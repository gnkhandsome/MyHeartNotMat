package com.myheart.core.utils

import android.os.IBinder
import java.util.Objects

class BinderUtils {

    companion object {
        const val TAG = "BinderUtils"
        fun isInterfaceAlive(asBinder: IBinder?): Boolean {
            if (asBinder == null) {
                Logger.f(TAG, "isInterfaceAlive asBinder is null")
                return false
            }
            if (Objects.isNull(asBinder.interfaceDescriptor)) {
                Logger.f(TAG, "isInterfaceAlive interfaceDescriptor is null")
                return false
            }
            if (EmptyBinder.DESCRIPTOR == asBinder.interfaceDescriptor) {
                Logger.f(TAG, "isInterfaceAlive interfaceDescriptor is ${EmptyBinder.DESCRIPTOR}")
                return false
            }
            if (!asBinder.isBinderAlive) {
                Logger.f(TAG, "isInterfaceAlive isBinderAlive false")
                return false
            }
            if (!asBinder.pingBinder()) {
                Logger.f(TAG, "isInterfaceAlive pingBinder false")
                return false
            }
            Logger.f(TAG, "isInterfaceAlive true")
            return true
        }
    }
}