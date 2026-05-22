package com.myheart.core.app

import android.os.Handler
import android.os.HandlerThread
import com.myheart.core.utils.Logger.f

class EngineThread private constructor(name: String) : HandlerThread(name) {
    init {
        f(THREAD_NAME, "EngineThread init")
        start()
    }

    private object Holder {
        val instance = EngineThread(THREAD_NAME)
        val handler = Handler(instance.looper)
    }

    companion object {
        private const val THREAD_NAME = "t_ENGINE"
        @JvmStatic
        fun get(): EngineThread {
            return Holder.instance
        }

        val isCurrentThread: Boolean
            get() {
                return currentThread() == Holder.instance
            }

        @JvmStatic
        fun assertEngineThread() {
            check(isCurrentThread) { "[MUST] invoke in EngineThread, Current=" + currentThread() }
        }

        @JvmStatic
        fun getHandler(): Handler {
            return Holder.handler
        }
    }
}