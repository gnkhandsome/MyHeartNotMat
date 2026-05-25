package com.myheart.core.aidl

import android.os.Parcelable
import com.myheart.core.utils.AppId
import kotlinx.parcelize.Parcelize
import java.lang.System

@Parcelize
data class EventResp(
    /**
     * 响应id
     */
    val id: Long = System.nanoTime(),
    /**
     * 请求id
     */
    val reqId: Long = -1,
    /**
     *
     * 宿主应用 id
     */
    val appId: Int = AppId.INVALID.value,
    /**
     * 响应状态码 EventHelper.RespCode
     */
    val code: Int = EventHelper.RespCode.CODE_SUCCESS,
    /**
     * 数据类型 EventHelper.RespType
     */
    val type: Int,

    // 数据
    val data: String? = null,
    /**
     * 子类型
     */
    val subType:Int = 0,
    ) : Parcelable