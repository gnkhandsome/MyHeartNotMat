package com.myheart.core.app.utils

import com.myheart.core.app.base.store.IViewModel
import com.myheart.core.app.base.value.IResetValue
import java.lang.ref.WeakReference

object ViewModelResetHelper {
    private const val TAG = "ViewModelResetHelper"

    // 用于缓存类的字段
    private val viewModelMap: MutableMap<Class<out IViewModel>, Array<WeakReference<Any>>> = HashMap()

    /**
     * 获取反射的字段信息
     * @param vm 对象
     * @return 对象字段信息
     */
    fun reset(vm: IViewModel) {
        val refArray = viewModelMap.getOrPut(vm::class.java) {
            val declaredFields = vm::class.java.declaredFields
            val array = Array(declaredFields.size) {
                val field = declaredFields[it]
                field.isAccessible = true
                WeakReference(field[vm])
            }
            array
        }
        refArray.forEach { ref ->
            ref.get()?.let { any ->
                when(any) {
                    is IResetValue -> {
                        any.reset()
                    }

                    is Map<*, *> -> {
                        any.values.forEach { v ->
                            if (v is IResetValue) {
                                v.reset()
                            }
                        }
                    }
                }
            }
        }
    }
}