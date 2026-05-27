package com.myheart.core.app.tracker

import android.content.Context
import android.os.SystemClock
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.Logger.trace

/**
 * 上报性能、埋点
 */
object EventTrackHelper {

    private const val TAG = "EventTrackHelper"

    private const val EMPTY = "{}"

    private var mAppColdStartTime: Long = 0

    private var phase1Time:Long = 0
    private var phase2Time:Long = 0
    private var phase3Time:Long = 0

    private var mAppColdStartEndTime: Long = 0
    private var mIsColdStartBegin = false

    private var phase1Logged = false
    private var phase2Logged = false
    private var phase3Logged = false

    fun init(context: Context, debug: Boolean = false) {
//        AppMonitor.init(context, debug)
    }

    // onAttachContext
    fun onAppColdStart() {
        mIsColdStartBegin = true
        mAppColdStartTime = SystemClock.elapsedRealtime()
        f("EidApmTrack","mAppColdStartTime: $mAppColdStartTime")

    }
    //  onAttachContext -> onCreate 结束
    fun onAppColdStartPhase1(){
        if (!mIsColdStartBegin) {
            // 只统计成对出现的冷启动
            return
        }
        if (phase1Logged) return
        phase1Logged = true
        // 阶段1 上报
        try {
            phase1Time = SystemClock.elapsedRealtime()
            val elapsedRealtime = phase1Time - mAppColdStartTime
            f("EidApmTrack","phase1Time: $elapsedRealtime @ $phase1Time")
//            val data = LaunchEventData.Builder()
//                .phase1(elapsedRealtime)
//                .build()
//            ApmTracker.trackColdLaunchEvent(data, DisplayType.DISPLAY_DEFAULT)
        } catch (e: Exception) {
            trace(TAG, e)
        }
    }


    // onCreate -> enable camera
    fun onAppColdPhase2(){
        if (!mIsColdStartBegin) {
            // 只统计成对出现的冷启动
            return
        }
        if (phase2Logged) return
        phase2Logged = true
        // 阶段2 上报
        try {
            phase2Time = SystemClock.elapsedRealtime()
            val elapsedRealtime = phase2Time - phase1Time
            f("EidApmTrack","phase2Time: $elapsedRealtime @ $phase2Time")
//            val data = LaunchEventData.Builder()
//                .phase2(elapsedRealtime)
//                .build()
//            ApmTracker.trackColdLaunchEvent(data, DisplayType.DISPLAY_DEFAULT)
        } catch (e: Exception) {
            trace(TAG, e)
        }
    }

    // enable camera -> onFirstFrameFinished
    fun onAppColdStartPhase3(){
        if (!mIsColdStartBegin) {
            // 只统计成对出现的冷启动
            return
        }
        // 阶段3
        if (phase3Logged) return
        phase3Logged = true
        // 阶段3 上报
        try {
            phase3Time = SystemClock.elapsedRealtime()
            val elapsedRealtime = phase3Time - phase2Time
            f("EidApmTrack","phase3Time: $elapsedRealtime @ $phase3Time")
//            val data = LaunchEventData.Builder()
//                .phase3(elapsedRealtime)
//                .build()
//            ApmTracker.trackColdLaunchEvent(data, DisplayType.DISPLAY_DEFAULT)
        } catch (e: Exception) {
            trace(TAG, e)
        }
        // 冷启动结束
        onAppColdStartEnd()
    }

    private fun onAppColdStartEnd() {
        mIsColdStartBegin = false
    }


    /**
     * 业务埋点
     */
    private fun sendCustomEvent(eventKey: String, json: String) {
        try {
            f(TAG, "sendCustomEvent eventKey:$eventKey, json:$json")
//            AppMonitor.uploadCustomEvent(eventKey, json, DisplayType.DISPLAY_DEFAULT)
        } catch (e: Exception) {
            trace(TAG, e)
        }
    }

}
