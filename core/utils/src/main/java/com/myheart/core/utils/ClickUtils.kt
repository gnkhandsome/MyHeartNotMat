package com.myheart.core.utils

object ClickUtils {

    private const val CLICK_MIN_INTERVAL = 300

    private var lastClickTime: Long = 0

    @JvmStatic
    val isFastDoubleClick: Boolean
        get() {
            val time = System.currentTimeMillis()
            if (time - lastClickTime < CLICK_MIN_INTERVAL) {
                return true
            }
            lastClickTime = time
            return false
        }

    @JvmStatic
    val isFastContinuousClick: Boolean
        get() {
            val time = System.currentTimeMillis()
            if (time - lastClickTime < CLICK_MIN_INTERVAL) {
                lastClickTime = time
                return true
            }
            lastClickTime = time
            return false
        }

}