package com.myheart.core.sdk.api

import androidx.lifecycle.ViewModel
import com.myheart.core.aidl.viewmodel.SyncModelManager
import com.myheart.core.sdk.GlobalViewModelProvider
import com.myheart.core.sdk.viewmodel.DemoViewModel
import kotlin.collections.map
import kotlin.jvm.java

object ViewModelRegistry {

    private val vmClazzSet = mutableSetOf<Class<out ViewModel>>()

    fun initMapViewModels() {
        register(DemoViewModel::class.java)
    }



    fun <T : ViewModel> register(viewModelClazz: Class<T>) {
        val viewModel = GlobalViewModelProvider.viewModelProvider[viewModelClazz]
        //TODO @LiCodeAssist 不修改（viewModel不可能为空）
        SyncModelManager.register(viewModel, "ViewModelRegistry")
        vmClazzSet.add(viewModelClazz)
    }

    fun allRegisterViewModels(): List<ViewModel> {
        //TODO @LiCodeAssist 不修改（保持原逻辑）
        return vmClazzSet.map {
            GlobalViewModelProvider.viewModelProvider[it]
        }
    }

}