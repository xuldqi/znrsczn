import { useMemo } from 'react'
import { Typography, Paper, Box, Stack } from '@mui/material'
import { MonetizationOnOutlined as MonetizationIcon } from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const SideBusiness = () => {
  const { getAllArticles } = useArticles()

  const sideArticles = useMemo(() => {
    return getAllArticles()
      .filter(a => a.category === '副业指南' && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const sideTags = [
    '技能变现',
    '咨询陪跑',
    '被动收入',
    '数字资产',
    '低成本试错',
    '知识付费'
  ]

  const sideSidebarWidget = (
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
        <MonetizationIcon sx={{ color: '#059669', fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
          中年轻创四不投原则
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            1. 坚决不投重资产加盟
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            严禁用家庭养老金加盟餐饮、奶茶或租办公场地，重资产往往在半年内吞噬所有积蓄。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            2. 必须技能复用与咨询化
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            将 10+ 年主业踩过的坑、合规模板沉淀为咨询案或 SOP，卖给小企业与新手。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            3. 陌生人付费验证闭环
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            在没有真实陌生用户付费前，不做任何高额营销买量，保持极低的单人试错成本。
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )

  return (
    <ColumnLayout
      columnTitle="副业与轻创"
      columnTag="开源创收"
      columnSummary="中年试错成本极高。严禁动用家庭防守资金盲目加盟开店；专注于零边际成本的咨询陪跑、行业模板化、数字资产与专业经验变现。"
      columnHighlight="四大避坑红线：坚决不碰重资产加盟、坚决不囤实体货品、必须复用过往主业技能、未获陌生人付费前绝不大额投入。"
      articles={sideArticles}
      tags={sideTags}
      sidebarWidget={sideSidebarWidget}
    />
  )
}

export default SideBusiness
