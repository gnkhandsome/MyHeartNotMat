package com.myheart.core.aidl

@kotlinx.parcelize.Parcelize
data class RespData(
    val code: Int,
    val message: String
) : android.os.Parcelable
