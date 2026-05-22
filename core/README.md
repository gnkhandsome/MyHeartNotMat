# Core Demo（仿 EID 架构）

你当前抽取并验证的，不是单个业务功能，而是 **EID 的状态同步框架链路**：

**Behavior（业务行为） -> ViewModelStore（发送端状态） -> ViewModel（接收端UI状态）**

并由 `World + MainEngine` 循环驱动。

---

## 1) 这次抽取的最小 AdInfo 链路

- app（发送端）
  - `AdInfoBehavior`：业务行为层，处理/组装数据
  - `AdInfoViewModelStore`：状态存储层，标记为
    `@SyncModel(SyncType.SENDER, ViewModelEnum.AD_INFO)`
  - `AdInfoRepo`：仅数据源采用模拟方式（你要求）

- sdk（接收端）
  - `AdInfoViewModel`：UI ViewModel，标记为
    `@SyncModel(SyncType.RECEIVER, ViewModelEnum.AD_INFO)`
  - `GlobalViewModelProvider`：和 eid-LFS 一样放在 sdk 层管理 VM

---

## 2) 数据通讯流程（你要理解的框架核心）

`MainEngine.onUpdate`
-> `AdInfoBehavior.onUpdate(frame)`
-> `AdInfoRepo.poll(frame)`（模拟数据）
-> `AdInfoViewModelStore.update(...)`
-> `World.registerAdInfoSyncListener(...)`
-> `sdk.AdInfoViewModel.syncFromStore(...)`
-> UI 刷新（`tvVmState`）

---

## 3) 运行验证

1. 打开 `/home/lixiang/文档/MyHeartNotMat/core`
2. 运行 app
3. 点击 **启动 World**
4. 观察：
   - `tvWorldState`：Behavior -> Store 的状态
   - `tvVmState`：AdInfoViewModel 接收后的状态
5. 点击 **停止 World**，刷新停止

---

## 4) 构建命令

```bash
cd /home/lixiang/文档/MyHeartNotMat/core
./gradlew :app:assembleDebug --stacktrace
```
