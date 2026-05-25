package com.myheart.core.appview

import android.app.ActivityOptions
import android.content.ActivityNotFoundException
import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.view.Display
import androidx.appcompat.app.AppCompatActivity
import com.myheart.core.utils.Logger.e

class AppViewActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 跳转到AppView应用
        launchMainActivityEid()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        launchMainActivityEid()
    }

    private fun launchMainActivityEid() {
        intent.setComponent(
            ComponentName(APPVIEW_PACKAGE_NAME, APPVIEW_ACTIVITY_NAME)
        )
        intent.setPackage(APPVIEW_PACKAGE_NAME)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
        try {
            val options = ActivityOptions.makeBasic()
                .setLaunchDisplayId(Display.DEFAULT_DISPLAY)
            startActivity(intent, options.toBundle())
        } catch (e: ActivityNotFoundException) {
            e(TAG, "start activity error: " + e.message)
        } finally {
            finish()
        }
    }

    companion object {
        private const val TAG = "AppViewActivity"
        private const val APPVIEW_PACKAGE_NAME = "com.myheart.core.appview"
        const val APPVIEW_ACTIVITY_NAME = "com.myheart.core.sdk.AppViewMainActivity"
    }
}
