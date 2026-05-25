package com.myheart.core.app.service

import android.content.Context
import android.os.Binder
import android.os.RemoteException
import com.myheart.core.aidl.EventHelper
import com.myheart.core.aidl.EventReq
import com.myheart.core.aidl.IEventClient
import com.myheart.core.aidl.IEventServer
import com.myheart.core.aidl.constant.SubscribeConstants
import com.myheart.core.aidl.reqmodel.SubscribeCommandDetailModel
import com.myheart.core.app.base.action.ActionType
import com.myheart.core.app.base.action.SubscribeManager
import com.myheart.core.utils.AppId
import com.myheart.core.utils.JsonUtils
import com.myheart.core.utils.Logger
import com.myheart.core.utils.Logger.f
import kotlin.jvm.Throws
import kotlin.jvm.java

class EventServer(
    private val context: Context,
    private val appId: Int,
    private val callback: OnEventListenerCallback
) : IEventServer.Stub() {

    private var TAG = "EventServer_${AppId.fromValue(appId)}"

    /**
     * 客户端添加，移除 EventListener 回调
     */
    interface OnEventListenerCallback {
        fun onAdd(appId: Int, listener: IEventClient?)
        fun onRemove(appId: Int, listener: IEventClient?)
    }

    init {
        f(TAG, "EventInterface init context=$context, appId=$appId")
    }

    fun onDestroy() {
        f(TAG, "onDestroy")
    }

    @Throws(RemoteException::class)
    override fun request(req: EventReq) {
        if (!isPermissionPass(Binder.getCallingUid(), Binder.getCallingPid())) {
            f(TAG, "Permission Denied")
            return
        }
        when(req.type) {
            // 订阅信息
            EventHelper.ReqType.TYPE_COMMAND_SUBSCRIBE -> {
                // req.data is SubscribeCommandDetailModel
                EventServerHolder.runImmediately {
                    try {
                        //TODO @LiCodeAssist 不修改（保持原逻辑）
                        val model = JsonUtils.fromJson(req.data, SubscribeCommandDetailModel::class.java) ?: return@runImmediately
                        //  直接处理
                        val action = SubscribeManager.Action(model.param1, model.param2, model.message)
                        when (model.type) {
                            SubscribeConstants.TYPE_CLICK -> {
                                val key = SubscribeManager.SubscribeKey(ActionType.Click, model.name)
                                SubscribeManager.performAction(key, action)
                            }
                        }
                        // 处理结束
                    } catch (e: Exception) {
                        Logger.trace(TAG, e)
                    }
                }
            }
            // Unknown Command
            else -> {
                f(TAG, " Unknown Command EventHelper.ReqType: ${req.type}")
                // onRequestListener?.onRequest(req)
            }
        }
    }
    @Throws(RemoteException::class)
    override fun addEventListener(listener: IEventClient?) {
        f(TAG, "addEventListener appId=$appId listener=$listener")
        callback.onAdd(appId, listener)
    }

    // 没有调用过
    @Throws(RemoteException::class)
    override fun removeEventListener(listener: IEventClient?) {
        f(TAG, "removeEventListener appId=$appId listener=$listener")
        callback.onRemove(appId, listener)
    }


    private fun isPermissionPass(uid: Int, pid: Int): Boolean {
        try {
         return true
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
            return false
        }
    }


    override fun toString(): String {
        return "EventInterface(context=$context, appId=$appId, callback=$callback, TAG='$TAG')"
    }

}
