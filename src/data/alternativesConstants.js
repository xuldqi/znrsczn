// 免费分级元数据与辅助函数 (严格遵守无 Unicode Emoji 规范)
export const FREE_TIER_META = {
  1: {
    level: 1,
    label: 'L1 永久免费',
    shortLabel: '永久免费',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    description: '开源、代码公开、不收割变相收费，永久可用'
  },
  2: {
    level: 2,
    label: 'L2 本地免费',
    shortLabel: '本地免费',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    description: '本地使用完全免费，云端同步/高级服务需付费'
  },
  3: {
    level: 3,
    label: 'L3 免费额度',
    shortLabel: '免费额度',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    description: '提供日常可用免费额度，超出限额后需付费'
  },
  4: {
    level: 4,
    label: 'L4 低价平替',
    shortLabel: '低价平替',
    color: '#ea580c',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    description: '非完全免费，但比原版便宜 70%+，无强制连环订阅'
  },
  5: {
    level: 5,
    label: 'L5 试用/限时',
    shortLabel: '试用/限时',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    description: '公测期/限时免费或学生特惠，政策随时可能变更'
  }
}

// 真相雷达状态元数据
export const PRICING_STATUS_META = {
  free: { label: '免费', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  freemium: { label: '部分免费', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  paid: { label: '收费', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  self_host: { label: '可自部署', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' }
}

export const PRICING_ROW_LABELS = {
  core: '核心功能',
  sync: '云端同步',
  ai: 'AI / 高级能力',
  export: '数据导出',
  collab: '团队协作'
}

export const DIFFICULTY_LABELS = {
  low: { label: '难度：小白可上手', color: '#059669', bg: '#ecfdf5' },
  medium: { label: '难度：需要些耐心', color: '#d97706', bg: '#fffbeb' },
  high: { label: '难度：极客折腾向', color: '#dc2626', bg: '#fef2f2' }
}

export const formatStars = (n) => {
  if (!n) return '0'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
