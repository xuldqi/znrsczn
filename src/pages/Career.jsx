import { useMemo } from 'react'
import { Typography, Paper, Box, Stack } from '@mui/material'
import { BookmarkBorder as BookmarkIcon } from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const Career = () => {
  const { getAllArticles } = useArticles()

  const careerArticles = useMemo(() => {
    return getAllArticles()
      .filter(a => ['职场发展', '转型升级'].includes(a.category) && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const careerTags = [
    '35岁危机',
    '离职维权',
    '职场生存',
    '职业规划',
    '技能变现',
    '向上管理'
  ]

  const careerSidebarWidget = (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <BookmarkIcon sx={{ color: '#c2410c', fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
          职场变故 72h 应急要点
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            1. 绝不现场盲签协议
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            要求对方出具书面解约函，把协议草案带回家复核 N+1 与年假 300% 折算。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            2. 及时固化流水凭证
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            在公司内网权限注销前，备份近 12 个月银行工资流水与有效考勤通知。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            3. 失业金与医保接续
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            非自愿离职享受失业保险金，期间由失业基金直接代缴职工基本医疗保险。
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )

  return (
    <ColumnLayout
      columnTitle="职场突围战"
      columnTag="职场防线"
      columnSummary="35岁不是职场的终点，而是从单兵执行向策略决策与经验变现的重构期。专注于劳动权益法律防御、中年不可替代性建设与轻量职业拓展。"
      columnHighlight="绝不现场盲签解约函；离职前固化考勤与工资流水；按法律规定争取 N+1 与年假折现；申领失业金以由基金代缴社保医保。"
      articles={careerArticles}
      tags={careerTags}
      sidebarWidget={careerSidebarWidget}
    />
  )
}

export default Career
