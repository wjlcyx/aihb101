// 先定义类型
export type TimeFormat = 'iso' | 'relative' | 'formatted';

// 导出函数
export const genUniseq = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${timestamp}-${random}`;
};

export const getIsoTimestr = (): string => {
  return new Date().toISOString();
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
};

export const getRelativeTime = (isoString: string): string => {
  const current = Date.now();
  const target = new Date(isoString).getTime();
  const diff = current - target;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  
  return formatDateTime(isoString);
};

// 默认导出（可选）
export default {
  genUniseq,
  getIsoTimestr,
  formatDateTime,
  getRelativeTime
};