package com.myheart.core.app.utils

import android.text.TextUtils
import android.util.Base64
import com.myheart.core.utils.Logger.e
import com.myheart.core.utils.Logger.trace
import kotlin.math.ceil
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.nanoseconds

object ValueUtils {

    private const val TAG = "ValueUtils"

    private const val MIN_SPEED_CAL_VALUE: Float = 0.1f
    private const val MAX_SPEED_VALUE: Int = 240
    private const val MAX_SPEED_VALUE_VALID: Float = 460f
    private const val TOO_FAST_SPEED = 30
    private const val TOO_FAST_SPEED_EXIT = 50

    /**
     * 车速表显示规则，
     * 单位：km/h
     * 精度：1km/h
     * 实际车速<0.1，计算后显示车速显示为0，实际车速>=0.1，显示车速向上取整，如0.8显示为1
     *
     * @param displaySpeed
     * @return
     */
    @JvmStatic
    fun getFormatDisplaySpeed(displaySpeed: Float): Float {
        return if (displaySpeed < MIN_SPEED_CAL_VALUE) {
            0.0f
        } else Math.ceil(displaySpeed.toDouble()).toFloat()
    }

    fun isInvalid(value: Float): Boolean {
        return java.lang.Float.isInfinite(value) || java.lang.Float.isNaN(value)
    }

    /**
     * 判断无效速度值
     * @param speed 速度值
     * @return true 无效速度值
     */
    fun isSpeedInvalid(speed: Float): Boolean {
        return isInvalid(speed) || speed > MAX_SPEED_VALUE_VALID || speed < 0
    }


    fun transformSpeed(speed: Float): Int {
        if (speed < MIN_SPEED_CAL_VALUE) {
            return 0
        }
        return ceil(speed.toDouble()).toInt().coerceAtMost(MAX_SPEED_VALUE);
    }

    /**
     * 速度太快 > 30
     */
    fun isSpeedTooFast(speed: Float?): Boolean {
        if (speed == null) {
            // 默认为false
            return false
        }
        return speed > TOO_FAST_SPEED || isSpeedInvalid(speed)
    }

    /**
     * 速度太快退出 > 50
     */
    fun isSpeedTooFastExit(speed: Float?): Boolean {
        if (speed == null) {
            // 默认为false
            return false
        }
        return speed > TOO_FAST_SPEED_EXIT || isSpeedInvalid(speed)
    }

    fun stringToInt(value: String?, default: Int = 0): Int {
        if (TextUtils.isEmpty(value)) {
            return default
        }
        var result = default
        try {
            result = value?.toInt() ?: default
        } catch (e: Throwable) {
            trace(TAG, e)
        }
        return result
    }

    /**
     * @param time 单位毫秒 ms
     */
    fun transformTimeMs(time: Long): String {
        return time.milliseconds.toString()
    }

    /**
     * @param time 单位纳秒 ns
     */
    fun transformTimeNs(time: Long): String {
        return time.nanoseconds.toString()
    }


    // 将字符串中的中文数字转为阿拉伯数字
    fun convertToArabic(input: String): String {
        val (numStr, rest) = extractNumberAndRest(input) ?: return input
        val arabicNum = when (numStr) {
            is NumberPart.Arabic -> numStr.value
            is NumberPart.Chinese -> chineseToArabic(numStr.value)
        }
        return "$arabicNum$rest"
    }

    // 将字符串中的阿拉伯数字转为中文数字
    fun convertToChinese(input: String): String {
        val (numStr, rest) = extractNumberAndRest(input) ?: return input
        val chineseNum = when (numStr) {
            is NumberPart.Arabic -> arabicToChinese(numStr.value)
            is NumberPart.Chinese -> numStr.value
        }
        return "$chineseNum$rest"
    }

    // 提取数字部分和非数字部分
    sealed class NumberPart {
        data class Arabic(val value: Int) : NumberPart()
        data class Chinese(val value: String) : NumberPart()
    }

    private fun extractNumberAndRest(input: String): Pair<NumberPart, String>? {
        // 匹配阿拉伯数字
        Regex("""^(\d+)(.*)$""").find(input)?.let {
            val num = it.groupValues[1].toInt()
            val rest = it.groupValues[2]
            return Pair(NumberPart.Arabic(num), rest)
        }

        // 匹配中文数字（只限 0-99）
        Regex("""^([零一二三四五六七八九十]+)(.*)$""").find(input)?.let {
            val num = it.groupValues[1]
            val rest = it.groupValues[2]
            return Pair(NumberPart.Chinese(num), rest)
        }

        return null
    }

    // 中文数字转阿拉伯数字（支持 0-99）
    fun chineseToArabic(cnNum: String): Int {
        if (cnNum == "零") return 0
        var result = 0
        var tmp = 0
        var i = 0
        while (i < cnNum.length) {
            val c = cnNum[i].toString()
            when (c) {
                "十" -> {
                    if (tmp == 0) tmp = 1
                    result += tmp * 10
                    tmp = 0
                }

                else -> {
                    tmp = when (c) {
                        "一" -> 1
                        "二" -> 2
                        "三" -> 3
                        "四" -> 4
                        "五" -> 5
                        "六" -> 6
                        "七" -> 7
                        "八" -> 8
                        "九" -> 9
                        else -> 0
                    }
                    // 如果后面是“十”，则跳过
                    if (i + 1 < cnNum.length && cnNum[i + 1].toString() == "十") {
                        result += tmp * 10
                        tmp = 0
                        i++
                    }
                }
            }
            i++
        }
        result += tmp
        return result
    }

    // 阿拉伯数字转中文数字（支持 0-99
    fun arabicToChinese(num: Int): String {
        if (num < 0 || num > 99) return num.toString() // 越界直接返回原数字

        if (num == 0) return "零"

        val digits = arrayOf("", "一", "二", "三", "四", "五", "六", "七", "八", "九")
        val tens = arrayOf("", "十", "二十", "三十", "四十", "五十", "六十", "七十", "八十", "九十")

        val ten = num / 10
        val unit = num % 10

        return when {
            ten == 0 -> digits[unit]
            unit == 0 -> tens.getOrNull(ten) ?: num.toString()
            else -> "${tens.getOrNull(ten) ?: ""}${digits[unit]}"
        }
    }

    // 提取 Base64 编码为独立函数
    fun encodeToBase64(data: ByteArray?): String {
        return if (data != null && data.isNotEmpty()) {
            String(Base64.encode(data, Base64.DEFAULT), Charsets.UTF_8)
        } else {
            ""
        }
    }

    /**
     * 将 Base64 编码的字符串解码为 ByteArray
     * @param base64String Base64 字符串（可为 null 或空）
     * @return 解码后的 ByteArray，如果输入无效则返回 null
     */
    fun decodeFromBase64(base64String: String?): ByteArray? {
        if (base64String.isNullOrEmpty()) {
            return null
        }
        return try {
            Base64.decode(base64String, Base64.DEFAULT)
        } catch (e: IllegalArgumentException) {
            // Base64 解码格式错误（如非法字符）
            e("Base64Util", "Invalid Base64 string: $base64String", e)
            null
        } catch (e: Throwable) {
            e("Base64Util", "Unexpected error during Base64 decoding", e)
            null
        }
    }

}