package com.myheart.core.app.base.value

fun interface StateValueChangedTrigger {
    /**
     * 不要做耗时操作
     */
    fun onChanged()
}