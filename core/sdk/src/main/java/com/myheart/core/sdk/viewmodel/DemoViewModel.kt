package com.myheart.core.sdk.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.myheart.core.aidl.constant.ViewModelEnum
import com.myheart.core.aidl.viewmodel.SyncModel
import com.myheart.core.aidl.viewmodel.SyncType
import com.myheart.core.utils.Logger.f

@SyncModel(SyncType.RECEIVER, ViewModelEnum.DEMO_VIEWMODEL)
class DemoViewModel : ViewModel() {

    val text = MutableLiveData("")

    init {
        text.observeForever {
            f("DemoViewModel", "text==$text")
//            EidEventClient.sendClick(SubscribeConstants.TEST_DRIVE)
        }
    }
}