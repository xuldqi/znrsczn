import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Grid,
  Slider,
  Divider,
  Chip,
  Alert,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  HelpOutline as HelpIcon,
  CheckCircleOutline as CheckIcon,
  InfoOutlined as InfoIcon,
  AccountBalanceOutlined as BalanceIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  SavingsOutlined as SavingsIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 各城市养老金计发基数（2024/2025年最新在岗职工月平均基数）
const cityPensionData = [
  { id: 'shanghai', name: '上海', base: 12183 },
  { id: 'beijing', name: '北京', base: 11525 },
  { id: 'shenzhen', name: '深圳', base: 11620 },
  { id: 'guangzhou', name: '广州', base: 9140 },
  { id: 'hangzhou', name: '杭州', base: 8450 },
  { id: 'chengdu', name: '成都', base: 8090 },
  { id: 'wuhan', name: '武汉', base: 7850 },
  { id: 'average', name: '全国二三线平均', base: 7300 },
  { id: 'custom', name: '自定义计发基数', base: 8000 }
]

// 计发月数对照表（依据国发〔2005〕38号及新规计发月数标准）
const getMonthsFactor = (retireAge) => {
  if (retireAge <= 50) return 195
  if (retireAge <= 51) return 190
  if (retireAge <= 52) return 185
  if (retireAge <= 53) return 180
  if (retireAge <= 54) return 175
  if (retireAge <= 55) return 170
  if (retireAge <= 56) return 164
  if (retireAge <= 57) return 158
  if (retireAge <= 58) return 152
  if (retireAge <= 59) return 145
  if (retireAge <= 60) return 139
  if (retireAge <= 61) return 132
  if (retireAge <= 62) return 125
  if (retireAge <= 63) return 120
  if (retireAge <= 64) return 111
  return 101 // 65岁
}

const RetirementSalaryCalculator = () => {
  const navigate = useNavigate()

  // 1. 基本个人档案
  const [birthYear, setBirthYear] = useState(1978)
  const [birthMonth, setBirthMonth] = useState(6)
  // 性别与身份类型: 'male' (男职工原60岁), 'female_cadre' (女管理干部原55岁), 'female_worker' (女职工原50岁)
  const [personType, setPersonType] = useState('male')

  // 2. 养老保险缴费档案
  const [selectedCityId, setSelectedCityId] = useState('beijing')
  const [customBase, setCustomBase] = useState(8000)
  const [payYears, setPayYears] = useState(25) // 累计缴费年限
  const [payIndex, setPayIndex] = useState(1.0) // 平均缴费指数 0.6 ~ 3.0
  const [personalAccountBalance, setPersonalAccountBalance] = useState(120000) // 个人账户现有本息余额
  const [futureYearsToPay, setFutureYearsToPay] = useState(5) // 预计还打算自己/单位交多少年

  // 3. 灵活就业断缴决策比价参数
  const [flexPayBase, setFlexPayBase] = useState(6000) // 灵活就业申报月基数（最低档~100%）
  const [flexCompareYears, setFlexCompareYears] = useState(5) // 纠结自费交5年还是存银行

  // 当前城市基数
  const currentCity = useMemo(() => {
    const found = cityPensionData.find(c => c.id === selectedCityId) || cityPensionData[0]
    if (selectedCityId === 'custom') {
      return { ...found, base: Number(customBase) || 8000 }
    }
    return found
  }, [selectedCityId, customBase])

  // -------------------------------------------------------------
  // 核心计算 1：2025 渐进式延迟法定退休年龄精确测算法
  // 依据《关于实施渐进式延迟法定退休年龄的决定》（2025年1月1日起施行）
  // -------------------------------------------------------------
  const delayRetireInfo = useMemo(() => {
    // 原法定退休年龄
    let originAge = 60
    let targetAge = 63
    let intervalMonths = 4 // 每几个月延迟1个月

    if (personType === 'female_cadre') {
      originAge = 55
      targetAge = 58
      intervalMonths = 4
    } else if (personType === 'female_worker') {
      originAge = 50
      targetAge = 55
      intervalMonths = 2
    }

    // 原退休年月 (出生年月 + 原退休年龄)
    const originRetireYear = birthYear + originAge
    const originRetireMonth = birthMonth

    // 政策实施起始点：2025年1月
    // 计算自 2025年1月到原退休年龄的月份差
    const monthsFrom2025 = (originRetireYear - 2025) * 12 + (originRetireMonth - 1)

    let delayMonths = 0
    if (monthsFrom2025 >= 0) {
      // 在 2025年1月1日及之后达到原法定退休年龄
      const maxDelay = (targetAge - originAge) * 12
      const calcDelay = Math.ceil((monthsFrom2025 + 1) / intervalMonths)
      delayMonths = Math.min(maxDelay, Math.max(1, calcDelay))
    } else {
      // 2025年前已达原退休年龄，不延迟
      delayMonths = 0
    }

    // 延迟后的法定退休年月
    const totalRetireMonths = (birthYear * 12 + birthMonth - 1) + (originAge * 12) + delayMonths
    const actualRetireYear = Math.floor(totalRetireMonths / 12)
    const actualRetireMonth = (totalRetireMonths % 12) + 1
    const actualRetireAgeFloat = (originAge + delayMonths / 12).toFixed(1)
    const actualRetireAgeYears = Math.floor(originAge + delayMonths / 12)
    const actualRetireAgeExtraMonths = delayMonths % 12

    // 最低缴费年限要求（从2030年开始由15年逐步提高至20年，每年提高6个月）
    let minPayYearsRequired = 15
    if (actualRetireYear >= 2030) {
      const yearsAfter2030 = actualRetireYear - 2030 + 1
      minPayYearsRequired = Math.min(20, 15 + Math.floor(yearsAfter2030 * 0.5))
    }

    // 弹性退休区间（可自愿提前最长3年且不低于原退休年龄，或协商推迟最长3年）
    const earliestRetireYear = Math.max(originRetireYear, actualRetireYear - 3)
    const latestRetireYear = actualRetireYear + 3

    return {
      originAge,
      targetAge,
      originRetireDate: `${originRetireYear}年${originRetireMonth}月`,
      delayMonths,
      actualRetireYear,
      actualRetireMonth,
      actualRetireDate: `${actualRetireYear}年${actualRetireMonth}月`,
      actualRetireAgeFloat,
      actualRetireAgeYears,
      actualRetireAgeExtraMonths,
      minPayYearsRequired,
      earliestRetireDate: `${earliestRetireYear}年${actualRetireMonth}月`,
      latestRetireDate: `${latestRetireYear}年${actualRetireMonth}月`
    }
  }, [birthYear, birthMonth, personType])

  // -------------------------------------------------------------
  // 核心计算 2：法定基本养老金月发金额测算
  // 基础养老金 + 个人账户养老金
  // -------------------------------------------------------------
  const pensionResult = useMemo(() => {
    const totalYears = payYears + futureYearsToPay
    const retireAgeInt = Math.round(parseFloat(delayRetireInfo.actualRetireAgeFloat))
    const monthsFactor = getMonthsFactor(retireAgeInt)

    // 1. 基础养老金 = 退休当年省社平工资 × (1 + 平均缴费指数) ÷ 2 × 缴费年限 × 1%
    const basePensionMonthly = currentCity.base * ((1 + payIndex) / 2) * totalYears * 0.01

    // 2. 预估后续缴费增加的个人账户储蓄 (月缴费基数 * 8% * 12 * 预估年数 * 稳健年化3.5%结息)
    const futureMonthlyBase = currentCity.base * payIndex
    const futureAccountAdd = futureMonthlyBase * 0.08 * 12 * futureYearsToPay * 1.15

    const finalAccountBalance = personalAccountBalance + futureAccountAdd

    // 3. 个人账户养老金 = 个人账户储存额 ÷ 计发月数
    const personalAccountMonthly = finalAccountBalance / monthsFactor

    // 4. 总月发退休金（退休第一年起薪估算）
    const totalMonthlyPension = basePensionMonthly + personalAccountMonthly

    // 5. 相当于退休前月薪替代率 (按参保工资估算)
    const wageBeforeRetire = currentCity.base * payIndex
    const replacementRate = wageBeforeRetire > 0 ? Math.round((totalMonthlyPension / wageBeforeRetire) * 100) : 50

    return {
      totalYears,
      monthsFactor,
      basePensionMonthly: Math.round(basePensionMonthly),
      personalAccountMonthly: Math.round(personalAccountMonthly),
      finalAccountBalance: Math.round(finalAccountBalance),
      totalMonthlyPension: Math.round(totalMonthlyPension),
      replacementRate
    }
  }, [delayRetireInfo, payYears, futureYearsToPay, payIndex, currentCity.base, personalAccountBalance])

  // -------------------------------------------------------------
  // 核心计算 3：灵活就业“自掏腰包续交社保” vs “存银行买定期” 终身划算度比价
  // -------------------------------------------------------------
  const flexDecisionResult = useMemo(() => {
    // 灵活就业养老缴费费率 20%（8%进个人账户，12%进统筹基金）
    const monthlyFlexCost = flexPayBase * 0.2
    const totalFlexCost = monthlyFlexCost * 12 * flexCompareYears

    // 如果交这N年，增加的基础养老金：计发基数 * (1 + 缴费指数) / 2 * N年 * 1%
    const estimatedIndex = Math.min(3, Math.max(0.6, flexPayBase / currentCity.base))
    const addedBasePension = currentCity.base * ((1 + estimatedIndex) / 2) * flexCompareYears * 0.01

    // 增加的个人账户养老金：(月基数 * 8% * 12 * N年) / 139个月
    const addedPersonalAccount = (flexPayBase * 0.08 * 12 * flexCompareYears) / 139

    const monthlyAddedPension = Math.round(addedBasePension + addedPersonalAccount)
    const yearlyAddedPension = monthlyAddedPension * 12

    // 社保回本年数
    const breakEvenYears = yearlyAddedPension > 0 ? (totalFlexCost / yearlyAddedPension).toFixed(1) : 0

    // 银行定期如果存同等金额（假定年化收益 2.0% 单利）
    const bankYearlyInterest = Math.round(totalFlexCost * 0.02)
    const bankMonthlyInterest = Math.round(bankYearlyInterest / 12)

    // 活到75岁、85岁时，自交社保累计净回报与银行对比
    const lifetimeYearsPastRetire = 20 // 假定退休后生活20年（活到80~83岁）
    // 社保每年平均按 2.5% 调待增长
    let totalPensionReceived = 0
    let currentYearly = yearlyAddedPension
    for (let i = 0; i < lifetimeYearsPastRetire; i++) {
      totalPensionReceived += currentYearly
      currentYearly *= 1.025
    }
    const netPensionProfit = Math.round(totalPensionReceived - totalFlexCost)

    return {
      monthlyFlexCost: Math.round(monthlyFlexCost),
      totalFlexCost: Math.round(totalFlexCost),
      monthlyAddedPension,
      yearlyAddedPension,
      breakEvenYears,
      bankMonthlyInterest,
      totalPensionReceived: Math.round(totalPensionReceived),
      netPensionProfit
    }
  }, [flexPayBase, flexCompareYears, currentCity.base])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf9f6', color: '#1c1917', pb: 10 }}>
      {/* 顶部面包屑与标题区 */}
      <Box sx={{ pt: 3.5, pb: 3, backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e4' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Button
              component={Link}
              to="/"
              size="small"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{ color: '#78716c', fontWeight: 600, p: 0, minWidth: 'auto', '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
            >
              返回首页
            </Button>
            <Typography variant="caption" sx={{ color: '#d6d3d1' }}>/</Typography>
            <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
              法定退休金与延迟退休测算
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.35rem', sm: '1.65rem' }, color: '#1c1917' }}>
                  2025 法定退休金与延迟退休精算器
                </Typography>
                <Chip
                  label="严格适配 2025 渐进式延迟退休新规"
                  size="small"
                  sx={{ bgcolor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', fontWeight: 700, fontSize: '0.74rem' }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#78716c' }}>
                精确计算法定退休年月、基础养老金与个人账户终身发放额，附失业自费续交社保划算度比对模型。
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/layoff-calculator')}
                sx={{ borderColor: '#e7e5e4', color: '#44403c', fontSize: '0.82rem' }}
              >
                裁员赔偿测算器
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/dashboard')}
                sx={{ borderColor: '#e7e5e4', color: '#44403c', fontSize: '0.82rem' }}
              >
                自救工作台
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 主体交互区域 */}
      <Container maxWidth="lg" sx={{ py: 3.5 }}>
        
        {/* 第一部分：2025 渐进式延迟退休新规判定大看板 */}
        <Paper elevation={0} sx={{ p: { xs: 2.2, sm: 3 }, mb: 3.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EventNoteIcon sx={{ color: '#c2410c', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1c1917' }}>
              第一步：法定退休年龄与时间窗口精算 (2025年起新政)
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            {/* 左侧：输入出生与身份 */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.78rem', display: 'block', mb: 0.8 }}>
                    1. 您的性别与工作身份类型
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1 }}>
                    {[
                      { id: 'male', label: '男职工', sub: '原60岁 → 渐延至63岁' },
                      { id: 'female_cadre', label: '女干部/技术岗', sub: '原55岁 → 渐延至58岁' },
                      { id: 'female_worker', label: '女工人/普通岗', sub: '原50岁 → 渐延至55岁' }
                    ].map(item => (
                      <Box
                        key={item.id}
                        onClick={() => setPersonType(item.id)}
                        sx={{
                          p: 1.2,
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          textAlign: 'center',
                          bgcolor: personType === item.id ? '#fff7ed' : '#f9fafb',
                          border: '1px solid',
                          borderColor: personType === item.id ? '#c2410c' : '#e5e7eb',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem', color: personType === item.id ? '#c2410c' : '#111827' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.66rem', display: 'block', mt: 0.2 }}>
                          {item.sub}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* 出生年份与月份 */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.76rem' }}>
                        出生年份
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c' }}>
                        {birthYear} 年
                      </Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={birthYear}
                      min={1965}
                      max={2000}
                      step={1}
                      onChange={(e, v) => setBirthYear(v)}
                      sx={{ color: '#c2410c', py: 0.6 }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.76rem' }}>
                        出生月份
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c' }}>
                        {birthMonth} 月
                      </Typography>
                    </Box>
                    <Slider
                      size="small"
                      value={birthMonth}
                      min={1}
                      max={12}
                      step={1}
                      onChange={(e, v) => setBirthMonth(v)}
                      sx={{ color: '#c2410c', py: 0.6 }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* 右侧：测算出的法定延迟退休年月与弹性窗口 */}
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  p: 2.2,
                  borderRadius: 2,
                  bgcolor: '#faf9f6',
                  border: '1px solid #fed7aa',
                  position: 'relative'
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>法定改革后退休年月</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#c2410c', mt: 0.3, fontSize: '1.15rem' }}>
                      {delayRetireInfo.actualRetireDate}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9a3412', fontSize: '0.72rem' }}>
                      满 {delayRetireInfo.actualRetireAgeYears} 周岁
                      {delayRetireInfo.actualRetireAgeExtraMonths > 0 ? `零 ${delayRetireInfo.actualRetireAgeExtraMonths} 个月` : ''}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>较旧政策顺延时间</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', mt: 0.3, fontSize: '1.15rem' }}>
                      {delayRetireInfo.delayMonths === 0 ? '不顺延' : `延迟 ${delayRetireInfo.delayMonths} 个月`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.72rem' }}>
                      原法定退休：{delayRetireInfo.originRetireDate}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>届时最低缴费年限要求</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', mt: 0.3, fontSize: '1.15rem' }}>
                      {delayRetireInfo.minPayYearsRequired} 年
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.72rem' }}>
                      {delayRetireInfo.actualRetireYear >= 2030 ? '2030年起提高要求' : '当前维持15年底线'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1.5, borderColor: '#e7e5e4' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#44403c', fontWeight: 700, fontSize: '0.75rem' }}>
                    法定弹性自愿空间：
                  </Typography>
                  <Chip
                    label={`最早可弹性提前至：${delayRetireInfo.earliestRetireDate}`}
                    size="small"
                    sx={{ bgcolor: '#ffffff', color: '#1f2937', border: '1px solid #d1d5db', fontSize: '0.72rem', height: 22 }}
                  />
                  <Chip
                    label={`协商最晚可推迟至：${delayRetireInfo.latestRetireDate}`}
                    size="small"
                    sx={{ bgcolor: '#ffffff', color: '#1f2937', border: '1px solid #d1d5db', fontSize: '0.72rem', height: 22 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 第二部分：法定基本养老金月发金额精准公式模型 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* 左侧：社保缴费基数与年限调节 */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BalanceIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '0.98rem' }}>
                  第二步：参保缴费档案参数
                </Typography>
              </Box>

              <Stack spacing={2.2}>
                {/* 城市计发基数 */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.76rem' }}>
                      退休所在城市（当地养老计发月基数）
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.74rem' }}>
                      基数：¥{currentCity.base.toLocaleString()}/月
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                    {cityPensionData.map(c => (
                      <Chip
                        key={c.id}
                        label={c.name}
                        size="small"
                        onClick={() => setSelectedCityId(c.id)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: selectedCityId === c.id ? 700 : 500,
                          fontSize: '0.72rem',
                          height: 24,
                          bgcolor: selectedCityId === c.id ? '#1f2937' : '#ffffff',
                          color: selectedCityId === c.id ? '#ffffff' : '#4b5563',
                          border: selectedCityId === c.id ? '1px solid #1f2937' : '1px solid #e5e7eb'
                        }}
                      />
                    ))}
                  </Box>
                  {selectedCityId === 'custom' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="输入您所在城市当年在岗月平均工资"
                      value={customBase}
                      onChange={(e) => setCustomBase(e.target.value)}
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                {/* 已累计缴费年限 */}
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                      目前已累计社保缴费年限
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>
                      {payYears} 年
                    </Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={payYears}
                    min={1}
                    max={40}
                    step={1}
                    onChange={(e, v) => setPayYears(v)}
                    sx={{ color: '#c2410c', py: 0.6 }}
                  />
                </Box>

                {/* 预计后续还要交几年 */}
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                      距离法定退休预计还打算续交
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c' }}>
                      {futureYearsToPay} 年（总缴费合计 {payYears + futureYearsToPay} 年）
                    </Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={futureYearsToPay}
                    min={0}
                    max={25}
                    step={1}
                    onChange={(e, v) => setFutureYearsToPay(v)}
                    sx={{ color: '#c2410c', py: 0.6 }}
                  />
                </Box>

                {/* 历年平均缴费工资指数 */}
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                        个人平均缴费指数 (0.6 ~ 3.0)
                      </Typography>
                      <Tooltip title="按社保缴纳基数除以社平工资计算：最低档交为0.6，按当地平均工资交为1.0，封顶缴纳为3.0">
                        <HelpIcon sx={{ fontSize: 13, color: '#9ca3af', cursor: 'pointer' }} />
                      </Tooltip>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>
                      {payIndex.toFixed(1)} 倍 ({Math.round(payIndex * 100)}%)
                    </Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={payIndex}
                    min={0.6}
                    max={3.0}
                    step={0.1}
                    onChange={(e, v) => setPayIndex(v)}
                    sx={{ color: '#c2410c', py: 0.6 }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.6, mt: 0.3 }}>
                    {[
                      { l: '最低档 0.6', v: 0.6 },
                      { l: '社会平均 1.0', v: 1.0 },
                      { l: '中产高薪 1.5', v: 1.5 },
                      { l: '顶格 3.0', v: 3.0 }
                    ].map(p => (
                      <Chip
                        key={p.l}
                        label={p.l}
                        size="small"
                        onClick={() => setPayIndex(p.v)}
                        sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#ffffff', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* 个人账户现有本息总额 */}
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                      个人养老账户目前累计余额（可从电子社保卡查询）
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>
                      ¥{(personalAccountBalance / 10000).toFixed(1)} 万元
                    </Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={personalAccountBalance}
                    min={10000}
                    max={500000}
                    step={10000}
                    onChange={(e, v) => setPersonalAccountBalance(v)}
                    sx={{ color: '#c2410c', py: 0.6 }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* 右侧：测算出的月发退休金构成大屏 */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4', height: '100%' }}>
              
              {/* 核心大卡片 */}
              <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fff7ed', border: '1px solid #fed7aa', mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 700, fontSize: '0.8rem', display: 'block', mb: 0.4 }}>
                  退休首月预估月发养老金总额 (刚性终身发放)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#c2410c', fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                    ¥{pensionResult.totalMonthlyPension.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#9a3412', fontWeight: 700 }}>
                    / 月
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#c2410c', display: 'block', mt: 0.5 }}>
                  注：自退休次年起，按国家规定每年享受基本养老金普调机制（抗通胀挂钩调整）。
                </Typography>
              </Box>

              {/* 养老金两大部分拆解 */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1.5, fontSize: '0.92rem' }}>
                法定双轨构成明细拆解
              </Typography>

              <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 1.8, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>
                        1. 基础养老金（统筹池）
                      </Typography>
                      <Chip label="国家终身补贴" size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: '0.66rem', height: 18 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1d4ed8', my: 0.5 }}>
                      ¥{pensionResult.basePensionMonthly.toLocaleString()}
                      <Typography component="span" variant="caption" sx={{ color: '#6b7280', ml: 0.5 }}>/月</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem', display: 'block', lineHeight: 1.4 }}>
                      公式：{currentCity.base} × (1 + {payIndex}) ÷ 2 × {pensionResult.totalYears}年 × 1%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 1.8, borderRadius: 1.8, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>
                        2. 个人账户养老金
                      </Typography>
                      <Chip label={`计发 ${pensionResult.monthsFactor} 个月`} size="small" sx={{ bgcolor: '#ecfdf5', color: '#047857', fontSize: '0.66rem', height: 18 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#047857', my: 0.5 }}>
                      ¥{pensionResult.personalAccountMonthly.toLocaleString()}
                      <Typography component="span" variant="caption" sx={{ color: '#6b7280', ml: 0.5 }}>/月</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem', display: 'block', lineHeight: 1.4 }}>
                      退休时个人账户累计约 ¥{(pensionResult.finalAccountBalance / 10000).toFixed(1)}万 ÷ {pensionResult.monthsFactor}月
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* 关键防坑提示 */}
              <Alert severity="info" sx={{ fontSize: '0.76rem', py: 0.8, borderRadius: 1.5, '& .MuiAlert-icon': { fontSize: 18 } }}>
                <strong>重要法律保障：</strong>个人账户即便在计发月数（如120或139个月）领完后，只要人健在，国家仍将按原有金额由统筹基金全额按月终身发放，绝不停发！若参保人不幸提前离世，个人账户未领完的本息余额全额由继承人继承。
              </Alert>

            </Paper>
          </Grid>
        </Grid>

        {/* 第三部分：中年失业核心决策——灵活就业自费交社保 vs 存银行买国债 */}
        <Paper elevation={0} sx={{ p: { xs: 2.2, sm: 3 }, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUpIcon sx={{ color: '#c2410c', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1c1917' }}>
              第三步：中年失业决策比对——自掏腰包交灵活就业社保，到底划算吗？
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#78716c', mb: 2.5, fontSize: '0.86rem' }}>
            失业后无单位补贴，全额 20% 自费缴纳职工养老保险到底能不能回本？我们帮您用真实数据对比存定期与买养老保险的终身账本。
          </Typography>

          <Grid container spacing={3} alignItems="center">
            {/* 决策参数调节 */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                      灵活就业拟申报月缴费基数
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c' }}>
                      ¥{flexPayBase} / 月 (20%费率自缴 ¥{flexDecisionResult.monthlyFlexCost}/月)
                    </Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={flexPayBase}
                    min={4000}
                    max={20000}
                    step={500}
                    onChange={(e, v) => setFlexPayBase(v)}
                    sx={{ color: '#c2410c', py: 0.6 }}
                  />
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem' }}>
                    通常选择当地社平工资的 60% 最低档缴费，回本周期最短、杠杆最高。
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                      失业期间纠结自费连续缴费年限
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>
                      {flexCompareYears} 年（累计自付总投入 ¥{(flexDecisionResult.totalFlexCost / 10000).toFixed(1)} 万元）
                    </Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={flexCompareYears}
                    min={1}
                    max={15}
                    step={1}
                    onChange={(e, v) => setFlexCompareYears(v)}
                    sx={{ color: '#c2410c', py: 0.6 }}
                  />
                </Box>
              </Stack>
            </Grid>

            {/* 比对诊断卡 */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: 2.2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                      自交社保额外带来的终身月收入
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#15803d', mt: 0.5 }}>
                      + ¥{flexDecisionResult.monthlyAddedPension}
                      <Typography component="span" variant="caption" sx={{ color: '#166534', ml: 0.5 }}>/月</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#166534', fontSize: '0.72rem' }}>
                      相当于每年多拿 ¥{flexDecisionResult.yearlyAddedPension.toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                      实际全部本金收回周期
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#c2410c', mt: 0.5 }}>
                      {flexDecisionResult.breakEvenYears}
                      <Typography component="span" variant="caption" sx={{ color: '#78716c', ml: 0.5 }}>年</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#166534', fontSize: '0.72rem' }}>
                      退休领满 {flexDecisionResult.breakEvenYears} 年后，全部为纯盈利
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1.5, borderColor: '#bbf7d0' }} />

                <Typography variant="caption" sx={{ color: '#14532d', display: 'block', lineHeight: 1.6, fontSize: '0.76rem' }}>
                  <strong>深度对比分析：</strong>如果将这 {(flexDecisionResult.totalFlexCost / 10000).toFixed(1)} 万元存银行，按当前 2% 定期利息每月仅产生约 ¥{flexDecisionResult.bankMonthlyInterest} 的利息收益，且本金会被通胀不断侵蚀。而交满法定社保，不仅退休后每月到手多领 ¥{flexDecisionResult.monthlyAddedPension}（是利息的 {(flexDecisionResult.monthlyAddedPension / (flexDecisionResult.bankMonthlyInterest || 1)).toFixed(1)} 倍），而且人活着就一直发！
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

      </Container>

      <Footer />
    </Box>
  )
}

export default RetirementSalaryCalculator