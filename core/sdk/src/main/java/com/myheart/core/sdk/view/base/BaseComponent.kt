package com.myheart.core.sdk.view.base

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import com.myheart.core.utils.Logger
import kotlin.jvm.javaClass

/**
 * 业务逻辑单元 ， ViewModel 和 View 的通道和持有者
 *
 *
 * 1. 持有 ViewModel 的引用，通过 ViewModel 的引用，可以调用 ViewModel 的方法，获取数据，设置数据等
 * 2. 持有 LifecycleOwner 的引用，通过 LifecycleOwner 的引用，可以调用 Lifecycle 的方法，获取生命周期状态等
 * 3. 分发数据
 *
 */
open class BaseComponent @JvmOverloads constructor(
    context: Context,
    attributeSet: AttributeSet?,
    defStyleAttr: Int = 0,
) : FrameLayout(context, attributeSet, defStyleAttr) , LifecycleOwner {

    protected open val TAG = this.javaClass.simpleName
    protected val innerLifecycleOwner = InnerLifecycleOwner()

    override val lifecycle = innerLifecycleOwner.lifecycle


    protected class InnerLifecycleOwner() : LifecycleOwner {
        val lifecycleRegistry = LifecycleRegistry(this)
        override val lifecycle = lifecycleRegistry
    }



    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        Logger.f(TAG, "onAttachedToWindow")
        lifecycle.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
        lifecycle.handleLifecycleEvent(Lifecycle.Event.ON_RESUME)
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        Logger.f(TAG, "onDetachedFromWindow")
        lifecycle.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE)
        lifecycle.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    }

}