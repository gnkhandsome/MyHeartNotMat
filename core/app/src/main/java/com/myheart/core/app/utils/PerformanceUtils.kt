package com.myheart.core.app.utils

import com.myheart.core.utils.Logger.f
import java.util.concurrent.TimeUnit

class PerformanceUtils {
    companion object {
        private const val TAG = "PerformanceUtils"
        private const val DEBUG = true

        /**
         * 方法执行时间，单位ms
         */
        private const val TIME_METHOD_EXEC_MS = 10L

        class MethodMonitor() {
            private lateinit var target: Any
            private var name: String = ""
            private var startTime: Long = 0L

            fun start(target: Any, name: String) {
                if (!DEBUG) {
                    return
                }
                this.target = target
                this.name = name
                startTime = System.nanoTime()
            }
            fun finish() {
                if (!DEBUG) {
                    return
                }
                val cost = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime)
                if (cost > TIME_METHOD_EXEC_MS) {
                    f(TAG, "[WARN] [MethodMonitor] [${target.javaClass.simpleName}] [$name] cost=${cost}ms")
                }
            }
        }
    }
}