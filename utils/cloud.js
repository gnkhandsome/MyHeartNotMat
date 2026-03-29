const DEFAULT_ERROR_MESSAGE_MAP = {
  40001: '请求参数有误',
  40002: '请求操作不合法',
  40301: '暂无权限执行此操作',
  40404: '内容不存在或已删除',
  40405: '目标状态不存在，请刷新后重试',
  40901: '操作重复，请勿重复提交',
  50000: '服务开小差了，请稍后重试',
  '-1': '网络异常，请稍后重试'
};

function getToastTitle(message = '') {
  const text = String(message || '').trim();
  if (!text) return '操作失败';
  // 避免 toast 文案过长影响展示
  return text.length > 16 ? `${text.slice(0, 16)}...` : text;
}

function showCloudErrorToast(message = '') {
  try {
    wx.showToast({
      title: getToastTitle(message),
      icon: 'none'
    });
  } catch (e) {
    // 兜底：在非页面上下文不阻断业务
    console.error('展示错误提示失败:', e);
  }
}

function resolveCloudErrorMessage({ code = 0, message = '', errorMessageMap = {} } = {}) {
  const normalizedCode = Number(code || 0);
  const mergedMap = {
    ...DEFAULT_ERROR_MESSAGE_MAP,
    ...(errorMessageMap || {})
  };

  const mapped = mergedMap[normalizedCode] || mergedMap[String(normalizedCode)];
  const rawMessage = String(message || '').trim();
  return mapped || rawMessage || '操作失败，请稍后再试';
}

export function normalizeCloudResult(res) {
  const result = (res && res.result) || {};
  const data = result.data || {};
  return {
    raw: res,
    result,
    success: !!result.success,
    code: Number(result.code || 0),
    message: result.message || '',
    data,
    rawMessage: result.message || ''
  };
}

export function callCloud(name, data = {}, options = {}) {
  const {
    silent = false,
    showErrorToast = !silent,
    errorMessageMap = {}
  } = options || {};

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        const normalized = normalizeCloudResult(res);
        if (normalized.success) {
          resolve(normalized);
        } else {
          const resolvedMessage = resolveCloudErrorMessage({
            code: normalized.code,
            message: normalized.message,
            errorMessageMap
          });

          const errorResult = {
            ...normalized,
            message: resolvedMessage
          };

          if (showErrorToast) {
            showCloudErrorToast(resolvedMessage);
          }

          reject(errorResult);
        }
      },
      fail: (err) => {
        const resolvedMessage = resolveCloudErrorMessage({
          code: -1,
          message: err?.errMsg || '云函数调用失败',
          errorMessageMap
        });

        const errorResult = {
          success: false,
          code: -1,
          message: resolvedMessage,
          error: err
        };

        if (showErrorToast) {
          showCloudErrorToast(resolvedMessage);
        }

        reject(errorResult);
      }
    });
  });
}