package com.myheart.core.sdk

import androidx.annotation.MainThread
import com.myheart.core.aidl.RespData

interface MyAidlClientListener {
    /**
     * 连接成功
     */
    @MainThread
    fun onConnected()

    /**
     * 连接断开
     */
    @MainThread
    fun onDisconnected()

    /**
     * 收到服务端回调
     */
    fun onReceive(resp: RespData)
}
