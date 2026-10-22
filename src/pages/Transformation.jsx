import { useMemo } from 'react'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const Transformation = () => {
  const { getAllArticles } = useArticles()

  const articles = useMemo(() => {
    return getAllArticles()
      .filter(a => a.category === '转型升级' && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const tags = ['职业转型', '技能重构', '第二曲线', '经验复用', 'AI工具赋能']

  return (
    <ColumnLayout
      columnTitle="转型与第二曲线"
      columnTag="突围升级"
      columnSummary="中年转型绝非抛弃过往一切平地起高楼，而是将积累多年的行业深度、协作经验与人脉资产移植到新的高附加值赛道。"
      columnHighlight="转型的铁律：带着存量做增量，先兼职验证、拿到陌生客户付费后，再考虑全职切换赛道。"
      articles={articles}
      tags={tags}
    />
  )
}

export default Transformation
