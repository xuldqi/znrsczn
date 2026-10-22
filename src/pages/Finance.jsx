import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Paper, Box, Slider, Button } from '@mui/material'
import {
  AccountBalanceOutlined as FinanceIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
import ColumnLayout from '../components/ColumnLayout'

const Finance = () => {
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  // 侧边栏计算器状态
  const [savings, setSavings] = useState(30)
  const [monthly, setMonthly] = useState(12000)

  const runwayMonths = useMemo(() => {
    if (!monthly) return '0.0'
    return ((savings * 10000) / monthly).toFixed(1)
  }, [savings, monthly])

  const financeArticles = useMemo(() => {
    return getAllArticles()
      .filter(a => a.category === '财务管理' && a.status === 'published')
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [getAllArticles])

  const financeTags = [
    '四笔钱配置',
    '现金流跑道',
    '个人养老金',
    '保险配置',
    '债务重组',
    '风险隔离'
  ]

  const financeSidebarWidget = (
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
        <FinanceIcon sx={{ color: '#b45309', fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
          家庭现金流跑道速测
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
        在收入突发归零的极端情况下，家庭现有备用金能支撑多久的生活。
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>流动备用金</Typography>
          <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>{savings} 万元</Typography>
        </Box>
        <Slider
          size="small"
          value={savings}
          min={0}
          max={120}
          step={5}
          onChange={(e, v) => setSavings(v)}
          sx={{ color: '#c2410c' }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>月度刚性总开销</Typography>
          <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>¥{monthly.toLocaleString()}</Typography>
        </Box>
        <Slider
          size="small"
          value={monthly}
          min={5000}
          max={30000}
          step={1000}
          onChange={(e, v) => setMonthly(v)}
          sx={{ color: '#c2410c' }}
        />
      </Box>

      <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#fef8f4', border: '1px solid #fed7aa', textAlign: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#7c2d12', display: 'block' }}>预计可支撑跑道</Typography>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#c2410c', my: 0.2 }}>
          {runwayMonths} <Typography component="span" variant="caption" sx={{ color: '#7c2d12' }}>个月</Typography>
        </Typography>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        size="small"
        onClick={() => navigate('/pension-planner')}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
        sx={{
          borderColor: '#d1d5db',
          color: '#374151',
          fontWeight: 700,
          py: 0.8,
          borderRadius: 1.5,
          whiteSpace: 'nowrap',
          '&:hover': { borderColor: '#c2410c', color: '#c2410c', bgcolor: '#fef8f4' }
        }}
      >
        使用完整养老金规划器
      </Button>
    </Paper>
  )

  return (
    <ColumnLayout
      columnTitle="资产与养老"
      columnTag="底线防御"
      columnSummary="人到中年，资产安全重于超额收益。通过四笔钱法则、流动性跑道测算、高杠杆纯保障配置与稳健长钱储备，构筑家庭反脆弱防线。"
      columnHighlight="活钱池留足 6~12 个月刚性生活费；家庭经济支柱配齐纯保障百万医疗与定寿；坚决远离加杠杆博取暴利的高风险投机。"
      articles={financeArticles}
      tags={financeTags}
      sidebarWidget={financeSidebarWidget}
    />
  )
}

export default Finance
