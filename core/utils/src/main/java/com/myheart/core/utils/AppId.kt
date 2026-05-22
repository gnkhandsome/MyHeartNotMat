package com.myheart.core.utils

import kotlin.collections.firstOrNull

enum class AppId(val value: Int) {
    /**
     * 宿主环境 Id
     */
    INVALID(0),
    HUD(1),
    MAP(2),
    SIDE_BAR(3);
//  MAP_CARD(4);

    companion object {
        fun fromValue(value: Int): AppId {
            return values().firstOrNull { it.value == value } ?: INVALID
        }

        fun getPackageName(value: Int): String {
            when (value) {
                HUD.value -> return "com.lixiang.hud"
                MAP.value -> return "com.liauto.onemap"
                SIDE_BAR.value -> return "com.lixiang.sidebar"
                else -> return "invalid"
            }
        }
    }
}