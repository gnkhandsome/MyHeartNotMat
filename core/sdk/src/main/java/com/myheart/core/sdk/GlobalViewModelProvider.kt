package com.myheart.core.sdk

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.ViewModelProvider.Factory
import androidx.lifecycle.ViewModelStore
import androidx.lifecycle.ViewModelStoreOwner

object GlobalViewModelProvider {

    val factory = object :Factory{
        val defaultFactory = ViewModelProvider.NewInstanceFactory()

        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            //TODO @LiCodeAssist 不修改（保持原逻辑）
            val instance = defaultFactory.create(modelClass)
            return instance
        }

    }


    @Transient
    val viewModelProvider: ViewModelProvider = ViewModelProvider(
        GlobalViewModelStoreOwner(),
        factory
    )

    class GlobalViewModelStoreOwner() : ViewModelStoreOwner {

        private val _viewModelStore = ViewModelStore()

        override val viewModelStore = _viewModelStore

    }

}