package com.myheart.core.app.base.value

fun interface StateValueSetCallback<T> {
    /**
     * 不要做耗时操作
     * @param value 值
     */
    fun onValueSet(value: T?)
}