package com.myheart.core.app.reborn.repo

import android.database.ContentObserver
import android.net.Uri
import android.os.Handler
import android.provider.Settings
import com.myheart.core.app.EngineThread
import com.myheart.core.app.base.repo.BaseRepo
import com.myheart.core.app.reborn.store.DemoStore
import com.myheart.core.app.world.World
import com.myheart.core.utils.Logger.f

class DemoRepo (world: World) : BaseRepo(world) {




    @Transient
    private val demoStore: DemoStore = world.storeManager[DemoStore::class.java]


    private val innerContentObserver = InnerContentObserver(EngineThread.getHandler())


    override fun onStart() {
        super.onStart()
        world.context.contentResolver.registerContentObserver(URI_RADAR_WARNING_SOUND_LEVEL, true, innerContentObserver)
        fetchRadarWarningSoundLevel()
    }

    override fun onDestroy() {
        super.onDestroy()
        world.context.contentResolver.unregisterContentObserver(innerContentObserver)
    }


    private inner class InnerContentObserver(handler: Handler?) : ContentObserver(handler) {
        override fun onChange(selfChange: Boolean, uri: Uri?, flags: Int) {
            f(TAG, "onChange selfChange=$selfChange, uri=$uri, flags=$flags")
            super.onChange(selfChange, uri, flags)
            when(uri) {
                URI_RADAR_WARNING_SOUND_LEVEL -> fetchRadarWarningSoundLevel()
                else -> f(TAG, "onChange else")
            }
        }
    }


    private fun fetchRadarWarningSoundLevel() {
        val radarWarningSoundLevel = Settings.System.getInt(world.context.contentResolver,
            KEY_RADAR_WARNING_SOUND_LEVEL, RADAR_WARN_LEVEL_FAR)
        f(TAG, "fetchRadarWarningSoundLevel radarWarningSoundLevel=$radarWarningSoundLevel")
        demoStore.text.setValue("radarWarningSoundLevel=$radarWarningSoundLevel")
    }


    companion object{

        private const val TAG = "DemoRepo"

        private const val KEY_RADAR_WARNING_SOUND_LEVEL = "radar_warning_sound_level"

        private val URI_RADAR_WARNING_SOUND_LEVEL: Uri = Settings.System.getUriFor(KEY_RADAR_WARNING_SOUND_LEVEL)

        private val RADAR_WARN_LEVEL_FAR: Int = 0X03
    }
}