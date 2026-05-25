package com.myheart.core.sdk.client

import android.content.ComponentName
import android.content.Intent
import android.os.IBinder
import androidx.annotation.MainThread
import androidx.annotation.WorkerThread
import androidx.lifecycle.ViewModel
import com.myheart.core.aidl.EventHelper
import com.myheart.core.aidl.EventReq
import com.myheart.core.aidl.EventResp
import com.myheart.core.aidl.IEventClient
import com.myheart.core.aidl.IEventServer
import com.myheart.core.aidl.constant.SubscribeConstants
import com.myheart.core.aidl.constant.ViewModelEnum
import com.myheart.core.aidl.reqmodel.SubscribeCommandDetailModel
import com.myheart.core.aidl.viewmodel.SyncModelManager
import com.myheart.core.sdk.EventClientListener
import com.myheart.core.sdk.ServiceManager
import com.myheart.core.sdk.api.DemoApplication
import com.myheart.core.sdk.utils.ViewModelDiffHelper
import com.myheart.core.utils.JsonUtils
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.Logger.trace
import com.myheart.core.utils.RunnableHelper
import com.myheart.core.utils.SdkAction
import kotlin.also
import kotlin.collections.forEach
import kotlin.jvm.java

/**
 * app 和 appview 的通讯通道 ，
 * 一个进程一个
 */
object EventClient {

    private const val EVENT_SERVER_PACKAGE = "com.myheart.core.app"
    private const val EVENT_SERVER_CLASS = "com.myheart.core.app.service.EventBridgeService"

    enum class ClientStatus(val value: Int) {
        INIT(0),
        CONNECTED(1),
        DISCONNECTED(2),
    }

    private val context = DemoApplication.application

    private val appId = DemoApplication.appId

    private var status = ClientStatus.INIT

    private var DEBUG_RECEIVE_DETAIL = true

    //
    private val TAG = "EventClient_$appId"

    private val runnableHelper = RunnableHelper.create("myheart-event")
    private var mainHelper: RunnableHelper = RunnableHelper.main

    var eventServer: IEventServer? = null
        private set

    private val connectedStatusListeners = mutableListOf<EventClientListener>()
    private val pendingReqs = mutableListOf<EventReq>()

    fun addConnectedStatusListener(listener: EventClientListener) {
        // 向前兼容，处理生命周期
        if (RunnableHelper.isMainThread()) {
            performAddEidEventClientListener(listener)
        } else {
            mainHelper.post({
                performAddEidEventClientListener(listener)
            })
        }
    }

    @MainThread
    private fun performAddEidEventClientListener(listener: EventClientListener) {
        if (status == ClientStatus.CONNECTED) {
            listener.onConnected()
        }
        if (status == ClientStatus.DISCONNECTED) {
            listener.onDisconnected()
        }
        connectedStatusListeners.add(listener)
    }

    fun removeConnectedStatusListener(listener: EventClientListener) {
        if (RunnableHelper.isMainThread()) {
            connectedStatusListeners.remove(listener)
        } else {
            mainHelper.post({
                connectedStatusListeners.remove(listener)
            })
        }
    }

    private var mShouldClearSurface = true


    /**
     * 启动真正的Service
     */
    private val multiServiceIntent = Intent().also {
        it.component =
            ComponentName(EVENT_SERVER_PACKAGE, EVENT_SERVER_CLASS)
        it.action = SdkAction.ACTION_EVENT
        // 设定Intent标识，区别Intent，Intent.FilterComparison
        // 用于Service.onBind回调多次
        // 参考源码ActiveServices.java中方法publishServiceLocked中判断逻辑
        // 把 identifier 设置成 appId
        it.identifier = "${appId.value}"
        // it.putExtra(SdkAction.EXTRA_MULTI_APP_ID, appId.value)
    }

    // 设置重连机制
    private val serviceManager =
        ServiceManager(context, multiServiceIntent, appId, ServiceConnectionCallback())

    private var extEventHandler: IEventClient.Stub? = null

    fun setExtEventHandler(handler: IEventClient.Stub) {
        extEventHandler = handler
    }


    // Hud AVP 模式下，每次切换屏幕时 不清理
    fun setClearSurfaceFlag(flag: Boolean) {
        mShouldClearSurface = flag
    }

    fun doBind() {
        f(TAG, "doBind")
        serviceManager.start()
    }

    fun doUnbind() {
        f(TAG, "doUnbind")
        serviceManager.stop()
    }
        runnableHelper.post({
            try {
                if (eventServer == null) {
                    f(TAG, "sendEvent enqueue: eventServer is null, try rebind. reqType=${req.type}")
                    pendingReqs.add(req)
                    serviceManager.start()
                }
                f(TAG, "sendEvent ${req}")
                eventServer?.request(req)
            } catch (e: Throwable) {
                trace(TAG, e)
                serviceManager.start()
            }
        })
    }

    private val stubEventListener = object : IEventClient.Stub() {

        override fun onReceive(resp: EventResp?) {
            runnableHelper.post({
                handleEventResp(resp)
            })
        }
    }


    @WorkerThread
    private fun handleEventResp(resp: EventResp?) {
        if (resp == null) {
            f(TAG, "eventListener resp is null")
            return
        }
        if (DEBUG_RECEIVE_DETAIL) {
            f(TAG, "onReceive appId=$appId", resp)
        }
        if (extEventHandler != null){
            extEventHandler?.onReceive(resp)
        }
        if (resp.code == EventHelper.RespCode.CODE_SUCCESS) {
            when (resp.type) {

                // ViewModel
                EventHelper.RespType.TYPE_VIEW_MODEL -> {
                    val map = JsonUtils.fromJson<Map<String, String>>(
                        resp.data,
                        MutableMap::class.java
                    )
                    val tag = ViewModelEnum.fromCode(resp.subType)

                    if (tag != null) {
                        val receiver = SyncModelManager.receiver(tag)
                        if (receiver != null) {
                            map?.forEach {
                                ViewModelDiffHelper.applyViewModel(
                                    receiver as ViewModel,
                                    it.key,
                                    it.value
                                )
                            }
                        }
                    }
                }

            }
        }
    }


    private class ServiceConnectionCallback : ServiceManager.ServiceConnectionCallback {
        override fun onConnected(service: IBinder?) {
            f(
                TAG,
                "serviceConnectionCallback onConnected ${appId} service=${service}, ${service?.interfaceDescriptor}"
            )
            try {
                eventServer = IEventServer.Stub.asInterface(service).also {
                    f(TAG, "serviceConnectionCallback  [$appId] onConnected asInterface")
                }
            } catch (e: Throwable) {
                trace(TAG, e)
                // restart
                serviceManager.start()
                return
            }
            try {
                eventServer?.addEventListener(stubEventListener).also {
                    f(TAG, "serviceConnectionCallback onConnected addEventListener")
                }
            } catch (e: Throwable) {
                trace(TAG, e)
                // restart
                serviceManager.start()
                return
            }
            runnableHelper.post {
                flushPendingReqs()
            }
                connectedStatusListeners.forEach {
                    it.onConnected()
                }
            })

            f(TAG, "serviceConnectionCallback  [$appId] onConnected end")
        }

        override fun onDisconnected() {
            f(TAG, "serviceConnectionCallback  [$appId] onDisconnected")
            status = ClientStatus.DISCONNECTED
            // disconnect release evenInterface
            eventServer = null
            mainHelper.post({
                connectedStatusListeners.forEach {
                    it.onDisconnected()
                }
            })
        }
    }



    /**
     * 发送订阅的点击事件
     */
    fun sendClick(
        name: String,
        arg1: Int = 0,
        arg2: Int = 0,
        message: String = "",
    ) {
        f(TAG, "sendClick name=$name")
        val req = EventReq(
            type = EventHelper.ReqType.TYPE_COMMAND_SUBSCRIBE,
            data = JsonUtils.toJson(
                SubscribeCommandDetailModel(
                    type = SubscribeConstants.TYPE_CLICK,
                    name = name,
                    param1 = arg1,
                    param2 = arg2,
                    message = message,
                )
            ),
        )
        sendEvent(req)
    }

    @Suppress("UNUSED")
    fun sendCommand(commandId: Long, screenId: Int) {
        f(TAG, "sendCommand commandId=$commandId")
        val req = EventReq(
            type = EventHelper.ReqType.TYPE_COMMAND,
            data = commandId.toString()
    }

    private fun flushPendingReqs() {
        if (pendingReqs.isEmpty()) {
            return
        }
        val reqs = pendingReqs.toList()
        pendingReqs.clear()
        f(TAG, "flushPendingReqs size=${reqs.size}")
        reqs.forEach { req ->
            try {
                eventServer?.request(req)
            } catch (e: Throwable) {
                trace(TAG, e)
                pendingReqs.add(req)
            }
        }
    }
