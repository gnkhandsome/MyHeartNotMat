package com.myheart.core.app.base.repo

import com.myheart.core.app.base.ILifecycle

interface IRepo : ILifecycle {
    val repoName: String
        get() = javaClass.simpleName

    var isEnable: Boolean
    fun <T :IRepo> enable(): T

    fun <T :IRepo> disable(): T
}