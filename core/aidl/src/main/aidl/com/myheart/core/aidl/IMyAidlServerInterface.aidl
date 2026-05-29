// IMyAidlServerInterface.aidl
package com.myheart.core.aidl;

// Declare any non-default types here with import statements
import com.myheart.core.aidl.IMyAidlClientInterface;
import com.myheart.core.aidl.ReqData;

interface IMyAidlServerInterface {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
     oneway void request(in ReqData req);
      oneway void addEventListener(IMyAidlClientInterface client);
      oneway void removeEventListener(IMyAidlClientInterface client);
}