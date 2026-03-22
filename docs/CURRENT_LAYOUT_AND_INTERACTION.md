# 当前布局结构与交互说明（V1 现状）

> 更新时间：2026-03-22  
> 范围：`pages/home`、`pages/post`、`pages/profile` + `app.js` 全局状态流

---

## 1. 全局架构（页面骨架 + 全局能力）

### 1.1 页面骨架

- 当前主路径采用 **Home + My** 双页骨架（都在 `pages/home` 内通过 `currentPage` 管理）。
- Home 内部顶部内容 `swiper` 采用双 Tab：`writing`（写作场景）/ `recommend`（推荐流）。
- 发布能力已并入 Home 的 `writing` Tab，不再依赖 Home 内独立“发布页”。
- `pages/post`、`pages/profile` 仍保留为独立页面能力（用于兼容跳转与后续演进）。

### 1.2 全局能力（`app.js`）

1. **主题状态流**
   - 核心字段：`theme`、`themeId`、`activeThemeType`
   - 核心方法：`getThemeState()`、`switchTheme(themeId)`、`syncThemeState(...)`
   - 页面侧在 `onShow` 同步全局主题。

2. **音频状态流（潮汐白噪音）**
   - 核心字段：`audioContext`、`isAudioPlaying`、`audioVolume`、`currentAudioSrc`
   - 核心方法：`toggleAudio()`、`setAudioVolume()`、`switchAudio()`
   - 已接入淡变：`fadeAudioVolume(from, to)`，用于主题切换与音量平滑归一。
   - 持久化：`audioPlaying`、`audioVolume`（Storage）。

3. **通用删除接口**
   - `deleteContentItem(payload)` 作为当前模拟删除入口（供粉碎闭环复用）。

---

## 2. Home 页面（`pages/home`）

## 2.1 布局结构

1. **顶层容器**
   - `container`：根据主题色渲染背景。
   - 雨天模式 class：`rain-mode-on`、`rain-perf-low`。

2. **叠加层**
   - 粉碎 Canvas：`#homeShredCanvas`（`isShredCanvasVisible` 控制）。
   - 沉浸环境层：`immersive-scene-overlay`（晴/阴/雨/风/雪/水流粒子）。
   - 雨滴层：`rain-overlay`（仅首页显示，`isRainModeEnabled && currentPage === 0`）。

3. **主内容 `swiper`（`currentPage`）**
   - 0：首页（顶部双 Tab + 音频/场景控制 + 内容流）
   - 1：我的区（用户信息 + 调色盘 + 盲盒 + 主题设置）

4. **首页内部双 Tab（`currentTab`）**
   - `writing`：写作场景（发布输入区 + 类型切换 + 结构化沉浸字段 + 封装/粉碎）
   - `recommend`：推荐内容流（`squarePostList`）

5. **底部导航**
   - 首页 / 发布 FAB / 我的。
   - 发布 FAB 同时承担短按进入发布、长按呼吸引导。

6. **呼吸引导面板**
   - `isBreathingActive` 时展示轮次与阶段文案。

### 2.2 关键交互

1. **内容流交互**
   - 顶部 Tab 切换：`switchTab`、`onSwiperChange`
   - 卡片粉碎：`onShatterCard` → 震动/音效 → 粒子动画 → 删除 → toast。

2. **发布 FAB 双态交互**
   - 短按：`onPublishTap` 回到首页写作态（`currentPage=0`, `activeTab='writing'`）。
   - 长按：`onPublishTouchStart` 延迟触发呼吸。
   - 松手/取消：`onPublishTouchEnd` / `onPublishTouchCancel` 停止呼吸。
   - 已做防误触：`shouldSuppressNextPublishTap` 抑制长按后的 tap 冒泡跳转。

3. **呼吸岛屿（4-7-8）**
   - 阶段：`inhale(4s)` / `hold(7s)` / `exhale(8s)`，最多 3 轮。
   - 生命周期兜底：`onHide/onUnload` 自动停止。
   - 性能降级：`breathingPerfLevel` 低端机缩短动画时长。

4. **雨落字里**
   - 开关：音频卡片内 `switch`（`onRainModeChange`）。
   - 状态：`isRainModeEnabled`、`rainDrops`、`rainPerfLevel`。
   - 持久化：`homeRainModeEnabled`。
   - 非阻塞：雨滴层 `pointer-events: none`。

5. **音频控制**
   - 播放/暂停：`toggleAudioPlay`
   - 面板展开：`toggleAudioPanel`
   - 音量滑杆：`onAudioVolumeChange`

6. **沉浸场景系统（新增）**
   - 场景类型：`sunny/cloudy/rainy/windy/snowy/stream`
   - 自动模式：`isSceneAutoMode`（按时段自动切换）
   - 手动切换：`onSceneChange`
   - 场景强度：`sceneIntensity`（20~100，联动粒子密度与场景分轨音量）
   - 状态落盘：`homeActiveScene`、`homeSceneAutoMode`
   - 场景驱动：`applyImmersiveScene` 同步视觉粒子、说明文案、听觉标签，并与雨天模式联动。
   - 音频联动：通过 `app.setSceneSoundscape(sceneKey, { intensity })` 接入场景分轨混音（风声/鸟鸣/水流/雪风等轨道组合），缺失音频自动回退 `/raining.mp3`。

7. **四类型沉浸增强（新增）**
   - 发布输入区新增结构化字段：
     - 写信：`letterSalutation`（称呼）、`letterSignature`（落款）
     - 明信片：`postcardLocation`（地点戳）
     - 日记：`diaryWeather`（天气）、`diaryMoodScore`（心情分 1~10）
     - Vlog：`vlogScriptTemplate`（镜头脚本模板，多行）
   - 内容流卡片新增类型扩展展示：
     - 写信卡片展示称呼/落款
     - 明信片卡片展示地点戳
     - 日记卡片展示天气与心情分
     - Vlog 卡片展示分镜条目（`vlogShots`）
   - 旧数据兜底：`createTypedPostItem` 对新增字段提供默认值，避免历史数据渲染异常。

8. **首屏缓入镜头（新增）**
   - 初次进入 Home 时触发 `isSceneEntering`（约 2.4s）。
   - 通过容器缩放+饱和度/模糊过渡 + `scene-enter-curtain` 幕布淡出，实现“进入空间”感。

9. **发布场景包与氛围还原（新增）**
   - Home 发布时会随内容打包 `scenePackage` 快照（`sceneKey` / `sceneIntensity` / `themeId` / `capturedAt`）。
   - 推荐卡片在存在 `scenePackage` 时展示“还原氛围”按钮（`onRestoreSceneFromPost`）。
   - 推荐卡片新增“场景记忆条”（图标/场景名/强度/相对时间），提升历史氛围可读性。
   - 还原时会同步：
     - 场景类型与强度（视觉粒子 + 雨落 + 分轨音量）
     - 主题（通过 `app.switchTheme(themeId)`）
   - 还原反馈：顶部 `scene-restore-hint` 浮层 + 短时镜头过渡，切换更柔和。
   - 目标：支持“回看历史发布时一键回到当时写作氛围”。

10. **写作桌面氛围层（新增）**
   - writing 区新增 `writing-ambient-panel`，通过柔光“台灯呼吸”与温和引导文案构建安心开写氛围。
   - 输入容器与操作区补充低对比渐变和轻微毛玻璃，减少控件噪音，保留聚焦感。
    - 焦点联动：`onPostFocus/onPostBlur` 驱动 `isWritingFocused`，同步作用于：
      - `input-container.writing-focused`
      - `post-type-row.writing-focused`
      - `action-buttons.writing-focused`
      - `writing-ambient-panel.is-writing-focused`
    - 操作层级：发布按钮 `action-button publish-btn` 作为主动作；粉碎/匿名使用 `secondary-btn` 降权，避免与正文输入区抢注意力。
    - 低端机兜底：`writing-ambient-panel.low-perf .desk-lamp-glow` 关闭呼吸动画，仅保留静态柔光。
    - 发布路径改为“先封装再选择去向”：
      - 主按钮触发 `onPackagePost`
      - 弹出 ActionSheet 选择“仅自己可见（本地私密）/发布到广场（公开）”
      - 不再在写作区常驻匿名开关按钮，减少决策干扰。

11. **动效节奏与低端机阈值（新增）**
    - 首页入场镜头：`startSceneEntranceTransition(2400ms)`，场景还原时使用短版本 `1200ms`。
    - 顶部还原提示：`scene-restore-hint` 动画约 `1600ms`，并在 `1800ms` 后自动收起。
    - 写作焦点动效：输入容器、操作区、氛围层统一采用 0.32~0.42s 的缓动节奏。
    - 统一降级阈值：`LOW_PERF_BENCHMARK_THRESHOLD = 20`，`benchmarkLevel <= 20` 进入 low perf（雨滴/场景粒子/呼吸等策略共用）。

12. **写作态控制折叠（新增）**
    - `audio-control` 升级为“氛围控制台”，新增 header 摘要（场景/强度/白噪音状态）。
    - 写作 Tab 默认折叠（`isAmbientControlExpanded=false`），减少首屏控件干扰。
    - 推荐 Tab 默认展开（便于调节）；用户也可点击 header 在写作态手动展开。
    - 折叠时自动关闭音量子面板（`showAudioPanel=false`），避免状态残留。
    - 回到写作态关键路径（FAB 回写作、发布后回写作、还原氛围后回写作）均强制折叠控制台，保持沉浸一致性。

---

## 3. Post 页面（`pages/post`）

### 3.1 布局结构

1. 顶部沉浸提示卡：`writing-ambient-panel`（不再保留清空/标题/顶部发布导航栏）。  
2. 发布类型切换：写信 / 明信片 / 日记 / Vlog（横向 type chips）。  
3. 输入区：`textarea#postInputField`（占位文案与排版随类型切换）。  
4. 沉浸增强字段区（随类型动态显示）：
   - 写信：称呼 + 落款
   - 明信片：地点戳
   - 日记：天气 + 心情分（slider）
   - Vlog：镜头脚本模板（多行）
5. 功能区：主按钮为类型化“封装/寄出/收进/发出”，次按钮为粉碎。  
6. 主按钮下方 `package-flow-tip` 提示“封装后再选择私密/公开”。
7. 两个内容列表：
   - 已发布内容 `myPostList`
   - 心情日记 `diaryList`
   - 卡片支持按类型展示差异化风格（type pill / 左侧色条 / Vlog 时长徽标）
   - 卡片支持沉浸增强字段展示（称呼/落款、地点戳、天气/心情分、分镜）

### 3.2 关键交互

1. **发布流程**
   - `onPackagePost`：非空校验 → 打开 ActionSheet（私密/公开）。
   - `publishPost({ visibility })`：按 `activePostType` 生成 typed item（含 `visibility`）→
     - `diary` 进入 `diaryList`
     - 其他类型进入 `myPostList`
     → 清空输入 → 成功提示。
   - 类型化动作文案由 `POST_ACTION_META` 控制：
     - `letter`：封装信笺
     - `postcard`：寄出明信片
     - `diary`：收进日记页
     - `vlog`：发出片段

2. **类型切换流程**
   - `switchPostType`：切换 `activePostType` 并更新 `postPlaceholder`。
   - 类型元数据：`POST_TYPE_META`（label/icon/placeholder）。

3. **结构化沉浸字段流程（新增）**
   - 输入事件：
     - `onLetterSalutationInput`
     - `onLetterSignatureInput`
     - `onPostcardLocationInput`
     - `onDiaryWeatherInput`
     - `onDiaryMoodScoreChange`
     - `onVlogScriptTemplateInput`
   - 发布时由 `publishPost` 透传到 `createTypedPostItem`，并由后者做字段兜底与标准化。

4. **草稿粉碎**
   - `shatter`：输入非空校验 → 震动/音效 → `#postInputField` 粉碎动画 → 清空。

5. **卡片粉碎**
   - `onShatterCard`：按 `type(post/diary)` 定位列表并删除。

6. **局部状态开关**
   - 历史匿名开关方法仍保留兼容，但已从 Post 主写作界面移除入口，避免干扰沉浸写作。

---

## 4. Profile 页面（`pages/profile`）

### 4.1 布局结构

1. 用户信息区。  
2. 情绪调色盘（30 天网格 + 记录按钮 + 统计文案）。  
3. 我的内容入口（发布/收藏/解忧记录）。  
4. 解忧盲盒（输入区 + 盲盒卡 + 操作按钮）。  
5. 主题设置（柔美/深邃 + 主题列表）。  
6. 底部导航（首页 / 发布 / 我的）。

### 4.2 关键交互

1. **情绪调色盘**
   - 存储键：`profileMoodCheckins`
   - 今日记录：`recordTodayMood`
   - 历史回看：`onMoodDayTap`（按 `themeId` 预览）

2. **解忧盲盒**
   - 输入：`onBlindInput`
   - 拆盒：`openBlindBox`（开盒态 + 延时出结果）
   - 换一句：`refreshBlindQuote`
   - 重置：`resetBlindBox`

3. **主题切换**
   - 风格分组：`switchThemeType`
   - 应用主题：`selectTheme` → 全局 `app.switchTheme`

4. **导航行为**
   - 回首页：`switchPage(data-page='home')` 使用 `redirectTo`
   - 去发布页：`goToPost` 使用 `navigateTo`

---

## 5. 关键状态与事件速查

### 5.1 Home 关键状态

- 页面与 Tab：`currentPage`、`activeTab`、`currentTab`
- 音频：`isAudioPlaying`、`audioVolume`、`showAudioPanel`
- 雨落：`isRainModeEnabled`、`rainDrops`、`rainPerfLevel`
- 场景：`activeScene`、`sceneIntensity`、`isSceneAutoMode`、`scenePerfLevel`、`isSceneEntering`
- 场景还原反馈：`showSceneRestoreHint`、`sceneRestoreHintText`、`sceneRestoreHintScene`
- 写作聚焦：`isWritingFocused`
- 呼吸：`isBreathingActive`、`breathingPhase`、`breathingDisplayRound`
- 粉碎：`isShredCanvasVisible`、`isPostShattering`、`shatteringCardIds`

### 5.2 跨页联动点

1. **主题联动**：三页 `onShow` 都会拉全局主题状态。  
2. **音频联动**：Home 控制全局音频；主题切换会触发全局音频切换与淡变。  
3. **粉碎联动**：Home 与 Post 共用 `createPageShredHelper` + `app.deleteContentItem`。  
4. **存储联动**：
   - `themeId`、`audioPlaying`、`audioVolume`（全局）
   - `homeRainModeEnabled`（Home）
   - `profileMoodCheckins`（Profile）

---

## 6. 当前交互特征总结

- 结构上：已形成“Home 主控（写作+推荐合一）+ My 个人疗愈资产”的主路径，Post/Profile 作为可扩展独立页保留。  
- 交互上：围绕“写-发-粉碎-调色盘-盲盒-呼吸-雨落-白噪音-场景还原-桌面沉浸”形成连续疗愈路径，并在四类内容中加入结构化沉浸表达。  
- 工程上：已具备主题/音频/动画降级/持久化/联调文档化能力，具备继续向验收收口的基础。

---

## 7. 全局陪伴者（树洞小精灵）当前实现

### 7.1 挂载位置与视觉

- 挂载在 Home 底部发布 FAB 旁（`tabbar-publish` 内）。
- 结构：`companion-wrapper` + `companion-sprite` + `companion-bubble`。
- 主题映射：
  - 感性（FEMALE）→ `cloud` 视觉（柔和能量体）
  - 理性（MALE）→ `core` 视觉（几何核心）

### 7.2 状态机（首版）

- `idle`：待机浮动
- `happy`：提亮 + 更轻快节奏
- `sad`：收缩 + 轻度灰化
- `breathing`：跟随呼吸节律缩放

状态由 `companionState` 驱动，核心计算函数：`resolveCompanionStateByText(text)`。

### 7.3 核心交互

1. **情绪感应（输入联动）**
   - 监听 Home 发布输入 `onPostInput`。
   - 关键词命中负向/正向词库后切换 `sad/happy`。
   - 同时弹出简短气泡文案（安抚/鼓励）。

2. **触碰反馈**
   - 单点：`onCompanionTap`，触发害羞位移（`is-shy`）和气泡。
   - 长按：`onCompanionTouchStart` 延迟触发呼吸岛屿。
   - 松手/取消：结束呼吸并恢复常态。

3. **呼吸联动**
   - 呼吸启动时强制切 `companionState='breathing'`。
   - 呼吸结束后根据当前输入文本恢复 `idle/happy/sad`。

4. **悄悄话提示**
   - `onShow` 时按条件触发：
     - 深夜（23:00~05:59）
     - 或长时间未打开（>3h）
   - 存储键：`homeCompanionLastActiveAt`。

### 7.4 当前限制与下一步建议

1. 当前为 CSS 形态动画，尚未接入序列帧/Lottie 资源。
2. 关键词词库为内置静态词，可后续抽到配置中心做灰度迭代。
3. 可继续扩展与盲盒/粉碎/雨落的专属联动动作（例如“吃掉烦恼”“撑伞”）。
4. 拖拽初始定位 `fabY = windowHeight - 156` 为经验值，仍需按机型与安全区真机微调。

### 7.5 已实现的功能联动（增量）

1. **粉碎联动**
   - 触发位置：`triggerShatterFeedback()`
   - 表现：精灵切为 `happy`，气泡提示“呼——烦恼都被吹散啦。”

2. **雨落联动**
   - 触发位置：`setRainMode(enabled)`
   - 表现：
     - 开启雨天：`happy` + “下雨啦，我会陪你一起听雨。”
     - 关闭雨天：`idle` + “雨停啦，天色慢慢亮起来。”

3. **白噪音联动**
   - 触发位置：`toggleAudioPlay()`
   - 表现：
     - 播放：`happy` + “我把白噪音开好了。”
     - 暂停：`idle` + “先安静一下也很好。”

4. **盲盒联动（Home 内盲盒入口）**
   - 触发位置：`openBlindBox()`
   - 表现：
     - 开盒前：“我来帮你拆开这份礼物。”
     - 出结果后：“收下这句温柔吧 ✨”

> 以上联动通过 `triggerCompanionMoment(...)` 统一收口，避免散落重复逻辑。

### 7.6 Phase2：拖拽物理感 + 轻量尾迹（已实现）

1. **结构改造（placeholder + movable overlay）**
   - 底部导航中原发布位改为占位：`tabbar-publish-placeholder` + `publish-button.placeholder`。
   - 真实可交互 FAB 迁移到覆盖层：`movable-area.fab-movable-area` + `movable-view.fab-movable-view`。
   - 通过 `pointer-events` 分层控制，保证内容区滚动与点击不被拖拽层误拦截。

2. **拖拽事件与速度映射（`onFabDragChange`）**
   - 仅在 `source === 'touch'` 时进入速度计算；非触摸来源只同步坐标。
   - 速度计算：`speed = sqrt(dx^2 + dy^2) / dt`，并基于阈值映射拖拽形变等级：
     - `speed <= 0.7` → `drag-level-1`
     - `0.7 < speed <= 1.2` → `drag-level-2`
     - `speed > 1.2` → `drag-level-3`
   - 停止拖拽 `120ms` 后自动回落 `companionDragLevel = 0`，避免残留“拉伸态”。

3. **轻量尾迹策略（`companionTrailParticles`）**
   - 拖拽时按当前位置生成粒子（`emitCompanionTrailParticle`），并根据速度调整尺寸/透明度。
   - 粒子上限 10 个，保证低成本渲染。
   - 每个粒子 `320ms` 自动回收，结合 `@keyframes companion-trail-fade` 做淡出缩放。

4. **样式冲突修正（is-shy × drag-level）**
   - 已新增组合类：`.is-shy.drag-level-1/2/3`，解决“害羞位移”与“拖拽拉伸”互相覆盖问题。
   - `companion-float` 改为 `margin-top` 轻微浮动，避免与 `transform` 动画争抢同一属性。

5. **当前已知限制与验收关注**
   - 拖拽与 `bindtap=onPublishTap` 的误触抑制需真机重点验证（快速拖放、边缘释放）。
   - 初始 FAB 定位在刘海屏/超高屏下可能偏高或偏低，需结合安全区做二次校准。
   - 低端机在持续高速拖拽下需观察尾迹帧率与主线程占用（必要时继续降频/降粒子）。

---

## 8. Home 沉浸链路验收走查清单（新增）

1. **写作流（焦点沉浸）**
   - 进入 `writing` Tab 后显示 `writing-ambient-panel`，台灯柔光正常呼吸。
   - 写作态默认仅展示“氛围控制台摘要行”，不直接暴露全部开关与滑杆。
   - 点击摘要行可展开完整控制项，再次点击可收起。
   - 点击 textarea：`isWritingFocused=true`，输入容器抬升、操作区轻降噪、类型 chip 区透明度下降。
   - 失焦后各区域回到默认视觉，不出现残留焦点态。

2. **发布流（主次动作层级）**
   - `publish-btn` 视觉主导明显，`secondary-btn`（粉碎）弱化但可用。
   - 主动作为“先封装再选择去向”（私密/公开），不在写作区常驻匿名开关。
   - 发布后推荐卡新增内容包含 `scenePackage` 快照，不丢失类型增强字段。

3. **推荐流（场景记忆可读）**
   - 含场景包内容展示 `scene-memory-strip`（图标/场景名/强度/时间）。
   - 卡片“还原氛围”入口可见且点击区域明确。

4. **还原流（视觉+状态回切）**
   - 点击“还原氛围”后自动回到 Home 写作态（`currentPage=0`, `activeTab='writing'`）。
   - 顶部出现 `scene-restore-hint`，并触发短镜头过渡；约 1.8s 后自动隐藏提示。
   - 场景类型、强度、主题同步到目标快照。

5. **低端机降级流（性能兜底）**
   - 当 `benchmarkLevel <= 20`：
     - `rainPerfLevel/scenePerfLevel/breathingPerfLevel` 统一进入 `low`。
     - `desk-lamp-glow` 停止动画，雨滴/粒子数量和节奏按低配策略收敛。
   - 页面交互保持流畅，滚动与点击不受覆盖层影响（`pointer-events: none` 仍生效）。
