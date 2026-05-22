package com.myheart.core.app.base

interface ILifecycle {
    fun onStart() {}
    fun onBeforeUpdate() {}
    fun onUpdate() {}
    fun onLateUpdate() {}
    fun onDestroy() {}
}