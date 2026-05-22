package com.myheart.core.app

import android.app.Application
import android.content.Context
import android.content.res.Configuration
import com.myheart.core.app.world.World
import com.myheart.core.utils.Logger.f
import java.time.LocalDateTime


/**
 * @Description:
 * @CreateDate: 21-12-1 下午4:11
 * @Author:
 */
open class App : Application() {

    lateinit var world: World
    override fun onCreate() {

        super.onCreate()
        f(TAG, "onCreate")
        world = World(this)
        AppSingleton.setApp(this)
        world.start()
    }

    override fun onTerminate() {
        super.onTerminate()
        if (this::world.isInitialized) {
            world.destroy()
        }
    }

    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val currentNightMode = newConfig.uiMode and Configuration.UI_MODE_NIGHT_MASK
        f(TAG, " currentNightMode $currentNightMode")
    }



    companion object {
        private val TAG = App::class.java.simpleName + "_EID"
        val initTime: String = LocalDateTime.now().toString()
    }
}