package com.myheart.core.app.world

import android.app.Application
import android.content.Context
import android.os.Looper
import com.myheart.core.app.AppSingleton
import com.myheart.core.app.MainEngine
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.Logger.traceStart

class World(@Transient val app: Application) {

    @Transient
    val engine: MainEngine

    @Transient
    val context: Context

    @Transient
    val storeManager: StoreManager

    @Transient
    val entityManager: EntityManager

    @Transient
    val repoManager: RepoManager

    @Transient
    val sp: Sp

    val looper: Looper
        get() = engine.looper

    private val engineCallbacks: ArrayList<MainEngine.EngineCallback> = ArrayList()
    private var state:Int = 0

    init {
        val trace = traceStart(TAG, "World init")
        context = app.applicationContext
        engine = MainEngine(EngineCallback())
        sp = Sp(this)
        storeManager = StoreManager(this)
        repoManager = RepoManager(this)
        entityManager = EntityManager(this)
        trace.finish()
    }

    private inner class EngineCallback : MainEngine.EngineCallback {
        override fun onStart() {
            val trace = traceStart(TAG, "onStart")
            // 初始化数据
            storeManager.onStart()
            // 初始化模块
            repoManager.onStart()
            // 初始化实体
            entityManager.onStart()
            f(TAG, "onStart traversal")
            // traversal start
            repoManager.traversalOnStart()

            // start 后 dump
            entityManager.dump()
            storeManager.dump()
            repoManager.dump()
            trace.finish()
            state = START
            engineCallbacks.forEach{
                it.onStart()
            }
        }

        override fun onCreate() {
            state = CREATE
            engineCallbacks.forEach{
                it.onCreate()
            }
            AppSingleton.isEngineCreated = true
        }

        override fun onUpdate() {
            repoManager.onUpdate()
            entityManager.onUpdate()
            engineCallbacks.forEach{
                it.onUpdate()
            }
        }

        override fun onLateUpdate() {
            repoManager.onLateUpdate()
            entityManager.onLateUpdate()
            engineCallbacks.forEach{
                it.onLateUpdate()
            }
            storeManager.onLateUpdate()
        }

        override fun onDestroy() {
            val trace = traceStart(TAG, "onDestroy")
            entityManager.onDestroy()
            repoManager.onDestroy()
            storeManager.onDestroy()
            state = DESTROY
            engineCallbacks.forEach{
                it.onDestroy()
            }
            trace.finish()
        }
    }

    @Deprecated("only use for internal test")
    fun registerEngineCallback(callback: MainEngine.EngineCallback) {
        engineCallbacks.add(callback)
        // 历史的变化需要全部通知到
        if (state == START){
            callback.onStart()
        } else if (state == CREATE){
            callback.onStart()
            callback.onCreate()
        } else if (state == DESTROY){
            callback.onStart()
            callback.onCreate()
            callback.onDestroy()
        }
    }

    @Deprecated("only use for internal test")
    fun unregisterEngineCallback(callback: MainEngine.EngineCallback) {
        engineCallbacks.remove(callback)
    }


    /**
     * 启动
     */
    fun start() {
        engine.start()
    }

    /**
     * 事件消息
     */
    fun updateImmediately() {
        engine.updateImmediately()
    }

    /**
     * TODO 此方法使用有待商榷
     */
    fun runImmediately(runnable: Runnable) {
        engine.runImmediately(runnable)
    }

    /**
     * 销毁
     */
    fun destroy() {
        engine.stop()
    }

    companion object {
        private const val TAG = "World"
        private const val START = 1
        private const val CREATE = 2
        private const val DESTROY = 3
    }
}
