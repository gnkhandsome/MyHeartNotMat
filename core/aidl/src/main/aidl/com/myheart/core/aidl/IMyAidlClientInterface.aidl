// IMyAidlClientInterface.aidl
package com.myheart.core.aidl;

// Declare any non-default types here with import statements
import com.myheart.core.aidl.RespData;

interface IMyAidlClientInterface {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
  void onReceive(in RespData resp);
}