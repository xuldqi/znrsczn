import { useMemo } from 'react'
import { Typography, Paper, Box, Stack } from '@mui/material'
import { FamilyRestroomOutlined as FamilyIcon } from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const Family = () => {
  const { getAllArticles } = useArticles()

  const familyArticles = useMemo(() => {
    return getAllArticles()
      .filter(a => ['家庭关系', '生活技能'].includes(a.category) && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const familyTags = [
    '夫妻沟通',
    '青春期沟通',
    '老人照料',
    '家庭边界',
    '情绪降温',
    '教育规划'
  ]

  const familySidebarWidget = (
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
        <FamilyIcon sx={{ color: '#be185d', fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
          家庭沟通降温法则
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            1. 设立职场与家庭的减压舱
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            在进家门前或熄火后静坐 5 分钟，将白天的竞争性防御姿态脱卸，避免将外部挫折投射给家人。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            2. 与青春期孩子沟通少评判
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            倾听事实大于输出道理；允许情绪表达，在孩子关闭心门前先表达无条件的接纳。
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
            3. 父母就医与养老预案前置
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
            提前整理父母病史、医保异地备案与定点医院清单，避免突发变故时慌乱失序。
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )

  return (
    <ColumnLayout
      columnTitle="身心与家庭"
      columnTag="基石支撑"
      columnSummary="中年不仅是职场的战斗，更是家庭与自我的平衡。聚焦夫妻深度沟通、青春期孩子情绪降温、父母就医养老照料与中年情绪边界重构。"
      columnHighlight="家庭沟通三戒律：不带情绪沟通事实、不将职场焦虑转嫁给伴侣和孩子、建立清晰的心理与精力隔离墙。"
      articles={familyArticles}
      tags={familyTags}
      sidebarWidget={familySidebarWidget}
    />
  )
}

export default Family
