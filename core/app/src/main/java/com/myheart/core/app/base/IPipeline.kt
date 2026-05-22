package com.myheart.core.app.base

fun interface IPipeline<T> {
    /**
     * 遍历
     * @param name
     * @param action
     */
    fun traversal(name: String, action: (T) -> Unit)
}