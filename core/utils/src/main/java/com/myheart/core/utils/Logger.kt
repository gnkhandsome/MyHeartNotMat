package com.myheart.core.utils

import android.os.SystemClock
import android.text.TextUtils
import android.util.Log
import java.util.concurrent.atomic.AtomicLong

object Logger {
    private const val TAG_PRE = "Reborn_"
    private const val TAG_TRACE_METHOD = "Reborn_TraceMethod"
    private const val TAG_TRACE_START = "<TraceStart>"
    private const val TAG_TRACE_END = "<TraceEnd>"

    /**
     * 可变参数不要传null，建议使用 JsonUtils.toString(...)
     * @param tag
     * @param message
     * @param args
     */
    @JvmStatic
    fun f(tag: String, message: String, vararg args: Any?) {
        print(Log.INFO, tag, message, *args)
    }



    @JvmStatic
    fun d(tag: String, message: String, vararg args: Any?) {
        print(Log.INFO, tag, message, *args)
    }

    @JvmStatic
    fun i(tag: String, message: String, vararg args: Any?) {
        print(Log.INFO, tag, message, *args)
    }

    @JvmStatic
    fun w(tag: String, message: String, vararg args: Any?) {
        print(Log.WARN, tag, message, *args)
    }

    @JvmStatic
    fun e(tag: String, message: String, vararg args: Any?) {
        print(Log.ERROR, tag, message, *args)
    }

    private fun print(level: Int, tag: String, message: String, vararg args: Any?) {
        var _tag = tag
        val builder = kotlin.text.StringBuilder()
        builder.append("[").append(Thread.currentThread().name).append("] ").append(message)
        for (obj in args) {
            builder.append(", ")
            when (obj) {
                null -> builder.append("null")
                (obj is Number || obj is String) -> builder.append(obj)
                else -> builder.append(JsonUtils.toJson(obj))
            }
        }
        _tag = TAG_PRE + _tag
        when (level) {
            Log.VERBOSE -> Log.v(_tag, builder.toString())
            Log.DEBUG -> Log.d(_tag, builder.toString())
            Log.INFO -> Log.i(_tag, builder.toString())
            Log.WARN -> Log.w(_tag, builder.toString())
            Log.ERROR -> Log.e(_tag, builder.toString())
            else -> Log.e(_tag, builder.toString())
        }
    }

    @JvmStatic
    fun trace(tag: String, tr: Throwable?) {
        val stackTraceString = Log.getStackTraceString(tr)
        print(Log.ERROR, tag, stackTraceString)
    }

    @JvmStatic
    @JvmOverloads
    fun traceMethod(message: String? = "") {
        val builder = kotlin.text.StringBuilder()
        builder.append("[").append(Thread.currentThread().name).append("] ")
        if (!TextUtils.isEmpty(message)) {
            builder.append(message).append("\n")
        }
        val stackTrace = Thread.currentThread().stackTrace
        var filterLine = 3
        for (element in stackTrace) {
            filterLine--
            if (filterLine >= 0) {
                continue
            }
            builder.append(element.toString()).append("\n")
        }
        Log.i(TAG_TRACE_METHOD, builder.toString())
    }

    /**
     * 与 traceEnd 成对使用
     * @param tag log tag
     * @param message 日志信息
     * @return trace信息
     */
    @JvmStatic
    fun traceStart(tag: String, message: String): LoggerTrace {
        val loggerTrace = LoggerTrace(tag, message)
        f(tag, message, TAG_TRACE_START, "id=" + loggerTrace.id)
        return loggerTrace
    }

    class LoggerTrace(var tag: String, var message: String) {
        var id: Long
        var time: Long

        init {
            id = ID.incrementAndGet()
            time = SystemClock.elapsedRealtimeNanos()
        }

        fun finish() {
            val cost = SystemClock.elapsedRealtimeNanos() - time
            val costStr: String = if (cost > 1000000) {
                (cost / 1000000).toString() + "ms" + cost % 1000000 + "ns"
            } else {
                cost.toString() + "ns"
            }
            f(tag, message, TAG_TRACE_END, "id=$id", "cost=$costStr")
        }

        companion object {
            private val ID = AtomicLong()
        }
    }
}