package com.myheart.core.app.base.entity

import com.myheart.core.app.EngineThread
import com.myheart.core.app.base.ILifecycle
import com.myheart.core.app.base.action.SubscribeManager
import com.myheart.core.app.base.behavior.IBehavior
import com.myheart.core.app.utils.ValueUtils
import com.myheart.core.app.world.World
import com.myheart.core.utils.Logger.f


open class BaseEntity(@Transient val world: World) : IEntity {

    override var isEnable: Boolean = true

    private var enableTime: Long = 0
    private var disableTime: Long = 0

    override fun enable() {
        isEnable = true
        enableTime = System.currentTimeMillis()
        if (disableTime > 0) {
            f(entityName, "enable $entityName disable time", ValueUtils.transformTimeMs(enableTime - disableTime))
        } else {
            f(entityName, "enable $entityName")
        }
    }

    override fun disable() {
        isEnable = false
        disableTime = System.currentTimeMillis()
        f(entityName, "disable $entityName running time", ValueUtils.transformTimeMs(disableTime - enableTime))
    }

    private lateinit var behaviors: MutableList<IBehavior>
    private lateinit var entites: MutableList<IEntity>
    override fun addBehavior(behavior: IBehavior) {
        EngineThread.assertEngineThread()
        if (!this::behaviors.isInitialized) {
            behaviors = mutableListOf()
        }
        if (!behaviors.contains(behavior)) {
            val result = behaviors.add(behavior)
            if (result) {
                behavior.traversal("onStart") { it.onStart() }
            }
            f(entityName, "addBehavior : $result, $behavior")
            // 点击事件监听
            SubscribeManager.register(behavior)
        }

    }

    override fun removeBehavior(behavior: IBehavior) {
        EngineThread.assertEngineThread()
        if (this::behaviors.isInitialized) {
            val result = behaviors.remove(behavior)
            if (result) {
                behavior.traversal("onDestroy") { it.onDestroy() }
            }
            // 点击事件监听
            SubscribeManager.unRegister(behavior)
            f(entityName, "removeBehavior : $result, $behavior")
        }
    }

    fun getBehavior(clazz: Class<out IBehavior>): IBehavior? {
        EngineThread.assertEngineThread()
        //TODO @LiCodeAssist 不修改（保持原逻辑）
        return behaviors.find { it.javaClass == clazz }
    }

    fun getAllBehaviors(): List<IBehavior> {
        //TODO @LiCodeAssist 不修改（保持原逻辑）
        return behaviors
    }

    override fun addEntity(entity: IEntity) {
        EngineThread.assertEngineThread()
        if (!this::entites.isInitialized) {
            entites = mutableListOf()
        }
        if (!entites.contains(entity)) {
            val result = entites.add(entity)
            if (result) {
                entity.traversal("onStart") { it.onStart() }
            }
            f(entityName, "addEntity : $result, $entity")
        }
    }

    override fun removeEntity(entity: IEntity) {
        EngineThread.assertEngineThread()
        if (this::entites.isInitialized) {
            val result = entites.remove(entity)
            if (result) {
                entity.traversal("onDestroy") { it.onDestroy() }
            }
            f(entityName, "removeEntity : $result, $entity")
        }
    }

    override fun performStart() {
        onStart()
    }

    /**
     * 遍历所有实体
     */
    override fun traversal(name: String, action: (ILifecycle) -> Unit) {
        if (!isEnable) {
            // 跳过
            return
        }
        // 执行自身的方法
        action(this)
        // 执行行为的方法
        if (this::behaviors.isInitialized) {
            behaviors.forEach {
                it.traversal(name, action)
            }
        }
        if (this::entites.isInitialized) {
            entites.forEach {
                it.traversal(name, action)
            }
        }
    }

    override fun performDestroy() {
        // 释放行为
        if (this::behaviors.isInitialized) {
            behaviors.forEach {
                it.onDestroy()
            }
            behaviors.clear()
        }
        // 释放实体
        if (this::entites.isInitialized) {
            entites.forEach {
                it.performDestroy()
            }
            entites.clear()
        }
        onDestroy()
    }
}