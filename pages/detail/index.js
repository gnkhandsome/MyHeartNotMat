import {
  THEMES,
  getThemeById
} from '../../theme.config.js';
import { callCloud } from '../../utils/cloud.js';

function resolveSemanticTextPalette(theme = {}) {
  const parseColorToRgb = (color = '') => {
    const value = String(color || '').trim();
    if (!value) return null;

    if (value.startsWith('#')) {
      const hex = value.slice(1);
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        };
      }
      if (hex.length >= 6) {
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16)
        };
      }
      return null;
    }

    const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
    if (!rgbMatch) return null;
    const [r, g, b] = rgbMatch[1].split(',').map((item) => Number(item.trim()));
    if (![r, g, b].every(Number.isFinite)) return null;
    return { r, g, b };
  };

  const isDarkColor = (color = '') => {
    const rgb = parseColorToRgb(color);
    if (!rgb) return false;
    const { r, g, b } = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.52;
  };

  const darkBg = isDarkColor(theme.bgColor);
  const darkPrimary = isDarkColor(theme.primaryColor);
  const body = theme.bodyTextColor || theme.textColor || '#334155';
  return {
    title: theme.titleTextColor || (darkBg ? '#F8FAFC' : '#1F2937'),
    body,
    subtitle: theme.subtitleTextColor || (darkBg ? '#CBD5E1' : '#64748B'),
    tertiary: theme.tertiaryTextColor || '#94A3B8',
    inverse: theme.inverseTextColor || (darkPrimary ? '#FFFFFF' : '#0F172A')
  };
}

Page({
  data: {
    theme: THEMES[0],
    textPalette: resolveSemanticTextPalette(THEMES[0]),
    post: null,
    comments: [],
    isOwnerPost: false,
    isEditing: false,
    commentText: '',
    replyTo: null,
    menuButtonInfo: null,
    inputFocus: false
  },

  onReady() {
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    this.setData({ menuButtonInfo });
  },

  truncateTitle(title) {
    // 直接返回完整标题，不再截断
    return title;
  },

  onLoad(options = {}) {
    const post = this.parsePostPayload(options.payload);
    const isOwnerPost = this.resolveIsOwnerPost(post);
    const scenePackage = post.scenePackage || {};
    const themeId = Number(scenePackage.themeId);
    const theme = Number.isFinite(themeId) ? getThemeById(themeId) : this.getThemeFromGlobal();

    // 从存储中读取点赞和收藏状态
    let isLiked = post.isLiked;
    let isCollected = post.isCollected;
    
    try {
      const likedPostIds = wx.getStorageSync('likedPostIds') || [];
      const collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      
      if (likedPostIds.includes(post.id)) {
        isLiked = true;
      }
      if (collectedPostIds.includes(post.id)) {
        isCollected = true;
      }
    } catch (e) {
      console.error('读取交互状态失败:', e);
    }

    const displayPost = {
      ...post,
      isLiked,
      isCollected,
      displayTitle: this.truncateTitle(post.title),
      showTitleInNav: false  // 不再显示顶部标题
    };

    // 从本地存储加载评论
    let comments = this.loadCommentsFromStorage(post.id);
    if (comments.length === 0) {
      comments = this.buildComments(post);
    }

    this.setData({
      theme,
      textPalette: resolveSemanticTextPalette(theme),
      post: displayPost,
      isOwnerPost,
      comments
    });

    this.updateNavigationBarColor();
  },

  goBack() {
    wx.navigateBack();
  },

  resolveIsOwnerPost(post = {}) {
    if (post.isOwner === true) return true;
    const sourceTab = String(post.sourceTab || '');
    return ['my', 'post', 'diary', 'writing'].includes(sourceTab);
  },

  getThemeFromGlobal() {
    try {
      const app = getApp();
      const state = app.getThemeState ? app.getThemeState() : null;
      return (state && state.theme) || app.globalData.theme || THEMES[0];
    } catch (e) {
      return THEMES[0];
    }
  },

  parsePostPayload(payload) {
    try {
      if (!payload) throw new Error('missing payload');
      const decoded = decodeURIComponent(payload);
      const parsed = JSON.parse(decoded);
      return parsed || {};
    } catch (e) {
      return {
        id: `fallback-${Date.now()}`,
        type: 'diary',
        typeLabel: '日记',
        typeIcon: '📔',
        content: '未找到内容，已为你展示默认详情。',
        time: '刚刚',
        scenePackage: { sceneKey: 'rainy', sceneIntensity: 65 }
      };
    }
  },

  onToggleEditMode() {
    if (!this.data.isOwnerPost) return;
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  onSavePostEdit() {
    if (!this.data.isOwnerPost) return;
    const content = String(this.data.post && this.data.post.content || '').trim();
    if (!content) {
      wx.showToast({ title: '内容不能为空', icon: 'none' });
      return;
    }
    this.setData({
      isEditing: false,
      'post.content': content
    });
    wx.showToast({
      title: '已保存修改',
      icon: 'success'
    });
  },

  onPostContentInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.content': e.detail.value
    });
  },

  onLetterSalutationInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.letterSalutation': e.detail.value
    });
  },

  onLetterSignatureInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.letterSignature': e.detail.value
    });
  },

  onPostcardLocationInput(e) {
    if (!this.data.isOwnerPost || !this.data.isEditing) return;
    this.setData({
      'post.postcardLocation': e.detail.value
    });
  },

  buildComments(post = {}) {
    if (Array.isArray(post.comments) && post.comments.length) {
      return post.comments.slice(0, 20);
    }
    // 不返回任何虚拟评论数据
    return [];
  },

  onToggleLike() {
    const post = this.data.post;
    if (!post) return;

    const newIsLiked = !post.isLiked;
    const newLikeCount = newIsLiked ? (post.likeCount || 0) + 1 : Math.max(0, (post.likeCount || 0) - 1);

    this.setData({
      'post.isLiked': newIsLiked,
      'post.likeCount': newLikeCount
    });

    this.syncToHomePage();
    this.saveLikedPostsToStorage();

    // 同步到云端（仅公开内容，后台异步执行，不影响本地显示）
    if (!post.isPrivate) {
      setTimeout(() => {
        callCloud('toggleLike', {
          postId: post.id,
          action: newIsLiked ? 'add' : 'remove'
        }, {
          silent: true
        })
          .then(({ result }) => {
            console.log('点赞同步到云端成功:', result);
          })
          .catch((err) => {
            console.error('点赞同步到云端失败:', err);
          });
      }, 0);
    }
  },

  onToggleCollect() {
    const post = this.data.post;
    if (!post) return;

    const newIsCollected = !post.isCollected;
    const newCollectCount = newIsCollected ? (post.collectCount || 0) + 1 : Math.max(0, (post.collectCount || 0) - 1);

    this.setData({
      'post.isCollected': newIsCollected,
      'post.collectCount': newCollectCount
    });

    this.syncToHomePage();
    this.saveCollectedPostsToStorage();

    // 同步到云端（仅公开内容，后台异步执行，不影响本地显示）
    if (!post.isPrivate) {
      setTimeout(() => {
        callCloud('toggleFavorite', {
          postId: post.id,
          action: newIsCollected ? 'add' : 'remove'
        }, {
          silent: true
        })
          .then(({ result }) => {
            console.log('收藏同步到云端成功:', result);
          })
          .catch((err) => {
            console.error('收藏同步到云端失败:', err);
          });
      }, 0);
    }
  },

  syncToHomePage() {
    const app = getApp();
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (prevPage && prevPage.route === 'pages/home/index') {
      const updatedPost = this.data.post;
      
      // 更新广场帖子列表
      if (prevPage.data.squarePostList) {
        const newSquareList = prevPage.data.squarePostList.map(item => {
          if (item.id === updatedPost.id) {
            return updatedPost;
          }
          return item;
        });
        prevPage.setData({ squarePostList: newSquareList });
      }
      
      // 更新 myDiaryList 列表
      if (prevPage.data.myDiaryList) {
        const newMyDiaryList = prevPage.data.myDiaryList.map(item => {
          if (item.id === updatedPost.id) {
            return updatedPost;
          }
          return item;
        });
        prevPage.setData({ myDiaryList: newMyDiaryList });
      }
      
      // 同步到全局数据
      if (app.globalData) {
        if (app.globalData.squarePostList) {
          app.globalData.squarePostList = app.globalData.squarePostList.map(item => {
            if (item.id === updatedPost.id) {
              return updatedPost;
            }
            return item;
          });
        }
        if (app.globalData.diaryList) {
          app.globalData.diaryList = app.globalData.diaryList.map(item => {
            if (item.id === updatedPost.id) {
              return updatedPost;
            }
            return item;
          });
        }
      }
      
      // 更新我的收藏和点赞列表
      if (prevPage.loadProfileLiked && prevPage.loadProfileFavorites) {
        prevPage.loadProfileLiked();
        prevPage.loadProfileFavorites();
      }
    }
  },

  saveLikedPostsToStorage() {
    try {
      const post = this.data.post;
      let likedPostIds = wx.getStorageSync('likedPostIds') || [];
      
      if (post.isLiked) {
        if (!likedPostIds.includes(post.id)) {
          likedPostIds.push(post.id);
        }
      } else {
        likedPostIds = likedPostIds.filter(id => id !== post.id);
      }
      
      wx.setStorageSync('likedPostIds', likedPostIds);
    } catch (e) {
      console.error('保存点赞状态失败:', e);
    }
  },

  saveCollectedPostsToStorage() {
    try {
      const post = this.data.post;
      let collectedPostIds = wx.getStorageSync('collectedPostIds') || [];
      
      if (post.isCollected) {
        if (!collectedPostIds.includes(post.id)) {
          collectedPostIds.push(post.id);
        }
      } else {
        collectedPostIds = collectedPostIds.filter(id => id !== post.id);
      }
      
      wx.setStorageSync('collectedPostIds', collectedPostIds);
      
      const app = getApp();
      if (app.globalData) {
        let collectedPosts = app.globalData.collectedPosts || [];
        
        if (post.isCollected) {
          if (!collectedPosts.find(p => p.id === post.id)) {
            collectedPosts.unshift(post);
          }
        } else {
          collectedPosts = collectedPosts.filter(p => p.id !== post.id);
        }
        
        app.globalData.collectedPosts = collectedPosts;
      }
    } catch (e) {
      console.error('保存收藏状态失败:', e);
    }
  },

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  onCommentBlur() {
    this.setData({ inputFocus: false });
  },

  onReplyToComment(e) {
    const comment = e.currentTarget.dataset.comment;
    this.setData({ 
      replyTo: comment,
      commentText: '',
      inputFocus: true
    });
  },

  cancelReply() {
    this.setData({ 
      replyTo: null,
      commentText: ''
    });
  },



  // 从本地存储加载评论
  loadCommentsFromStorage(postId) {
    try {
      const commentsData = wx.getStorageSync(`comments_${postId}`);
      return commentsData || [];
    } catch (e) {
      console.error('加载评论失败:', e);
      return [];
    }
  },

  // 保存评论到本地存储
  saveCommentsToStorage(postId, comments) {
    try {
      wx.setStorageSync(`comments_${postId}`, comments);
      console.log('评论保存到本地存储成功');
    } catch (e) {
      console.error('保存评论失败:', e);
    }
  },

  updateNavigationBarColor() {
    const { theme } = this.data;
    if (theme && theme.bgColor) {
      const rgb = (() => {
        const value = String(theme.bgColor || '').trim();
        if (value.startsWith('#')) {
          const hex = value.slice(1);
          if (hex.length === 3) {
            return {
              r: parseInt(hex[0] + hex[0], 16),
              g: parseInt(hex[1] + hex[1], 16),
              b: parseInt(hex[2] + hex[2], 16)
            };
          }
          if (hex.length >= 6) {
            return {
              r: parseInt(hex.slice(0, 2), 16),
              g: parseInt(hex.slice(2, 4), 16),
              b: parseInt(hex.slice(4, 6), 16)
            };
          }
        }
        const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
        if (!rgbMatch) return null;
        const [r, g, b] = rgbMatch[1].split(',').map((item) => Number(item.trim()));
        if (![r, g, b].every(Number.isFinite)) return null;
        return { r, g, b };
      })();
      const isDarkBg = rgb
        ? ((0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255) < 0.52
        : false;
      wx.setNavigationBarColor({
        frontColor: isDarkBg ? '#ffffff' : '#000000',
        backgroundColor: theme.bgColor
      });
    }
  },

  // 修改sendComment函数，添加本地存储
  sendComment() {
    const commentText = this.data.commentText.trim();
    if (!commentText) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }

    const post = this.data.post;
    const replyTo = this.data.replyTo;
    const newComment = {
      id: `comment-${Date.now()}`,
      nickname: '我',
      content: commentText,
      time: '刚刚'
    };

    let newComments = [...this.data.comments];
    
    if (replyTo) {
      newComments = newComments.map(comment => {
        if (comment.id === replyTo.id) {
          const replies = comment.replies || [];
          return {
            ...comment,
            replies: [...replies, {
              id: `reply-${Date.now()}`,
              nickname: '我',
              content: commentText,
              time: '刚刚',
              toUser: replyTo.nickname
            }]
          };
        }
        return comment;
      });
    } else {
      newComments.unshift(newComment);
    }

    this.setData({
      comments: newComments,
      commentText: '',
      replyTo: null
    });

    // 保存评论到本地存储
    this.saveCommentsToStorage(post.id, newComments);

    wx.showToast({ title: '评论成功', icon: 'success' });
    
    // 同步到云端（仅公开内容，后台异步执行，不影响本地显示）
    if (!post.isPrivate) {
      setTimeout(() => {
        callCloud('createComment', {
          postId: post.id,
          content: commentText,
          replyTo: replyTo ? replyTo.id : null,
          replyToNickname: replyTo ? replyTo.nickname : null
        }, {
          silent: true
        })
          .then(({ result }) => {
            console.log('评论同步到云端成功:', result);
          })
          .catch((err) => {
            console.error('评论同步到云端失败:', err);
          });
      }, 0);
    }
  }
});
