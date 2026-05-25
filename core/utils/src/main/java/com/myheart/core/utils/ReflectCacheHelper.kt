package com.myheart.core.utils

import java.lang.reflect.Field
import java.util.Arrays
import java.util.concurrent.ConcurrentHashMap
import java.util.stream.Collectors
import kotlin.collections.forEach
import kotlin.let

object ReflectCacheHelper {

    private const val TAG = "ReflectCacheUtils"

    // 用于缓存类的字段
    private val fieldMap: MutableMap<Class<*>, Array<Field>> = ConcurrentHashMap()

    /**
     * 获取反射的字段信息
     * @param clazz 类名
     * @return 类的所有字段信息
     */
    fun getFields(clazz: Class<*>): Array<Field> {
        var fields = fieldMap[clazz]
        if (fields == null) {
            fields = clazz.declaredFields
            fields.forEach { it.isAccessible = true }
            fieldMap[clazz] = fields
            //TODO @LiCodeAssist 不修改（无需修改）
            Logger.f(TAG, "getFields", clazz, fields?.size, fields?.let { Arrays.stream(it).map({ it.name }).collect(Collectors.toList()) })
        }
        return fields!!
    }

    // 用户缓存字段映射的字段名
    private val fieldNameMap: MutableMap<Field, String> = ConcurrentHashMap()

    /**
     * 通过反射的字段获取字段名称
     * @param field 字段
     * @return 字段名
     */
    fun getFieldName(field: Field): String {
        var name = fieldNameMap[field]
        if (name == null) {
            val fieldName = field.name
            fieldNameMap[field] = fieldName
            name = fieldName
        }
        return name!!
    }
}