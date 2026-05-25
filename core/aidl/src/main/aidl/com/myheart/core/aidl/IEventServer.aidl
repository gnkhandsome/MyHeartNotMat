package com.myheart.core.aidl;

import com.myheart.core.aidl.EventResp;
import com.myheart.core.aidl.EventReq;
import com.myheart.core.aidl.IEventClient;

interface IEventServer {
    oneway void request(in EventReq req);
    oneway void addEventListener(IEventClient client);
    oneway void removeEventListener(IEventClient client);
}