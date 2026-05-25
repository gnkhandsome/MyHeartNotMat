package com.myheart.core.app.service

import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.myheart.core.app.App
import com.myheart.core.app.utils.NotificationUtils
import com.myheart.core.utils.AppId
import com.myheart.core.utils.Logger.e
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.Logger.trace
import com.myheart.core.utils.SdkAction
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.let
import kotlin.text.toInt

// 以 AppId 为核心
class EventBridgeService : Service() {

    private val isStartedForeground = AtomicBoolean(false)

    override fun onCreate() {
        super.onCreate()
        f(TAG, "onCreate !!!")
    }

    override fun onDestroy() {
        super.onDestroy()
        f(TAG, "onDestroy !!!")
    }

    override fun onBind(intent: Intent): IBinder? {
        f(TAG, "onBind intent=$intent")
        val action = intent.action
        val appId = intent.identifier?.toIntOrNull() ?: intent.getIntExtra(SdkAction.EXTRA_MULTI_APP_ID, AppId.INVALID.value)
        if (appId == null || appId == AppId.INVALID.value){
            e(TAG, "invalid appId appId=$appId !!!")
            return null
        }

        // Int Extra 不稳定，改用 identifier
//      val appId = intent.getIntExtra(SdkAction.EXTRA_MULTI_APP_ID, AppId.INVALID.value)
        val seq = intent.getLongExtra(SdkAction.EXTRA_SEQ, -1)
        f(TAG, "onBind appId=$appId, action=$action, seq=$seq")
        tryStartForegroundOnce()
        if (action == SdkAction.ACTION_EVENT) {
            f(TAG, "create EventInterface for appId=$appId")
            return EventServerHolder.createEventInterface((application as App).world,appId)
        }
        f(TAG, "onBind no binder created !!!")
        return null
    }

    override fun onUnbind(intent: Intent?): Boolean {
        f(TAG, "onUnbind intent=$intent")
        intent?.let {
            if (it.action == SdkAction.ACTION_EVENT) {
                f(TAG, "onUnbind identifier=${it.identifier}")
                it.identifier?.let { identifier ->
                    try {
                        f(TAG, "destroy EventInterface for appId=$identifier")
                        EventServerHolder.deActiveEventInterface(identifier.toInt())
                    } catch (_: Exception) {}
                } ?: throw kotlin.IllegalArgumentException("identifier is null")
            }
        }
        return super.onUnbind(intent)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        f(TAG, "onStartCommand intent=$intent, flags=$flags, startId=$startId")
        tryStartForegroundOnce()
        return super.onStartCommand(intent, flags, startId)
    }

    private fun tryStartForegroundOnce() {
        if (!isStartedForeground.compareAndSet(false, true)) {
            return
        }
        runCatching {
            NotificationUtils.notifyStartForeground(this)
        }.onFailure {
            isStartedForeground.set(false)
            trace(TAG, it)
        }
    }

    companion object {
        private const val TAG = "MultiScreenEventService"
    }
}