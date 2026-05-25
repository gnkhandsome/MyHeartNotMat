package com.myheart.core.app.ui.base

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.viewbinding.ViewBinding
import kotlin.let

/**
 * Fragment基类，支持ViewBinding和ViewModel
 */
abstract class BaseFragment<VB : ViewBinding, VM : BaseViewModel> : Fragment() {

    private var _binding: VB? = null
    protected val binding get() = _binding
    
    protected lateinit var viewModel: VM
    /**
     * 创建ViewBinding实例
     */
    abstract fun getViewBinding(inflater: LayoutInflater, container: ViewGroup?): VB
    
    /**
     * 获取ViewModel Class
     */
    abstract fun getViewModelClass(): Class<VM>
    
    /**
     * 初始化视图和数据
     */
    abstract fun initViews()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = getViewBinding(inflater, container)
        return binding?.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = initViewModel()

        // 监听通用状态
        observeCommonState()
        
        // 初始化视图
        initViews()
    }


   open  fun initViewModel(): VM {
        return ViewModelProvider(this)[getViewModelClass()]
    }

    /**
     * 监听通用的ViewModel状态（如加载状态、错误状态）
     */
    private fun observeCommonState() {
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            if (isLoading) {
                showLoading()
            } else {
                hideLoading()
            }
        }
        
        viewModel.error.observe(viewLifecycleOwner) { errorMessage ->
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
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
} 