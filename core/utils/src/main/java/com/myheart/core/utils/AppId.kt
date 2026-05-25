package com.myheart.core.utils

import kotlin.collections.firstOrNull

enum class AppId(val value: Int) {
    /**
     * 宿主环境 Id
     */
    INVALID(0),
    DEMO(1);

    companion object {
        fun fromValue(value: Int): AppId {
            return values().firstOrNull { it.value == value } ?: INVALID
        }

        fun getPackageName(value: Int): String {
            when (value) {
                DEMO.value -> return "com.myheart.demo"
                else -> return "invalid"
            }
        }
    }
}