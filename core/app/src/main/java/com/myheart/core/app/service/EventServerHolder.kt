package com.myheart.core.app.service

import androidx.annotation.BinderThread
import androidx.annotation.MainThread
import android.os.Handler
import android.os.IBinder
import android.os.RemoteCallbackList
import com.myheart.core.aidl.EventHelper
import com.myheart.core.aidl.EventResp
import com.myheart.core.aidl.IEventClient
import com.myheart.core.app.world.World
import com.myheart.core.utils.AppId
import com.myheart.core.utils.Logger
import com.myheart.core.utils.Logger.e
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.RunnableHelper
import java.util.concurrent.ConcurrentHashMap
import kotlin.collections.set
import kotlin.isInitialized
import kotlin.ranges.until

object EventServerHolder {

    private val DEBUG_BROADCAST = false
    private val DEBUG_VIEW_MODEL = false

    private lateinit var world: World

    private val senderHelper: RunnableHelper = RunnableHelper.create("t_event_sender")

    fun getHandler(): Handler {
        return senderHelper.getHandler()
    }
    /**
     * key appId 有效的 EventInterface
     * 1个 App 对应 一个 EventInterface
     * 1个 EventInterface 对应多个 surface
     */
     val eidEventServerMap: MutableMap<Int, EventServer> = ConcurrentHashMap()

    //  管理所有的 RemoteCallbackList 合并发
     val eventCallbacks: RemoteCallbackList<IEventClient> = RemoteCallbackList()

    // 刚连上等待全量同步的客户端
    val waitSyncAppClients = mutableSetOf<Int>()


    //  保存 Callback List
    private val eidEventServerCallback = object : EventServer.OnEventListenerCallback {
        @BinderThread
        override fun onAdd(appId: Int, listener: IEventClient?) {
            f(TAG, "onAdd appId=$appId, listener=$listener")
            eventCallbacks.register(listener, appId)
            // 立即同步 Thread 中立即执行一个全同步
            runImmediately {
                f(TAG,"init sync all view model appId=${appId}")
                // 记录下要全量同步的客户端appId，下一个循环里发出去
                waitSyncAppClients.add(appId)
            }
        }

        override fun onRemove(appId: Int, client: IEventClient?) {
            f(TAG, "onRemove appId=$appId, listener=$client")
            eventCallbacks.unregister(client)
        }
    }

    @MainThread
    fun createEventInterface(world: World, appId: Int): IBinder {
//        val trace = traceStart(TAG, "createEventInterface appId=$appId, context=${world.context}")
        // 创建EventInterface
        val item = EventServer(world.context, appId, eidEventServerCallback)
        // 可能会覆盖
        eidEventServerMap[appId] = item
        return item
    }

    // 不会删除仅会释放资源，因为 Unbind 仅说明 client 被消除了
    @MainThread
    fun deActiveEventInterface(appId: Int) {
        f(TAG, "deActiveEventInterface appId=$appId")
        val item = eidEventServerMap[appId]
        // 服务断开后释放资源
        item?.onDestroy()
        // 创建EventInterface
    }


    @MainThread
    fun initWorld(wld: World) {
        e(TAG, "initEventInterfaceRepoListener")
        // 建立和几个数据的来源
        world = wld
    }

    /**
     * 引擎线程立即执行runnable
     * 其他业务不要使用此方法
     */
    fun runImmediately(runnable: Runnable) {
        if (this::world.isInitialized) {
            world.runImmediately(runnable)
        } else {
            f(TAG, "runImmediately world not init")
        }
    }

    fun sendSingleCmd(appId: Int,cmdId : Int, cmd: String,params: String?){
        f(TAG, "sendSingleCmd appId=$appId, cmdId=$cmdId, cmd=$cmd, params=$params")
        var resp = EventResp(
            appId = appId,
            type = EventHelper.RespType.TYPE_COMMAND,
            subType = cmdId,
            data = cmd
        )
        sendResp(resp)
    }

    // @SenderThread
    fun sendResp(resp: EventResp) {
        senderHelper.post({ broadcastResp(resp) })
    }

    /**
     * 广播给对应的监听或者所有的监听
     */
    private fun broadcastResp(resp: EventResp) {
        try {
            val count = eventCallbacks.beginBroadcast()
            if (DEBUG_BROADCAST){
                f("SeverSend", "broadcastResp broadcastResp=$count, resp=$resp")
            }
            for (i in 0 until count) {
                val cookie = eventCallbacks.getBroadcastCookie(i)
                // appId 为 AppId.INVALID.value 或者指定 appId 才发送
                if (resp.appId == AppId.INVALID.value || (cookie is Int && cookie == resp.appId)) {
                    val callback = eventCallbacks.getBroadcastItem(i)
                    try {
                        //TODO @LiCodeAssist 不修改（保持原逻辑）
                        callback.onReceive(resp)
                    } catch (e: Exception) {
                        Logger.trace(TAG, e)
                    }
                }
            }
            eventCallbacks.finishBroadcast()
        } catch (e: Exception) {
            Logger.trace(TAG, e)
        }
    }

    fun drainWaitSyncAppClients(): MutableSet<Int> {
        val result = mutableSetOf<Int>()
        result.addAll(waitSyncAppClients)
        waitSyncAppClients.clear()
        return result
    }

    override fun toString(): String {
        return "EidEventServerHolder(eidEventServerMap=$eidEventServerMap, eventCallbacks=$eventCallbacks)"
    }

    const val TAG = "EidEventServerHolder"

}