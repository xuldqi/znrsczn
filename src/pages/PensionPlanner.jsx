import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
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
  TrendingUp as TrendingUpIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  ShieldOutlined as ShieldIcon,
  CompareArrows as CompareIcon
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
    name: '典型工薪家庭 (35岁起步)',
    desc: '平稳积累，社保+个人储蓄双轨',
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
    desc: '高存量资产，提早结束职场打工',
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
    name: '稳健保本冲刺 (50岁备老)',
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

  // 针对缺口的动态建议测算
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 顶部面包屑与工具定位 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 1.2 }}>
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

      {/* 页面主标题区 */}
      <Container maxWidth="lg" sx={{ pt: 3.5, pb: 2 }}>
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              icon={<CalculateIcon sx={{ fontSize: '15px !important', color: '#c2410c !important' }} />}
              label="精算测算工具"
              size="small"
              sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.75rem', height: 24, borderRadius: 1 }}
            />
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              复利模型 · 通胀对冲 · 社保养老金统筹抵扣
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', fontSize: { xs: '1.45rem', sm: '1.8rem' }, mb: 0.8 }}>
            个人与家庭养老金缺口精算看板
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.9rem', maxWidth: 840, lineHeight: 1.6 }}>
            输入当前年龄、积蓄储备与每月储蓄能力，系统将基于通货膨胀模型与社保基本养老金对冲，实时测算退休时的资产规模峰值与资金可持续生存年限。
          </Typography>
        </Box>

        {/* 典型场景一键预设 */}
        <Paper elevation={0} sx={{ p: 1.8, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              典型人群预设:
            </Typography>
            {presetProfiles.map((p) => {
              const isSelected = activePreset === p.name
              return (
                <Chip
                  key={p.name}
                  label={`${p.name} · ${p.desc}`}
                  size="small"
                  onClick={() => applyPreset(p)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.75rem',
                    height: 26,
                    borderRadius: 1.5,
                    bgcolor: isSelected ? '#1f2937' : '#f9fafb',
                    color: isSelected ? '#ffffff' : '#374151',
                    border: isSelected ? '1px solid #1f2937' : '1px solid #e5e7eb',
                    transition: 'all 0.15s',
                    '&:hover': {
                      bgcolor: isSelected ? '#111827' : '#f3f4f6',
                      borderColor: isSelected ? '#111827' : '#cbd5e1'
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
              sx={{ color: '#9ca3af', fontSize: '0.74rem', p: 0, minWidth: 'auto', ml: 'auto', '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
            >
              恢复默认参数
            </Button>
          </Box>
        </Paper>

        {/* 核心双栏看板：左侧控制台 + 右侧精算结论 (高度对齐平衡) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1.25fr'
            },
            gap: 2.8,
            alignItems: 'stretch',
            mb: 3
          }}
        >
          {/* 左侧：输入控制台 (Sliders + Number inputs) */}
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneIcon sx={{ color: '#c2410c', fontSize: 19 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    精算参数设定
                  </Typography>
                </Box>
                <Chip
                  label={`积累 ${result.yearsToRetirement.toFixed(0)}年 | 提领 ${result.retirementYears.toFixed(0)}年`}
                  size="small"
                  sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                />
              </Box>

              <Stack spacing={2}>
                
                {/* 1. 年龄与生命周期 */}
                <Box sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151', fontSize: '0.78rem', display: 'block', mb: 1.2 }}>
                    1. 时间轴规划
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>当前年龄</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{form.currentAge} 岁</Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.currentAge)}
                        min={20}
                        max={70}
                        step={1}
                        onChange={(e, val) => handleFieldChange('currentAge', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>计划退休年龄</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{form.retirementAge} 岁</Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.retirementAge)}
                        min={Math.max(35, Number(form.currentAge))}
                        max={75}
                        step={1}
                        onChange={(e, val) => handleFieldChange('retirementAge', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>预估预期寿命</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{form.lifeExpectancy} 岁</Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.lifeExpectancy)}
                        min={Math.max(65, Number(form.retirementAge) + 1)}
                        max={100}
                        step={1}
                        onChange={(e, val) => handleFieldChange('lifeExpectancy', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>
                  </Stack>
                </Box>

                {/* 2. 积累期储备与月定投 */}
                <Box sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151', fontSize: '0.78rem', display: 'block', mb: 1.2 }}>
                    2. 积累期注入 (现阶段)
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>已有养老储备</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>
                          ¥{(form.currentSavings / 10000).toFixed(1)} 万元
                        </Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.currentSavings)}
                        min={0}
                        max={3000000}
                        step={20000}
                        onChange={(e, val) => handleFieldChange('currentSavings', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>每月可定投追加</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>
                          ¥{Number(form.monthlyContribution).toLocaleString()} /月
                        </Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.monthlyContribution)}
                        min={0}
                        max={30000}
                        step={500}
                        onChange={(e, val) => handleFieldChange('monthlyContribution', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>积累期年化投资回报</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{form.expectedReturn}% /年</Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.expectedReturn)}
                        min={1.0}
                        max={10.0}
                        step={0.5}
                        onChange={(e, val) => handleFieldChange('expectedReturn', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>
                  </Stack>
                </Box>

                {/* 3. 退休期开支与社保 */}
                <Box sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#374151', fontSize: '0.78rem', display: 'block', mb: 1.2 }}>
                    3. 退休后现金流与通胀
                  </Typography>

                  <Stack spacing={1.5}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>退休目标月支出 (现值)</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>
                          ¥{Number(form.desiredMonthlyExpense).toLocaleString()} /月
                        </Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.desiredMonthlyExpense)}
                        min={3000}
                        max={35000}
                        step={500}
                        onChange={(e, val) => handleFieldChange('desiredMonthlyExpense', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>社保基本养老金 (现值预估)</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>
                          ¥{Number(form.pensionIncome).toLocaleString()} /月
                        </Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.pensionIncome)}
                        min={1000}
                        max={15000}
                        step={200}
                        onChange={(e, val) => handleFieldChange('pensionIncome', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem' }}>年化通货膨胀率</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{form.inflationRate}% /年</Typography>
                      </Box>
                      <Slider
                        size="small"
                        value={Number(form.inflationRate)}
                        min={1.0}
                        max={5.0}
                        step={0.1}
                        onChange={(e, val) => handleFieldChange('inflationRate', val)}
                        sx={{ color: '#c2410c', py: 0.8 }}
                      />
                    </Box>
                  </Stack>
                </Box>

              </Stack>
            </Box>
          </Paper>

          {/* 右侧：精算大屏与核心结论 (与左侧高度对齐) */}
          <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
            
            {/* 1. 核心精算结论卡 (Verdict Scorecard) */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                bgcolor: '#ffffff',
                border: '1px solid',
                borderColor: result.success ? '#bbf7d0' : '#fed7aa',
                borderLeft: '5px solid',
                borderLeftColor: result.success ? '#16a34a' : '#c2410c'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  {result.success ? (
                    <SafeIcon sx={{ color: '#16a34a', fontSize: 22 }} />
                  ) : (
                    <WarningIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                  )}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', fontSize: '1rem' }}>
                    精算评估诊断
                  </Typography>
                </Box>
                <Chip
                  label={result.success ? `覆盖率 100% · 安全达标` : `覆盖率 ${coverageRatio}% · 需补充防线`}
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
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#15803d', mb: 0.8, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                    资产可稳健覆盖至 {form.lifeExpectancy} 岁（全生命周期安全）
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6, fontSize: '0.88rem' }}>
                    在当前储蓄与定投规划下，到 {form.retirementAge} 岁退休时总资产预计达到{' '}
                    <Typography component="span" sx={{ fontWeight: 700, color: '#111827' }}>
                      {formatCurrency(result.retirementBalance)}
                    </Typography>
                    。足以支撑退休后完整 {result.retirementYears.toFixed(0)} 年生活，即使计入长期通胀上浮，依然享有充分的安全边际。
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#c2410c', mb: 0.8, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                    养老资产预计在 {result.depletionAge.toFixed(0)} 岁耗尽（存在 {result.gapYears.toFixed(0)} 年资金缺口）
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6, fontSize: '0.88rem', mb: 1.5 }}>
                    现有积累仅能支撑退休后约{' '}
                    <Typography component="span" sx={{ fontWeight: 700, color: '#c2410c' }}>
                      {result.yearsCovered.toFixed(1)} 年
                    </Typography>
                    ，在距离目标寿命 {form.lifeExpectancy} 岁尚有 {result.gapYears.toFixed(0)} 年时面临资金断供风险。
                  </Typography>

                  {/* 3 条智能破局自救建议 */}
                  {advice && (
                    <Box sx={{ p: 1.6, borderRadius: 1.5, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                        <LightbulbIcon sx={{ color: '#c2410c', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#9a3412', fontSize: '0.78rem' }}>
                          实战破局的 3 条自救解法:
                        </Typography>
                      </Box>
                      <Stack spacing={0.6}>
                        <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.76rem', display: 'block' }}>
                          1. <strong>增加月定投</strong>：每月多存约 <strong>¥{advice.extraPerMonth.toLocaleString()}</strong> 元，复利即可填补缺口。
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.76rem', display: 'block' }}>
                          2. <strong>推迟退休</strong>：适当延后 <strong>{advice.delayYearsNeeded} 年</strong> 退休，多积累本金并缩短支取年限。
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.76rem', display: 'block' }}>
                          3. <strong>压缩开销</strong>：退休期月度支出削减 <strong>{advice.expenseCutPercent}%</strong>，即可做到收支平稳平衡。
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>

            {/* 2. 四大核心量化指标卡 (4-Grid Metrics) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  sm: 'repeat(4, 1fr)'
                },
                gap: 1.2
              }}
            >
              <Paper elevation={0} sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.3, fontSize: '0.72rem' }}>
                  退休时资产规模
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>
                  {formatCurrency(result.retirementBalance)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.66rem' }}>
                  在 {form.retirementAge} 岁达峰值
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.3, fontSize: '0.72rem' }}>
                  累计自筹本金投入
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>
                  {formatCurrency(result.totalContribution)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.66rem' }}>
                  储蓄+定投总本金
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.3, fontSize: '0.72rem' }}>
                  首年退休月开销
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#c2410c', fontSize: '1.1rem' }}>
                  {formatCurrencyExact(result.expenseAtRetirement)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.66rem' }}>
                  通胀后真实月开销
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.3, fontSize: '0.72rem' }}>
                  首年社保养老金
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0369a1', fontSize: '1.1rem' }}>
                  {formatCurrencyExact(result.pensionAtRetirement)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.66rem' }}>
                  社保月度托底硬现金
                </Typography>
              </Paper>
            </Box>

            {/* 3. 现金流提领收支平衡卡片 */}
            <Paper elevation={0} sx={{ p: 1.8, borderRadius: 1.8, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CompareIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', fontSize: '0.8rem' }}>
                    退休期现金流平衡结构
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.74rem' }}>
                  首年月度自筹净提取：<Typography component="span" variant="caption" sx={{ fontWeight: 700, color: '#c2410c' }}>{formatCurrencyExact(result.netMonthlyDeficitAtRetirement)}/月</Typography>
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, pt: 1, borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem', display: 'block' }}>社保替代率 (首年)</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0369a1' }}>
                    {result.expenseAtRetirement ? `${((result.pensionAtRetirement / result.expenseAtRetirement) * 100).toFixed(0)}%` : '0%'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem', display: 'block' }}>退休期累计支取</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
                    {formatCurrency(result.cumulativeWithdrawals)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem', display: 'block' }}>资金覆盖安全度</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: result.success ? '#16a34a' : '#c2410c' }}>
                    {result.success ? '充分冗余' : '承压紧绷'}
                  </Typography>
                </Box>
              </Box>
            </Paper>

          </Stack>
        </Box>

        {/* ========================================================================= */}
        {/* 全宽模块 1：生命周期四阶段推演路线图 (Full-Width Milestone Roadmap) */}
        {/* ========================================================================= */}
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon sx={{ color: '#c2410c', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
                全生命周期资金轨迹与关键节点推演
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              从积累筑底到被动提领的全周期推演
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: 'repeat(4, 1fr)'
              },
              gap: 1.5
            }}
          >
            {/* 阶段 1：起跑线 */}
            <Box sx={{ p: 2, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label="阶段 01"
                  size="small"
                  sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.68rem', height: 20, borderRadius: 1 }}
                />
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  当下起跑
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: '1.05rem' }}>
                {form.currentAge} 岁
              </Typography>
              <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', mb: 0.2 }}>
                现有储备: <strong>{formatCurrency(form.currentSavings)}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                每月定投 ¥{Number(form.monthlyContribution).toLocaleString()}，开启复利滚雪球
              </Typography>
            </Box>

            {/* 阶段 2：退休拐点 */}
            <Box sx={{ p: 2, borderRadius: 1.8, bgcolor: '#fff7ed', border: '1px solid #fed7aa', position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label="阶段 02"
                  size="small"
                  sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.68rem', height: 20, borderRadius: 1 }}
                />
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>
                  资产顶峰
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: '1.05rem' }}>
                {form.retirementAge} 岁 (退出职场)
              </Typography>
              <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'block', mb: 0.2 }}>
                资产达峰: {formatCurrency(result.retirementBalance)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                结束工薪收入，转入自筹资产提取与社保月领
              </Typography>
            </Box>

            {/* 阶段 3：提领中段 */}
            <Box sx={{ p: 2, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label="阶段 03"
                  size="small"
                  sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontWeight: 700, fontSize: '0.68rem', height: 20, borderRadius: 1 }}
                />
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  养老中段
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: '1.05rem' }}>
                {Math.round((Number(form.retirementAge) + Number(form.lifeExpectancy)) / 2)} 岁
              </Typography>
              <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', mb: 0.2 }}>
                刚性医疗与日常维持
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                社保养老金持续提供确定性现金流托底
              </Typography>
            </Box>

            {/* 阶段 4：终局结余 */}
            <Box
              sx={{
                p: 2,
                borderRadius: 1.8,
                bgcolor: result.success ? '#f0fdf4' : '#fef2f2',
                border: '1px solid',
                borderColor: result.success ? '#bbf7d0' : '#fecaca',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label="阶段 04"
                  size="small"
                  sx={{
                    bgcolor: result.success ? '#dcfce7' : '#fee2e2',
                    color: result.success ? '#15803d' : '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    height: 20,
                    borderRadius: 1
                  }}
                />
                <Typography variant="caption" sx={{ color: result.success ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                  {result.success ? '从容终局' : '资金枯竭'}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: '1.05rem' }}>
                {result.success ? `${form.lifeExpectancy} 岁` : `${result.depletionAge.toFixed(0)} 岁断粮`}
              </Typography>
              <Typography variant="caption" sx={{ color: result.success ? '#166534' : '#b91c1c', fontWeight: 700, display: 'block', mb: 0.2 }}>
                {result.success ? '资金全程覆盖充足' : `面临 ${result.gapYears.toFixed(0)} 年资金缺口`}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                {result.success ? '生活品质不打折，安享晚年' : '需提前按建议补充定投或延后退休'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ========================================================================= */}
        {/* 全宽模块 2：逐年资产与现金流推演明细表 (Full-Width Trajectory Table) */}
        {/* ========================================================================= */}
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ color: '#c2410c', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
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
              {showTable ? '收起逐年明细' : '展开查看逐年明细'}
            </Button>
          </Box>

          <Collapse in={showTable}>
            <Box sx={{ maxHeight: 420, overflowY: 'auto', mt: 2, border: '1px solid #e5e7eb', borderRadius: 1.5 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 1 }}>阶段</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 1 }}>年龄</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 1 }}>期末名义资产 (¥)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 1 }}>月度定投 / 月度实际支出</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 1 }}>社保养老金月领</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', bgcolor: '#f9fafb', py: 1 }}>状态评估</TableCell>
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
                        <TableCell sx={{ fontSize: '0.75rem', py: 0.8 }}>
                          <Chip
                            label={row.phase}
                            size="small"
                            sx={{
                              fontSize: '0.68rem',
                              height: 20,
                              bgcolor: row.phase === '积累期' ? '#eff6ff' : row.phase === '退休期' ? '#f0fdf4' : row.phase === '缺口期' ? '#fee2e2' : '#f3f4f6',
                              color: row.phase === '积累期' ? '#1d4ed8' : row.phase === '退休期' ? '#15803d' : row.phase === '缺口期' ? '#b91c1c' : '#374151',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 0.8 }}>{row.age} 岁</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem', py: 0.8, color: isDepleted ? '#b91c1c' : '#111827' }}>
                          {formatCurrency(row.balance)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.74rem', py: 0.8, color: '#4b5563' }}>
                          {row.annualExpense > 0 ? `月开支 ¥${Math.round(row.annualExpense / 12).toLocaleString()}` : `月定投 ¥${Number(form.monthlyContribution).toLocaleString()}`}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.74rem', py: 0.8, color: '#0369a1', fontWeight: 600 }}>
                          {row.annualPension > 0 ? `¥${Math.round(row.annualPension / 12).toLocaleString()}` : '—'}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: '0.74rem', py: 0.8 }}>
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

        {/* ========================================================================= */}
        {/* 全宽模块 3：精选实战参考：养老与家庭资产防守讨论 (Curated Articles) */}
        {/* ========================================================================= */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '1rem' }}>
                精选实战参考：家庭资产防守与养老讨论
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
