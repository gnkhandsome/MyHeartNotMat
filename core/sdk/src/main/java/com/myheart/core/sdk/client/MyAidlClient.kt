package com.myheart.core.sdk.client

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import android.util.Log
import com.myheart.core.aidl.IMyAidlClientInterface
import com.myheart.core.aidl.IMyAidlServerInterface
import com.myheart.core.aidl.ReqData
import com.myheart.core.aidl.RespData
import com.myheart.core.utils.RunnableHelper

/**
 * 最基础版 AIDL Client（不做重连/队列/状态机封装）
 */
class MyAidlClient(
    context: Context,
    private val servicePackage: String = DEFAULT_SERVER_PACKAGE,
    private val serviceClass: String = DEFAULT_SERVER_CLASS,
    private val action: String = DEFAULT_ACTION,
) {

    private val appContext = context.applicationContext
    private var isBound = false
    private var server: IMyAidlServerInterface? = null
    private var onReceive: ((RespData) -> Unit)? = null
    private var callbackRegistered = false
    private val workerHelper = RunnableHelper.create("my_aidl_client_worker")

    private val intent = Intent().also {
        it.component = ComponentName(servicePackage, serviceClass)
        it.action = action
    }

    private val callback = object : IMyAidlClientInterface.Stub() {
        override fun onReceive(resp: RespData?) {
            if (resp != null) {
                onReceive?.invoke(resp)
            }
        }
    }

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, binder: IBinder?) {
            server = IMyAidlServerInterface.Stub.asInterface(binder)
            Log.i(TAG, "onServiceConnected: name=$name, serverReady=${server != null}, instance=${hashCode()}")
            if (onReceive != null && !callbackRegistered) {
                runCatching {
                    server?.addEventListener(callback)
                    callbackRegistered = true
                    Log.i(TAG, "onServiceConnected: callback auto-registered")
                }.onFailure {
                    Log.e(TAG, "onServiceConnected: addEventListener failed", it)
                }
            }
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            Log.w(TAG, "onServiceDisconnected: name=$name, instance=${hashCode()}")
            server = null
            callbackRegistered = false
        }
    }

    fun bind(): Boolean {
        if (isBound) return true
        isBound = appContext.bindService(intent, connection, Context.BIND_AUTO_CREATE)
        Log.i(TAG, "bind: result=$isBound, instance=${hashCode()}")
        return isBound
    }

    fun unbind() {
        if (!isBound) return
        server?.removeEventListener(callback)
        appContext.unbindService(connection)
        server = null
        callbackRegistered = false
        isBound = false
    }

    fun registerCallback(onReceive: (RespData) -> Unit) {
        this.onReceive = onReceive
        runCatching {
            server?.addEventListener(callback)
            callbackRegistered = (server != null)
            Log.i(TAG, "registerCallback: serverReady=${server != null}")
        }.onFailure {
            callbackRegistered = false
            Log.e(TAG, "registerCallback: addEventListener failed", it)
        }
    }

    fun unregisterCallback() {
        runCatching { server?.removeEventListener(callback) }
        onReceive = null
        callbackRegistered = false
    }

    fun request(req: ReqData) {
        workerHelper.post(Runnable {
            if (server == null) {
                Log.w(TAG, "request dropped: server is null, cmd=${req.cmd}, instance=${hashCode()}")
            }
            server?.request(req)
        })
    }

    fun request(cmd: String, payload: String) {
        request(ReqData(cmd = cmd, payload = payload))
    }

    fun isConnected(): Boolean {
        return server != null
    }

    companion object {
        private const val TAG = "MyAidlClient"
        private const val DEFAULT_SERVER_PACKAGE = "com.myheart.core.app"
        private const val DEFAULT_SERVER_CLASS = "com.myheart.core.app.service.MyAidlBridgeService"
        private const val DEFAULT_ACTION = "com.myheart.core.sdk.my_aidl"
    }
}
