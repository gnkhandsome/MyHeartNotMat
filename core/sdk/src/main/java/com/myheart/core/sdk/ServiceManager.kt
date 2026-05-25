package com.myheart.core.sdk

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Handler
import android.os.IBinder
import android.os.Message
import com.myheart.core.utils.AppId
import com.myheart.core.utils.BinderUtils
import com.myheart.core.utils.EmptyBinder
import com.myheart.core.utils.Logger
import com.myheart.core.utils.RunnableHelper
import com.myheart.core.utils.SdkAction
import java.util.concurrent.Executor
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicLong
import kotlin.also

class ServiceManager(private val context: Context, private val intent: Intent, private val appId: AppId, private val callback: ServiceConnectionCallback) {

    private val TAG = "ServiceManager_${intent.component?.shortClassName}_$appId"

    private val hasBind = AtomicBoolean(false)
    private val binderAlive = AtomicBoolean(false)
    private val keepServiceAlive = AtomicBoolean(true)
    private val executor = Executor { command -> RunnableHelper.work.post(command) }
    private var iBinder: IBinder? = null
    private val INDEX = AtomicLong(0)


    private val MSG_BIND_SERVICE = 1
    private val MSG_UNBUND_SERVICE = 2
    private val TIME_BIND_SERVICE_DELAY_SHORT = 1000L
    private val TIME_BIND_SERVICE_DELAY_LONG = 5000L
    private val TIME_CHECK_CONNECT_DELAY = 60000L


    private val handler = object : Handler(RunnableHelper.work.looper) {
        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)
            when(msg.what) {
                MSG_BIND_SERVICE -> {
                    Logger.f(TAG, "MSG_BIND_SERVICE hasBind=${hasBind.get()}, binderAlive=${binderAlive.get()}")
                    if (!hasBind.get() || !binderAlive.get() || !BinderUtils.isInterfaceAlive(iBinder)) {
                        handlerDoBind()
                    } else {
                        if (keepServiceAlive.get()) {
                            handlerCheckConnect(TIME_CHECK_CONNECT_DELAY)
                        }
                    }
                }
                MSG_UNBUND_SERVICE -> {
                    handlerDoUnbind()
                }
            }
        }
    }

    /**
     * 执行解绑操作，清理所有资源
     */
    private fun handlerDoUnbind() {
        Logger.f(TAG, "handlerDoUnbind")
        //  永远是KeepAlive的
        //  keepServiceAlive.set(false)
        try {
            if (hasBind.get()) {
                Logger.f(TAG, "handlerDoUnbind unbindService serviceConnection=$serviceConnection")
                context.unbindService(serviceConnection)
                hasBind.set(false)
            }
        } catch (e: Exception) {
            Logger.trace(TAG, e)
        }
        iBinder = null
    }

    private fun handlerDoBind() {
        Logger.f(TAG, "handlerDoBind intent=$intent")

        if (hasBind.get()) {
            Logger.f(TAG, "handlerDoBind service is ready. unbind")
            try {
                context.unbindService(serviceConnection)
                hasBind.set(false)
            } catch (e: Exception) {
                Logger.trace(TAG, e)
            }
        }

        if (!keepServiceAlive.get()) {
            Logger.f(TAG, "handlerDoBind keepServiceAlive is false. return")
            return
        }
        try {
            intent.putExtra(SdkAction.EXTRA_SEQ, INDEX.getAndDecrement())
            val success = context.bindService(intent, Context.BIND_AUTO_CREATE, executor, serviceConnection)
            Logger.f(TAG, "handlerDoBind success=$success")
            hasBind.compareAndSet(false, success)
        } catch (e: Exception) {
            Logger.trace(TAG, e)
        }
        Logger.f(TAG, "handlerDoBind hasBind=${hasBind.get()}")
        handlerCheckConnect(TIME_BIND_SERVICE_DELAY_LONG)
    }

    /**
     * 默认TIME_BIND_SERVICE_DELAY_SHORT ms 检查重连
     */
    private fun handlerCheckConnect(delay: Long = TIME_BIND_SERVICE_DELAY_SHORT) {
        Logger.f(TAG, "handlerCheckConnect delay=$delay")
        handler.removeMessages(MSG_BIND_SERVICE)
        handler.sendEmptyMessageDelayed(MSG_BIND_SERVICE, delay)
    }

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            Logger.f(TAG, "serviceConnection onServiceConnected $name, $service")
            Logger.f(TAG, "serviceConnection interfaceDescriptor=${service?.interfaceDescriptor}")
            iBinder = service
            if (EmptyBinder.DESCRIPTOR == service?.interfaceDescriptor) {
                handlerCheckConnect()
                return
            }
            try {
                service?.linkToDeath(deathRecipient, 0).also {
                    Logger.f(TAG, "serviceConnection onServiceConnected linkToDeath")
                }
            } catch (e: Throwable) {
                Logger.trace(TAG, e)
                handlerCheckConnect()
                return
            }
            binderAlive.set(true)
            callback.onConnected(service)
            Logger.f(TAG, "serviceConnection onServiceConnected end")
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            Logger.f(TAG, "serviceConnection onServiceDisconnected", name)
            try {
                iBinder?.unlinkToDeath(deathRecipient, 0)  // ✅ 添加清理
            } catch (e: Exception) {
                Logger.trace(TAG, e)
            }
            iBinder = null  // ✅ 清空引用
            onDisconnected()
        }
    }

    private val deathRecipient = object : IBinder.DeathRecipient {
        override fun binderDied() {
            Logger.f(TAG, "deathRecipient binderDied")
            try {
                iBinder?.unlinkToDeath(this, 0)
            } catch (e: Exception) {
                Logger.trace(TAG, e)
            }
            iBinder = null
            onDisconnected()
        }
    }

    fun onDisconnected() {
        Logger.f(TAG, "onDisconnected")
        if (!binderAlive.get()) {
            Logger.f(TAG, "onDisconnected binderAlive=false, return")
            return
        }
        binderAlive.set(false)
        iBinder = null  // ✅ 清空 IBinder 引用
        callback.onDisconnected()
        handlerCheckConnect()
    }

    fun start() {
        Logger.f(TAG, "start")
        innerStart()
    }

    private fun innerStart() {
        Logger.f(TAG, "innerStart")
        handler.removeMessages(MSG_BIND_SERVICE)
        handler.removeMessages(MSG_UNBUND_SERVICE)
        handler.sendEmptyMessage(MSG_BIND_SERVICE)
    }

    fun stop() {
        Logger.f(TAG, "stop")
        // ✅ 清理所有 Handler 消息，防止延迟任务泄露
        handler.removeCallbacksAndMessages(null)
        handler.sendEmptyMessage(MSG_UNBUND_SERVICE)
    }

    interface ServiceConnectionCallback {
        fun onConnected(service: IBinder?)
        fun onDisconnected()
    }
}
