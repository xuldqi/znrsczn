import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Stack,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material'
import { useArticles } from '../contexts/ArticleContext'

const defaultForm = {
  currentAge: 40,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentSavings: 300000,
  monthlyContribution: 5000,
  expectedReturn: 6, // 年化收益率 %
  postRetirementReturn: 4, // 退休后年化收益率 %
  inflationRate: 2.5, // 年化通胀率 %
  desiredMonthlyExpense: 12000,
  pensionIncome: 4000,
}

const formatCurrency = (value) => {
  if (!isFinite(value)) return '—'
  return value.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: value >= 100000 ? 0 : 2,
  })
}

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`

const clamps = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback)

const monthlyRate = (annualRate) => Math.pow(1 + annualRate, 1 / 12) - 1

const simulatePlan = (state) => {
  const currentAge = clamps(Number(state.currentAge), defaultForm.currentAge)
  const retirementAge = clamps(Number(state.retirementAge), defaultForm.retirementAge)
  const lifeExpectancy = Math.max(retirementAge, clamps(Number(state.lifeExpectancy), defaultForm.lifeExpectancy))

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
  let totalContribution = 0
  const timeline = []

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
        })
      }
    }
  } else {
    timeline.push({
      phase: '积累期',
      age: Math.round(currentAge),
      balance: Math.max(balance, 0),
    })
  }

  const expenseAtRetirement = desiredExpense * Math.pow(1 + inflationMonthly, monthsToRetirement)
  const pensionAtRetirement = pensionIncomeBase * Math.pow(1 + inflationMonthly, monthsToRetirement)

  let retirementBalance = balance
  let cumulativeWithdrawals = 0
  let shortfallMonth = null
  let expense = expenseAtRetirement
  let pension = pensionAtRetirement

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
        phase: '退休期',
        age: Math.round(age),
        balance: Math.max(retirementBalance, 0),
      })
    }

    expense *= 1 + inflationMonthly
    pension *= 1 + inflationMonthly
    if (retirementBalance <= 0) {
      break
    }
  }

  const retirementDurationCovered = shortfallMonth === null
    ? retirementMonths
    : shortfallMonth

  return {
    yearsToRetirement,
    retirementYears,
    totalContribution,
    retirementBalance,
    cumulativeWithdrawals,
    expenseAtRetirement,
    pensionAtRetirement,
    inflationMonthly,
    accumulationRate,
    postReturnRate,
    timeline,
    success: shortfallMonth === null,
    yearsCovered: retirementDurationCovered / 12,
  }
}

const PensionPlanner = () => {
  const [form, setForm] = useState(defaultForm)
  const navigate = useNavigate()
  const { articles, loading: articlesLoading, error: articlesError } = useArticles()

  const result = useMemo(() => simulatePlan(form), [form])
  const pensionArticles = useMemo(() => {
    const list = Object.values(articles || {})
    return list
      .filter(article => {
        if (article.status !== 'published') return false
        const title = article.title || ''
        const tags = article.tags || []
        return article.category === '财务管理'
          || title.includes('养老')
          || tags.some(tag => tag.includes('养老'))
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
  }, [articles])

  const handleChange = (key) => (event) => {
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value === '' ? '' : Number(event.target.value),
    }))
  }

  const scrollToTool = useCallback(() => {
    const element = document.getElementById('planner-tool')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleViewArticle = useCallback((id) => {
    navigate(`/article/${id}`)
  }, [navigate])

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Paper
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            px: { xs: 4, md: 6 },
            py: { xs: 5, md: 7 },
            color: 'common.white',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #9333ea 100%)',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
          <Stack spacing={3} sx={{ position: 'relative' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" sx={{ letterSpacing: 4 }}>
                  养老规划中心
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  一键测算中年家庭的养老资金缺口
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 520, opacity: 0.9 }}>
                  根据通胀、收益假设和养老金数据，实时得到退休资金可持续年限。点击下方按钮立即开始测算，
                  同时查阅精选养老规划文章，搭建属于自己的第三支柱资产组合。
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={scrollToTool}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(6px)',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                }}
              >
                立即开始测算
              </Button>
            </Stack>

            <Grid container spacing={2}>
              <MetricCard
                label="距离退休"
                value={`${result.yearsToRetirement.toFixed(1)} 年`}
              />
              <MetricCard
                label="退休时资产规模"
                value={formatCurrency(result.retirementBalance)}
              />
              <MetricCard
                label="首年退休月支出"
                value={formatCurrency(result.expenseAtRetirement)}
              />
              <MetricCard
                label="资金可覆盖年限"
                value={result.success
                  ? `${result.retirementYears.toFixed(1)} 年`
                  : `${result.yearsCovered.toFixed(1)} 年`}
              />
            </Grid>
          </Stack>
        </Paper>

        <Grid container spacing={3} id="planner-tool">
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Stack spacing={3}>
                <Typography variant="h5">
                  基础信息
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="当前年龄"
                      type="number"
                      fullWidth
                      value={form.currentAge}
                      onChange={handleChange('currentAge')}
                      inputProps={{ min: 18, max: 80 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="计划退休年龄"
                      type="number"
                      fullWidth
                      value={form.retirementAge}
                      onChange={handleChange('retirementAge')}
                      inputProps={{ min: 40, max: 80 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="预计寿命"
                      type="number"
                      fullWidth
                      value={form.lifeExpectancy}
                      onChange={handleChange('lifeExpectancy')}
                      inputProps={{ min: form.retirementAge, max: 110 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="当前养老储蓄 (¥)"
                      type="number"
                      fullWidth
                      value={form.currentSavings}
                      onChange={handleChange('currentSavings')}
                      inputProps={{ min: 0, step: 10000 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="每月投入 (¥)"
                      type="number"
                      fullWidth
                      value={form.monthlyContribution}
                      onChange={handleChange('monthlyContribution')}
                      inputProps={{ min: 0, step: 500 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="退休后每月养老金 (¥)"
                      type="number"
                      fullWidth
                      value={form.pensionIncome}
                      onChange={handleChange('pensionIncome')}
                      inputProps={{ min: 0, step: 100 }}
                    />
                  </Grid>
                </Grid>

                <Divider />
                <Typography variant="h5">
                  投资与通胀假设
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="积累期年化收益率 (%)"
                      type="number"
                      fullWidth
                      value={form.expectedReturn}
                      onChange={handleChange('expectedReturn')}
                      inputProps={{ step: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="退休期年化收益率 (%)"
                      type="number"
                      fullWidth
                      value={form.postRetirementReturn}
                      onChange={handleChange('postRetirementReturn')}
                      inputProps={{ step: 0.5 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="年化通胀假设 (%)"
                      type="number"
                      fullWidth
                      value={form.inflationRate}
                      onChange={handleChange('inflationRate')}
                      inputProps={{ step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="退休目标月支出 (¥，以今天币值)"
                      type="number"
                      fullWidth
                      value={form.desiredMonthlyExpense}
                      onChange={handleChange('desiredMonthlyExpense')}
                      inputProps={{ min: 0, step: 500 }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Paper sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      积累期概览
                    </Typography>
                    <Stack spacing={1.5}>
                      <InfoRow
                        label="距离退休"
                        value={`${result.yearsToRetirement.toFixed(1)} 年`}
                      />
                      <InfoRow
                        label="退休时账户规模（名义）"
                        value={formatCurrency(result.retirementBalance)}
                      />
                      <InfoRow
                        label="累计本金投入（含通胀调整）"
                        value={formatCurrency(result.totalContribution)}
                      />
                      <InfoRow
                        label="积累期实际年化收益"
                        value={formatPercent(result.accumulationRate * 12)}
                      />
                    </Stack>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      退休期概览
                    </Typography>
                    <Stack spacing={1.5}>
                      <InfoRow
                        label="首年退休月支出（含通胀）"
                        value={formatCurrency(result.expenseAtRetirement)}
                      />
                      <InfoRow
                        label="首年养老金（月）"
                        value={formatCurrency(result.pensionAtRetirement)}
                      />
                      <InfoRow
                        label="累计提取金额（名义）"
                        value={formatCurrency(result.cumulativeWithdrawals)}
                      />
                      <InfoRow
                        label="资金可支撑年限"
                        value={result.success
                          ? `${result.retirementYears.toFixed(1)} 年（覆盖至 ${form.lifeExpectancy} 岁）`
                          : `${result.yearsCovered.toFixed(1)} 年后耗尽`}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              {!result.success && (
                <Alert severity="warning" variant="outlined">
                  现有假设下，养老金与投资组合只能覆盖约 {result.yearsCovered.toFixed(1)} 年退休生活。
                  建议提升积累期投入、延后退休或调低退休期支出 / 提高收益假设。
                </Alert>
              )}

              <Paper sx={{ p: 3, flex: 1 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      年度资产轨迹
                    </Typography>
                    <Chip
                      label={result.success ? '资金贯穿全退休期' : '提前耗尽提醒'}
                      color={result.success ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                  <Box sx={{ maxHeight: 360, overflow: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>阶段</TableCell>
                          <TableCell>年龄</TableCell>
                          <TableCell align="right">期末资产 (¥)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.timeline.map((row, index) => (
                          <TableRow key={`${row.phase}-${row.age}-${index}`}>
                            <TableCell>{row.phase}</TableCell>
                            <TableCell>{row.age}</TableCell>
                            <TableCell align="right">{formatCurrency(row.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                养老规划精选文章
              </Typography>
              <Typography variant="body1" color="text.secondary">
                从现金流管理到第三支柱搭建，精选文章帮助你把测算结果落地执行。
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/articles?category=财务管理')}
            >
              查看更多财务文章
            </Button>
          </Stack>

          {articlesError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              加载养老文章时出错：{articlesError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {articlesLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={`pension-skeleton-${index}`}>
                  <Paper sx={{ p: 3 }}>
                    <Skeleton variant="text" width="60%" height={36} />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="rectangular" height={80} sx={{ my: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" width="40%" />
                  </Paper>
                </Grid>
              ))
              : pensionArticles.map(article => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack spacing={2}>
                        <Chip label={article.category} color="primary" size="small" />
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, lineHeight: 1.4 }}
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {article.excerpt}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ px: 3, pb: 3 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleViewArticle(article.id)}
                      >
                        阅读文章
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            {!articlesLoading && pensionArticles.length === 0 && !articlesError && (
              <Grid item xs={12}>
                <Alert severity="info">
                  暂未找到符合条件的养老规划文章，请稍后再试。
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Stack>
    </Container>
  )
}

const InfoRow = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
)

const MetricCard = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.12)',
        color: 'inherit',
        border: '1px solid rgba(255,255,255,0.18)',
      }}
      elevation={0}
    >
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
)

export default PensionPlanner
