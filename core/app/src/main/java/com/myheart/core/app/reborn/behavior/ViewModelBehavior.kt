package com.myheart.core.app.reborn.behavior

import android.os.SystemClock
import com.myheart.core.aidl.EventHelper
import com.myheart.core.aidl.EventResp
import com.myheart.core.aidl.viewmodel.SyncModelManager
import com.myheart.core.app.base.behavior.BaseBehavior
import com.myheart.core.app.base.store.IStore
import com.myheart.core.app.service.EventServerHolder
import com.myheart.core.app.service.EventServerHolder.sendResp
import com.myheart.core.app.utils.StoreCacheHelper
import com.myheart.core.app.world.World
import com.myheart.core.utils.Logger.f
import kotlin.collections.forEach
import kotlin.collections.isNotEmpty
import kotlin.collections.isNullOrEmpty
import kotlin.jvm.javaClass
import kotlin.ranges.until

class ViewModelBehavior(world: World) : BaseBehavior(world) {

    private val DEBUG = true
    private val TAG = "ViewModelBehavior"
    private val PRINT_MS_INTERVAL = 60000L


    override fun onUpdate() {
        super.onUpdate()
        val startTime = SystemClock.elapsedRealtimeNanos()
        var waitSyncAppClients: MutableSet<Int>? = null
        if (EventServerHolder.waitSyncAppClients.isNotEmpty()) {
            waitSyncAppClients = EventServerHolder.drainWaitSyncAppClients()
        }
        SyncModelManager.allSender().forEach {
            if (!waitSyncAppClients.isNullOrEmpty()) {
                for (appID in waitSyncAppClients) {     // 对于新连接上的client，全量同步
                    StoreCacheHelper.diffAll(it.instance as IStore) { json: String? ->
                        f(TAG, "sync all, appId=${appID}, ${it.instance.javaClass.simpleName}")
                        // 只发给特定的对象
                        sendResp(
                            EventResp(
                                appId = appID,
                                type = EventHelper.RespType.TYPE_VIEW_MODEL,
                                data = json,
                                subType = it.tag.code
                            )
                        )
                    }
                }

                for (callbackIndex in 0 until (EventServerHolder.eventCallbacks.registeredCallbackCount)) {    // 对于非新连接上的增量同步
                    val cookie = EventServerHolder.eventCallbacks.getRegisteredCallbackCookie(callbackIndex)
                    if (cookie is Int && !waitSyncAppClients.contains(cookie)) {
                        StoreCacheHelper.diff(it.instance as IStore) { json: String? ->
                            //TODO @LiCodeAssist 不修改（保持原逻辑）
                            EventServerHolder.sendResp(
                                EventResp(
                                    appId = cookie,
                                    type = EventHelper.RespType.TYPE_VIEW_MODEL,
                                    data = json,
                                    subType = it.tag.code
                                )
                            )
                        }
                    }
                }
            } else {    // 没有需要全量同步的
                StoreCacheHelper.diff(it.instance as IStore) { json: String? ->
                    //TODO @LiCodeAssist 不修改（保持原逻辑）
                    EventServerHolder.sendResp(
                        EventResp(
                            type = EventHelper.RespType.TYPE_VIEW_MODEL,
                            data = json,
                            subType = it.tag.code
                        )
                    )
                }
            }
        }

        val lastCost = SystemClock.elapsedRealtimeNanos() - startTime
        updateCost += lastCost
        updateCount++
        if (System.currentTimeMillis() - lastPrintTime > PRINT_MS_INTERVAL) {
            lastPrintTime = System.currentTimeMillis()
            f(TAG, "onUpdate", "lastCost", lastCost, "avg", updateCost.toFloat() / updateCount)
        }
    }

    private var updateCount: Long = 0
    private var updateCost: Long = 0
    private var lastPrintTime: Long = 0
}