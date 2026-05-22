package com.myheart.core.app.base.store

import com.myheart.core.app.utils.StoreCacheHelper


/**
 * 支持IEvenValue字段和Map<*, IEvenValue>字段
 */
interface IStore {
    /**
     * 所有StateValue调用even方法，覆盖旧的值
     */
    fun even() {
        StoreCacheHelper.even(this)
    }
}