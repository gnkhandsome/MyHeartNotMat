package com.myheart.core.utils

import android.os.Binder
import com.myheart.core.utils.Logger.f

class EmptyBinder: Binder(DESCRIPTOR) {

    val TAG = "EmptyBinder"

    init {
        f(TAG, "init EmptyBinder")
    }
    companion object {
        const val DESCRIPTOR = "NULL"
    }
}