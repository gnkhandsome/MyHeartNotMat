// app.js
import { getThemeById, getThemeTypeById, THEME_STYLE_TYPES } from './theme.config.js';

const SCENE_SOUND_PROFILES = {
  sunny: {
    tracks: [
      { src: '/static/audio/morning_birds.mp3', weight: 0.62, role: 'accent' },
      { src: '/static/audio/soft_wind.mp3', weight: 0.38, role: 'bed' }
    ]
  },
  cloudy: {
    tracks: [
      { src: '/static/audio/soft_wind.mp3', weight: 0.72, role: 'bed' },
      { src: '/static/audio/obsidian_hum.mp3', weight: 0.28, role: 'accent' }
    ]
  },
  rainy: {
    tracks: [
      { src: '/static/audio/thunder_rain.mp3', weight: 0.78, role: 'bed' },
      { src: '/static/audio/rain_leaf.mp3', weight: 0.34, role: 'accent' }
    ]
  },
  windy: {
    tracks: [
      { src: '/static/audio/autumn_leaves.mp3', weight: 0.66, role: 'bed' },
      { src: '/static/audio/aurora_wind.mp3', weight: 0.38, role: 'accent' }
    ]
  },
  snowy: {
    tracks: [
      { src: '/static/audio/ice_wind.mp3', weight: 0.66, role: 'bed' },
      { src: '/static/audio/night_signal.mp3', weight: 0.3, role: 'accent' }
    ]
  },
  stream: {
    tracks: [
      { src: '/static/audio/sea_waves.mp3', weight: 0.62, role: 'bed' },
      { src: '/static/audio/morning_birds.mp3', weight: 0.36, role: 'accent' }
    ]
  }
};

function resolveSceneTrackRoleGain(track = {}, intensity = 0.65) {
  const safeIntensity = Math.min(1, Math.max(0.2, Number(intensity) || 0.65));
  const role = track.role || 'balanced';

  if (role === 'bed') {
    // 底噪在低强度下也要可感知，高强度时温和拉升
    return 0.55 + safeIntensity * 0.45;
  }

  if (role === 'accent') {
    // 点缀声在低强度更克制，高强度明显抬升层次
    return 0.12 + Math.pow(safeIntensity, 1.35) * 0.88;
  }

  return 0.35 + safeIntensity * 0.65;
}

App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
    // 初始化主题
    this.initTheme();
    // 初始化音频管理
    this.initAudioManager();
    this.initSceneAudioManager();
  },
  
  onShow() {
    // 小程序显示时执行
    console.log('小程序显示');
    // 从存储读取主题ID
    this.loadThemeFromStorage();
  },
  
  onHide() {
    // 小程序隐藏时执行
    console.log('小程序隐藏');
    this.persistAudioState();
  },
  
  // 初始化主题
  initTheme() {
    try {
      const themeId = wx.getStorageSync('themeId') || 0;
      this.syncThemeState(themeId, {
        persist: false,
        switchAudio: false
      });
    } catch (e) {
      console.error('初始化主题失败:', e);
      this.syncThemeState(0, {
        persist: false,
        switchAudio: false
      });
    }
  },

  // 获取统一主题状态
  getThemeState() {
    if (!this.globalData.theme) {
      this.syncThemeState(0, {
        persist: false,
        switchAudio: false
      });
    }

    return {
      theme: this.globalData.theme,
      themeId: this.globalData.themeId,
      activeThemeType: this.globalData.activeThemeType
    };
  },

  // 获取统一音频状态
  getAudioState() {
    return {
      isAudioPlaying: !!this.globalData.isAudioPlaying,
      audioVolume: Number(this.globalData.audioVolume ?? 0.5),
      currentAudioSrc: this.globalData.currentAudioSrc || this.getResolvedAudioSrc()
    };
  },

  getSceneAudioState() {
    return {
      sceneKey: this.globalData.sceneAudioProfileKey || 'rainy',
      sceneIntensity: Number(this.globalData.sceneAudioIntensity ?? 0.65),
      sceneEnabled: this.globalData.sceneAudioEnabled !== false
    };
  },

  // 统一同步主题状态
  syncThemeState(themeId, options = {}) {
    const {
      persist = true,
      switchAudio = true
    } = options;

    const resolvedThemeId = Number.isInteger(themeId) ? themeId : 0;
    const theme = getThemeById(resolvedThemeId);

    this.globalData.theme = theme;
    this.globalData.themeId = theme.id;
    this.globalData.activeThemeType = getThemeTypeById(theme.id);

    if (persist) {
      wx.setStorageSync('themeId', theme.id);
    }

    if (switchAudio) {
      this.switchAudio(theme.audioSrc);
    }

    return this.getThemeState();
  },
  
  // 从存储加载主题
  loadThemeFromStorage() {
    const themeId = wx.getStorageSync('themeId') || 0;
    if (themeId !== this.globalData.themeId) {
      this.syncThemeState(themeId, {
        persist: false,
        switchAudio: true
      });
    }
  },
  
  // 切换主题
  switchTheme(themeId) {
    return this.syncThemeState(themeId, {
      persist: true,
      switchAudio: true
    });
  },
  
  // 初始化音频管理
  initAudioManager() {
    const audioContext = wx.createInnerAudioContext();
    const storedVolume = Number(wx.getStorageSync('audioVolume'));
    const storedAudioPlaying = wx.getStorageSync('audioPlaying');

    this.globalData.audioContext = audioContext;
    this.globalData.audioVolume = Number.isFinite(storedVolume)
      ? Math.min(1, Math.max(0, storedVolume))
      : 0.5;
    this.globalData.isAudioPlaying = typeof storedAudioPlaying === 'boolean'
      ? storedAudioPlaying
      : false;

    audioContext.loop = true;
    audioContext.volume = this.globalData.audioVolume;
    this.globalData.currentAudioSrc = null;

    // 统一使用根目录白噪音（临时 V1 方案）
    const initialThemeState = this.getThemeState();
    const initialAudioSrc = this.getResolvedAudioSrc(initialThemeState.theme?.audioSrc);
    audioContext.src = initialAudioSrc;
    this.globalData.currentAudioSrc = initialAudioSrc;
    if (this.globalData.isAudioPlaying) {
      audioContext.play();
    }
    
    // 音频异常处理
    audioContext.onError((res) => {
      console.error('音频播放错误:', res);
      wx.showToast({
        title: '音频播放失败',
        icon: 'none'
      });
    });

    audioContext.onPlay(() => {
      this.setAudioPlayingState(true);
    });

    audioContext.onPause(() => {
      this.setAudioPlayingState(false);
    });

    audioContext.onStop(() => {
      this.setAudioPlayingState(false);
    });
    
    // 音频加载完成
    audioContext.onCanplay(() => {
      console.log('音频加载完成');
    });
    
    // 音频播放结束
    audioContext.onEnded(() => {
      console.log('音频播放结束');
      this.setAudioPlayingState(false);
    });

    this.persistAudioState();
  },

  getResolvedAudioSrc() {
    return '/raining.mp3';
  },

  getSceneProfile(sceneKey = 'rainy') {
    return SCENE_SOUND_PROFILES[sceneKey] || SCENE_SOUND_PROFILES.rainy;
  },

  initSceneAudioManager() {
    const contexts = [];
    for (let i = 0; i < 2; i += 1) {
      const ctx = wx.createInnerAudioContext();
      ctx.loop = true;
      ctx.autoplay = false;
      ctx.obeyMuteSwitch = true;
      ctx.volume = 0;
      ctx.__trackIndex = i;
      ctx.__fallbackApplied = false;
      ctx.onError(() => {
        if (!ctx.__fallbackApplied) {
          ctx.__fallbackApplied = true;
          ctx.src = '/raining.mp3';
          if (this.globalData.isAudioPlaying && this.globalData.sceneAudioEnabled !== false) {
            ctx.play();
          }
        }
      });
      contexts.push(ctx);
    }

    this.globalData.sceneAudioContexts = contexts;
    this.globalData.sceneAudioProfileKey = 'rainy';
    const storedIntensity = Number(wx.getStorageSync('homeSceneIntensity'));
    this.globalData.sceneAudioIntensity = Number.isFinite(storedIntensity)
      ? Math.min(1, Math.max(0.2, storedIntensity / 100))
      : 0.65;
    this.globalData.sceneAudioEnabled = true;

    this.setSceneSoundscape('rainy', {
      intensity: this.globalData.sceneAudioIntensity,
      autoPlay: false
    });
  },

  setSceneIntensity(intensity = 0.65, options = {}) {
    const { persist = true } = options;
    const safe = Math.min(1, Math.max(0.2, Number(intensity) || 0.65));
    this.globalData.sceneAudioIntensity = safe;
    this.applySceneAudioVolumes();
    if (persist) {
      wx.setStorageSync('homeSceneIntensity', Math.round(safe * 100));
    }
    return safe;
  },

  applySceneAudioVolumes() {
    const contexts = this.globalData.sceneAudioContexts || [];
    if (!contexts.length) return;

    const profile = this.getSceneProfile(this.globalData.sceneAudioProfileKey);
    const sceneIntensity = Number(this.globalData.sceneAudioIntensity) || 0.65;
    const baseVolume = (Number(this.globalData.audioVolume) || 0.5) * sceneIntensity;
    const enabled = this.globalData.sceneAudioEnabled !== false;

    contexts.forEach((ctx, index) => {
      const track = (profile.tracks && profile.tracks[index]) || {};
      const weight = Number(track.weight || 0);
      const roleGain = resolveSceneTrackRoleGain(track, sceneIntensity);
      const target = enabled ? Math.min(1, Math.max(0, baseVolume * weight * roleGain)) : 0;
      ctx.volume = target;
    });
  },

  setSceneSoundscape(sceneKey = 'rainy', options = {}) {
    const {
      intensity,
      autoPlay = true,
      enabled = true
    } = options;

    const profileKey = SCENE_SOUND_PROFILES[sceneKey] ? sceneKey : 'rainy';
    const profile = this.getSceneProfile(profileKey);
    const contexts = this.globalData.sceneAudioContexts || [];
    if (!contexts.length) return;

    this.globalData.sceneAudioProfileKey = profileKey;
    this.globalData.sceneAudioEnabled = enabled;
    if (typeof intensity === 'number') {
      this.setSceneIntensity(intensity, { persist: true });
    }

    contexts.forEach((ctx, index) => {
      const track = profile.tracks[index];
      if (!track) {
        ctx.stop();
        return;
      }
      if (ctx.src !== track.src) {
        ctx.__fallbackApplied = false;
        ctx.src = track.src;
      }
    });

    this.applySceneAudioVolumes();

    if (this.globalData.isAudioPlaying && autoPlay && enabled) {
      contexts.forEach((ctx) => ctx.play());
    }
  },

  pauseSceneAudio() {
    const contexts = this.globalData.sceneAudioContexts || [];
    contexts.forEach((ctx) => ctx.pause());
  },

  resumeSceneAudio() {
    const contexts = this.globalData.sceneAudioContexts || [];
    if (!contexts.length || this.globalData.sceneAudioEnabled === false) return;
    this.applySceneAudioVolumes();
    contexts.forEach((ctx) => ctx.play());
  },

  persistAudioState() {
    wx.setStorageSync('audioVolume', this.globalData.audioVolume);
    wx.setStorageSync('audioPlaying', this.globalData.isAudioPlaying);
  },

  setAudioPlayingState(isPlaying) {
    this.globalData.isAudioPlaying = !!isPlaying;
    this.persistAudioState();
  },

  setAudioVolume(volume, options = {}) {
    const { persist = true } = options;
    const safeVolume = Math.min(1, Math.max(0, Number(volume) || 0));
    this.globalData.audioVolume = safeVolume;

    if (this.globalData.audioContext) {
      this.globalData.audioContext.volume = safeVolume;
    }

    this.applySceneAudioVolumes();

    if (persist) {
      this.persistAudioState();
    }

    return safeVolume;
  },
  
  // 切换音频
  switchAudio(audioSrc) {
    const targetAudioSrc = this.getResolvedAudioSrc(audioSrc);
    if (!this.globalData.audioContext) return;
    if (this.globalData.currentAudioSrc === targetAudioSrc) {
      if (this.globalData.isAudioPlaying) {
        const audioContext = this.globalData.audioContext;
        const targetVolume = this.globalData.audioVolume;
        if (Math.abs((audioContext.volume ?? 0) - targetVolume) > 0.01) {
          this.clearAudioFadeTimers();
          this.fadeAudioVolume(audioContext.volume, targetVolume);
        }
      }
      return;
    }
    
    const audioContext = this.globalData.audioContext;
    const shouldAutoPlay = this.globalData.isAudioPlaying;
    this.clearAudioFadeTimers();
    
    // 非播放态只切换 source，不触发自动播放
    if (!shouldAutoPlay) {
      audioContext.stop();
      audioContext.src = targetAudioSrc;
      this.globalData.currentAudioSrc = targetAudioSrc;
      return;
    }

    // 淡入淡出切换
    if (this.globalData.currentAudioSrc) {
      let volume = audioContext.volume;
      this.globalData.fadeOutTimer = setInterval(() => {
        volume -= 0.1;
        if (volume <= 0) {
          clearInterval(this.globalData.fadeOutTimer);
          this.globalData.fadeOutTimer = null;
          audioContext.stop();
          this.playAudio(targetAudioSrc);
        } else {
          audioContext.volume = volume;
        }
      }, 100);
    } else {
      this.playAudio(targetAudioSrc);
    }
  },

  clearAudioFadeTimers() {
    if (this.globalData.fadeOutTimer) {
      clearInterval(this.globalData.fadeOutTimer);
      this.globalData.fadeOutTimer = null;
    }

    if (this.globalData.fadeInTimer) {
      clearInterval(this.globalData.fadeInTimer);
      this.globalData.fadeInTimer = null;
    }
  },

  fadeAudioVolume(fromVolume, toVolume, options = {}) {
    const {
      step = 0.08,
      interval = 80,
      onComplete
    } = options;

    const audioContext = this.globalData.audioContext;
    if (!audioContext) {
      if (onComplete) onComplete();
      return;
    }

    let current = Math.min(1, Math.max(0, Number(fromVolume) || 0));
    const target = Math.min(1, Math.max(0, Number(toVolume) || 0));
    const delta = target >= current ? Math.abs(step) : -Math.abs(step);

    this.globalData.fadeInTimer = setInterval(() => {
      current += delta;
      const reachedTarget = delta > 0 ? current >= target : current <= target;
      audioContext.volume = reachedTarget ? target : current;

      if (reachedTarget) {
        clearInterval(this.globalData.fadeInTimer);
        this.globalData.fadeInTimer = null;
        if (onComplete) onComplete();
      }
    }, interval);
  },
  
  // 播放音频
  playAudio(audioSrc) {
    if (!this.globalData.audioContext) return;
    const audioContext = this.globalData.audioContext;
    const targetAudioSrc = this.getResolvedAudioSrc(audioSrc);

    this.clearAudioFadeTimers();
    audioContext.src = targetAudioSrc;
    audioContext.volume = 0;
    audioContext.play();
    
    // 淡入
    this.fadeAudioVolume(0, this.globalData.audioVolume);
    
    this.globalData.currentAudioSrc = targetAudioSrc;
    this.setAudioPlayingState(true);
  },
  
  // 暂停音频
  pauseAudio() {
    if (this.globalData.audioContext) {
      this.clearAudioFadeTimers();
      this.globalData.audioContext.pause();
      this.setAudioPlayingState(false);
    }
    this.pauseSceneAudio();
  },
  
  // 恢复音频
  resumeAudio() {
    if (this.globalData.audioContext) {
      const targetSrc = this.globalData.currentAudioSrc || this.getResolvedAudioSrc();
      if (!this.globalData.currentAudioSrc) {
        this.globalData.audioContext.src = targetSrc;
        this.globalData.currentAudioSrc = targetSrc;
      }
      this.globalData.audioContext.volume = this.globalData.audioVolume;
      this.globalData.audioContext.play();
      this.setAudioPlayingState(true);
    }
    this.resumeSceneAudio();
  },

  // 播放/暂停切换
  toggleAudio() {
    if (this.globalData.isAudioPlaying) {
      this.pauseAudio();
      return false;
    }
    this.resumeAudio();
    return true;
  },

  // 粉碎音效（一次性）
  playShatterSfx(audioSrc = '/raining.mp3') {
    try {
      if (!this.globalData.shatterAudioContext) {
        this.globalData.shatterAudioContext = wx.createInnerAudioContext();
        this.globalData.shatterAudioContext.loop = false;
      }

      const sfx = this.globalData.shatterAudioContext;
      sfx.stop();
      sfx.src = audioSrc;
      sfx.volume = Math.min(1, Math.max(0, this.globalData.audioVolume || 0.5));
      sfx.play();
    } catch (e) {
      console.error('播放粉碎音效失败:', e);
    }
  },

  // 删除接口模拟（后续可替换真实 API）
  deleteContentItem(payload = {}) {
    const { id = '', type = 'post' } = payload;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          id,
          type,
          message: 'deleted'
        });
      }, 240);
    });
  },
  
  globalData: {
    userInfo: null,
    theme: null,
    themeId: 0,
    activeThemeType: THEME_STYLE_TYPES.FEMALE,
    audioContext: null,
    currentAudioSrc: null,
    audioVolume: 0.5,
    isAudioPlaying: false,
    fadeOutTimer: null,
    fadeInTimer: null,
    shatterAudioContext: null,
    sceneAudioContexts: [],
    sceneAudioProfileKey: 'rainy',
    sceneAudioIntensity: 0.65,
    sceneAudioEnabled: true
  }
});