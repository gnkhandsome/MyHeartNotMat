package com.myheart.core.app.world

import com.myheart.core.aidl.viewmodel.SyncModelManager
import com.myheart.core.app.EngineThread.Companion.assertEngineThread
import com.myheart.core.app.annotation.ValueChange
import com.myheart.core.app.base.IPipeline
import com.myheart.core.app.base.store.IStore
import com.myheart.core.app.base.value.StateValue
import com.myheart.core.app.utils.PerformanceUtils
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.Logger.trace

class StoreManager(// transient 关键字，解除Gson循环依赖
        @field:Transient private val world: World) : IPipeline<IStore> {
    private val storeMap: MutableMap<Class<out IStore>, IStore> = HashMap()
    private val storeNameMap: MutableMap<String, IStore> = HashMap()

    private val methodMonitor = PerformanceUtils.Companion.MethodMonitor()
    fun onStart() {}
    fun onDestroy() {
        storeMap.clear()
    }

    @Deprecated("Only used for test")
    fun getNameMap(): Map<String, IStore> {
        return storeNameMap
    }


    /**
     * 只能在引擎线程中使用
     * 不存在时创建
     * @param clazz
     * @return
     * @param <T>
    </T> */
    operator fun <T : IStore?> get(clazz: Class<out IStore>): T {
        assertEngineThread()
        var c = storeMap[clazz]
        if (c == null) {
            try {
                c = clazz.newInstance()
                setupStoreLog(c)
                SyncModelManager.register(c,"StoreManager")
                storeMap[clazz] = c
                storeNameMap[clazz.simpleName] = c
            } catch (e: Exception) {
                trace(TAG, e)
                throw RuntimeException("Data class=[$clazz] is null")
            }
        }
        return c as T
    }

    operator fun <T : IStore?> get(name: String): T? {
        return queryClass(name)?.let { get(it) }
    }

    fun queryClass(name: String): Class<out IStore>? {
        assertEngineThread()
        return storeMap.firstNotNullOfOrNull { it.takeIf { it.key.simpleName == name }?.key }
    }

    override fun toString(): String {
        assertEngineThread()
        return storeMap.keys.stream().map { obj: Class<out IStore> -> obj.simpleName }.toArray().contentToString()
    }

    fun dump() {
        f(TAG, "dump", "size", storeMap.size, this.toString())
    }

    fun onLateUpdate() {
        traversal("even") { it.even() }
    }

    override fun traversal(name: String, action: (IStore) -> Unit) {
        storeMap.values.forEach {
            methodMonitor.start(it, name)
            //TODO @LiCodeAssist 不修改（保持原逻辑）
            action(it)
            methodMonitor.finish()
        }
    }

    /**
     * 设置日志信息
     */
    private fun setupStoreLog(store: IStore) {
        val clazz = store.javaClass
        clazz.declaredFields.forEach { field ->
            if (field.isAnnotationPresent(ValueChange::class.java)) {
                field.isAccessible = true
                val o = field[store]
                if (o is StateValue<*>) {
                    o.setupLog(clazz.simpleName, field.name)
                }
            }
        }
    }


    companion object {
        private const val TAG = "StoreManager"
    }
}