package com.myheart.core.app.service

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.os.RemoteCallbackList
import com.myheart.core.aidl.IDataClient
import com.myheart.core.aidl.IDataServer

class DataBridgeService : Service() {

    private val clients = RemoteCallbackList<IDataClient>()

    private val binder = object : IDataServer.Stub() {
        override fun sendData(message: String?) {
            val payload = "service-echo: ${message ?: "null"}"
            broadcast(payload)
        }

        override fun registerClient(client: IDataClient?) {
            if (client != null) clients.register(client)
        }

        override fun unregisterClient(client: IDataClient?) {
            if (client != null) clients.unregister(client)
        }
    }

    override fun onBind(intent: Intent?): IBinder = binder

    private fun broadcast(message: String) {
        val count = clients.beginBroadcast()
        for (index in 0 until count) {
            runCatching { clients.getBroadcastItem(index).onDataChanged(message) }
        }
        clients.finishBroadcast()
    }
}
