package com.myheart.core.aidl.reqmodel

/**
 * 订阅的事件信息
 */
data class SubscribeCommandDetailModel(
    /** 事件参数 */
    /**
     * 事件类型
     */
    val type : Int,
    /**
     * 事件名称，根据不同的type，name有不同的含义
     * TYPE_CLICK -> 点击事件的名称
     * TYPE_TTS -> 播报
     */
    val name : String,
    val param1 : Int,
    val param2 : Int,
    val message :String,
)