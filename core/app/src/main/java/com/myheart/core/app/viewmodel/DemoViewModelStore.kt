package com.myheart.core.app.viewmodel

import com.myheart.core.aidl.constant.ViewModelEnum
import com.myheart.core.aidl.viewmodel.SyncModel
import com.myheart.core.aidl.viewmodel.SyncType
import com.myheart.core.app.annotation.ValueChange
import com.myheart.core.app.base.store.BaseStore
import com.myheart.core.app.base.store.IViewModel
import com.myheart.core.app.base.value.StateValue

@SyncModel(SyncType.SENDER, ViewModelEnum.DEMO_VIEWMODEL)
class DemoViewModelStore : BaseStore(), IViewModel {

    @ValueChange
    val text = StateValue<String>()

    @ValueChange
    val receiveText = StateValue<String>()
}