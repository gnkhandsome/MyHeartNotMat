package com.myheart.core.sdk.api

import android.app.Application
import android.content.Context
import androidx.annotation.MainThread
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import com.myheart.core.sdk.EventClientListener
import com.myheart.core.sdk.client.EventClient
import com.myheart.core.utils.AppId
import com.myheart.core.utils.AppIdHolder
import com.myheart.core.utils.Logger.f
import kotlin.isInitialized

/**
 * 监听App的生命周期,一个进程中仅有一个 SdkApp
 */
object DemoApplication : LifecycleOwner {

    public val TAG = "DemoApplication"

    var appId: AppId
        get() {
            return AppIdHolder.appId
        }
        set(value) {
            AppIdHolder.appId = value
        }

    private lateinit var eventClient: EventClient

    fun getEventClient(): EventClient {
        return eventClient
    }

    lateinit var application: Application

    private val lifecycleRegistry = LifecycleRegistry(this)
    override val lifecycle = lifecycleRegistry

    private val eventClientListener = object : EventClientListener {
        override fun onConnected() {
            onStart()
        }

        override fun onDisconnected() {
            onPause()
            onStop()
        }
    }

    @Suppress("UNUSED")
    @MainThread
    fun onCreate(context: Context, id: AppId,) {
        // 保存初始化实例
        f(TAG, "{ context packageName=${context.packageName} applicatoin package=${context.applicationContext.packageName} @this"  + this )
        //TODO @LiCodeAssist 不修改（保持原逻辑）
        appId = id

        application = context.applicationContext as Application
        ViewModelRegistry.initMapViewModels()

        eventClient = EventClient
        eventClient.addConnectedStatusListener(eventClientListener)
        // 真正的 Bind 调用
        eventClient.doBind()
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
    }

    fun onStart() {
        f(TAG, "onStart app=${appId}")
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START)
    }

    fun onResume() {
        f(TAG, "onResume app=${appId} packgeName=${application.packageName} @this" +this)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME)
    }

    fun onPause() {
        f(TAG, "onPause app=${appId}")
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    }

    fun onStop() {
        f(TAG, "onStop app=${appId}")
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP)
    }

    @Suppress("UNUSED")
    @MainThread
    fun onTerminate() {
        f(TAG, "onTerminate appId=${appId}")
        if (::eventClient.isInitialized) {
            eventClient.removeConnectedStatusListener(eventClientListener)
            eventClient.doUnbind()
        }
//        EventClientProxy.destroy()
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    }

}
