package com.myheart.core.app.base.action

import com.myheart.core.utils.Logger.e
import com.myheart.core.utils.Logger.f
import java.lang.IllegalArgumentException
import java.lang.reflect.Method


@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FUNCTION)
annotation class Subscribe(val type:Int, val name:String)



object ActionType{
  const val Other = 0       // 未知
  const val Controller = 1  // 盘控
  const val Voice = 2       // 语音
  const val Click = 3       // 点击
  const val TTS = 4         // TTS
  const val FAPA = 5        // FAPA
  const val TRACK = 6       // 上报事件
}

// TODO 改成 Gradle 插件实现
object SubscribeManager {

    const val TAG = "SubscribeManager"
    private data class SubscribeInfo(val type: Int, val name : String, val clazz: Class<*>, val instance: Any, val method : Method)

    data class SubscribeKey(val type: Int, val name : String)

    data class Action(val arg1: Int, val arg2 : Int, val data : String)

    private val map = mutableMapOf<SubscribeKey, SubscribeInfo>()

    fun register(subscriber: Any) {

        val clazz: Class<*> = subscriber.javaClass
        for (method in clazz.declaredMethods) {
            val action: Subscribe? = method.getAnnotation(Subscribe::class.java)
            if (action != null) {
                // 处理 @Subscribe 注解标记的方法
                val actionType = action.type
                val actionName = action.name

                val subscribeInfo = SubscribeInfo(actionType, actionName,clazz,subscriber, method)
                addToMap(subscribeInfo)
                // 将方法和 actionName 关联起来
            }
        }
    }

    fun unRegister(subscriber: Any) {
        val clazz: Class<*> = subscriber.javaClass
        map.forEach {
            if (it.value.clazz == clazz){
                map.remove(it.key)
            }
        }
    }

    fun performAction(key: SubscribeKey, action: Action) {
        val info = map[key]
        if (info == null) {
            f(TAG, "performAction miss key=$key, registeredKeys=${map.keys}")
            return
        }
        f(TAG, "performAction : $key, $action")
        info.method.invoke(info.instance, action)
    }

    private fun addToMap(info: SubscribeInfo) {
        val key = SubscribeKey(info.type, info.name)

        if (map.contains(key)){
            throw IllegalArgumentException("SubscribeManager :重复的Subscribe 订阅 key=$key")
        } else {
            val paramCount = info.method.parameters.count()
            if ((paramCount == 1) && (info.method.parameters[0].type.equals(Action::class.java))){
                f(TAG, "addToMap : $key info $info")
                map[key] = info
            }else{
                e(TAG, "addToMap : info $info 函数参数签名类型错误")
            }
        }
    }


    fun clear(){
        map.clear()
    }

    fun dump(){
        map.forEach {
            f(TAG, "dump : ${it.key} : ${it.value}")
        }
    }

}