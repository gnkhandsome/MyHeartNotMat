package com.myheart.core.sdk

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.myheart.core.aidl.IDataClient
import com.myheart.core.aidl.IDataServer
import com.myheart.core.utils.DemoConstants

class DataChainManager(private val context: Context) {

    private var dataServer: IDataServer? = null

    private val _messageLiveData = MutableLiveData("等待数据...")
    val messageLiveData: LiveData<String> = _messageLiveData

    private val dataClient = object : IDataClient.Stub() {
        override fun onDataChanged(message: String?) {
            _messageLiveData.postValue(message ?: "null")
        }
    }

    private val connection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            dataServer = IDataServer.Stub.asInterface(service)
            dataServer?.registerClient(dataClient)
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            dataServer = null
        }
    }

    fun bind() {
        val intent = Intent(DemoConstants.ACTION_DATA_BRIDGE_SERVICE)
        intent.setPackage(context.packageName)
        context.bindService(intent, connection, Context.BIND_AUTO_CREATE)
    }

    fun unbind() {
        runCatching { dataServer?.unregisterClient(dataClient) }
        runCatching { context.unbindService(connection) }
        dataServer = null
    }

    fun sendData(content: String) {
        dataServer?.sendData(content)
    }
}
