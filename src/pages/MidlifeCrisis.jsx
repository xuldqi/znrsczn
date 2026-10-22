import { useMemo } from 'react'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const MidlifeCrisis = () => {
  const { getAllArticles } = useArticles()

  const articles = useMemo(() => {
    return getAllArticles()
      .filter(a => a.category === '中年危机' && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const tags = ['危机应对', '心理调适', '认知重塑', '精力分配', '走出低谷']

  return (
    <ColumnLayout
      columnTitle="中年危机解构"
      columnTag="心智破局"
      columnSummary="中年危机的本质是生活惯性的瓦解与多维角色的重压。正视危机信号，破除虚假完美主义，用战略收缩与小步快跑重建秩序。"
      columnHighlight="不要在情绪低谷期做出重大绝收决策；先稳住现金流与健康基本盘，给自我留出 3~6 个月的观察缓冲期。"
      articles={articles}
      tags={tags}
    />
  )
}

export default MidlifeCrisis
