package com.myheart.core.app.base.repo

import com.myheart.core.app.utils.ValueUtils
import com.myheart.core.app.world.World
import com.myheart.core.utils.Logger.f

abstract class BaseRepo( // transient 关键字，解除Gson循环依赖
        @JvmField @field:Transient val world: World
) : IRepo {

    override var isEnable: Boolean = false

    private var enableTime: Long = 0
    private var disableTime: Long = 0

    override fun <T :IRepo> enable(): T {
        isEnable = true
        enableTime = System.currentTimeMillis()
        if (disableTime > 0) {
            f(repoName, "enable $repoName disable time", ValueUtils.transformTimeMs(enableTime - disableTime))
        } else {
            f(repoName, "enable $repoName")
        }
        return this as T
    }

    override fun <T :IRepo> disable(): T {
        isEnable = false
        disableTime = System.currentTimeMillis()
        f(repoName, "disable $repoName running time", ValueUtils.transformTimeMs(disableTime - enableTime))
        return this as T
    }
}