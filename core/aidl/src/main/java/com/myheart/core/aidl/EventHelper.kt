package com.myheart.core.aidl

import java.util.concurrent.atomic.AtomicLong

object EventHelper {
    private val ID_CREATOR = AtomicLong()
    fun createId(): Long {
        return ID_CREATOR.incrementAndGet()
    }

    /**
     * 需要自己设置 respCode、data
     */
    fun createResp(req: EventReq): EventResp {
        //TODO @LiCodeAssist 不修改（保持原逻辑）
        val resp = EventResp(reqId = req.id, type = req.type)
        return resp
    }

    class RespCode {
        companion object {
            const val CODE_SUCCESS = 0
            const val CODE_FAILURE = 1
            const val CODE_WAITING = 2
            const val CODE_TIMEOUT = 3
        }
    }

    /**
     * 响应类型
     */
    class RespType {
        companion object {
            const val TYPE_INVALID = 0
            const val TYPE_COMMAND = 1000
            const val TYPE_VIEW_MODEL = 2000

        }
    }

    /**
     * 请求类型
     */
    class ReqType {
        companion object {

            /** 命令 */
            const val TYPE_COMMAND = 1000

            /** 订阅事件 */
            const val TYPE_COMMAND_SUBSCRIBE = 1001
        }
    }

}