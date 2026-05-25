// IEidEventClient.aidl
package com.myheart.core.aidl;

import com.myheart.core.aidl.EventResp;
// Declare any non-default types here with import statements    EID ==> 地图

interface IEventClient {
    void onReceive(in EventResp resp);
}