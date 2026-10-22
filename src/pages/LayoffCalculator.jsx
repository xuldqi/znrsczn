import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Tooltip
} from '@mui/material'
import {
  GavelOutlined as LegalIcon,
  CalculateOutlined as CalculateIcon,
  ShieldOutlined as ShieldIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as CheckIcon,
  WarningAmber as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  BookmarkBorder as BookmarkIcon,
  HelpOutline as HelpIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 国内主要城市 2024-2026 年度社平工资与 3 倍封顶基数参考（单位：元/月）
const cityData = [
  { id: 'beijing', name: '北京', avgMonthly: 11761, cap3x: 35283 },
  { id: 'shanghai', name: '上海', avgMonthly: 12183, cap3x: 36549 },
  { id: 'shenzhen', name: '深圳', avgMonthly: 12964, cap3x: 38892 },
  { id: 'guangzhou', name: '广州', avgMonthly: 11262, cap3x: 33786 },
  { id: 'hangzhou', name: '杭州', avgMonthly: 10850, cap3x: 32550 },
  { id: 'chengdu', name: '成都', avgMonthly: 8500, cap3x: 25500 },
  { id: 'wuhan', name: '武汉', avgMonthly: 8200, cap3x: 24600 },
  { id: 'nanjing', name: '南京', avgMonthly: 9600, cap3x: 28800 },
  { id: 'suzhou', name: '苏州', avgMonthly: 9800, cap3x: 29400 },
  { id: 'xian', name: '西安', avgMonthly: 7800, cap3x: 23400 },
  { id: 'custom', name: '其他城市', avgMonthly: 8000, cap3x: 24000 }
]

const formatMoney = (val) => {
  if (!isFinite(val) || val <= 0) return '¥0'
  return `¥${Math.round(val).toLocaleString('zh-CN')}`
}

const LayoffCalculator = () => {
  const navigate = useNavigate()

  // 1. 基础参数
  const [selectedCityId, setSelectedCityId] = useState('beijing')
  const [customCap, setCustomCap] = useState(24000)

  // 2. 工作年限
  const [workYears, setWorkYears] = useState(4.5) // 年限（小数）

  // 3. 工资与收入
  const [monthlySalary, setMonthlySalary] = useState(25000) // 前12个月平均应发（税前）
  const [lastMonthSalary, setLastMonthSalary] = useState(25000) // 上月实际应发工资（代通知金基数）

  // 4. 解除性质
  // 'n_plus_one': 协商解除/无过错解除 (N+1)
  // 'n_only': 提前30天书面通知解除 (N)
  // 'two_n': 违法单方解除 (2N)
  const [severanceType, setSeveranceType] = useState('n_plus_one')

  // 5. 未休年假
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState(5)

  // 当前城市的封顶参数
  const currentCity = useMemo(() => {
    const found = cityData.find(c => c.id === selectedCityId) || cityData[0]
    if (selectedCityId === 'custom') {
      return { ...found, cap3x: Number(customCap) || 24000, avgMonthly: Math.round((Number(customCap) || 24000) / 3) }
    }
    return found
  }, [selectedCityId, customCap])

  // 精算法定折算年数 N
  const nValue = useMemo(() => {
    const fullYears = Math.floor(workYears)
    const remainder = workYears - fullYears
    if (remainder >= 0.5) {
      return fullYears + 1
    } else if (remainder > 0) {
      return fullYears + 0.5
    }
    return Math.max(0.5, fullYears)
  }, [workYears])

  // 计算经济补偿金基数（是否超过社平 3 倍）
  const isCapped = useMemo(() => {
    return monthlySalary > currentCity.cap3x
  }, [monthlySalary, currentCity.cap3x])

  // 法定经济补偿基数（月薪与社平3倍取较小值）
  const effectiveBaseSalary = useMemo(() => {
    return isCapped ? currentCity.cap3x : monthlySalary
  }, [isCapped, currentCity.cap3x, monthlySalary])

  // 法定最高补偿年限限制（超过3倍社平的，补偿年限最高不超过 12 年）
  const effectiveNValue = useMemo(() => {
    if (isCapped && severanceType !== 'two_n') {
      return Math.min(12, nValue)
    }
    return nValue
  }, [isCapped, severanceType, nValue])

  // 1. 经济补偿金部分 (N 或 2N)
  const baseSeverance = useMemo(() => {
    if (severanceType === 'two_n') {
      // 违法解除 2N
      return effectiveBaseSalary * effectiveNValue * 2
    }
    // N 或 N+1 中的 N
    return effectiveBaseSalary * effectiveNValue
  }, [severanceType, effectiveBaseSalary, effectiveNValue])

  // 2. 代通知金部分 (+1)
  const noticePay = useMemo(() => {
    if (severanceType === 'n_plus_one') {
      // 代通知金按照劳动者上一个月的月平均工资确定，不受社平 3 倍上限限制！
      return lastMonthSalary
    }
    return 0
  }, [severanceType, lastMonthSalary])

  // 3. 未休年假法定折算金
  // 法定日工资 = 月工资 / 21.75
  // 未休年假应当按照日工资收入的 300% 支付（已发放的正常工作日 100% 工资包含在内，额外补发 200%）
  const leaveCompensation = useMemo(() => {
    if (unpaidLeaveDays <= 0) return 0
    const dailyWage = monthlySalary / 21.75
    return dailyWage * 2 * unpaidLeaveDays
  }, [monthlySalary, unpaidLeaveDays])

  // 总应付经济补偿金
  const totalGrossAmount = useMemo(() => {
    return baseSeverance + noticePay + leaveCompensation
  }, [baseSeverance, noticePay, leaveCompensation])

  // 4. 个税免税额度测算
  // 根据财税〔2018〕164号文件：
  // 个人与用人单位解除劳动关系取得的一次性补偿收入，在当地上年职工平均工资 3 倍数额以内的部分，免征个人所得税
  const taxExemptLimit = useMemo(() => {
    return currentCity.avgMonthly * 12 * 3
  }, [currentCity.avgMonthly])

  const taxableAmount = useMemo(() => {
    return Math.max(0, totalGrossAmount - taxExemptLimit)
  }, [totalGrossAmount, taxExemptLimit])

  // 预估个税（免税额度内 0 个税，超额部分按综合所得预扣）
  const estimatedTax = useMemo(() => {
    if (taxableAmount <= 0) return 0
    // 超出部分按年综合所得简易测算（通常适用 10%~20% 税率）
    if (taxableAmount <= 36000) return taxableAmount * 0.03
    if (taxableAmount <= 144000) return taxableAmount * 0.1 - 2520
    if (taxableAmount <= 300000) return taxableAmount * 0.2 - 16920
    return taxableAmount * 0.25 - 31920
  }, [taxableAmount])

  // 预估实际到手
  const netTakeHome = useMemo(() => {
    return Math.max(0, totalGrossAmount - estimatedTax)
  }, [totalGrossAmount, estimatedTax])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 顶部微面包屑导航 */}
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
                onClick={() => navigate('/career')}
                sx={{ color: '#6b7280', cursor: 'pointer', '&:hover': { color: '#c2410c' } }}
              >
                职场与维权
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>/</Typography>
              <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                裁员离职赔偿 N+1 / 2N 精确计算器
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() => navigate('/pension-planner')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.82rem', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
            >
              测算养老储备缺口 →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 主页面区域 */}
      <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
        
        {/* 头部标题与法条依据 */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              icon={<LegalIcon sx={{ fontSize: '15px !important', color: '#c2410c !important' }} />}
              label="劳动法法定标准精算"
              size="small"
              sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.72rem', height: 22, borderRadius: 1 }}
            />
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              依据《劳动合同法》第 40/47/87 条及财税〔2018〕164号文件
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', fontSize: { xs: '1.25rem', sm: '1.6rem' }, mb: 0.6 }}>
            裁员离职赔偿 N+1 / 2N 与未休年假精确计算器
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.88rem', maxWidth: 840, lineHeight: 1.55 }}>
            综合各大城市社平工资 3 倍封顶红线、未提前 30 天通知代通知金、未休年假 300% 折算与离职补偿免征个税政策，精确计算您应得的每一分法定权益。
          </Typography>
        </Box>

        {/* 核心双栏计算器：左侧参数输入 + 右侧精确明细大屏 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1.15fr'
            },
            gap: 2.5,
            alignItems: 'start',
            mb: 3
          }}
        >
          {/* 左侧：输入控制台 */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid #f3f4f6' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CalculateIcon sx={{ color: '#c2410c', fontSize: 19 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                  补偿测算参数设定
                </Typography>
              </Box>
              <Chip
                label={`折算法定 N = ${effectiveNValue}`}
                size="small"
                sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.72rem', height: 22 }}
              />
            </Box>

            <Stack spacing={2.2}>
              
              {/* 1. 工作城市选择 */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.78rem' }}>
                    1. 工作所在城市 (匹配当地社平 3 倍封顶)
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                    3倍封顶: {formatMoney(currentCity.cap3x)}/月
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {cityData.map((c) => {
                    const isSelected = selectedCityId === c.id
                    return (
                      <Chip
                        key={c.id}
                        label={c.name}
                        size="small"
                        onClick={() => setSelectedCityId(c.id)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.74rem',
                          height: 24,
                          borderRadius: 1,
                          bgcolor: isSelected ? '#1f2937' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#4b5563',
                          border: isSelected ? '1px solid #1f2937' : '1px solid #e5e7eb',
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: isSelected ? '#111827' : '#f9fafb' }
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>

              {/* 2. 解除类型选择 */}
              <Box>
                <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.78rem', display: 'block', mb: 0.8 }}>
                  2. 公司解约性质与通知方式
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1 }}>
                  {[
                    { id: 'n_plus_one', title: 'N + 1 赔偿', sub: '未提前30天通知协商解除' },
                    { id: 'n_only', title: '标准 N 补偿', sub: '已提前30天书面通知' },
                    { id: 'two_n', title: '违法 2N 赔偿', sub: '公司单方开除/无故解约' },
                  ].map((item) => {
                    const isSelected = severanceType === item.id
                    return (
                      <Box
                        key={item.id}
                        onClick={() => setSeveranceType(item.id)}
                        sx={{
                          p: 1.2,
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          textAlign: 'center',
                          bgcolor: isSelected ? '#fff7ed' : '#f9fafb',
                          border: '1px solid',
                          borderColor: isSelected ? '#c2410c' : '#e5e7eb',
                          transition: 'all 0.15s',
                          '&:hover': { borderColor: '#c2410c' }
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem', color: isSelected ? '#c2410c' : '#111827' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.66rem', display: 'block', mt: 0.3 }}>
                          {item.sub}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>

              {/* 3. 在职年限滑动条 */}
              <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                    3. 在本单位实际工作年限
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem' }}>
                    {workYears} 年（折算法定 N = {nValue}）
                  </Typography>
                </Box>
                <Slider
                  size="small"
                  value={workYears}
                  min={0.5}
                  max={20}
                  step={0.5}
                  onChange={(e, v) => setWorkYears(v)}
                  sx={{ color: '#c2410c', py: 0.6 }}
                />
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem', display: 'block' }}>
                  注：6个月以上不满1年按1年算；不满6个月按0.5个月工资补偿。
                </Typography>
              </Box>

              {/* 4. 工资基数设定 */}
              <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                      4. 离职前 12 个月月均应发工资（税前）
                    </Typography>
                    <Tooltip title="包含基本工资、岗位工资、绩效奖金、提成、年终奖均摊、餐补话补等全部税前应发收入，切勿被HR用“基本工资”忽悠！">
                      <HelpIcon sx={{ fontSize: 13, color: '#9ca3af', cursor: 'pointer' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.88rem' }}>
                    ¥{monthlySalary.toLocaleString()}
                  </Typography>
                </Box>
                <Slider
                  size="small"
                  value={monthlySalary}
                  min={4000}
                  max={80000}
                  step={1000}
                  onChange={(e, v) => setMonthlySalary(v)}
                  sx={{ color: '#c2410c', py: 0.6 }}
                />

                <Box sx={{ display: 'flex', gap: 0.6, mt: 0.4, mb: 1, flexWrap: 'wrap' }}>
                  {[10000, 15000, 20000, 25000, 35000, 50000].map(amt => (
                    <Chip
                      key={amt}
                      label={`¥${amt / 1000}k`}
                      size="small"
                      onClick={() => setMonthlySalary(amt)}
                      sx={{ fontSize: '0.68rem', height: 20, bgcolor: '#ffffff', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                    />
                  ))}
                </Box>

                {isCapped && (
                  <Alert severity="warning" sx={{ py: 0.2, px: 1, fontSize: '0.72rem', mt: 0.5, '& .MuiAlert-icon': { fontSize: 16 } }}>
                    您的月薪高于 {currentCity.name} 社平工资 3 倍（{formatMoney(currentCity.cap3x)}），按法律规定法定补偿基数将按 {formatMoney(currentCity.cap3x)} 封顶计算，最高折算年限不超过 12 年。
                  </Alert>
                )}
              </Box>

              {/* 5. 未休年假天数 */}
              <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.76rem', fontWeight: 700 }}>
                    5. 当年度剩余未休带薪年假天数
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#c2410c', fontSize: '0.85rem' }}>
                    {unpaidLeaveDays} 天（额外补发 200% 日薪）
                  </Typography>
                </Box>
                <Slider
                  size="small"
                  value={unpaidLeaveDays}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(e, v) => setUnpaidLeaveDays(v)}
                  sx={{ color: '#c2410c', py: 0.6 }}
                />
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem' }}>
                  依据《企业职工带薪年休假实施办法》第10条：未休年假折算日薪按 300% 结算（含当期工资，净补发2倍日薪）。
                </Typography>
              </Box>

            </Stack>
          </Paper>

          {/* 右侧：精确明细看板大屏 */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
            
            {/* 顶栏总额诊断卡 */}
            <Box
              sx={{
                p: 2.2,
                borderRadius: 2,
                bgcolor: '#fff7ed',
                border: '1px solid #fed7aa',
                borderLeft: '5px solid #c2410c',
                mb: 2.5
              }}
            >
              <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 700, fontSize: '0.78rem', display: 'block', mb: 0.5 }}>
                法定应得税前补偿总包预估
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#c2410c', fontSize: { xs: '1.8rem', sm: '2.2rem' }, mb: 0.6 }}>
                {formatMoney(totalGrossAmount)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#431407', fontSize: '0.76rem' }}>
                  当地免征个税额度：{formatMoney(taxExemptLimit)}（免征额内 0 个税）
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#15803d', fontSize: '0.78rem' }}>
                  预估税后净到账：{formatMoney(netTakeHome)}
                </Typography>
              </Box>
            </Box>

            {/* 四项补偿细目拆解 */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1.5, fontSize: '0.9rem' }}>
              应得补偿费用法定明细拆解
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 2.5 }}>
              {/* 明细 1：经济补偿金 */}
              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Chip label={severanceType === 'two_n' ? '2N 赔偿' : 'N 补偿'} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.82rem' }}>
                      法定解约经济补偿金
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    {formatMoney(baseSeverance)}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                  计算公式：{formatMoney(effectiveBaseSalary)} (补偿基数) × {effectiveNValue} (折算年数) {severanceType === 'two_n' ? '× 2 (违法加倍)' : ''}
                </Typography>
              </Box>

              {/* 明细 2：代通知金 (+1) */}
              {severanceType === 'n_plus_one' && (
                <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Chip label="+1 代通知金" size="small" sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.82rem' }}>
                        未提前30天书面通知补偿
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#047857' }}>
                      {formatMoney(noticePay)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    依据《劳动合同法》第40条：以用人单位上月实际发放工资金额为准，不设社平3倍封顶。
                  </Typography>
                </Box>
              )}

              {/* 明细 3：未休年假折算金 */}
              {unpaidLeaveDays > 0 && (
                <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Chip label="年假折现" size="small" sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.82rem' }}>
                        {unpaidLeaveDays} 天未休带薪年假补偿
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b45309' }}>
                      {formatMoney(leaveCompensation)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    日工资约 {formatMoney(monthlySalary / 21.75)} × 200% 额外支付 × {unpaidLeaveDays} 天。
                  </Typography>
                </Box>
              )}

              {/* 明细 4：个税免税减免情况 */}
              <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Chip label="税务免征" size="small" sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontWeight: 700, fontSize: '0.68rem', height: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.82rem' }}>
                      一次性离职经济补偿个税
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: estimatedTax > 0 ? '#b91c1c' : '#15803d' }}>
                    {estimatedTax > 0 ? `预扣个税约 ${formatMoney(estimatedTax)}` : '免征 0 个税'}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                  {totalGrossAmount <= taxExemptLimit
                    ? `总补偿金在 ${currentCity.name} 上年年均工资 3 倍（${formatMoney(taxExemptLimit)}）以内，全额免征个税！`
                    : `超出免征额度（${formatMoney(taxExemptLimit)}）部分需依法计征个税。`}
                </Typography>
              </Box>
            </Stack>

            {/* 约谈谈判三原则备忘便签 */}
            <Box sx={{ p: 1.8, borderRadius: 1.8, bgcolor: '#fafaf9', border: '1px solid #e7e5e4' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                <BookmarkIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '0.8rem' }}>
                  约谈现场的 3 条保命谈判原则:
                </Typography>
              </Box>
              <Stack spacing={0.6}>
                <Typography variant="caption" sx={{ color: '#44403c', fontSize: '0.74rem', display: 'block' }}>
                  1. <strong>绝不现场签字</strong>：统一回复“协议草案我带回家看清，明天书面答复”，防备被套路自愿离职。
                </Typography>
                <Typography variant="caption" sx={{ color: '#44403c', fontSize: '0.74rem', display: 'block' }}>
                  2. <strong>算清基数总和</strong>：补偿基数必须包含过去12个月的绩效、季度奖与年终奖均摊，并非单纯底薪。
                </Typography>
                <Typography variant="caption" sx={{ color: '#44403c', fontSize: '0.74rem', display: 'block' }}>
                  3. <strong>离职证明写明解约原因</strong>：必须写明“用人单位提出解除”，否则无法享受失业金与医保代缴。
                </Typography>
              </Stack>
            </Box>

          </Paper>
        </Box>

        {/* 底部相关真实案例指引 */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
                离职维权与劳动仲裁真实实战经历
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                知乎高赞实操帖：从取证、仲裁立案到拿到 2N 赔偿全过程记录
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => navigate('/career')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              浏览全部职场维权帖子 →
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Paper
              elevation={0}
              onClick={() => navigate('/article/web-zhihu-layoff-arbitration-guide')}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#ffffff',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: '#fdba74', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', '& .art-title': { color: '#c2410c' } }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <Chip label="知乎专栏" size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '0.7rem', fontWeight: 700, height: 20 }} />
                <Chip label="职场维权" size="small" sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontSize: '0.68rem', height: 20 }} />
                <Typography variant="caption" sx={{ color: '#9ca3af', ml: 'auto' }}>3.5k 赞同</Typography>
              </Box>
              <Typography className="art-title" variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 0.6, fontSize: '0.94rem' }}>
                突遭裁员的法律自救指南：从固定证据、劳动仲裁到争取 2N 赔偿完整过程
              </Typography>
              <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.84rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>
                公司以“绩效不合格”为由单方辞退合法吗？手把手教你如何取证考勤打卡、核算未休年假 300% 折算与申请劳动仲裁立案。
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="small" variant="text" sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.78rem', p: 0 }}>
                  阅读全文 →
                </Button>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              onClick={() => navigate('/article/web-zhihu-35-developer-real')}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#ffffff',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: '#fdba74', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', '& .art-title': { color: '#c2410c' } }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <Chip label="知乎高赞" size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '0.7rem', fontWeight: 700, height: 20 }} />
                <Chip label="真实实录" size="small" sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontSize: '0.68rem', height: 20 }} />
                <Typography variant="caption" sx={{ color: '#9ca3af', ml: 'auto' }}>3.4k 赞同</Typography>
              </Box>
              <Typography className="art-title" variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 0.6, fontSize: '0.94rem' }}>
                35岁程序员被裁后都去哪了？100+位前大厂员工的真实去向与生存实录
              </Typography>
              <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.84rem', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>
                深度访谈近两年从一线大厂被优化的 108 位 35+ 程序员。详细梳理降薪去国企小厂、出海做外包以及开网约车的真实收入与心理落差。
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="small" variant="text" sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.78rem', p: 0 }}>
                  阅读全文 →
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>

      </Container>

      <Footer />
    </Box>
  )
}

export default LayoffCalculator
