package com.myheart.core.app.base.behavior

import com.myheart.core.app.base.ILifecycle
import com.myheart.core.app.base.IPipeline

/**
 * Behavior 行为接口
 * 
 * Behavior 是 EID 架构中的功能模块单元,类似于游戏引擎中的 Component 组件。
 * 每个 Behavior 封装一个独立的功能逻辑,通过组合多个 Behavior 实现复杂的业务功能。
 * 
 * 设计理念:
 * - 通过组合而非继承实现功能扩展
 * - Behavior 之间通过 Store 通信,不直接依赖
 * - 运行时可动态启用/禁用
 * - 每个 Behavior 可以独立测试
 * 
 * 生命周期:
 * - onStart(): 初始化,在 Behavior 被添加到 Entity 时调用一次
 * - onUpdate(): 每帧更新(50ms),执行主要业务逻辑
 * - onLateUpdate(): 延迟更新,在所有 onUpdate 之后执行,用于依赖其他 Behavior 的逻辑
 * - onDestroy(): 销毁清理,在 Behavior 被移除时调用
 * 
 * @see ILifecycle 生命周期接口,定义 Behavior 的生命周期方法
 * @see IPipeline 遍历管道接口,支持性能监控和条件过滤
 */
interface IBehavior : ILifecycle, IPipeline<ILifecycle>
