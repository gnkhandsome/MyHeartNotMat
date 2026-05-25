package com.myheart.core.app.ui.helper

import kotlin.let

/**
 * 统一的数据资源封装类，适用于异步数据请求；使用泛型处理不同类型的响应数据
 */
sealed class Resource<out T> {
    // 成功状态，包含数据
    data class Success<T>(val data: T) : Resource<T>()
    
    // 错误状态，包含错误信息和错误码
    data class Error(
        val message: String, 
        val code: Int? = null,
        val exception: Throwable? = null
    ) : Resource<Nothing>()
    
    // 加载中状态
    data class Loading<T>(val data: T? = null) : Resource<T>()

    companion object {
        fun <T> success(data: T): Resource<T> = Success(data)
        
        fun <T> error(
            message: String, 
            code: Int? = null, 
            exception: Throwable? = null
        ): Resource<T> = Error(message, code, exception)
        
        fun <T> loading(data: T? = null): Resource<T> = Loading(data)
    }
}

// 扩展函数，方便处理Resource结果
inline fun <T, R> Resource<T>.map(transform: (T) -> R): Resource<R> {
    return when (this) {
        is Resource.Success -> Resource.success(transform(data))
        is Resource.Error -> Resource.error(message, code, exception)
        is Resource.Loading -> Resource.loading(data?.let { transform(it) })
    }
}

// 处理Resource的扩展函数
inline fun <T> Resource<T>.onSuccess(action: (T) -> Unit): Resource<T> {
    if (this is Resource.Success) {
        action(data)
    }
    return this
}

inline fun <T> Resource<T>.onError(action: (String, Int?, Throwable?) -> Unit): Resource<T> {
    if (this is Resource.Error) {
        action(message, code, exception)
    }
    return this
}

inline fun <T> Resource<T>.onLoading(action: (T?) -> Unit): Resource<T> {
    if (this is Resource.Loading) {
        action(data)
    }
    return this
} 