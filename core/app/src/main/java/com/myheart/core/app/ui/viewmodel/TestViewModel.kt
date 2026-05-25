package com.myheart.core.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.MutableLiveData
import com.myheart.core.app.ui.base.BaseViewModel
import com.myheart.core.app.utils.GlobalStaticHelper
import com.myheart.core.app.viewmodel.DemoViewModelStore
import kotlin.let

/**
 * ViewModel基类，提供通用功能
 */
open class TestViewModel(app: Application) : BaseViewModel(app) {

    open val demoViewModelStore = GlobalStaticHelper.demoViewModelStore

    val text = MutableLiveData<String?>()
    val receiveText = MutableLiveData<String?>()

    init {
        demoViewModelStore?.let {
            onInit(it)
        }
    }

    protected open fun onInit(demoViewModelStore: DemoViewModelStore) {
        demoViewModelStore.text.vmBindValue(this, this.text)
        demoViewModelStore.receiveText.vmBindValue(this, this.receiveText)
    }

}