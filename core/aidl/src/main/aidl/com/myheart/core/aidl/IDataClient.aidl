package com.myheart.core.aidl;

interface IDataClient {
    oneway void onDataChanged(String message);
}
