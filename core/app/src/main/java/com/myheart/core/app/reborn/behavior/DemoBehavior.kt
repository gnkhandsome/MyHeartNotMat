package com.myheart.core.app.reborn.behavior

import com.myheart.core.aidl.constant.SubscribeConstants
import com.myheart.core.app.base.action.ActionType
import com.myheart.core.app.base.action.Subscribe
import com.myheart.core.app.base.action.SubscribeManager
import com.myheart.core.app.base.behavior.BaseBehavior
import com.myheart.core.app.reborn.store.DemoStore
import com.myheart.core.app.utils.StateValueHelper
import com.myheart.core.app.viewmodel.DemoViewModelStore
import com.myheart.core.app.world.World
import com.myheart.core.utils.Logger.f

class DemoBehavior(world: World) : BaseBehavior(world) {

    @Transient
    private val demoStore: DemoStore = world.storeManager[DemoStore::class.java]

    @Transient
    private val demoViewModelStore: DemoViewModelStore = world.storeManager[DemoViewModelStore::class.java]

    override fun onStart() {

    }

    override fun onUpdate() {
        StateValueHelper.syncValue(demoStore.text, demoViewModelStore.text)
    }

    override fun onDestroy() {

    }

    var count = 0
    @Subscribe(type = ActionType.Click, name = SubscribeConstants.DEMO_CLICK_EVENT)
    fun onDemoSendClick(action: SubscribeManager.Action) {
        f(TAG, "onDemoSendClick: clickIntent=${action.data}")
        demoViewModelStore.receiveText.setValue("receiveText${count++}")
        demoViewModelStore.text.setValue("text${count++}")
    }

    companion object {
        const val TAG = "DemoBehavior"
    }
}
