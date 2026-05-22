package com.myheart.core.utils

import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import android.os.Process
import java.util.concurrent.ConcurrentHashMap
import kotlin.collections.set

/**
 * 异步线程工具，默认工作在work线程
 */
class RunnableHelper private constructor(looper: Looper) {
    @Transient
    private val handler: Handler

    init {
        handler = Handler(looper)
    }

    @Deprecated("Only use for Camera Image Loader and Watchdog")
    fun getHandler(): Handler {
        return handler
    }

    val looper: Looper
        get() = handler.looper

    fun isCurrentThread(): Boolean {
        return handler.looper.isCurrentThread
    }

    /**
     * 即使在同一个线程中调用，postCheckThread 与 post 的表现是不一样的，注意区分
     * @param action
     */
    fun postCheckThread(action: Runnable) {
        if (isCurrentThread()) {
            action.run()
        } else {
            post(action)
        }
    }

    /**
     * 即使在同一个线程中调用，postCheckThread 与 post 的表现是不一样的，注意区分
     * @param action
     * @param token
     */
    fun postWithCancelCheckThread(action: Runnable, token: String) {
        if (isCurrentThread()) {
            action.run()
        } else {
            postWithCancel(action, token)
        }
    }

    /**
     * Kotlin 中 action 作为最后一个参数方便作为lambda表达式使用
     */
    fun postRunnable(action: Runnable){
        if (isCurrentThread()){
            action.run()
        } else {
            post(action)
        }
    }

    @JvmOverloads
    fun post(action: Runnable, delayMillis: Long = 0) {
        val success = handler.postDelayed(action, delayMillis)
        if (!success) {
            Logger.traceMethod("post fail")
        }
    }

    fun cancelRunnable(runnable: Runnable) {
        handler.removeCallbacks(runnable)
    }

    /**
     * post runnable，但是不删除队列中的token
     */
    fun postWithoutCancel(action: Runnable, token: String, delayMillis: Long = 0) {
        val success = handler.postDelayed(action, token, delayMillis)
        if (!success) {
            Logger.traceMethod("postWithCancel fail")
        }
    }

    /**
     * post runnable，会删除掉队列中的token，如果token是null，则清除队列中所有的runnable
     * @param action
     * @param token
     */
    @JvmOverloads
    fun postWithCancel(action: Runnable, token: String, delayMillis: Long = 0) {
        cancel(token)
        val success = handler.postDelayed(action, token, delayMillis)
        if (!success) {
            Logger.traceMethod("postWithCancel fail")
        }
    }

    /**
     *
     * @param action
     * @param uptimeMillis
     */
    fun postAtTime(action: Runnable, uptimeMillis: Long) {
        val success = handler.postAtTime(action, uptimeMillis)
        if (!success) {
            Logger.traceMethod("postAtTime fail")
        }
    }

    fun cancel(token: Any) {
        handler.removeCallbacksAndMessages(token)
    }

    fun destroy() {
        handler.looper.quitSafely()
    }

    companion object {
        private const val TAG = "RunnableHelper"
        private val runnableLooperMap: MutableMap<String, Looper> = ConcurrentHashMap()
        val work = create("t_work")
        val timer = create("t_timer")
        val io = create("t_io")
        val main = RunnableHelper(Looper.getMainLooper())

        init {
            Logger.f(TAG, "create default work RunnableHelper")
            val appMainRunnableName = Looper.getMainLooper().thread.name
            runnableLooperMap[appMainRunnableName] set Looper.getMainLooper()
        }

        @JvmStatic
        fun create(name: String): RunnableHelper {
            return create(name, Process.THREAD_PRIORITY_DEFAULT)
        }

        fun create(name: String, priority: Int): RunnableHelper {
            var looper = runnableLooperMap[name]
            if (looper == null) {
                Logger.f(TAG, "create", "new", name, "priority", priority)
                val handlerThread = HandlerThread(name, priority)
                handlerThread.start()
                looper = handlerThread.looper
                runnableLooperMap[name] set looper
            } else {
                Logger.f(TAG, "create", "reuse", name, "priority", priority)
            }
            return RunnableHelper(looper!!)
        }

        operator fun get(name: String): RunnableHelper {
            val looper = runnableLooperMap[name]
                    ?: throw kotlin.IllegalArgumentException("RunnableHelper.looper not exist, name=$name")
            return RunnableHelper(looper)
        }

        fun isMainThread(): Boolean {
            return Looper.getMainLooper().isCurrentThread
        }
    }
}