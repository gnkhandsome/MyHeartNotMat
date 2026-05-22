package com.myheart.core.app.world

import android.content.Context
import android.content.SharedPreferences

/**
 * 本地存储
 */
class Sp(val world: World) {

    private val sp = world.context.getSharedPreferences(world.context.packageName, Context.MODE_PRIVATE)

    fun getString(key: String, default: String = ""): String {
        return sp.getString(key, default) ?: default
    }

    fun putString(key: String, value: String) {
        sp.edit().putString(key, value).apply()
    }

    fun getInt(key: String, default: Int = 0): Int {
        return sp.getInt(key, default)
    }

    fun putInt(key: String, value: Int) {
        sp.edit().putInt(key, value).apply()
    }


    fun getLong(key: String, default: Long = 0L): Long {
        return sp.getLong(key, default)
    }

    fun putLong(key: String, value: Long) {
        sp.edit().putLong(key, value).apply()
    }

    fun getBoolean(key: String, default: Boolean = false): Boolean {
        return sp.getBoolean(key, default)
    }

    fun putBoolean(key: String, value: Boolean) {
        sp.edit().putBoolean(key, value).apply()
    }

    fun getFloat(key: String, default: Float = 0f): Float {
        return sp.getFloat(key, default)
    }

    fun putFloat(key: String, value: Float) {
        sp.edit().putFloat(key, value).apply()
    }

    fun getStringSet(key: String) = sp.getStringSet(key, null) ?: mutableSetOf()

    fun putStringSet(key: String, value: Set<String>) {
        sp.edit().putStringSet(key, value).apply()
    }

    fun getAll():Map<String,*>{
        return sp.all
    }

    fun registerChangeListener(listener: SharedPreferences.OnSharedPreferenceChangeListener) {
        sp.registerOnSharedPreferenceChangeListener(listener)
    }

    fun unregisterChangeListener(listener: SharedPreferences.OnSharedPreferenceChangeListener) {
        sp.unregisterOnSharedPreferenceChangeListener(listener)
    }


    companion object {
        private const val TAG = "Sp"
    }
}