package com.myheart.core.app.base.value

/**
 * 易变的值
 */
interface IChangeableValue {
    /**
     * 值是否变化
     */
    fun isChanged(): Boolean
}