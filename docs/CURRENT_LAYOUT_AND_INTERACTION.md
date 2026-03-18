# 当前布局结构与交互说明（V1 现状）

> 更新时间：2026-03-18  
> 范围：`pages/home`、`pages/post`、`pages/profile` + `app.js` 全局状态流

---

## 1. 全局架构（页面骨架 + 全局能力）

### 1.1 页面骨架

- 主要采用三页结构：Home / Post / Profile。
- Home 内部通过 `swiper` 管理“首页流 / 发布区 / 我的区”三块内容。
- Post、Profile 作为独立页面也可通过 `navigateTo/redirectTo` 进入。

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
   - 雨滴层：`rain-overlay`（仅首页显示，`isRainModeEnabled && currentPage === 0`）。

3. **主内容 `swiper`（`currentPage`）**
   - 0：首页（顶部 Tab + 音频/雨天开关 + 三栏内容流）
   - 1：发布区（输入 + 粉碎 + 隐私/位置）
   - 2：我的区（用户信息 + 调色盘 + 盲盒 + 主题设置）

4. **底部导航**
   - 首页 / 发布 FAB / 我的。
   - 发布 FAB 同时承担短按进入发布、长按呼吸引导。

5. **呼吸引导面板**
   - `isBreathingActive` 时展示轮次与阶段文案。

### 2.2 关键交互

1. **内容流交互**
   - 顶部 Tab 切换：`switchTab`、`onSwiperChange`
   - 卡片粉碎：`onShatterCard` → 震动/音效 → 粒子动画 → 删除 → toast。

2. **发布 FAB 双态交互**
   - 短按：`onPublishTap` 进入发布页。
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

---

## 3. Post 页面（`pages/post`）

### 3.1 布局结构

1. 顶部导航：清空 / 标题 / 发布。  
2. 输入区：`textarea#postInputField`。  
3. 功能区：粉碎、匿名开关、位置开关。  
4. 两个内容列表：
   - 已发布内容 `myPostList`
   - 心情日记 `diaryList`

### 3.2 关键交互

1. **发布流程**
   - `publishPost`：非空校验 → 插入新卡片 → 清空输入 → 成功提示。

2. **草稿粉碎**
   - `shatter`：输入非空校验 → 震动/音效 → `#postInputField` 粉碎动画 → 清空。

3. **卡片粉碎**
   - `onShatterCard`：按 `type(post/diary)` 定位列表并删除。

4. **局部状态开关**
   - 匿名：`togglePrivacy`
   - 位置：`toggleLocation`

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

- 结构上：已形成“Home 主控 + Post 专注发布 + Profile 专注个人疗愈资产”的分工。  
- 交互上：围绕“写-发-粉碎-调色盘-盲盒-呼吸-雨落-白噪音”形成连续疗愈路径。  
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
