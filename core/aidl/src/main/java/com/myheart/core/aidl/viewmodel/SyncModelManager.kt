package com.myheart.core.aidl.viewmodel

import com.myheart.core.aidl.constant.ViewModelEnum
import com.myheart.core.utils.Logger
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.collections.find
import kotlin.collections.forEach
import kotlin.jvm.java
import kotlin.jvm.javaClass
import kotlin.let

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS)
annotation class SyncModel(val type:SyncType, val tag: ViewModelEnum)


data class SyncModelInfo(val type: SyncType, val tag:ViewModelEnum, val clazz: Class<*>, val instance: Any)

enum class SyncType(val code: Int){

    UNKNOWN(0),       // 未知
    SENDER(1),       // 发送者
    RECEIVER(2);     // 接收者

    companion object {
        fun fromCode(code: Int): SyncType? {
            return values().find { it.code == code }
        }
    }
}

// TODO 转换成 Gradle Plugin
object SyncModelManager {

    const val TAG = "SyncModelManager"
    private val senderMap = mutableMapOf<ViewModelEnum, SyncModelInfo>()
    private val senderList = CopyOnWriteArrayList<SyncModelInfo>()
    private val receiveMap = mutableMapOf<ViewModelEnum, SyncModelInfo>()
    private val receiveList = CopyOnWriteArrayList<SyncModelInfo>()


    fun register(viewModel: Any,tag: String) {
        val clazz = viewModel.javaClass
        val annotation = clazz.getAnnotation(SyncModel::class.java) ?: return

        if (annotation.type ==  SyncType.SENDER){
            val info = SyncModelInfo(SyncType.SENDER, annotation.tag, clazz, viewModel)
            senderMap.put(annotation.tag, info)
            senderList.add(info)
            Logger.f(TAG, "register sender $tag: ${annotation.tag} : ${info}")
            return
        }

        if (annotation.type ==  SyncType.RECEIVER){
            val info = SyncModelInfo(SyncType.RECEIVER, annotation.tag, clazz, viewModel)
            Logger.f(TAG, "register receiver $tag: ${annotation.tag} : ${info}")
            receiveMap.put(annotation.tag, info)
            receiveList.add(info)
            return
        }
    }


    fun sender(tag: ViewModelEnum): Any? {
        return senderMap[tag]?.instance
    }

    fun allSender(): List<SyncModelInfo> {
        return senderList
    }

    fun allReceiver(): List<SyncModelInfo> {
        return receiveList
    }

    fun receiver(tag: ViewModelEnum): Any? {
        return receiveMap[tag]?.instance
    }

    fun unRegister(viewModel: Any) {

        val annotation = viewModel.javaClass.getAnnotation(SyncModel::class.java) ?: return

        if (annotation.type ==  SyncType.SENDER){
            senderMap.remove(annotation.tag)?.let {
                senderList.remove(it)
            }
            return
        }

        if (annotation.type ==  SyncType.RECEIVER){
            receiveMap.remove(annotation.tag)?.let {
                receiveList.remove(it)
            }
            return
        }
    }


    fun dump() {
        Logger.f(TAG, "Sender Map dump : ")
        senderMap.forEach {
            Logger.f(TAG, "dump : ${it.key} : ${it.value}")
        }

        Logger.f(TAG, "Receiver Map dump : ")
        receiveMap.forEach {
            Logger.f(TAG, "dump : ${it.key} : ${it.value}")
        }
    }


}