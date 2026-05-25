package com.myheart.core.utils

import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.accessibility.AccessibilityNodeInfo
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.ViewCompat
import androidx.core.view.children
import kotlin.sequences.forEach

/**
 * 文件名称：ClickSourceHelper
 * 描述   ：[文件功能描述]
 * 作者   ：樊健凯（WX: Kai1782674853）
 * 日期   ：2025/8/14
 * 版本   ：V1.0.0
 *
 * 修改记录：
 * 时间      | 修改人   | 修改内容
 * ---------|---------|---------
 *
 */
object ClickSourceHelper {

    var clickFormVoiceDcs = false
        private set

    fun trackClickSource(view: View) {
        if (view is ViewGroup) {
            trackViewGroupClickSource(view)
        } else {
            trackViewClickSource(view)
        }
    }

    private fun trackViewGroupClickSource(viewGroup: ViewGroup) {
        if (viewGroup.isClickable) {
            trackViewClickSource(viewGroup)
        }
        viewGroup.children.forEach {
            if (it is ViewGroup) {
                trackViewGroupClickSource(it)
            } else if (it.isClickable) {
                trackViewClickSource(it)
            }
        }
    }

    private fun trackViewClickSource(view: View) {
        view.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_DOWN) {
                clickFormVoiceDcs = false
            }
            false
        }
        ViewCompat.setAccessibilityDelegate(view, object : AccessibilityDelegateCompat() {
            override fun performAccessibilityAction(host: View, action: Int, args: Bundle?): Boolean {
                if (action == AccessibilityNodeInfo.ACTION_CLICK) {
                    clickFormVoiceDcs = true
                }
                return super.performAccessibilityAction(host, action, args)
            }
        })
    }

}