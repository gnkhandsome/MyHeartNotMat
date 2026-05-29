package com.myheart.core.app.service

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.os.RemoteCallbackList
import com.myheart.core.aidl.IMyAidlClientInterface
import com.myheart.core.aidl.IMyAidlServerInterface
import com.myheart.core.aidl.ReqData
import com.myheart.core.aidl.RespData
import com.myheart.core.utils.Logger.f

/**
 * 自定义 AIDL Demo 服务：
 * - 客户端调用 request(req)
 * - 服务端通过 IMyAidlClientInterface 回调 onReceive(resp)
 */
class MyAidlBridgeService : Service() {

    private val clients = RemoteCallbackList<IMyAidlClientInterface>()


    private val binder = object : IMyAidlServerInterface.Stub() {
        override fun request(req: ReqData?) {
            f(TAG, "request ${req?.cmd}")
            val cmd = req?.cmd ?: ""
            val payload = req?.payload ?: ""
            val resp = RespData(
                code = 0,
                message = "service-ack cmd=$cmd payload=$payload"
            )
            broadcast(resp)
        }

        override fun addEventListener(client: IMyAidlClientInterface?) {
            if (client != null) {
                clients.register(client)
                f(TAG, "addEventListener client=$client")
            }
        }

        override fun removeEventListener(client: IMyAidlClientInterface?) {
            if (client != null) {
                clients.unregister(client)
                f(TAG, "removeEventListener client=$client")
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder {
        f(TAG, "onBind intent=$intent")
        return binder
    }

    override fun onUnbind(intent: Intent?): Boolean {
        f(TAG, "onUnbind intent=$intent")
        // 最后一个客户端解绑时触发，清理回调引用，避免残留
        clients.kill()
        return super.onUnbind(intent)
    }

    override fun onDestroy() {
        f(TAG, "onDestroy")
        clients.kill()
        super.onDestroy()
    }

    private fun broadcast(resp: RespData) {
        val count = clients.beginBroadcast()
        try {
            for (index in 0 until count) {
                runCatching { clients.getBroadcastItem(index).onReceive(resp) }
            }
        } finally {
            clients.finishBroadcast()
        }
    }

    companion object {
        private const val TAG = "MyAidlBridgeService"
    }
}
