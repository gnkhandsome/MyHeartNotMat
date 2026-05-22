package com.myheart.core.aidl.constant

import kotlin.collections.find

/**
 * 订阅点击事件的常量信息
 */
enum class ViewModelEnum(val code: Int) {
        DEMO_VIEWMODEL(900),
        ;
        companion object {
                fun fromCode(code: Int): ViewModelEnum? {
                        return ViewModelEnum.values().find { it.code == code }
                }
        }
}