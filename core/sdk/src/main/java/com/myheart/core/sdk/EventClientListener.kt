package com.myheart.core.sdk

import androidx.annotation.MainThread

interface EventClientListener {
    /**
     * 连接成功，连接成功后也可能出现异常
     */
    @MainThread
    fun onConnected()

    /**
     * 连接断开
     */
    @MainThread
    fun onDisconnected()
}