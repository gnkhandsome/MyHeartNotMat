# 天气场景音频素材接入指南（V1）

## 目标

先补齐 6 个场景的基础音频，让场景听感有明显差异。

## 项目内目标目录

`/static/audio/`

## 最小可用素材清单（建议先完成）

> 下面这些文件名已和当前代码对齐，下载后直接放进 `static/audio` 即可。

- `morning_birds.mp3`（鸟鸣）
- `soft_wind.mp3`（柔风底噪）
- `thunder_rain.mp3`（雨声主底噪）
- `rain_leaf.mp3`（雨滴点缀）
- `autumn_leaves.mp3`（风吹叶）
- `aurora_wind.mp3`（风声点缀）
- `ice_wind.mp3`（雪地风）
- `night_signal.mp3`（空灵夜氛围）
- `sea_waves.mp3`（水流/海浪底噪）
- `obsidian_hum.mp3`（阴天低频）

## 场景映射（当前代码）

- `sunny`: `morning_birds` + `soft_wind`
- `cloudy`: `soft_wind` + `obsidian_hum`
- `rainy`: `thunder_rain` + `rain_leaf`
- `windy`: `autumn_leaves` + `aurora_wind`
- `snowy`: `ice_wind` + `night_signal`
- `stream`: `sea_waves` + `morning_birds`

## 素材来源建议（可自行筛选同类）

- Mixkit 分类入口（下载前请确认其最新 License）：
  - Rain: https://mixkit.co/free-sound-effects/rain/
  - Wind: https://mixkit.co/free-sound-effects/wind/
  - Bird: https://mixkit.co/free-sound-effects/bird/
  - Rivers: https://mixkit.co/free-sound-effects/rivers/
  - Water: https://mixkit.co/free-sound-effects/water/
  - Ambience: https://mixkit.co/free-sound-effects/ambience/
  - Night: https://mixkit.co/free-sound-effects/night/

## 接入完成后自测

1. 打开小程序 → 写点页，依次切换 6 个场景。
2. 每个场景听 5-10 秒，确认不是同一种雨声。
3. 调整场景强度（20 / 65 / 100）确认层次变化。
4. 异常时看控制台是否有音频加载错误。
