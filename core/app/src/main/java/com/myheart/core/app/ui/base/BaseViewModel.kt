package com.myheart.core.app.ui.base

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.myheart.core.app.ui.helper.Resource
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.onCompletion
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.launch

/**
 * ViewModel基类，提供通用功能
 */
open class BaseViewModel(app: Application) : AndroidViewModel(app) {

    // Manually manage CoroutineScope
    private val _coroutineJob = SupervisorJob()
    private val _uiScope = CoroutineScope(Dispatchers.Main + _coroutineJob)

    // UI状态相关
    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    // 默认的异常处理器
    private val exceptionHandler = CoroutineExceptionHandler { _, throwable ->
        handleException(throwable)
    }

    /**
     * 安全地启动协程，自动处理异常
     */
    protected fun launchCoroutine(
        block: suspend CoroutineScope.() -> Unit
    ): Job {
        // Use the manually created UI scope
        return _uiScope.launch(exceptionHandler) {
            block()
        }
    }

    /**
     * 处理异常，可以被子类重写以提供自定义处理
     */
    protected open fun handleException(throwable: Throwable) {
        _error.value = throwable.message ?: "未知错误"
        _loading.value = false
    }

    /**
     * 启动协程并收集Flow结果，处理常见状态（加载、错误等）
     */
    protected fun <T> launchFlow(
        flow: Flow<Resource<T>>,
        onSuccess: (T) -> Unit,
        onError: ((String) -> Unit)? = null
    ) {
        launchCoroutine {
            flow
                .onStart { _loading.value = true }
                .onCompletion { _loading.value = false }
                .catch { handleException(it) }
                .collect { resource ->
                    when (resource) {
                        is Resource.Success -> {
                            onSuccess(resource.data)
                        }
                        is Resource.Error -> {
                            if (onError != null) {
                                onError(resource.message)
                            } else {
                                _error.value = resource.message
                            }
                        }
                        is Resource.Loading -> {
                            _loading.value = true
                        }
                    }
                }
        }
    }

    /**
     * 清除错误状态
     */
    fun clearError() {
        _error.value = null
    }

    /**
     * Override onCleared to cancel all coroutines when the ViewModel is destroyed.
     */
    override fun onCleared() {
        super.onCleared()
        _coroutineJob.cancel() // Cancel all child jobs
    }

}