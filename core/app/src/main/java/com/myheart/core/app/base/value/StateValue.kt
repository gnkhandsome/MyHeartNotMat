package com.myheart.core.app.base.value

import androidx.annotation.AnyThread
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.myheart.core.app.EngineThread
import com.myheart.core.utils.Logger.f
import com.myheart.core.utils.RunnableHelper
import java.io.Serializable

open class StateValue<T: Any?>(value: T?) : IEvenValue, IChangeableValue, Serializable {

    /** 当前类所在类名 */
    private lateinit var ownerClassName: String
    /** 当前类所在类的字段名 */
    private lateinit var ownerFieldName: String

    @Transient
    private val lock = Any()

    @Volatile
    @Transient
    private var pendingData: Any? = NOT_SET
    private val initValue: T? = value
    private var oldValue: T? = null

    @Volatile
    private var value: T?
    private var id: Long = 0
    private var dirty = false
    private var changed = false
    private val stateValueSetCallbacks: MutableList<StateValueSetCallback<T>> by lazy {
        ArrayList(1)
    }
    private val stateValueChangedCallbacks: MutableList<StateValueChangedCallback<T>> by lazy {
        ArrayList(1)
    }

    private val stateValueChangedCallbackMap: MutableMap<String,MutableList<StateValueChangedCallback<T>>> by lazy {
        HashMap(1)
    }

    private val stateValueChangedTriggers: MutableList<StateValueChangedTrigger> by lazy {
        ArrayList(1)
    }

    constructor():this(null)

    init {
        this.value = value
    }
    fun setValue(value: T?) {
        if (EngineThread.isCurrentThread) {
            setValueInner(value)
        } else {
            postValue(value)
        }
    }

    private fun setValueInner(value: T?) {
        EngineThread.assertEngineThread()
        performValueSetCallback(value)
        if (oldValue != value || this.value != value) {
            changed = true
            id++
            if (this.value != value) {
                this.value = value
                printValue()
                performValueChangedTrigger()
                performValueChangedCallback(value)
            }
        }
    }

    @AnyThread
    private fun postValue(value: T?) {
        // 非Engine线程，转换一下
        var postTask: Boolean
        synchronized(lock) {
            postTask = pendingData === NOT_SET
            pendingData = value
        }
        if (!postTask) {
            return
        }
        EngineThread.getHandler().post(postValueRunnable)
    }

    @Transient
    private val postValueRunnable = Runnable {
        var newValue: Any?
        synchronized(lock) {
            newValue = pendingData
            pendingData = NOT_SET
        }
        setValueInner(newValue as T?)
    }

    fun getValue(): T? {
        return value
    }

    fun getOldValue(): T? {
        return oldValue
    }

    fun check(t: T?): Boolean {
        return value == t
    }

    fun setDirty() {
        EngineThread.assertEngineThread()
        this.dirty = true
    }

    /**
     * 引擎调用此方法，外部方法不直接调用
     */
    override fun even() {
        oldValue = value
        dirty = false
        changed = false
    }

    fun setEven(value: T?) {
        EngineThread.assertEngineThread()
        setValue(value)
        even()
    }

    fun resetValue() {
        setValue(initValue)
    }

    override fun isChanged(): Boolean {
        return dirty || changed
    }

    /**
     * 如果变化则执行操作
     * @param action 值不为null
     */
    fun ifChanged(action: (T?) -> Unit):StateValue<T> {
        if (isChanged()) {
            action(value)
        }
        return this
    }

    /**
     * 如果 value 值变化且 value 满足条件
     */
    fun ifChangedToCondition(predicate: (T?) -> Boolean, action: (T?) -> Unit): StateValue<T> {
        if (isChanged() && predicate(value)) {
            action(value)
        }
        return this
    }

    /**
     * 如果 value 值是 Boolean true，则执行 action
     */
    fun ifValueTrue(action: (T?) -> Unit): StateValue<T> {
        if ((value is Boolean) and (value == true)) {
            action(value)
        }
        return this
    }

    /**
     * 如果 value 的值是 Boolean false，则执行 action
     */
    fun ifValueFalse(action: (T?) -> Unit): StateValue<T> {
        if ((value is Boolean) and (value == false)) {
            action(value)
        }
        return this
    }

    /**
     * 如果 value 满足条件则返回 value，否则返回 null
     * 类似 takeIf
     */
    fun takeIfValue(predicate: (T?) -> Boolean): T? {
        return if (predicate(value)) value else null
    }

    /**
     * 如果 value 不满足条件则返回 value，否则返回 null
     * 类似 takeUnless
     */
    fun takeUnlessValue(predicate: (T?) -> Boolean): T? {
        return if (!predicate(value)) value else null
    }

    /**
     * 如果 value 满足条件 predicate 执行 action
     */
    fun ifCondition(predicate: (T?) -> Boolean, action: (T?) -> Unit): T?{
        if (predicate(value)) {
            action(value).let {  }
        }
        return value
    }

    /**
     * value 是否满足条件 predicate
     */
    fun isValueCondition(predicate: (T?) -> Boolean): Boolean {
        return predicate(value)
    }

    /**
     * 判断值 value == target
     */
    fun isValueEquals(target:T?): Boolean {
        return value == target
    }

    /**
     * 判断值 value != target
     */
    fun isValueNotEquals(target:T?): Boolean {
        return value != target
    }

    fun isValueTrue(): Boolean {
        return value == true
    }

    fun isValueFalse(): Boolean {
        return value == false
    }

    fun isValueNull(): Boolean {
        return value == null
    }

    fun isValueNotNull(): Boolean {
        return value != null
    }

    fun addValueSetCallback(callback: StateValueSetCallback<T>) {
        EngineThread.assertEngineThread()
        if (!stateValueSetCallbacks.contains(callback)) {
            stateValueSetCallbacks.add(callback)
            f(TAG, "addValueSetCallback callback=$callback")
        }
    }

    fun removeValueSetCallback(callback: StateValueSetCallback<*>) {
        EngineThread.assertEngineThread()
        stateValueSetCallbacks.remove(callback)
        f(TAG, "removeValueSetCallback callback=$callback")
    }

    private fun performValueSetCallback(value: T?) {
        stateValueSetCallbacks.forEach { it.onValueSet(value) }
    }

    // Engine线程调用
    fun addValueChangeCallback(callback: StateValueChangedCallback<T>) {
        EngineThread.assertEngineThread()
        if (!stateValueChangedCallbacks.contains(callback)) {
            stateValueChangedCallbacks.add(callback)
            f(TAG, "addValueChangeCallback callback=$callback")
        }
        if (dirty || initValue != value) {
            callback.onValueChanged(value)
        }
    }

    /*
     *  ViewModel 绑定 Store 数据联动
     *  1. 处理生命周期
     *  2. 处理链接状态
     */
    fun vmBindValue(vm: ViewModel, liveData:  MutableLiveData<T?>) {
        f(TAG, "vmBindValue Bind vm=${vm.javaClass.simpleName} liveData=$liveData")
        val tag = vm.javaClass.simpleName
        // 在 main 线程中回调用
        val callback = StateValueChangedCallback<T> {
            RunnableHelper.main.post({
                liveData.value = it as T
                f(TAG, "vmBindValue set vm=${vm.javaClass.simpleName} value=${liveData.value}")
            })
        }

        // 在 Engine 线程中添加
        EngineThread.getHandler().post {
            val callbackList = stateValueChangedCallbackMap[tag]
            if (callbackList == null){
                stateValueChangedCallbackMap[tag] = mutableListOf(callback)
            }else{
                callbackList.add(callback)
            }
        }
        // 结束的时候删除
        vm.addCloseable {
            EngineThread.getHandler().post {
                val list  = stateValueChangedCallbackMap.remove(tag)
                f(TAG, "vmBindValue Unbind list=$list")
            }
        }

        if (RunnableHelper.isMainThread()){
            liveData.value = value
        }else{
            RunnableHelper.main.post( {
                liveData.value = value
            })
        }
    }


    fun removeValueChangeCallback(callback: StateValueChangedCallback<*>) {
        EngineThread.assertEngineThread()
        stateValueChangedCallbacks.remove(callback)
        f(TAG, "removeValueChangeCallback callback=$callback")
    }

    private fun performValueChangedCallback(value: T?) {
        stateValueChangedCallbacks.forEach { e -> e.onValueChanged(value) }
        stateValueChangedCallbackMap.forEach{ (s, callbacks) -> callbacks.forEach { e -> e.onValueChanged(value) } }
    }

    fun addValueChangedTrigger(trigger: StateValueChangedTrigger) {
        EngineThread.assertEngineThread()
        if (!stateValueChangedTriggers.contains(trigger)) {
            stateValueChangedTriggers.add(trigger)
            f(TAG, "addValueChangedTrigger trigger=$trigger")
        }
        if (dirty || initValue != value) {
            trigger.onChanged()
        }
    }

    fun removeValueChangedTrigger(trigger: StateValueChangedTrigger) {
        EngineThread.assertEngineThread()
        stateValueChangedTriggers.remove(trigger)
        f(TAG, "removeValueChangedTrigger trigger=$trigger")
    }

    private fun performValueChangedTrigger() {
        stateValueChangedTriggers.forEach { e -> e.onChanged() }
    }

    fun setupLog(ownerClassName: String, ownerFieldName: String) {
        this.ownerClassName = ownerClassName
        this.ownerFieldName = ownerFieldName
    }

    private fun printValue() {
        if (this::ownerClassName.isInitialized && this::ownerFieldName.isInitialized) {
            f(TAG, "## ${ownerClassName}.$ownerFieldName = $oldValue -> $value")
        }
    }

    override fun toString(): String {
        return "StateValue{" +
                "initValue=" + initValue +
                ", oldValue=" + oldValue +
                ", value=" + value +
                ", id=" + id +
                ", dirty=" + dirty +
                ", stateValueSetCallbacks=" + stateValueSetCallbacks.size +
                ", stateValueChangedCallbacks=" + stateValueChangedCallbacks.size +
                ", hashCode=" + hashCode() +
                '}'
    }

    companion object {
        private const val TAG = "StateValue"
        private val NOT_SET = Any()
    }
}