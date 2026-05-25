package com.myheart.core.sdk.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.myheart.core.aidl.constant.SubscribeConstants
import com.myheart.core.aidl.constant.ViewModelEnum
import com.myheart.core.aidl.viewmodel.SyncModel
import com.myheart.core.aidl.viewmodel.SyncType
import com.myheart.core.sdk.client.EventClient
import com.myheart.core.utils.Logger.f

@SyncModel(SyncType.RECEIVER, ViewModelEnum.DEMO_VIEWMODEL)
class DemoViewModel : ViewModel() {

    val text = MutableLiveData("")

    val receiveText = MutableLiveData<String>("")

    init {
        text.observeForever {
            f("DemoViewModel_Sdk", "text==${text.value.toString()}")
        }
    }
}