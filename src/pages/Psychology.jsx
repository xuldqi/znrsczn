import { useMemo } from 'react'
import { Typography, Paper, Box, Stack } from '@mui/material'
import { PsychologyOutlined as PsychologyIcon } from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const Psychology = () => {
  const { getAllArticles } = useArticles()

  const psychologyArticles = useMemo(() => {
    return getAllArticles()
      .filter(a => ['心理健康', '中年危机'].includes(a.category) && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const psychologyTags = [
    '焦虑脱敏',
    '中年危机',
    '精力管理',
    '情绪止损',
    '睡眠调节',
    '自我接纳'
  ]

  const psychologySidebarWidget = (
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
        <PsychologyIcon sx={{ color: '#0f766e', fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
          中年内耗急救准则
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            1. 区分“可控”与“不可控”
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            行业周期与大厂裁员不可控，但今日的简历刷新、身体锻炼与现金流记账完全在自我掌控之中。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            2. 给担忧设定固定时间段
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            每天只允许自己焦虑 15 分钟（如傍晚 5:00-5:15），一旦时间结束，立刻投入具体事务。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            3. 精力管理优先于时间管理
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            中年身体机能下滑，戒除报复性熬夜，保证 7 小时深度睡眠是最低成本的大脑自救。
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )

  return (
    <ColumnLayout
      columnTitle="心理与内耗"
      columnTag="心智防御"
      columnSummary="中年危机的本质是不确定性激增与既有价值感的动摇。学习科学的焦虑脱敏、精力管理、失眠调节与情绪止损技巧，在动荡期守住内心的定力。"
      columnHighlight="接纳不确定性；停止过度内耗自责；关注微小的当下掌控感；规律运动与高质量睡眠是最高回报的心智投资。"
      articles={psychologyArticles}
      tags={psychologyTags}
      sidebarWidget={psychologySidebarWidget}
    />
  )
}

export default Psychology
