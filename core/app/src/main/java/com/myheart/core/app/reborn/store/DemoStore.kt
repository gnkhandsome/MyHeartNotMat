package com.myheart.core.app.reborn.store

import com.myheart.core.app.annotation.ValueChange
import com.myheart.core.app.base.store.BaseStore
import com.myheart.core.app.base.value.StateValue

class DemoStore : BaseStore() {


    @ValueChange
    val text = StateValue<String>()
}