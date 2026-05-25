package com.myheart.core.utils

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonDeserializer
import com.google.gson.JsonElement
import com.google.gson.JsonNull
import com.google.gson.JsonObject
import com.google.gson.JsonParseException
import com.google.gson.JsonPrimitive
import com.google.gson.JsonSerializationContext
import com.google.gson.JsonSerializer
import com.google.gson.TypeAdapter
import com.google.gson.TypeAdapterFactory
import com.google.gson.reflect.TypeToken
import com.google.gson.JsonParser
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonToken
import com.google.gson.stream.JsonWriter
import com.myheart.core.utils.JsonUtils.GSON
import org.json.JSONObject
import java.lang.reflect.Type
import java.nio.ByteBuffer
import kotlin.collections.indices
import kotlin.isFinite
import kotlin.isNaN
import kotlin.jvm.Throws
import kotlin.jvm.java
import kotlin.ranges.until
import kotlin.takeIf
import kotlin.text.isEmpty
import kotlin.text.substring
import kotlin.text.toByteArray
import kotlin.text.toDouble

inline fun <reified T> String.fromJson(): T? {
    return GSON.fromJson(this, object : TypeToken<T>() {}.type)
}

object JsonUtils {
    private const val VERSION = 1.0

    private val mode = SpecialFpWriteMode.AS_NULL

    val baseDouble = object : TypeAdapter<Double>() {
        override fun write(out: JsonWriter, value: Double) {
            if (value.isFinite()) {
                out.value(value)
            } else {
                when (mode) {
                    SpecialFpWriteMode.AS_NULL -> out.nullValue()
                    SpecialFpWriteMode.AS_STRING -> out.value(encodeSpecial(value))
                }
            }
        }

        override fun read(`in`: JsonReader): Double {
            return when (`in`.peek()) {
                JsonToken.NUMBER -> `in`.nextDouble()
                JsonToken.STRING -> {
                    val s = `in`.nextString()
                    decodeSpecial(s)
                        ?: s.toDouble()
                }
                else -> throw JsonParseException("Expected NUMBER/STRING for double but was ${`in`.peek()}")
            }
        }
    }

    val primitiveDouble = object : TypeAdapter<Double>() {
        override fun write(out: JsonWriter, value: Double) = baseDouble.write(out, value)
        override fun read(`in`: JsonReader): Double {
            if (`in`.peek() == JsonToken.NULL) {
                `in`.nextNull()
                return 0.0
            }
            return baseDouble.read(`in`)
        }
    }

    val baseFloat = object : TypeAdapter<Float>() {
        override fun write(out: JsonWriter, value: Float) {
            if (value.isFinite()) {
                out.value(value)
            } else {
                when (mode) {
                    SpecialFpWriteMode.AS_NULL -> out.nullValue()
                    SpecialFpWriteMode.AS_STRING -> out.value(
                        when {
                            value.isNaN() -> "NaN"
                            value == Float.POSITIVE_INFINITY -> "Infinity"
                            value == Float.NEGATIVE_INFINITY -> "-Infinity"
                            else -> error("not special")
                        }
                    )
                }
            }
        }

        override fun read(`in`: JsonReader): Float {
            return when (`in`.peek()) {
                JsonToken.NUMBER -> `in`.nextDouble().toFloat()
                JsonToken.STRING -> {
                    val s = `in`.nextString()
                    (decodeSpecial(s) ?: s.toDouble()).toFloat()
                }

                else -> throw JsonParseException("Expected NUMBER/STRING for float but was ${`in`.peek()}")
            }
        }
    }

    val primitiveFloat = object : TypeAdapter<Float>() {
        override fun write(out: JsonWriter, value: Float) = baseFloat.write(out, value)
        override fun read(`in`: JsonReader): Float {
            if (`in`.peek() == JsonToken.NULL) {
                `in`.nextNull()
                return 0f
            }
            return baseFloat.read(`in`)
        }
    }

    val GSON: Gson = GsonBuilder()
//            .setPrettyPrinting()
            .disableHtmlEscaping()
            .serializeNulls()
            .setVersion(VERSION)
            .registerTypeAdapter(Class::class.java, ClassCodec())
            .registerTypeAdapterFactory(EmptyStringToNullTypeAdapterFactory())
            .registerTypeAdapter(java.lang.Double.TYPE, primitiveDouble)                // Double
            .registerTypeAdapter(java.lang.Double::class.java, baseDouble.nullSafe())   // Double?
            .registerTypeAdapter(java.lang.Float.TYPE, primitiveFloat)                  // Float
            .registerTypeAdapter(java.lang.Float::class.java, baseFloat.nullSafe())     // Float?
            .create()

    private fun encodeSpecial(d: Double): String = when {
        d.isNaN() -> "NaN"
        d == Double.POSITIVE_INFINITY -> "Infinity"
        d == Double.NEGATIVE_INFINITY -> "-Infinity"
        else -> error("not special")
    }
    private fun decodeSpecial(s: String): Double? = when (s) {
        "NaN" -> Double.NaN
        "Infinity" -> Double.POSITIVE_INFINITY
        "-Infinity" -> Double.NEGATIVE_INFINITY
        else -> null
    }

    @JvmStatic
    fun toJson(obj: Any?): String {
        return GSON.toJson(obj)
    }

    @JvmStatic
    fun <T> fromJson(json: String?, clazz: Class<T>): T? {
        return GSON.fromJson(json, clazz)
    }

    @JvmStatic
    fun <T> fromJson(json: String?, type: Type): T? {
        return GSON.fromJson(json, type)
    }

    //可选地获取一个字符串字段
    @JvmStatic
    fun optString(jsonObject: JsonObject?, name: String): String {
        if (jsonObject == null || !jsonObject.has(name)) return ""
        val element: JsonElement = jsonObject.get(name)
        return if (element is JsonNull) "" else element.asString
    }

    @JvmStatic
    fun doubles2Bytes(doubles: DoubleArray?): ByteArray? {
        if (doubles == null) {
            return null
        }
        val bb = ByteBuffer.allocate(doubles.size * 8)
        for (double in doubles) {
            bb.putDouble(double)
        }
        return bb.array()
    }

    @JvmStatic
    fun bytes2Doubles(bytes: ByteArray?): DoubleArray? {
        if (bytes == null) {
            return null
        }
        val bb = ByteBuffer.wrap(bytes)
        val doubles = DoubleArray(bytes.size / 8)
        for (i in doubles.indices) {
            doubles[i] = bb.getDouble()
        }
        return doubles
    }

    /**
     * 16进制字符串转为ByteArray
     */
    @JvmStatic
    fun hexString2Bytes(string: String?): ByteArray? {
        if (string == null)   {
            return null
        }
        val hexBytes = string.toByteArray(Charsets.US_ASCII)
        val length = hexBytes.size / 2
        val bb = ByteBuffer.allocate(length)
        for (i in 0 until length) {
            bb.put(i, Integer.parseInt(string.substring(i * 2, i * 2 + 2), 16).toByte())
        }
        return bb.array()
    }

    /**
     * 需要实现 JsonSerializer，JsonDeserializer 序列化和反序列化接口
     * 泛型 Class 是说要把 java 那个类型序列化反序列化
     */
    private class ClassCodec : JsonSerializer<Class<*>>, JsonDeserializer<Class<*>> {
        // 反序列化
        @Throws(JsonParseException::class)
        override fun deserialize(jsonElement: JsonElement, type: Type, jsonDeserializationContext: JsonDeserializationContext): Class<*> {
            val clazz = jsonElement.asString
            return try {
                Class.forName(clazz)
            } catch (e: ClassNotFoundException) {
                throw kotlin.RuntimeException(e)
            }
        }

        // 序列化
        override fun serialize(aClass: Class<*>, type: Type, jsonSerializationContext: JsonSerializationContext): JsonElement {
            // 将 Class 变为 json
            return JsonPrimitive(aClass.name)
        }
    }

    private class EmptyStringToNullTypeAdapterFactory : TypeAdapterFactory {
        override fun <T> create(gson: Gson, type: TypeToken<T>): TypeAdapter<T>? {

            val rawType = type.rawType

            // 不处理基础类型、String、Array、List、Map
            if (rawType.isPrimitive
                || rawType == String::class.java
                || rawType.isArray
                || Collection::class.java.isAssignableFrom(rawType)
                || Map::class.java.isAssignableFrom(rawType)) {
                return null
            }

            val delegate = gson.getDelegateAdapter(this, type)

            return object : TypeAdapter<T>() {
                override fun write(out: JsonWriter, value: T?) {
                    delegate.write(out, value)
                }

                override fun read(reader: JsonReader): T? {
                    return when (reader.peek()) {
                        JsonToken.STRING -> {
                            val str = reader.nextString()

                            // ① 空字符串 → 直接返回 null
                            if (str.isEmpty()) return null

                            // ② 字符串形式的 JSON → 用 JsonParser 解析，不调用 gson.fromJson 避免循环
                            return try {
                                val jsonElement = JsonParser.parseString(str)
                                delegate.fromJsonTree(jsonElement)
                            } catch (e: Exception) {
                                null
                            }
                        }

                        JsonToken.NULL -> {
                            reader.nextNull()
                            null
                        }

                        else -> delegate.read(reader)
                    }
                }
            }
        }
    }

    fun getString(json: JSONObject?, key: String, default: String = ""): String {
        return json?.takeIf { it.has(key) && !it.isNull(key) }?.optString(key, default) ?: default
    }

    fun getInt(json: JSONObject?, key: String, default: Int = 0): Int {
        return json?.takeIf { it.has(key) && !it.isNull(key) }?.optInt(key, default) ?: default
    }

    fun getDouble(json: JSONObject?, key: String, default: Double = 0.0): Double {
        return json?.takeIf { it.has(key) && !it.isNull(key) }?.optDouble(key, default) ?: default
    }

    fun getNested(json: JSONObject?, vararg path: String): JSONObject? {
        var current = json
        for (key in path) {
            current = current?.optJSONObject(key)
        }
        return current
    }
}

enum class SpecialFpWriteMode { AS_NULL, AS_STRING }

