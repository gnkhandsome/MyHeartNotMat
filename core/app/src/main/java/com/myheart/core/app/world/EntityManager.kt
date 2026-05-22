package com.myheart.core.app.world

import com.myheart.core.app.base.ILifecycle
import com.myheart.core.app.base.IPipeline
import com.myheart.core.app.reborn.entity.GlobalEntity
import com.myheart.core.utils.Logger

class EntityManager internal constructor(// transient 关键字，解除Gson循环依赖
    @field:Transient private val world: World) : IPipeline<ILifecycle> {

    private val globalEntity: GlobalEntity = GlobalEntity(world)


    fun onStart() {
        globalEntity.performStart()
    }

    fun onUpdate() {
        traversal("onBeforeUpdate") { it.onBeforeUpdate() }
        traversal("onUpdate") { it.onUpdate() }
    }

    fun onLateUpdate() {
        traversal("onLateUpdate") { it.onLateUpdate() }
    }

    fun onDestroy() {
        globalEntity.performDestroy()
    }
    override fun traversal(name: String, action: (ILifecycle) -> Unit) {
        globalEntity.traversal(name, action)
    }

    override fun toString(): String {
        return globalEntity.toString()
    }

    fun dump() {
        //TODO @LiCodeAssist 不修改（内部逻辑中有验空逻辑）
        Logger.f(TAG, "dump", "size", this.toString())
    }

    companion object {
        private const val TAG = "EntityManager"
    }
}