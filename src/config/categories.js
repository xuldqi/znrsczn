// 文章分类配置
export const ARTICLE_CATEGORIES = [
  { id: 'family', name: '家庭关系', color: '#ec4899', description: '家庭和睦，关系处理' },
  { id: 'career', name: '职场发展', color: '#2563eb', description: '职业规划，技能提升' },
  { id: 'psychology', name: '心理健康', color: '#7c3aed', description: '心理调节，情绪管理' },
  { id: 'interests', name: '兴趣爱好', color: '#f59e0b', description: '培养兴趣，丰富生活' },
  { id: 'life-skills', name: '生活技能', color: '#7c3aed', description: '实用技能，生活窍门' },
  { id: 'finance', name: '财务管理', color: '#10b981', description: '理财规划，投资指导' },
  { id: 'side-business', name: '副业指南', color: '#06b6d4', description: '副业选择，增收方法' },
  { id: 'midlife-crisis', name: '中年危机', color: '#ef4444', description: '危机应对，心理建设' },
  { id: 'transformation', name: '转型升级', color: '#64748b', description: '转型指导，能力升级' }
]

// 获取分类名称列表
export const getCategoryNames = () => ARTICLE_CATEGORIES.map(cat => cat.name)

// 根据名称获取分类信息
export const getCategoryByName = (name) => ARTICLE_CATEGORIES.find(cat => cat.name === name)

// 根据ID获取分类信息
export const getCategoryById = (id) => ARTICLE_CATEGORIES.find(cat => cat.id === id)

// 获取分类颜色
export const getCategoryColor = (name) => {
  const category = getCategoryByName(name)
  return category ? category.color : '#666666'
}