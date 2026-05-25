package com.myheart.core.app.ui.base

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.ViewDataBinding
import androidx.lifecycle.ViewModelProvider
import com.myheart.core.utils.ClickSourceHelper
import com.myheart.core.utils.ClickUtils
import com.myheart.core.utils.Logger

/**
 * AppCompatActivity
 */
abstract class BaseActivity<DB : ViewDataBinding, VM : BaseViewModel> : AppCompatActivity(), View.OnClickListener {

    protected val TAG = javaClass.simpleName

    protected lateinit var viewModel: VM

    protected val binding by lazy {
        initViewBinding(layoutInflater)
    }

    abstract fun getViewModelClass(): Class<VM>


    open fun initViewModel(): VM {
        return ViewModelProvider(this)[getViewModelClass()]
    }

    protected abstract fun initViewBinding(inflater: LayoutInflater): DB

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Logger.f(TAG, "onCreate() savedInstanceState = $savedInstanceState")

        setContentView(binding.root)

        binding.lifecycleOwner = this
        viewModel = initViewModel()
        observeCommonState()
        initView()
        initListener()
        initObserve()
        initData()
    }

    protected open fun initView() {

    }

    protected open fun initListener() {
        if (trackViewClickSource()) {
            ClickSourceHelper.trackClickSource(binding.root)
        }
    }

    protected open fun trackViewClickSource() = false

    protected open fun initObserve() {

    }

    protected open fun initData() {

    }

    @Deprecated("Replaced by onValidClick", ReplaceWith("onValidClick()"), DeprecationLevel.HIDDEN)
    override fun onClick(v: View?) {
        if (v != null && !ClickUtils.isFastContinuousClick) {
            onValidClick(v)
        }
    }

    protected open fun onValidClick(v: View) {

    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)

        Logger.f(TAG, "onRestoreInstanceState() savedInstanceState = $savedInstanceState")
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)

        Logger.f(TAG, "onConfigurationChanged() newConfig = $newConfig")
    }

    override fun onStart() {
        super.onStart()

        Logger.f(TAG, "onStart()")
    }

    override fun onResume() {
        super.onResume()

        Logger.f(TAG, "onResume()")
    }

    override fun onPause() {
        super.onPause()

        Logger.f(TAG, "onPause()")
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)

        Logger.f(TAG, "onSaveInstanceState() outState = $outState")
    }

    override fun onStop() {
        super.onStop()

        Logger.f(TAG, "onStop()")
    }

    override fun onRestart() {
        super.onRestart()

        Logger.f(TAG, "onRestart()")
    }

    override fun onDestroy() {
        super.onDestroy()

        Logger.f(TAG, "onDestroy()")
    }

    /**
     * 监听通用的ViewModel状态（如加载状态、错误状态）
     */
    private fun observeCommonState() {
        viewModel.loading.observe(this) { isLoading ->
            if (isLoading) {
                showLoading()
            } else {
                hideLoading()
            }
        }

        viewModel.error.observe(this) { errorMessage ->
            errorMessage?.let {
                showError(it)
                viewModel.clearError()
            }
        }
    }


    /**
     * 显示加载中状态，可由子类重写自定义实现
     */
    protected open fun showLoading() {
        // 默认实现可以为空，由子类根据需要实现
    }

    /**
     * 隐藏加载中状态，可由子类重写自定义实现
     */
    protected open fun hideLoading() {
        // 默认实现可以为空，由子类根据需要实现
    }

    /**
     * 显示错误信息，默认使用Toast展示
     */
    protected open fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}