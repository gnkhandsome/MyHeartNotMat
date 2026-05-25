package com.myheart.core.sdk.view

import android.content.Context
import android.util.AttributeSet
import android.view.LayoutInflater
import androidx.databinding.DataBindingUtil
import com.myheart.core.sdk.GlobalViewModelProvider
import com.myheart.core.sdk.R
import com.myheart.core.sdk.databinding.LayoutDemoViewBinding
import com.myheart.core.sdk.view.base.BaseComponent
import com.myheart.core.sdk.viewmodel.DemoViewModel
import com.myheart.core.utils.Logger.f

/**
 * @Description: 系统一信息各种形态的view
 * @author: lixiang
 * @date: 2024/8/22
 */
class DemoComponent @JvmOverloads constructor(
    context: Context,
    attributeSet: AttributeSet?,
    defStyleAttr: Int = 0,
) : BaseComponent(context, attributeSet, defStyleAttr) {

    protected val adInfoViewModel by lazy {
        GlobalViewModelProvider.viewModelProvider[DemoViewModel::class.java]
    }

    private val binder: LayoutDemoViewBinding =
        DataBindingUtil.inflate<LayoutDemoViewBinding>(
            LayoutInflater.from(context), R.layout.layout_demo_view, this, true
        )

    init {

        f(TAG, "init")
        binder.lifecycleOwner = innerLifecycleOwner
        binder.demoViewModel = adInfoViewModel
    }
}