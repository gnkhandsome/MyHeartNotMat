package com.myheart.core.sdk.utils

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.myheart.core.utils.JsonUtils
import com.myheart.core.utils.Logger
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.ReflectCacheHelper
import java.lang.reflect.Field
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import java.util.Objects
import java.util.concurrent.ConcurrentHashMap
import kotlin.jvm.java
import kotlin.jvm.javaClass
import kotlin.let

object ViewModelDiffHelper {

    private const val DEBUG = true
    private const val TAG = "ViewModelDiffHelper"

    @Transient
    private val fieldParameterizedTypeMap: MutableMap<Field, Type> = ConcurrentHashMap()

    /**
     * 将对应字段和 json 转换为 ViewModel 中对应的 MutableLiveData 字段对象并赋值
     * @param t ViewModel 对象，只处理对象中 MutableLiveData 字段
     * @param fieldName MutableLiveData 字段名，与 ViewModelStore 中的字段名一致
     * @param json MutableLiveData 对应的对象json字符串
     * @param <T> ViewModel 子类
    </T> */
    fun <T:ViewModel> applyViewModel(t: T, fieldName: String, json: String) {
        val fields = ReflectCacheHelper.getFields(t::class.java)
        try {
            for (field in fields) {
                val o = field[t]
                if (o is MutableLiveData<*>) {
                    if (fieldName == ReflectCacheHelper.getFieldName(field)) {
                        // 获取 MutableLiveData 泛型的类型
                        var actualType = fieldParameterizedTypeMap[field]
                        if (actualType == null) {
                            val genericType = field.genericType
                            if (DEBUG){
                                Logger.f(TAG, "apply genericType", Objects.toString(genericType), json)
                            }
                            if (genericType is ParameterizedType) {
                                // MutableLiveData<java.lang.Float> 只需要获取第一个泛型类型
                                val actualTypeArgument = genericType.actualTypeArguments[0]
                                fieldParameterizedTypeMap[field] = actualTypeArgument
                                actualType = actualTypeArgument
                            }
                        }
                        actualType?.let {
                            if (json == "null") {
                                o.postValue(null)
                            } else {
                                o.postValue(JsonUtils.fromJson(json, actualType))
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            f(TAG, "t=${t.javaClass.name}, fieldName=$fieldName, json=$json, e=${e.message}")
        }
    }
}