package com.myheart.core.aidl

import android.os.Parcelable
import com.myheart.core.utils.AppIdHolder
import kotlinx.parcelize.Parcelize

@Parcelize
data class EventReq(
    /**
     * 请求id
     */
    val id: Long = System.nanoTime(),
    /**
     * 集成应用id
     */
    val appId: Int = AppIdHolder.appId.value,
    /**
     * 数据类型 EventHelper.ReqType
     */
    val type: Int,
    /**
     * 数据
     */
    val data: String,

    ) : Parcelable