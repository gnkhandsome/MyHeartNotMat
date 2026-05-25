package com.myheart.core.app

import android.os.Handler
import android.os.Looper
import android.os.Message
import android.os.SystemClock
import com.myheart.core.app.EngineThread.Companion.get
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.Logger.trace
import com.myheart.core.utils.Logger.traceMethod
import com.myheart.core.utils.Logger.traceStart
import java.util.concurrent.TimeUnit
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.nanoseconds
import kotlin.time.DurationUnit

class MainEngine(@field:Transient val engineCallback: EngineCallback) {

    // 初始化线程
    @Transient
    private val frameHandler: FrameHandler = FrameHandler(   get().looper)
    private var fps = 20

    fun start() {
        frameHandler.start(fps)
    }

    fun stop() {
        traceMethod("stop")
        frameHandler.stop()
    }

    fun updateImmediately() {
        frameHandler.updateImmediately()
    }

    fun runImmediately(runnable: Runnable) {
        frameHandler.post(runnable)
    }

    val looper: Looper
        get() = frameHandler.looper

    private fun performEngineStart() {
        val trace = traceStart(TAG, "performEngineStart")
        engineCallback.onStart()
        trace.finish()
    }

    private fun performEngineCreate() {
        val trace = traceStart(TAG, "performEngineCreate")
        engineCallback.onCreate()
        trace.finish()
    }

    private fun performEngineUpdate() {
        engineCallback.onUpdate()
    }

    private fun performEngineLateUpdate() {
        engineCallback.onLateUpdate()
    }

    private fun performEngineDestroy() {
        val trace = traceStart(TAG, "performEngineDestroy")
        engineCallback.onDestroy()
        trace.finish()
    }

    private inner class FrameHandler(looper: Looper) : Handler(looper) {
        private val MSG_START = 1
        private val MSG_UPDATE = 2
        private val MSG_CREATE = 3
        private val MSG_DESTROY = 4
        private val MSG_FPS = 5
        private var frameIntervalMs = 0L
        private var updateCost: Long = 0
        private var totalUpdateCost: Long = 0
        private var totalUpdateCount: Long = 0
        private var lastUpdateTimeNs: Long = 0
        private var minUpdateTimeNs: Long = Long.MAX_VALUE
        private var maxUpdateTimeNs: Long = Long.MIN_VALUE
        /** 日志记录时间间隔 1分钟 */
        private var DUMP_INTERVAL_NS: Long = TimeUnit.MINUTES.toNanos(1)
        /** 5秒打印一次FPS */
        private var FPS_INTERVAL_MS: Long = TimeUnit.SECONDS.toMillis(5)
        private var lastPrintFpsTime = 0L
        private var updateCount = 0
        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)
            when (msg.what) {
                MSG_START -> {
                    removeMessages(MSG_START)
                    performEngineStart()
                    // 开始循环
                    sendEmptyMessage(MSG_UPDATE)
                    sendEmptyMessage(MSG_CREATE)
                    sendEmptyMessage(MSG_FPS)
                }
                MSG_CREATE -> { // 第一个Update后就是 Create
                    removeMessages(MSG_CREATE)
                    performEngineCreate()
                }
                MSG_UPDATE -> {
                    val time = SystemClock.elapsedRealtimeNanos()
                    performEngineUpdate()
                    performEngineLateUpdate()
                    updateCount ++
                    updateCost = SystemClock.elapsedRealtimeNanos() - time
                    var delay = TimeUnit.MILLISECONDS.toNanos(frameIntervalMs) - updateCost
                    if (delay <= 0) {
                        f(TAG, "MSG_UPDATE delay=${transformTimeNs(abs(delay))}")
                        delay = 0
                    }
                    performTrack()
                    // 自循环
                    removeMessages(MSG_UPDATE)
                    sendEmptyMessageDelayed(MSG_UPDATE, TimeUnit.NANOSECONDS.toMillis(delay))
                }
                MSG_FPS -> {
                    val current = SystemClock.elapsedRealtime()
                    try {
                        val fps = updateCount / (current - lastPrintFpsTime).milliseconds.toInt(DurationUnit.SECONDS)
                        f(TAG, "MSG_FPS fps=${fps}")
                    } catch (e: Exception) {
                        trace(TAG, e)
                    }
                    updateCount = 0
                    lastPrintFpsTime = current
                    // 自循环
                    removeMessages(MSG_FPS)
                    sendEmptyMessageDelayed(MSG_FPS, FPS_INTERVAL_MS)
                }
                MSG_DESTROY -> {
                    removeMessages(MSG_DESTROY)
                    performEngineDestroy()
                }
            }
        }

        fun updateFps(fps: Int) {
            frameIntervalMs = 1000L / fps
            f(TAG, "performUpdateFps fps=$fps, frameInterval=$frameIntervalMs")
        }

        fun start(fps: Int) {
            val trace = traceStart(TAG, "start fps $fps")
            updateFps(fps)
            obtainMessage(MSG_START).sendToTarget()
            trace.finish()
        }

        fun stop() {
            val trace = traceStart(TAG, "stop")
            obtainMessage(MSG_DESTROY).sendToTarget()
            frameHandler.looper.quitSafely()
            try {
                frameHandler.looper.thread.join()
            } catch (e: InterruptedException) {
                trace(TAG, e)
            }
            trace.finish()
        }

        /**
         * 立即更新
         */
        fun updateImmediately() {
            obtainMessage(MSG_UPDATE).sendToTarget()
        }


        private fun performTrack() {
            minUpdateTimeNs = min(updateCost, minUpdateTimeNs)
            maxUpdateTimeNs = max(updateCost, maxUpdateTimeNs)
            totalUpdateCost += updateCost
            totalUpdateCount ++
            val curTimeNs = SystemClock.elapsedRealtimeNanos()
            if (curTimeNs - lastUpdateTimeNs >= DUMP_INTERVAL_NS) {
                lastUpdateTimeNs = curTimeNs
                f(TAG, "performTrack min=${transformTimeNs(minUpdateTimeNs)}, max=${transformTimeNs(maxUpdateTimeNs)}, avg=${transformTimeNs(totalUpdateCost/totalUpdateCount)}, count=$totalUpdateCount, total update cost=${transformTimeNs(totalUpdateCost)}")
            }
        }
    }

    /**
     * 引擎线程事件回调
     */
    interface EngineCallback {
        fun onStart()
        fun onCreate()
        fun onUpdate()
        fun onLateUpdate()
        fun onDestroy()
    }

    open class AbsEngineCallback : EngineCallback {
        override fun onStart() {}

        override fun onCreate() {}

        override fun onUpdate() {}

        override fun onLateUpdate() {}

        override fun onDestroy() {}

    }

    fun transformTimeNs(time: Long): String {
        return time.nanoseconds.toString()
    }

    companion object {
        private const val TAG = "MainEngine_Demo"
    }
}