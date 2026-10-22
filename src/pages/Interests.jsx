import { useMemo } from 'react'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const Interests = () => {
  const { getAllArticles } = useArticles()

  const articles = useMemo(() => {
    return getAllArticles()
      .filter(a => a.category === '兴趣爱好' && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const tags = ['深度阅读', '独处放空', '户外徒步', '手工制作', '心流体验']

  return (
    <ColumnLayout
      columnTitle="热爱与心流"
      columnTag="心灵充电"
      columnSummary="中年人需要至少一项不以功利赚钱为目的的纯粹热爱。在专注的心流中阻断外部杂音，为干涸的精神世界持续注水。"
      columnHighlight="纯粹爱好不考核产出、不打卡变现；它是成年人唯一可以合法合理脱离功利世界的避风港。"
      articles={articles}
      tags={tags}
    />
  )
}

export default Interests
