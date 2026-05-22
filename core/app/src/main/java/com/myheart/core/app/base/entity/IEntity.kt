package com.myheart.core.app.base.entity

import com.myheart.core.app.base.ILifecycle
import com.myheart.core.app.base.IPipeline
import com.myheart.core.app.base.behavior.IBehavior

/**
 * 实体接口
 */
interface IEntity : ILifecycle, IPipeline<ILifecycle> {

    /**
     * 实体名称
     */
    val entityName: String
        get() = javaClass.simpleName

    /**
     * 是否启用
     */
    var isEnable: Boolean

    fun enable()

    fun disable()

    /**
     * 添加行为
     */
    fun addBehavior(behavior: IBehavior)

    /**
     * 移除行为
     */
    fun removeBehavior(behavior: IBehavior)

    /**
     * 添加实体
     */
    fun addEntity(entity: IEntity)

    /**
     * 移除实体
     */
    fun removeEntity(entity: IEntity)

    /**
     * 不需要继承performStart，要继承onStart
     */
    fun performStart()

    /**
     * 不需要继承performDestroy，要继承onDestroy
     */
    fun performDestroy()
}