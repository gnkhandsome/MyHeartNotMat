package com.myheart.core.app.base.store

import com.myheart.core.app.utils.ViewModelResetHelper


interface IViewModel {

    fun reset() {
        ViewModelResetHelper.reset(this)
    }
}