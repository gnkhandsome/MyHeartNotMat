package com.myheart.core.app

object AppSingleton {
    private var app: App? = null

    @Transient
    var isEngineCreated = false

    fun setApp(app: App) {
        this.app = app
    }

    fun getApp(): App? {
        return app
    }
}