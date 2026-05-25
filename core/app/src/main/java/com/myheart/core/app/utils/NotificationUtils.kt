package com.myheart.core.app.utils

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Bundle
import com.myheart.core.app.R
import com.myheart.core.utils.Logger.f
import kotlin.jvm.java

class NotificationUtils private constructor() {
    companion object {
        private const val TAG = "NotificationUtils"
        private const val KEY_CHJ_NOTIFICATION_SHOW = "android.chj.notification.show"
        private const val VALUE_CHJ_NOTIFICATION_HIDE = 1
        private const val CHANNEL_ID_PROTOCOL_SERVICE = "core"
        private const val SERVICE_ID = 1

        @SuppressLint("ForegroundServiceType")
        fun notifyStartForeground(service: Service) {
            f(TAG, "notifyStartForeground")
            val context = service.baseContext
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // Create the NotificationChannel, but only on API 26+ because
                // the NotificationChannel class is new and not in the support library
                val name: CharSequence = context.getString(R.string.app_name)
                val description = context.getString(R.string.app_name)
                val channel = NotificationChannel(
                    CHANNEL_ID_PROTOCOL_SERVICE,
                    name,
                    NotificationManager.IMPORTANCE_LOW
                )
                channel.description = description

                // Register the channel with the system
                val nm = context.getSystemService(NotificationManager::class.java)
                nm?.createNotificationChannel(channel)
                val bundle = Bundle()
                bundle.putInt(KEY_CHJ_NOTIFICATION_SHOW, VALUE_CHJ_NOTIFICATION_HIDE)
                val builder = Notification.Builder(service.baseContext, CHANNEL_ID_PROTOCOL_SERVICE)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setAutoCancel(false)
                    .setContentTitle("OneMapProtocolService")
                    .setContentText("OneMapProtocolService is running!")
                    .setExtras(bundle)
                val foregroundServiceType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
                } else {
                    0 // API < 34 不需要类型
                }

                service.startForeground(SERVICE_ID, builder.build(), foregroundServiceType)
            }
        }
    }
}