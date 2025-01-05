/**
 * 浏览器相关的工具函数
 */

/**
 * 检查当前环境是否为浏览器
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * 获取浏览器默认语言
 */
export const getBrowserLanguage = () => {
  if (!isBrowser) return 'en'
  return navigator.language.toLowerCase()
}

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string) => {
  if (!isBrowser) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('复制失败:', err)
    return false
  }
}

/**
 * 获取设备类型
 */
export const getDeviceType = () => {
  if (!isBrowser) return 'desktop'
  
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

/**
 * 检查是否为移动设备
 */
export const isMobile = () => {
  return getDeviceType() === 'mobile'
}

/**
 * 获取浏览器窗口大小
 */
export const getWindowDimensions = () => {
  if (!isBrowser) return { width: 0, height: 0 }
  
  const { innerWidth: width, innerHeight: height } = window
  return { width, height }
}

/**
 * 滚动到页面顶部
 */
export const scrollToTop = (smooth = true) => {
  if (!isBrowser) return
  
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * 检查是否支持某个 Web API
 */
export const isFeatureSupported = (feature: string) => {
  if (!isBrowser) return false
  return feature in window
}

/**
 * 获取本地存储数据
 */
export const getLocalStorage = (key: string) => {
  if (!isBrowser) return null
  try {
    return localStorage.getItem(key)
  } catch (err) {
    console.error('获取本地存储失败:', err)
    return null
  }
}

/**
 * 设置本地存储数据
 */
export const setLocalStorage = (key: string, value: string) => {
  if (!isBrowser) return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch (err) {
    console.error('设置本地存储失败:', err)
    return false
  }
}

/**
 * 生成唯一的设备ID
 */
const generateDeviceId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 获取或生成设备ID
 */
const getOrCreateDeviceId = () => {
  if (!isBrowser) return 'server-side';
  
  const storageKey = 'device_id';
  let deviceId = getLocalStorage(storageKey);
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    setLocalStorage(storageKey, deviceId);
  }
  
  return deviceId;
}

import FingerprintJS from "@fingerprintjs/fingerprintjs";

declare global {
  interface Window {
    __TAURI__?: unknown;
    __wxjs_environment?: unknown;
  }
}

/**
 * 获取设备信息
 */
const getDeviceInfo = async () => {
  const deviceType = getDeviceType();
  let osType = 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('windows')) osType = 'windows';
  else if (ua.includes('mac')) osType = 'mac';
  else if (ua.includes('linux')) osType = 'linux';
  else if (ua.includes('android')) osType = 'android';
  else if (ua.includes('ios')) osType = 'ios';
  
  return { deviceType, osType };
};

/**
 * 获取 User Agent
 */
const getUserAgent = () => {
  if (!isBrowser) return 'server-side';
  return navigator.userAgent;
};

/**
 * 获取浏览器指纹
 */
export const getFingerprint = async (): Promise<string> => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  
  return result.visitorId;
};

/**
 * 获取客户端信息
 */
export const getClientInfo = async () => {
  if (!isBrowser) {
    return {
      device_type: 'unknown',
      os_type: 'unknown',
      device_id: 'server-side',
      user_agent: 'server-side'
    };
  }

  const { deviceType, osType } = await getDeviceInfo();
  const deviceId = await getFingerprint();
  const userAgent = getUserAgent();

  const clientInfo = {
    device_type: deviceType,
    os_type: osType,
    device_id: deviceId,
    user_agent: userAgent
  };

  return clientInfo;
};
