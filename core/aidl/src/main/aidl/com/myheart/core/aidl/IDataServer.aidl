package com.myheart.core.aidl;

import com.myheart.core.aidl.IDataClient;

interface IDataServer {
    oneway void sendData(String message);
    oneway void registerClient(IDataClient client);
    oneway void unregisterClient(IDataClient client);
}
