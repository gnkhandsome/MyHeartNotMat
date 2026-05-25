package com.myheart.core.appview

import android.app.Application
import com.myheart.core.sdk.api.DemoApplication
import com.myheart.core.utils.AppId
import com.myheart.core.utils.Logger.f

class AppViewApp : Application(){

    override fun onCreate() {
        super.onCreate()
        f(TAG, "onCreate")
        DemoApplication.onCreate(this, AppId.DEMO)
    }

    companion object {
        private val TAG = AppViewApp::class.java.simpleName + "_MYHEART_APPVIEW"
    }
}
