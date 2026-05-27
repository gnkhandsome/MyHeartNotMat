package com.myheart.core.app

import android.app.Application
import android.content.Context
import android.content.res.Configuration
import com.myheart.core.app.service.EventServerHolder
import com.myheart.core.app.tracker.EventTrackHelper
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
        EventServerHolder.initWorld(world)
        world.start()

        // 冷启动时间记录，放在方法最后面
        EventTrackHelper.onAppColdStartPhase1()
    }

    override fun onTerminate() {
        super.onTerminate()
        if (this::world.isInitialized) {
            world.destroy()
        }
    }

    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        EventTrackHelper.init(base)
        EventTrackHelper.onAppColdStart()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val currentNightMode = newConfig.uiMode and Configuration.UI_MODE_NIGHT_MASK
        f(TAG, " currentNightMode $currentNightMode")
    }



    companion object {
        private val TAG = App::class.java.simpleName + "_MYHEART_CORE"
        val initTime: String = LocalDateTime.now().toString()
    }
}