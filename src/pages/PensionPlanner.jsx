import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Slider,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'
import {
  CalculateOutlined as CalculateIcon,
  Timeline as TimelineIcon,
  CheckCircleOutline as SafeIcon,
  WarningAmber as WarningIcon,
  Tune as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  OpenInNew as OpenInNewIcon,
  ArrowForward as ArrowForwardIcon,
  LightbulbOutlined as LightbulbIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
import Footer from '../components/Footer'

const defaultForm = {
  currentAge: 38,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentSavings: 350000,
  monthlyContribution: 4000,
  expectedReturn: 5.0, // 积累期年化收益率 %
  postRetirementReturn: 3.5, // 退休后年化收益率 %
  inflationRate: 2.5, // 年化通胀率 %
  desiredMonthlyExpense: 10000,
  pensionIncome: 3800,
}

// 常见典型人群预设方案
const presetProfiles = [
  {
    name: '工薪家庭 (35岁起步)',
    desc: '平稳积累，社保+储蓄双轨',
    values: {
      currentAge: 35,
      retirementAge: 60,
      lifeExpectancy: 85,
      currentSavings: 200000,
      monthlyContribution: 3000,
      expectedReturn: 5.0,
      postRetirementReturn: 3.5,
      inflationRate: 2.5,
      desiredMonthlyExpense: 8500,
      pensionIncome: 3500,
    }
  },
  {
    name: '大厂提前退休 (42岁FIRE)',
    desc: '高存量资产，提早告别打工',
    values: {
      currentAge: 42,
      retirementAge: 48,
      lifeExpectancy: 85,
      currentSavings: 1800000,
      monthlyContribution: 10000,
      expectedReturn: 5.5,
      postRetirementReturn: 3.8,
      inflationRate: 2.5,
      desiredMonthlyExpense: 15000,
      pensionIncome: 4000,
    }
  },
  {
    name: '稳健备老 (50岁冲刺)',
    desc: '缩减开支，守好养老现金底盘',
    values: {
      currentAge: 50,
      retirementAge: 60,
      lifeExpectancy: 88,
      currentSavings: 650000,
      monthlyContribution: 4500,
      expectedReturn: 4.0,
      postRetirementReturn: 3.0,
      inflationRate: 2.2,
      desiredMonthlyExpense: 9000,
      pensionIncome: 4500,
    }
  }
]

const formatCurrency = (value) => {
  if (!isFinite(value) || value === null) return '—'
  if (value >= 10000) {
    const wan = value / 10000
    return `¥${wan >= 100 ? wan.toFixed(1) : wan.toFixed(2)} 万`
  }
  return `¥${Math.round(value).toLocaleString('zh-CN')}`
}

const formatCurrencyExact = (value) => {
  if (!isFinite(value) || value === null) return '—'
  return `¥${Math.round(value).toLocaleString('zh-CN')}`
}

const clamps = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback)

const monthlyRate = (annualRate) => Math.pow(1 + annualRate, 1 / 12) - 1

const simulatePlan = (state) => {
  const currentAge = clamps(Number(state.currentAge), defaultForm.currentAge)
  const retirementAge = clamps(Number(state.retirementAge), defaultForm.retirementAge)
  const lifeExpectancy = Math.max(retirementAge + 1, clamps(Number(state.lifeExpectancy), defaultForm.lifeExpectancy))

  const yearsToRetirement = Math.max(0, retirementAge - currentAge)
  const monthsToRetirement = Math.round(yearsToRetirement * 12)
  const retirementYears = Math.max(0, lifeExpectancy - retirementAge)
  const retirementMonths = Math.round(retirementYears * 12)

  const currentSavings = Math.max(0, Number(state.currentSavings))
  const monthlyContributionBase = Math.max(0, Number(state.monthlyContribution))
  const desiredExpense = Math.max(0, Number(state.desiredMonthlyExpense))
  const pensionIncomeBase = Math.max(0, Number(state.pensionIncome))

  const annualReturn = Math.max(-0.99, Number(state.expectedReturn) / 100)
  const annualReturnPost = Math.max(-0.99, Number(state.postRetirementReturn) / 100)
  const annualInflation = Math.max(-0.5, Number(state.inflationRate) / 100)

  const accumulationRate = monthlyRate(annualReturn)
  const postReturnRate = monthlyRate(annualReturnPost)
  const inflationMonthly = monthlyRate(annualInflation)

  let balance = currentSavings
  let totalContribution = currentSavings
  const timeline = []

  // 初始节点
  timeline.push({
    phase: '起步起点',
    age: Math.round(currentAge),
    balance: Math.max(balance, 0),
    annualExpense: 0,
    annualPension: 0
  })

  // 积累期模拟
  if (monthsToRetirement > 0) {
    for (let month = 0; month < monthsToRetirement; month += 1) {
      balance *= 1 + accumulationRate
      const contribution = monthlyContributionBase * Math.pow(1 + inflationMonthly, month)
      balance += contribution
      totalContribution += contribution

      if ((month + 1) % 12 === 0 || month === monthsToRetirement - 1) {
        const age = currentAge + (month + 1) / 12
        timeline.push({
          phase: '积累期',
          age: Math.round(age),
          balance: Math.max(balance, 0),
          annualExpense: 0,
          annualPension: 0
        })
      }
    }
  }

  const expenseAtRetirement = desiredExpense * Math.pow(1 + inflationMonthly, monthsToRetirement)
  const pensionAtRetirement = pensionIncomeBase * Math.pow(1 + inflationMonthly, monthsToRetirement)

  let retirementBalance = balance
  let cumulativeWithdrawals = 0
  let shortfallMonth = null
  let expense = expenseAtRetirement
  let pension = pensionAtRetirement

  // 退休期模拟
  for (let month = 0; month < retirementMonths; month += 1) {
    retirementBalance *= 1 + postReturnRate
    const withdrawal = Math.max(expense - pension, 0)
    retirementBalance -= withdrawal
    cumulativeWithdrawals += withdrawal

    if (retirementBalance <= 0 && shortfallMonth === null) {
      shortfallMonth = month
      retirementBalance = 0
    }

    if ((month + 1) % 12 === 0 || month === retirementMonths - 1) {
      const age = retirementAge + (month + 1) / 12
      timeline.push({
        phase: shortfallMonth !== null && (month > shortfallMonth) ? '缺口期' : '退休期',
        age: Math.round(age),
        balance: Math.max(retirementBalance, 0),
        annualExpense: expense * 12,
        annualPension: pension * 12
      })
    }

    expense *= 1 + inflationMonthly
    pension *= 1 + inflationMonthly
    if (retirementBalance <= 0) {
      if (shortfallMonth !== null && timeline.length < retirementMonths / 12) {
        const remainingYears = Math.ceil((retirementMonths - month) / 12)
        for (let y = 1; y <= remainingYears; y++) {
          const projectedAge = Math.min(lifeExpectancy, Math.round(retirementAge + (month + y * 12) / 12))
          if (!timeline.some(t => t.age === projectedAge)) {
            timeline.push({
              phase: '缺口期',
              age: projectedAge,
              balance: 0,
              annualExpense: expense * 12,
              annualPension: pension * 12
            })
          }
        }
      }
      break
    }
  }

  const retirementDurationCovered = shortfallMonth === null
    ? retirementMonths
    : shortfallMonth

  const yearsCovered = retirementDurationCovered / 12
  const depletionAge = retirementAge + yearsCovered

  return {
    yearsToRetirement,
    retirementYears,
    totalContribution,
    retirementBalance: balance, // 退休时本金积累规模
    cumulativeWithdrawals,
    expenseAtRetirement,
    pensionAtRetirement,
    netMonthlyDeficitAtRetirement: Math.max(0, expenseAtRetirement - pensionAtRetirement),
    inflationMonthly,
    accumulationRate,
    postReturnRate,
    timeline,
    success: shortfallMonth === null,
    yearsCovered,
    depletionAge,
    gapYears: Math.max(0, lifeExpectancy - depletionAge)
  }
}

const PensionPlanner = () => {
  const [form, setForm] = useState(defaultForm)
  const [activePreset, setActivePreset] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  const result = useMemo(() => simulatePlan(form), [form])

  const pensionArticles = useMemo(() => {
    const list = getAllArticles ? getAllArticles() : []
    return list
      .filter(article => {
        if (article.status !== 'published') return false
        const title = article.title || ''
        const tags = article.tags || []
        return article.category === '财务管理'
          || title.includes('养老')
          || title.includes('存')
          || title.includes('资产')
          || tags.some(tag => tag.includes('养老') || tag.includes('理财') || tag.includes('现金流'))
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 4)
  }, [getAllArticles])

  const handleFieldChange = (key, val) => {
    setActivePreset(null)
    setForm(prev => ({
      ...prev,
      [key]: val === '' ? '' : Number(val)
    }))
  }

  const applyPreset = (preset) => {
    setForm(preset.values)
    setActivePreset(preset.name)
  }

  // 针对缺口的动态自救破局建议
  const advice = useMemo(() => {
    if (result.success) return null
    const gapYears = result.gapYears
    const extraPerMonth = Math.round((gapYears * result.expenseAtRetirement * 12) / (Math.max(1, result.yearsToRetirement * 12) * 1.5))
    const delayYearsNeeded = Math.min(5, Math.ceil(gapYears / 2.5))
    const expenseCutPercent = Math.min(30, Math.round((gapYears / result.retirementYears) * 50))

    return {
      extraPerMonth: Math.max(500, Math.round(extraPerMonth / 100) * 100),
      delayYearsNeeded: Math.max(1, delayYearsNeeded),
      expenseCutPercent: Math.max(10, expenseCutPercent)
    }
  }, [result])

  const coverageRatio = useMemo(() => {
    if (!result.retirementYears) return 100
    return Math.min(100, Math.round((result.yearsCovered / result.retirementYears) * 100))
  }, [result])

  // 生命周期进度条比例计算
  const timelineProgress = useMemo(() => {
    const totalSpan = Math.max(1, form.lifeExpectancy - form.currentAge)
    const accumYears = Math.max(0, form.retirementAge - form.currentAge)
    const coveredYears = result.yearsCovered
    const gapYears = result.gapYears

    const accumPercent = (accumYears / totalSpan) * 100
    const coveredPercent = (coveredYears / totalSpan) * 100
    const gapPercent = (gapYears / totalSpan) * 100

    return {
      accumPercent,
      coveredPercent,
      gapPercent
    }
  }, [form, result])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 顶部极简状态栏 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 1.1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="caption"
                onClick={() => navigate('/')}
                sx={{ color: '#6b7280', cursor: 'pointer', '&:hover': { color: '#c2410c' } }}
              >
                首页
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>/</Typography>
              <Typography
                variant="caption"
                onClick={() => navigate('/finance')}
                sx={{ color: '#6b7280', cursor: 'pointer', '&:hover': { color: '#c2410c' } }}
              >
                房贷与钱袋子
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>/</Typography>
              <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                养老金缺口精算看板
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() => navigate('/dashboard')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.82rem', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
            >
              去工作台测算自救跑道 →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 核心主容器 */}
      <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
        
        {/* 头部标题与场景切换 */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<CalculateIcon sx={{ fontSize: '15px !important', color: '#c2410c !important' }} />}
                label="精算测算工具"
                size="small"
                sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.72rem', height: 22, borderRadius: 1 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                养老金与退休安全边界精算看板
              </Typography>
            </Box>

            {/* 典型预设单行胶囊 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
              {presetProfiles.map((p) => {
                const isSelected = activePreset === p.name
                return (
                  <Chip
                    key={p.name}
                    label={p.name}
                    size="small"
                    onClick={() => applyPreset(p)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.75rem',
                      height: 26,
                      borderRadius: 1.2,
                      bgcolor: isSelected ? '#1f2937' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#4b5563',
                      border: isSelected ? '1px solid #1f2937' : '1px solid #e5e7eb',
                      transition: 'all 0.15s',
                      '&:hover': {
                        bgcolor: isSelected ? '#111827' : '#f9fafb'
                      }
                    }}
                  />
                )
              })}
              <Button
                size="small"
                onClick={() => {
                  setForm(defaultForm)
                  setActivePreset(null)
                }}
                sx={{ color: '#9ca3af', fontSize: '0.72rem', p: 0, minWidth: 'auto', '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
              >
                重置
              </Button>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.86rem', maxWidth: 840, lineHeight: 1.5 }}>
            综合测算社保统筹基本养老金、个人资产复利积累与长期通胀对冲，量化您的退休安全边界与现金流断档风险。
          </Typography>
        </Box>

        {/* 核心双栏看板：左侧紧凑控制台 + 右侧可视化大屏 (自然等高无空隙) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1.05fr 1.15fr'
            },
            gap: 2.5,
            alignItems: 'start',
            mb: 3
          }}
        >
          {/* 左侧：精选交互式控制面板 */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid #f3f4f6' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <TuneIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                  参数设定
                </Typography>
              </Box>
              <Chip
                label={`工作积累 ${result.yearsToRetirement.toFixed(0)}年 · 退休提领 ${result.retirementYears.toFixed(0)}年`}
                size="small"
                sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.68rem', height: 20 }}
              />
            </Box>

            <Stack spacing={2.2}>
              
              {/* 1. 年龄三合一紧凑行 */}
              <Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 1 }}>
                  1. 生命时间轴
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>当前年龄</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>{form.currentAge}岁</Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.currentAge)}
                      min={20}
                      max={70}
                      step={1}
                      onChange={(e, v) => handleFieldChange('currentAge', v)}
                      sx={{ color: '#c2410c', py: 0.5 }}
                    />
                  </Box>

                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography variant="caption" sx={{ color: '#c2410c', fontSize: '0.72rem', fontWeight: 700 }}>退休年龄</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c' }}>{form.retirementAge}岁</Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.retirementAge)}
                      min={Math.max(35, Number(form.currentAge))}
                      max={75}
                      step={1}
                      onChange={(e, v) => handleFieldChange('retirementAge', v)}
                      sx={{ color: '#c2410c', py: 0.5 }}
                    />
                  </Box>

                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>预估寿命</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>{form.lifeExpectancy}岁</Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.lifeExpectancy)}
                      min={Math.max(65, Number(form.retirementAge) + 1)}
                      max={100}
                      step={1}
                      onChange={(e, v) => handleFieldChange('lifeExpectancy', v)}
                      sx={{ color: '#c2410c', py: 0.5 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* 2. 积累期资金与月定投 */}
              <Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 1 }}>
                  2. 积累期储备与月定投
                </Typography>

                <Stack spacing={1.5}>
                  {/* 已有储备 */}
                  <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>现有养老储蓄本金</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem' }}>
                        ¥{(form.currentSavings / 10000).toFixed(1)} 万元
                      </Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.currentSavings)}
                      min={0}
                      max={3000000}
                      step={20000}
                      onChange={(e, v) => handleFieldChange('currentSavings', v)}
                      sx={{ color: '#c2410c', py: 0.6 }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.6, mt: 0.4 }}>
                      {[100000, 300000, 600000, 1000000, 1500000].map(amt => (
                        <Chip
                          key={amt}
                          label={`${amt / 10000}万`}
                          size="small"
                          onClick={() => handleFieldChange('currentSavings', amt)}
                          sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#ffffff', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* 每月定投 */}
                  <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>每月可定投追加</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem' }}>
                        ¥{Number(form.monthlyContribution).toLocaleString()} /月
                      </Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.monthlyContribution)}
                      min={0}
                      max={25000}
                      step={500}
                      onChange={(e, v) => handleFieldChange('monthlyContribution', v)}
                      sx={{ color: '#c2410c', py: 0.6 }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.6, mt: 0.4 }}>
                      {[2000, 4000, 6000, 10000, 15000].map(amt => (
                        <Chip
                          key={amt}
                          label={`${amt}/月`}
                          size="small"
                          onClick={() => handleFieldChange('monthlyContribution', amt)}
                          sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#ffffff', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* 3. 退休后现金流收支 */}
              <Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', display: 'block', mb: 1 }}>
                  3. 退休期现金流预估 (以今天购买力)
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.72rem' }}>目标月支出</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.8rem' }}>
                        ¥{Number(form.desiredMonthlyExpense).toLocaleString()}
                      </Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.desiredMonthlyExpense)}
                      min={3000}
                      max={30000}
                      step={500}
                      onChange={(e, v) => handleFieldChange('desiredMonthlyExpense', v)}
                      sx={{ color: '#c2410c', py: 0.6 }}
                    />
                  </Box>

                  <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.72rem' }}>社保基本养老金</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0369a1', fontSize: '0.8rem' }}>
                        ¥{Number(form.pensionIncome).toLocaleString()}
                      </Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={Number(form.pensionIncome)}
                      min={1000}
                      max={12000}
                      step={200}
                      onChange={(e, v) => handleFieldChange('pensionIncome', v)}
                      sx={{ color: '#c2410c', py: 0.6 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* 4. 折叠式高阶宏观假设 (年化收益/通胀率) */}
              <Box sx={{ pt: 1, borderTop: '1px solid #f3f4f6' }}>
                <Button
                  size="small"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  startIcon={<SettingsIcon sx={{ fontSize: 14 }} />}
                  endIcon={showAdvanced ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                  sx={{ color: '#6b7280', fontSize: '0.75rem', p: 0, fontWeight: 600, '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
                >
                  {showAdvanced ? '收起收益率与通胀假设' : `展开收益率与通胀假设 (默认年化 ${form.expectedReturn}% / 通胀 ${form.inflationRate}%)`}
                </Button>

                <Collapse in={showAdvanced}>
                  <Box sx={{ p: 1.5, mt: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#6b7280' }}>积累期收益</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 700 }}>{form.expectedReturn}%</Typography>
                        </Box>
                        <Slider
                          size="small"
                          value={Number(form.expectedReturn)}
                          min={1.0}
                          max={9.0}
                          step={0.5}
                          onChange={(e, v) => handleFieldChange('expectedReturn', v)}
                          sx={{ color: '#c2410c', py: 0.4 }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#6b7280' }}>退休期收益</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 700 }}>{form.postRetirementReturn}%</Typography>
                        </Box>
                        <Slider
                          size="small"
                          value={Number(form.postRetirementReturn)}
                          min={1.0}
                          max={6.0}
                          step={0.5}
                          onChange={(e, v) => handleFieldChange('postRetirementReturn', v)}
                          sx={{ color: '#c2410c', py: 0.4 }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.68rem', color: '#6b7280' }}>年化通胀率</Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 700 }}>{form.inflationRate}%</Typography>
                        </Box>
                        <Slider
                          size="small"
                          value={Number(form.inflationRate)}
                          min={1.0}
                          max={5.0}
                          step={0.1}
                          onChange={(e, v) => handleFieldChange('inflationRate', v)}
                          sx={{ color: '#c2410c', py: 0.4 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Collapse>
              </Box>

            </Stack>
          </Paper>

          {/* 右侧：精算评估看板 (结论 + 直观跑道 + 核心数据 + 自救锦囊) */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
            
            {/* 1. 核心诊断 Headline */}
            <Box sx={{ mb: 2, pb: 1.8, borderBottom: '1px solid #f3f4f6' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  {result.success ? (
                    <SafeIcon sx={{ color: '#16a34a', fontSize: 22 }} />
                  ) : (
                    <WarningIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                  )}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
                    精算评估诊断
                  </Typography>
                </Box>
                <Chip
                  label={result.success ? `覆盖率 100% · 全周期安全` : `覆盖率 ${coverageRatio}% · 需补充防线`}
                  size="small"
                  sx={{
                    bgcolor: result.success ? '#f0fdf4' : '#fff7ed',
                    color: result.success ? '#166534' : '#c2410c',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    border: `1px solid ${result.success ? '#bbf7d0' : '#fed7aa'}`,
                    borderRadius: 1
                  }}
                />
              </Box>

              {result.success ? (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#15803d', mb: 0.5, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                    资产可稳健覆盖至 {form.lifeExpectancy} 岁（全生命周期安全）
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.86rem', lineHeight: 1.55 }}>
                    到 {form.retirementAge} 岁退休时总资产预计达到{' '}
                    <Typography component="span" sx={{ fontWeight: 700, color: '#111827' }}>
                      {formatCurrency(result.retirementBalance)}
                    </Typography>
                    ，足以支撑退休后完整 {result.retirementYears.toFixed(0)} 年生活，享有充分的安全边际。
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#c2410c', mb: 0.5, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                    养老资产预计在 {result.depletionAge.toFixed(0)} 岁耗尽（存在 {result.gapYears.toFixed(0)} 年缺口）
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.86rem', lineHeight: 1.55 }}>
                    现有积累仅能支撑退休后约{' '}
                    <Typography component="span" sx={{ fontWeight: 700, color: '#c2410c' }}>
                      {result.yearsCovered.toFixed(1)} 年
                    </Typography>
                    ，在距离目标寿命 {form.lifeExpectancy} 岁尚有 {result.gapYears.toFixed(0)} 年时面临断供风险。
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 2. 生命周期资金覆盖可视化跑道 (Visual Runway Bar) */}
            <Box sx={{ p: 1.8, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <TimelineIcon sx={{ fontSize: 16, color: '#c2410c' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151', fontSize: '0.76rem' }}>
                    生命周期资金跑道直观推演
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: result.success ? '#15803d' : '#b91c1c', fontWeight: 700, fontSize: '0.74rem' }}>
                  {result.success ? '全生命周期资金无断崖' : `在 ${result.depletionAge.toFixed(0)} 岁出现资金缺口`}
                </Typography>
              </Box>

              {/* 多色段可视柱 */}
              <Box sx={{ position: 'relative', height: 26, borderRadius: 1.2, overflow: 'hidden', display: 'flex', bgcolor: '#e5e7eb', width: '100%' }}>
                {/* 积累期 (蓝) */}
                <Box
                  sx={{
                    width: `${timelineProgress.accumPercent}%`,
                    bgcolor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    px: 0.5
                  }}
                >
                  积累期 {result.yearsToRetirement.toFixed(0)}年
                </Box>

                {/* 退休覆盖期 (绿/橙) */}
                <Box
                  sx={{
                    width: `${timelineProgress.coveredPercent}%`,
                    bgcolor: result.success ? '#16a34a' : '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    px: 0.5
                  }}
                >
                  提领维持 {result.yearsCovered.toFixed(0)}年
                </Box>

                {/* 缺口期 (红) */}
                {!result.success && (
                  <Box
                    sx={{
                      width: `${timelineProgress.gapPercent}%`,
                      bgcolor: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      px: 0.5
                    }}
                  >
                    缺口 {result.gapYears.toFixed(0)}年
                  </Box>
                )}
              </Box>

              {/* 关键时间刻度标尺 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.8, color: '#6b7280', fontSize: '0.72rem' }}>
                <Typography variant="caption">{form.currentAge}岁 (当下)</Typography>
                <Typography variant="caption">{form.retirementAge}岁 (退休达峰)</Typography>
                {!result.success && (
                  <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800 }}>{result.depletionAge.toFixed(0)}岁 (断粮耗尽)</Typography>
                )}
                <Typography variant="caption">{form.lifeExpectancy}岁 (终局)</Typography>
              </Box>
            </Box>

            {/* 3. 四大核心量化指标卡 (2x2 紧凑网格) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1.2,
                mb: 2
              }}
            >
              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                  退休时资产规模 (峰值)
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem', my: 0.2 }}>
                  {formatCurrency(result.retirementBalance)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem' }}>
                  在 {form.retirementAge} 岁达峰转入支取
                </Typography>
              </Box>

              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                  累计自筹本金投入
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem', my: 0.2 }}>
                  {formatCurrency(result.totalContribution)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem' }}>
                  初始储蓄 + 每月定投总额
                </Typography>
              </Box>

              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                  首年退休月开销 (含通胀)
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#c2410c', fontSize: '1.05rem', my: 0.2 }}>
                  {formatCurrencyExact(result.expenseAtRetirement)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem' }}>
                  通胀后等效今天生活标准
                </Typography>
              </Box>

              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontSize: '0.72rem' }}>
                  首年社保养老金 (月领)
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0369a1', fontSize: '1.05rem', my: 0.2 }}>
                  {formatCurrencyExact(result.pensionAtRetirement)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem' }}>
                  社保刚性月领底线现金
                </Typography>
              </Box>
            </Box>

            {/* 4. 自救锦囊建议 */}
            {advice ? (
              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}>
                  <LightbulbIcon sx={{ color: '#c2410c', fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#9a3412', fontSize: '0.78rem' }}>
                    平衡收支的 3 条实战破局解法:
                  </Typography>
                </Box>
                <Stack spacing={0.4}>
                  <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.74rem', display: 'block' }}>
                    · <strong>增加月定投</strong>：每月多存约 <strong>¥{advice.extraPerMonth.toLocaleString()}</strong> 元，复利即可填补后半程缺口。
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.74rem', display: 'block' }}>
                    · <strong>推迟退休</strong>：延后 <strong>{advice.delayYearsNeeded} 年</strong> 退休，多攒几年本金并缩减支取期。
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.74rem', display: 'block' }}>
                    · <strong>优化开销</strong>：退休月度支出削减 <strong>{advice.expenseCutPercent}%</strong>，即可达到全程收支平衡。
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, fontSize: '0.78rem' }}>
                  健康储备状态：现有方案能够稳健穿越完整退休周期，建议保持纪律定期定投。
                </Typography>
              </Box>
            )}

          </Paper>
        </Box>

        {/* 逐年资产推演明细表格 (折叠式) */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                逐年资产余额与现金流明细表
              </Typography>
              <Chip
                label={`共 ${result.timeline.length} 个监测年度`}
                size="small"
                sx={{ bgcolor: '#f3f4f6', color: '#6b7280', fontSize: '0.72rem', height: 20 }}
              />
            </Box>

            <Button
              size="small"
              onClick={() => setShowTable(!showTable)}
              endIcon={showTable ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              {showTable ? '收起明细表' : '展开查看逐年明细'}
            </Button>
          </Box>

          <Collapse in={showTable}>
            <Box sx={{ maxHeight: 360, overflowY: 'auto', mt: 2, border: '1px solid #e5e7eb', borderRadius: 1.5 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 0.8 }}>阶段</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 0.8 }}>年龄</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 0.8 }}>期末名义资产 (¥)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 0.8 }}>月度投入 / 月度支出</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 0.8 }}>社保养老金月领</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 0.8 }}>状态评估</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.timeline.map((row, idx) => {
                    const isDepleted = row.balance <= 0 && row.phase === '缺口期'
                    const isTurnPoint = row.age === Number(form.retirementAge)
                    return (
                      <TableRow
                        key={`${row.phase}-${row.age}-${idx}`}
                        sx={{
                          bgcolor: isDepleted ? '#fef2f2' : isTurnPoint ? '#fff7ed' : idx % 2 === 0 ? '#ffffff' : '#fcfcfc',
                          '&:hover': { bgcolor: '#f3f4f6' }
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.75rem', py: 0.6 }}>
                          <Chip
                            label={row.phase}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              height: 18,
                              bgcolor: row.phase === '积累期' ? '#eff6ff' : row.phase === '退休期' ? '#f0fdf4' : row.phase === '缺口期' ? '#fee2e2' : '#f3f4f6',
                              color: row.phase === '积累期' ? '#1d4ed8' : row.phase === '退休期' ? '#15803d' : row.phase === '缺口期' ? '#b91c1c' : '#374151',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 0.6 }}>{row.age} 岁</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem', py: 0.6, color: isDepleted ? '#b91c1c' : '#111827' }}>
                          {formatCurrency(row.balance)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.74rem', py: 0.6, color: '#4b5563' }}>
                          {row.annualExpense > 0 ? `月开支 ¥${Math.round(row.annualExpense / 12).toLocaleString()}` : `月定投 ¥${Number(form.monthlyContribution).toLocaleString()}`}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.74rem', py: 0.6, color: '#0369a1', fontWeight: 600 }}>
                          {row.annualPension > 0 ? `¥${Math.round(row.annualPension / 12).toLocaleString()}` : '—'}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: '0.74rem', py: 0.6 }}>
                          {isDepleted ? (
                            <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 700 }}>资金枯竭</Typography>
                          ) : isTurnPoint ? (
                            <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>达峰拐点</Typography>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#16a34a' }}>平稳维持</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </Paper>

        {/* 底部精选：养老与资产规划实战讨论 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
                精选实战参考：家庭资产防守与养老经验
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                从社保个人养老金、四笔钱法则到中年提前退休（FIRE）的真实经验
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => navigate('/articles?category=财务管理')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              浏览全部财务帖子 →
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr'
              },
              gap: 2
            }}
          >
            {pensionArticles.map((art) => (
              <Paper
                key={art.id}
                elevation={0}
                onClick={() => {
                  if (art.sourceUrl) {
                    window.open(art.sourceUrl, '_blank')
                  } else {
                    navigate(`/article/${art.id}`)
                  }
                }}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#fdba74',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    '& .pension-art-title': { color: '#c2410c' }
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8, flexWrap: 'wrap' }}>
                  {art.source && (
                    <Chip
                      label={art.source}
                      size="small"
                      sx={{ bgcolor: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', fontSize: '0.7rem', fontWeight: 700, height: 20 }}
                    />
                  )}
                  <Chip
                    label={art.category}
                    size="small"
                    sx={{ bgcolor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.68rem', fontWeight: 600, height: 20 }}
                  />
                  <Typography variant="caption" sx={{ color: '#9ca3af', ml: 'auto', fontSize: '0.72rem' }}>
                    {art.hotMetric || '全网精选'}
                  </Typography>
                </Box>

                <Typography
                  className="pension-art-title"
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: '0.94rem',
                    lineHeight: 1.45,
                    mb: 0.6,
                    transition: 'color 0.15s'
                  }}
                >
                  {art.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#4b5563',
                    fontSize: '0.84rem',
                    lineHeight: 1.55,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1.2
                  }}
                >
                  {art.excerpt}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f9fafb' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.74rem' }}>
                    {art.date || '近期'}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                    sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.78rem', p: 0, whiteSpace: 'nowrap' }}
                  >
                    直达原帖 ↗
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

      </Container>

      <Footer />
    </Box>
  )
}

export default PensionPlanner
