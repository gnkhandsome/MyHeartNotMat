# V1 开发任务拆解（框架优先）

> 策略：先搭框架，再逐个接入 6 个功能，降低返工。

## Phase 1：页面框架与全局状态（先做）

1. 统一页面骨架
- Home / Post / Profile 的容器高度、安全区、滚动行为统一
- 底部导航与页面切换行为统一
- 当前进度：✅ 已完成（2026-03-18）
  - 已统一三页容器与底部安全区留白策略
  - 已统一卡片圆角层级与模块间距节奏
  - 已统一过渡曲线为柔和 `cubic-bezier(0.22, 1, 0.36, 1)`，避免生硬切换

2. 统一主题状态流
- App 全局：`theme`、`themeId`、`activeThemeType`
- 页面进入时同步全局主题，不再各页重复初始化逻辑
- 当前进度：✅ 已完成（2026-03-18）
  - `app.js` 新增统一主题状态入口：`syncThemeState` / `getThemeState`
  - `home/post/profile` 页面改为 `onShow` 同步全局主题，不再使用异步 `setTimeout + loadTheme`
  - 页面切换主题统一走 `app.switchTheme(theme.id)` 并回写当前页状态

3. 统一音频基础能力（为潮汐白噪音铺路）
- 全局 `InnerAudioContext` 生命周期管理
- 播放/暂停状态与音量持久化（Storage）
- 当前进度：✅ 已完成（2026-03-18）
  - 全局音频状态已统一为：`isAudioPlaying`、`audioVolume`、`currentAudioSrc`
  - 已接入播放状态与音量持久化：`audioPlaying` / `audioVolume`
  - 已增加 `toggleAudio / pauseAudio / resumeAudio / setAudioVolume` 统一控制入口
  - 临时音源策略已启用：当前所有主题先统一使用根目录 `/raining.mp3`

4. 统一风格切面开关
- 柔美（0-11）/深邃（12-23）两组样式映射常量化
- 当前进度：✅ 已完成（2026-03-18）
  - `theme.config.js` 新增 `THEME_STYLE_TYPES / THEME_STYLE_RANGE`
  - 新增 `getThemeTypeById / getThemesByType`，统一切面推导与分组
  - `app.js` 与 `home/post/profile` 全部改为复用常量与函数，移除硬编码边界判断与切片
  - 主题列表渲染统一改为 `filteredThemes`，避免散落 `slice(0,12)` / `slice(12,24)`

## Phase 2：接入 6 个 V1 功能（按顺序）

1. 潮汐白噪音（全局）
 - 当前进度：✅ 已完成首版（2026-03-18）
 - 首页已接入播放/暂停控制与音量滑杆交互
 - 已对接全局音频状态：`getAudioState / toggleAudio / setAudioVolume`
 - 播放状态与音量可跨重启恢复（Storage）
2. 粉碎（Post）
  - 当前进度：✅ 已完成首版（2026-03-18）
  - 发布输入已接入完整闭环：粒子动画 + 震动 + 粉碎音效 + 清空 + 不入流
  - 首页内容卡片（我的小屋/广场/最新）支持粉碎动画与删除闭环
  - Post 页已发布内容与心情日记卡片支持粉碎动画与删除闭环
  - 已统一删除接口入口：`app.deleteContentItem(payload)`（后续可替换真实 API）
  - 已升级为 Canvas 2D 粉碎层：根据 `theme.particleType` 自动切换 `petal/shatter`
  - 已抽离通用引擎：`utils/shredder.js`，可复用于任意页面任意控件
  - 已完成组件级封装：`createPageShredHelper({ canvasSelector })`
    - 页面仅需调用：`helper.shred(this, { targetSelector, particleCount })`
    - 统一处理 Canvas 显隐、主题粒子风格推导、颜色回退与动画调用
3. 解忧盲盒（Profile）
  - 当前进度：✅ 已完成首版（2026-03-18）
  - 已支持“投入烦恼（选填）→ 拆盲盒 → 治愈结果”闭环
  - 已接入拆盒动画：开盒抖动 + 翻牌 + 闪光粒子
  - 已支持“换一句 / 重置”操作与状态管理
  - 已保证主题适配（主题色、边框与阴影风格联动）
4. 情绪调色盘（Profile）
  - 当前进度：✅ 已完成首版（2026-03-18）
  - 已支持“今日心情”一键记录（存储键：`profileMoodCheckins`）
  - 已支持近30天色块回看与记录统计展示
  - 点击历史记录可回看当日主题风格（主题预览）
  - 已完成本地持久化读写（跨重启可恢复）
5. 呼吸岛屿（Home FAB）
  - 当前进度：✅ 已完成首版（2026-03-18）
  - 已接入长按触发呼吸引导，支持 4-7-8 节律（吸气/屏息/呼气）
  - 已接入引导面板文案与轮次反馈（最多 3 轮）
  - 已支持松手结束、切后台/离页自动结束
  - 已接入低性能降级（低端机缩短动画时长）
  - ✅ 已完成核心交互自检（2026-03-18）
    - 修复长按后 `touchend` 触发 `tap` 导致误进入发布页的问题（新增 tap 抑制标记）
    - 验证长按触发稳定、松手/取消/切后台可正确中止、3 轮自动结束逻辑正常
    - 验证低性能分支样式与普通分支并行可用
6. 雨落字里（Home）
  - 当前进度：✅ 已完成首版（2026-03-18）
  - 首页已接入“雨天模式”开关（默认关闭），支持即时开启/关闭
  - 已在内容层上方叠加轻量雨滴动画层（`pointer-events: none`，不阻塞滚动与点击）
  - 已接入低性能降级（低端机自动减少雨滴数量并弱化视觉强度）
  - 已接入本地持久化（存储键：`homeRainModeEnabled`，重启后可恢复）

## Phase 3：联调与验收

1. 功能联调
- 主题切换与音频切换一致
- 粉碎与发布互不干扰
- 调色盘数据跨重启可恢复
- 当前进度：🚧 联调中（2026-03-18）
  - 已新增粉碎联调清单：`docs/PHASE2_SHREDDER_JOINT_DEBUG_CHECKLIST.md`
  - 已新增 Home 主链路联调清单：`docs/PHASE3_JOINT_DEBUG_CHECKLIST.md`
  - 已新增联调缺陷跟踪表：`docs/PHASE3_DEFECT_TRACKER.md`

2. 性能与兼容
- 动画降级策略（低端机）
- iOS/Android 安全区与震动反馈行为验证
- 当前进度：🚧 已接入首版性能保护（2026-03-18）
  - `utils/shredder.js` 已接入设备分级粒子降级、并发防抖、动画超时兜底
  - `app.js` 已补齐音频淡变辅助（`fadeAudioVolume`），用于主题切换听感平滑化

3. 回归验证
- 按 `docs/V1_HEALING_PRD.md` 第 6 节验收标准逐项打勾
- 当前进度：🚧 清单已就绪（2026-03-18）
  - 已新增验收清单：`docs/V1_ACCEPTANCE_CHECKLIST.md`
  - 已新增开发侧自检报告：`docs/PHASE3_SELF_CHECK_REPORT_2026-03-18.md`
