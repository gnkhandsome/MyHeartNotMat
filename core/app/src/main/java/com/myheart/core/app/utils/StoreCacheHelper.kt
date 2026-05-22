package com.myheart.core.app.utils

import com.google.gson.annotations.Expose
import com.myheart.core.app.base.store.IStore
import com.myheart.core.app.base.value.IEvenValue
import com.myheart.core.app.base.value.StateValue
import com.myheart.core.utils.JsonUtils
import com.myheart.core.utils.Logger.w

object StoreCacheHelper {
    private const val TAG = "StoreCacheHelper"

    // 用于缓存类的字段
    private val fieldMap: MutableMap<Class<out IStore>, Array<FieldInfo>> = HashMap()

    private val recordFieldMap: MutableMap<Class<out IStore>, Array<FieldInfo>> = HashMap()

    data class FieldInfo(
        val declaringClassSimpleName: String,
        val valueCanonicalName: String?,
        val valueName: String,
        val value: Any?,
    )

    private fun getFieldMap(store: IStore): Array<FieldInfo> {
        return fieldMap.getOrPut(store::class.java) {
            val declaredFields = store::class.java.declaredFields
            val array = Array(declaredFields.size) {
                val field = declaredFields[it]
                field.isAccessible = true
                FieldInfo(
                    declaringClassSimpleName = store::class.java.simpleName,
                    valueCanonicalName = field.type.canonicalName,
                    valueName = field.name,
                    value = field[store]
                )
            }
            array
        }
    }

    /**
     * 获取反射的字段信息
     * @param store 对象
     * @return 对象字段信息
     */
    fun even(store: IStore) {
        val fields = getFieldMap(store)
        fields.forEach { info ->
            info.value?.let {
                when (it) {
                    is IEvenValue -> {
                        it.even()
                    }

                    is Map<*, *> -> {
                        it.values.forEach { v ->
                            if (v is IEvenValue) {
                                v.even()
                            }
                        }
                    }
                }
            }
        }
    }

    @Transient
    private val tempDiffMap: MutableMap<String?, String> = HashMap()
    fun diff(store: IStore, action: (String) -> Unit) {
        tempDiffMap.clear()
        getFieldMap(store).forEach { info ->
            info.value?.let { any ->
                if (any is StateValue<*> && any.isChanged()) {
                    if (any.isValueNotNull()) {
                        try {
                            tempDiffMap[info.valueName] = JsonUtils.toJson(any.getValue())
                        } catch (th: Throwable) {
                            w(TAG, "diff deserialize failed ${th.stackTraceToString()}")
                            tempDiffMap[info.valueName] = "null"
                        }
                    } else {
                        tempDiffMap[info.valueName] = "null"
                    }
                }
            }
        }
        if (tempDiffMap.isNotEmpty()) {
            action(JsonUtils.toJson(tempDiffMap))
            tempDiffMap.clear()
        }
    }

    // 忽略掉 Transient 这种字段
    fun allWithoutTransient(useDiff: Boolean, store: IStore, action: (String) -> Unit) {
        tempDiffMap.clear()
        // 存储 Record 对象
        var logFieldArray = recordFieldMap.getOrPut(store::class.java) {
            // 过滤掉不是Transient 的字段
            val declaredFields = store::class.java.declaredFields.filter {
                // 透明的
                val transient = it.isAnnotationPresent(Expose::class.java)
                !transient
            }
            //
            val array = Array(declaredFields.size) {
                val field = declaredFields[it]
                field.isAccessible = true
                FieldInfo(
                    declaringClassSimpleName = store::class.java.simpleName,
                    valueCanonicalName = field.type.canonicalName,
                    valueName = field.name,
                    value = field[store]
                )
            }
            array
        }

        // 遍历所有字段
        logFieldArray.forEach { info ->
            info.value?.let { any ->
                var condition = if (useDiff) {
                    any is StateValue<*> && any.isChanged()
                } else {
                    any is StateValue<*>
                }

                if (condition) {
                    if ((any as StateValue<*>).isValueNotNull()) {
                        tempDiffMap[info.valueName] = JsonUtils.toJson(any.getValue())
                    } else {
                        tempDiffMap[info.valueName] = "null"
                    }
                }
            }
        }
        if (tempDiffMap.isNotEmpty()) {
            action(JsonUtils.toJson(tempDiffMap))
            tempDiffMap.clear()
        }
    }


    fun diffAll(store: IStore, action: (String) -> Unit) {
        tempDiffMap.clear()
        getFieldMap(store).forEach { info ->
            info.value?.let { any ->
                if (any is StateValue<*>) {
                    if (any.isValueNotNull()) {
                        try {
                            tempDiffMap[info.valueName] = JsonUtils.toJson(any.getValue())
                        } catch (th: Throwable) {
                            w(TAG, "diffAll deserialize failed ${th.stackTraceToString()}")
                            tempDiffMap[info.valueName] = "null"
                        }
                    } else {
                        tempDiffMap[info.valueName] = "null"
                    }
                    // 仅同步一次
//                    any.even()
                }
            }
        }
        if (tempDiffMap.isNotEmpty()) {
            action(JsonUtils.toJson(tempDiffMap))
        }
        tempDiffMap.clear()
    }
}