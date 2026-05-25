package com.myheart.core.utils

class SdkAction {
    companion object {
        /**
         * 事件
         */
        const val ACTION_EVENT = "com.myheart.core.sdk.event"

        /**
         * 请求序列
         */
        const val EXTRA_SEQ = "extra_seq"

        /**
         * 跨进程 appId（兼容部分系统对 Intent.identifier 透传不稳定场景）
         */
        const val EXTRA_MULTI_APP_ID = "extra_multi_app_id"
    }
}