import { useMemo } from 'react'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const LifeSkills = () => {
  const { getAllArticles } = useArticles()

  const articles = useMemo(() => {
    return getAllArticles()
      .filter(a => a.category === '生活技能' && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const tags = ['时间管理', '健康自律', '居住整理', '精力分配', '生活节奏']

  return (
    <ColumnLayout
      columnTitle="生活掌控力"
      columnTag="基石日常"
      columnSummary="生活琐事的失控往往是中年失焦的开始。通过结构化日程、极简生活动线与高效精力分配，打造支撑全家运转的稳固后方。"
      columnHighlight="建立日常最小行动阻力：精简决策疲劳，用固化流程接管琐碎日常，把有限心力留给核心战略。"
      articles={articles}
      tags={tags}
    />
  )
}

export default LifeSkills
