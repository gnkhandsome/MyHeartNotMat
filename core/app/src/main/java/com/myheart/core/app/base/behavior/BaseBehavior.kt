package com.myheart.core.app.base.behavior

import com.myheart.core.app.base.ILifecycle
import com.myheart.core.app.utils.PerformanceUtils
import com.myheart.core.app.world.World


open class BaseBehavior(// transient 关键字，解除Gson循环依赖
        @field:Transient val world: World
) : IBehavior {

        private val methodMonitor = PerformanceUtils.Companion.MethodMonitor()
        override fun traversal(name: String, action: (ILifecycle) -> Unit) {
                if (!isEnable) {
                     return
                }
                methodMonitor.start(this, name)
                action(this)
                methodMonitor.finish()
        }
        // 增加可关闭能力
        var isEnable = true

}