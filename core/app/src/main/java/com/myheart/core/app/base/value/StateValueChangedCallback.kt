package com.myheart.core.app.base.value

fun interface StateValueChangedCallback<T> {
    /**
     * 不要做耗时操作
     * @param value 值
     */
    fun onValueChanged(value: T?)
}