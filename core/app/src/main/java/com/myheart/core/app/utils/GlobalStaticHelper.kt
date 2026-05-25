package com.myheart.core.app.utils

import com.myheart.core.app.viewmodel.DemoViewModelStore
import com.myheart.core.app.world.World
import kotlin.jvm.java

/**
 * 文件名称：GlobalStaticHelper.kt
 * 描述   ：[用于非 Behavior 中使用 World 关联]
 * 作者   ：樊健凯（WX: Kai1782674853）
 * 日期   ：2026/3/28
 * 版本   ：V1.0.0
 *
 * 修改记录：
 * 时间      | 修改人   | 修改内容
 * ---------|---------|---------
 *
 */
object GlobalStaticHelper {

    var demoViewModelStore: DemoViewModelStore? = null
        private set

    fun init(world: World) {
        demoViewModelStore = world.storeManager[DemoViewModelStore::class.java]
    }

}