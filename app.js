// app.js
import { getThemeById, getThemeTypeById, THEME_STYLE_TYPES } from './theme.config.js';

App({
  onLaunch() {
    // 小程序启动时执行
    console.log('小程序启动');
    // 初始化主题
    this.initTheme();
    // 初始化音频管理
    this.initAudioManager();
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
    shatterAudioContext: null
  }
});