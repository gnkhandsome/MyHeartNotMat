package com.myheart.core.aidl

@kotlinx.parcelize.Parcelize
data class ReqData(
    val cmd: String,
    val payload: String
) : android.os.Parcelable
