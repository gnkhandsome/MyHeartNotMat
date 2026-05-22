package com.myheart.core.app.utils

import com.myheart.core.app.base.behavior.IBehavior
import com.myheart.core.app.base.value.IChangeableValue
import com.myheart.core.app.base.value.StateValue
import com.myheart.core.app.base.value.StateValueChangedCallback
import com.myheart.core.app.base.value.StateValueChangedTrigger

/**
 * 实现了易变接口的对象是否变化辅助类
 * @see IChangeableValue
 */
object StateValueHelper {

    private const val TAG = "StateValueHelper"

    /**
     * 如果有一个参数变化，则执行action
     * @param args IChangeableValue 可变参数
     * @param action 执行的action
     */
    fun ifChanged(
        arg0: IChangeableValue? = null,
        arg1: IChangeableValue? = null,
        arg2: IChangeableValue? = null,
        arg3: IChangeableValue? = null,
        arg4: IChangeableValue? = null,
        arg5: IChangeableValue? = null,
        arg6: IChangeableValue? = null,
        arg7: IChangeableValue? = null,
        arg8: IChangeableValue? = null,
        arg9: IChangeableValue? = null,
        arg10: IChangeableValue? = null,
        arg11: IChangeableValue? = null,
        arg12: IChangeableValue? = null,
        arg13: IChangeableValue? = null,
        arg14: IChangeableValue? = null,
        arg15: IChangeableValue? = null,
        arg16: IChangeableValue? = null,
        arg17: IChangeableValue? = null,
        arg18: IChangeableValue? = null,
        arg19: IChangeableValue? = null,
        arg20: IChangeableValue? = null,
        arg21: IChangeableValue? = null,
        arg22: IChangeableValue? = null,
        arg23: IChangeableValue? = null,
        arg24: IChangeableValue? = null,
        arg25: IChangeableValue? = null,
        arg26: IChangeableValue? = null,
        arg27: IChangeableValue? = null,
        arg28: IChangeableValue? = null,
        arg29: IChangeableValue? = null,
        arg30: IChangeableValue? = null,
        arg31: IChangeableValue? = null,
        arg32: IChangeableValue? = null,
        arg33: IChangeableValue? = null,
        arg34: IChangeableValue? = null,
        arg35: IChangeableValue? = null,
        arg36: IChangeableValue? = null,
        arg37: IChangeableValue? = null,
        arg38: IChangeableValue? = null,
        arg39: IChangeableValue? = null,
        arg40: IChangeableValue? = null,
        arg41: IChangeableValue? = null,
        arg42: IChangeableValue? = null,
        arg43: IChangeableValue? = null,
        arg44: IChangeableValue? = null,
        action: () -> Unit) {
        if (arg0 == null) { return } else if (arg0.isChanged()) { return action.invoke() }
        if (arg1 == null) { return } else if (arg1.isChanged()) { return action.invoke() }
        if (arg2 == null) { return } else if (arg2.isChanged()) { return action.invoke() }
        if (arg3 == null) { return } else if (arg3.isChanged()) { return action.invoke() }
        if (arg4 == null) { return } else if (arg4.isChanged()) { return action.invoke() }
        if (arg5 == null) { return } else if (arg5.isChanged()) { return action.invoke() }
        if (arg6 == null) { return } else if (arg6.isChanged()) { return action.invoke() }
        if (arg7 == null) { return } else if (arg7.isChanged()) { return action.invoke() }
        if (arg8 == null) { return } else if (arg8.isChanged()) { return action.invoke() }
        if (arg9 == null) { return } else if (arg9.isChanged()) { return action.invoke() }
        if (arg10 == null) { return } else if (arg10.isChanged()) { return action.invoke() }
        if (arg11 == null) { return } else if (arg11.isChanged()) { return action.invoke() }
        if (arg12 == null) { return } else if (arg12.isChanged()) { return action.invoke() }
        if (arg13 == null) { return } else if (arg13.isChanged()) { return action.invoke() }
        if (arg14 == null) { return } else if (arg14.isChanged()) { return action.invoke() }
        if (arg15 == null) { return } else if (arg15.isChanged()) { return action.invoke() }
        if (arg16 == null) { return } else if (arg16.isChanged()) { return action.invoke() }
        if (arg17 == null) { return } else if (arg17.isChanged()) { return action.invoke() }
        if (arg18 == null) { return } else if (arg18.isChanged()) { return action.invoke() }
        if (arg19 == null) { return } else if (arg19.isChanged()) { return action.invoke() }
        if (arg20 == null) { return } else if (arg20.isChanged()) { return action.invoke() }
        if (arg21 == null) { return } else if (arg21.isChanged()) { return action.invoke() }
        if (arg22 == null) { return } else if (arg22.isChanged()) { return action.invoke() }
        if (arg23 == null) { return } else if (arg23.isChanged()) { return action.invoke() }
        if (arg24 == null) { return } else if (arg24.isChanged()) { return action.invoke() }
        if (arg25 == null) { return } else if (arg25.isChanged()) { return action.invoke() }
        if (arg26 == null) { return } else if (arg26.isChanged()) { return action.invoke() }
        if (arg27 == null) { return } else if (arg27.isChanged()) { return action.invoke() }
        if (arg28 == null) { return } else if (arg28.isChanged()) { return action.invoke() }
        if (arg29 == null) { return } else if (arg29.isChanged()) { return action.invoke() }
        if (arg30 == null) { return } else if (arg30.isChanged()) { return action.invoke() }
        if (arg31 == null) { return } else if (arg31.isChanged()) { return action.invoke() }
        if (arg32 == null) { return } else if (arg32.isChanged()) { return action.invoke() }
        if (arg33 == null) { return } else if (arg33.isChanged()) { return action.invoke() }
        if (arg34 == null) { return } else if (arg34.isChanged()) { return action.invoke() }
        if (arg35 == null) { return } else if (arg35.isChanged()) { return action.invoke() }
        if (arg36 == null) { return } else if (arg36.isChanged()) { return action.invoke() }
        if (arg37 == null) { return } else if (arg37.isChanged()) { return action.invoke() }
        if (arg38 == null) { return } else if (arg38.isChanged()) { return action.invoke() }
        if (arg39 == null) { return } else if (arg39.isChanged()) { return action.invoke() }
        if (arg40 == null) { return } else if (arg40.isChanged()) { return action.invoke() }
        if (arg41 == null) { return } else if (arg41.isChanged()) { return action.invoke() }
        if (arg42 == null) { return } else if (arg42.isChanged()) { return action.invoke() }
        if (arg43 == null) { return } else if (arg43.isChanged()) { return action.invoke() }
        if (arg44 == null) { return } else if (arg44.isChanged()) { return action.invoke() }
    }

    /**
     * 同步两个StateValue的值，如果left有变化，则同步到right
     */
    fun <T> syncValue(from: StateValue<T>, to: StateValue<T>, action: (() -> T)? = null){
        if (from.isChanged()){
            if (action == null){
                //TODO @LiCodeAssist 不修改（保持原逻辑）
                to.setValue(from.getValue())
            }else{
                to.setValue(action())
            }
        }
    }

    private val _observeMultiMap = mutableMapOf<IBehavior, Pair<Array<out StateValue<*>>, StateValueChangedTrigger>>()

    fun observeMultiChange(key: IBehavior, vararg args: StateValue<*>, trigger: StateValueChangedTrigger) {
        args.forEach {
            it.addValueChangedTrigger(trigger)
        }
        val pair = args to trigger
        _observeMultiMap[key] = pair
    }

    private val _observeSingleMap = mutableMapOf<IBehavior, Pair<StateValue<*>, StateValueChangedCallback<*>>>()

    /**
     * 观察单个StateValue的变化
     * @param key IBehavior
     * 通过releaseObserve释放所有key的观察
     */
    fun <T> observeSingleChange(key: IBehavior, args: StateValue<T>, callback: StateValueChangedCallback<T>) {
        args.addValueChangeCallback(callback)
        val pair = args to callback
        _observeSingleMap[key] = pair
    }

    /**
     * 释放某个key的观察
     */
    fun releaseObserve(key: IBehavior) {
        val singlePair = _observeSingleMap.remove(key)
        singlePair?.let {
            it.first.removeValueChangeCallback(it.second)
        }
        val multiPair = _observeMultiMap.remove(key)
        multiPair?.let {
            it.first.forEach { value ->
                value.removeValueChangedTrigger(it.second)
            }
        }
    }
}