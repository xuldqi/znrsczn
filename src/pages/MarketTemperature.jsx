import { useState, useMemo } from 'react'
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
  Grid,
  Divider,
  Alert,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  Breadcrumbs
} from '@mui/material'
import {
  NavigateNext as NavigateNextIcon,
  Thermostat as ThermostatIcon,
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircleOutline as CheckIcon,
  WarningAmber as WarningIcon,
  InfoOutlined as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  HelpOutline as HelpIcon,
  MenuBook as BookIcon,
  Tune as TuneIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 指数估值与温度参考数据集
const marketIndices = [
  {
    name: '中证红利',
    code: '000922',
    temperature: 18,
    pe: 6.5,
    pePercentile: '14%',
    pb: 0.72,
    dividendYield: '5.8%',
    status: '极度低估',
    color: '#059669',
    advice: '高股息现金流护城河，适合作为长期底仓'
  },
  {
    name: '沪深300',
    code: '000300',
    temperature: 26,
    pe: 11.6,
    pePercentile: '25%',
    pb: 1.25,
    dividendYield: '3.2%',
    status: '低估区间',
    color: '#047857',
    advice: '大盘核心资产，估值处于历史低分位，适合定投'
  },
  {
    name: '中证500',
    code: '000905',
    temperature: 24,
    pe: 21.3,
    pePercentile: '22%',
    pb: 1.62,
    dividendYield: '2.1%',
    status: '低估区间',
    color: '#047857',
    advice: '中盘成长风格，周期弹性大，适合分批建仓'
  },
  {
    name: '恒生科技',
    code: 'HSTECH',
    temperature: 16,
    pe: 18.2,
    pePercentile: '12%',
    pb: 1.95,
    dividendYield: '1.8%',
    status: '极度低估',
    color: '#059669',
    advice: '离岸中概龙头，海外流动性拐点期的高弹性资产'
  },
  {
    name: '创业板指',
    code: '399006',
    temperature: 34,
    pe: 28.6,
    pePercentile: '32%',
    pb: 3.40,
    dividendYield: '1.2%',
    status: '合理偏低',
    color: '#2563eb',
    advice: '新能源与高端制造，分批定投，避免一次性重仓'
  },
  {
    name: '纳斯达克100',
    code: 'NDX',
    temperature: 78,
    pe: 32.4,
    pePercentile: '82%',
    pb: 7.20,
    dividendYield: '0.8%',
    status: '偏高/过热',
    color: '#dc2626',
    advice: '全球科技龙头但当前估值偏高，只适合定投或逢高止盈'
  }
]

export default function MarketTemperature() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('temperature') // 'temperature' | 'fourPots' | 'philosophy'

  // 温度计交互模拟
  const [simulatedTemp, setSimulatedTemp] = useState(26)

  // 四笔钱自测表单状态
  const [totalAsset, setTotalAsset] = useState(300000) // 总金融资产
  const [monthlyExpense, setMonthlyExpense] = useState(8000) // 每月刚需支出
  const [plannedExpense3Y, setPlannedExpense3Y] = useState(60000) // 未来1-3年大额确定性开销

  // 用户当前四笔钱分布
  const [currentLiving, setCurrentLiving] = useState(30000) // 当前活钱
  const [currentSteady, setCurrentSteady] = useState(100000) // 当前稳健钱
  const [currentLongTerm, setCurrentLongTerm] = useState(170000) // 当前长期钱

  // 保险自查
  const [hasMedicalInsurance, setHasMedicalInsurance] = useState(true) // 百万医疗
  const [hasTermLife, setHasTermLife] = useState(false) // 定期寿险
  const [hasAccident, setHasAccident] = useState(true) // 意外险

  // 四笔钱智能计算
  const fourPotsAnalysis = useMemo(() => {
    // 理想活钱需求：建议 6 个月月度支出
    const idealLiving = monthlyExpense * 6
    // 理想稳健钱需求：未来 1-3 年大额支出 + 额外 6-12 个月生活缓冲备用
    const idealSteady = plannedExpense3Y + monthlyExpense * 6
    // 理想长期钱：总资产扣除活钱和稳健钱后的剩余闲钱
    const idealLongTerm = Math.max(0, totalAsset - idealLiving - idealSteady)

    // 当前实际占比
    const sumActual = currentLiving + currentSteady + currentLongTerm || 1
    const livingPct = Math.round((currentLiving / sumActual) * 100)
    const steadyPct = Math.round((currentSteady / sumActual) * 100)
    const longPct = Math.round((currentLongTerm / sumActual) * 100)

    // 活钱可支撑月数
    const livingMonths = monthlyExpense > 0 ? (currentLiving / monthlyExpense).toFixed(1) : '0'

    // 长期钱占总资产比例
    const longTermRatio = (currentLongTerm / sumActual)

    // 评分计算 (满分 100)
    let score = 100
    // 1. 活钱不足扣分
    if (currentLiving < idealLiving) {
      const gap = (idealLiving - currentLiving) / idealLiving
      score -= Math.round(gap * 30)
    }
    // 2. 稳健钱不足扣分
    if (currentSteady < idealSteady) {
      const gap = (idealSteady - currentSteady) / idealSteady
      score -= Math.round(gap * 25)
    }
    // 3. 长期钱过多（超过安全上限，抗周期抗崩盘能力差）
    if (longTermRatio > 0.6) {
      score -= Math.round((longTermRatio - 0.6) * 40)
    }
    // 4. 保险缺失扣分
    if (!hasMedicalInsurance) score -= 15
    if (!hasTermLife) score -= 10
    if (!hasAccident) score -= 5

    score = Math.max(10, Math.min(100, score))

    return {
      idealLiving,
      idealSteady,
      idealLongTerm,
      livingPct,
      steadyPct,
      longPct,
      livingMonths,
      score,
      isLivingSafe: currentLiving >= idealLiving,
      isSteadySafe: currentSteady >= idealSteady,
      isLongTermOverweight: longTermRatio > 0.55
    }
  }, [
    totalAsset,
    monthlyExpense,
    plannedExpense3Y,
    currentLiving,
    currentSteady,
    currentLongTerm,
    hasMedicalInsurance,
    hasTermLife,
    hasAccident
  ])

  // 根据当前模拟温度获取配置指南
  const tempStrategy = useMemo(() => {
    if (simulatedTemp <= 15) {
      return {
        level: '冰点极度低估',
        equityRatio: '70% - 80%',
        bondRatio: '20% - 30%',
        color: '#059669',
        tagBg: '#d1fae5',
        action: '满弓播种',
        desc: '全市场极度便宜，优质筹码遍地。此时应当克服恐惧，将长期投资资金加大定投力度，买入宽基指数与高股息资产。'
      }
    } else if (simulatedTemp <= 30) {
      return {
        level: '低估播种区间',
        equityRatio: '60% - 70%',
        bondRatio: '30% - 40%',
        color: '#047857',
        tagBg: '#ecfdf5',
        action: '坚定定投',
        desc: '市场整体估值处于历史偏低分位，股债性价比高。适合保持稳定的定投资律，积累低成本长期份额。'
      }
    } else if (simulatedTemp <= 50) {
      return {
        level: '合理偏低区间',
        equityRatio: '50% - 60%',
        bondRatio: '40% - 50%',
        color: '#2563eb',
        tagBg: '#eff6ff',
        action: '均衡配置',
        desc: '市场估值回归合理中枢，保持股债均衡配置，既不盲目冒进，也不轻易离场，耐心让组合自然生长。'
      }
    } else if (simulatedTemp <= 75) {
      return {
        level: '正常偏高区间',
        equityRatio: '30% - 40%',
        bondRatio: '60% - 70%',
        color: '#d97706',
        tagBg: '#fef3c7',
        action: '克制贪婪',
        desc: '市场部分板块已有明显泡沫，保持克制，停止追高加仓，开始考虑适度将浮盈按计划再平衡回稳健固收池。'
      }
    } else {
      return {
        level: '高估过热区间',
        equityRatio: '10% - 20%',
        bondRatio: '80% - 90%',
        color: '#dc2626',
        tagBg: '#fee2e2',
        action: '分批收获',
        desc: '市场处于亢奋过热阶段，风险远大于收益。坚决分批止盈权益类资产，把利润装进大额存单和国债中保全本金。'
      }
    }
  }, [simulatedTemp])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf9f6', color: '#1c1917', py: 4 }}>
      <Container maxWidth="lg">
        {/* 面包屑导航 */}
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 16, color: '#9ca3af' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Button
            size="small"
            onClick={() => navigate('/')}
            sx={{ p: 0, minWidth: 'auto', color: '#6b7280', fontSize: '0.85rem' }}
          >
            首页
          </Button>
          <Button
            size="small"
            onClick={() => navigate('/dashboard')}
            sx={{ p: 0, minWidth: 'auto', color: '#6b7280', fontSize: '0.85rem' }}
          >
            自救工具
          </Button>
          <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.85rem' }}>
            有知有行温度计与四笔钱
          </Typography>
        </Breadcrumbs>

        {/* 顶部标题区 */}
        <Box sx={{ mb: 3.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <ThermostatIcon sx={{ fontSize: 32, color: '#c2410c' }} />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.2rem' },
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em'
              }}
            >
              有知有行 · 全市场温度计与四笔钱资产配置
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: '#4b5563', maxWidth: 860, lineHeight: 1.7, fontSize: '0.98rem' }}>
            借鉴有知有行（孟岩）核心资产配置模型与全市场估值温度计，为处于逆境、降薪或失业过渡期的家庭提供资产健康体检、全市场冷热度推演与战时四笔钱稳健配置方案。
          </Typography>
        </Box>

        {/* 顶部标签切换栏 */}
        <Paper
          elevation={0}
          sx={{
            p: 0.8,
            mb: 3.5,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            display: 'inline-flex',
            gap: 1
          }}
        >
          <Button
            variant={activeTab === 'temperature' ? 'contained' : 'text'}
            onClick={() => setActiveTab('temperature')}
            startIcon={<ThermostatIcon />}
            sx={{
              bgcolor: activeTab === 'temperature' ? '#c2410c' : 'transparent',
              color: activeTab === 'temperature' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.9rem',
              '&:hover': { bgcolor: activeTab === 'temperature' ? '#9a3412' : '#f3f4f6' }
            }}
          >
            全市场估值温度计
          </Button>

          <Button
            variant={activeTab === 'fourPots' ? 'contained' : 'text'}
            onClick={() => setActiveTab('fourPots')}
            startIcon={<SavingsIcon />}
            sx={{
              bgcolor: activeTab === 'fourPots' ? '#c2410c' : 'transparent',
              color: activeTab === 'fourPots' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.9rem',
              '&:hover': { bgcolor: activeTab === 'fourPots' ? '#9a3412' : '#f3f4f6' }
            }}
          >
            四笔钱家庭资产体检
          </Button>

          <Button
            variant={activeTab === 'philosophy' ? 'contained' : 'text'}
            onClick={() => setActiveTab('philosophy')}
            startIcon={<BookIcon />}
            sx={{
              bgcolor: activeTab === 'philosophy' ? '#c2410c' : 'transparent',
              color: activeTab === 'philosophy' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.9rem',
              '&:hover': { bgcolor: activeTab === 'philosophy' ? '#9a3412' : '#f3f4f6' }
            }}
          >
            有知有行极简投资心法
          </Button>
        </Paper>

        {/* TAB 1: 全市场估值温度计 */}
        {activeTab === 'temperature' && (
          <Box>
            {/* 综合温度大仪表卡片 */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                mb: 3.5,
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb'
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={5}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
                    <Typography sx={{ fontSize: '0.92rem', color: '#6b7280', fontWeight: 600 }}>
                      当前全市场综合估值温度
                    </Typography>
                    <Chip
                      label={tempStrategy.level}
                      size="small"
                      sx={{
                        bgcolor: tempStrategy.tagBg,
                        color: tempStrategy.color,
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '3.5rem', md: '4.5rem' },
                        fontWeight: 800,
                        lineHeight: 1,
                        color: tempStrategy.color
                      }}
                    >
                      {simulatedTemp}°
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 600 }}>
                      / 100°C 满格刻度
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.6, mb: 2 }}>
                    基于全市场 A 股滚动 PE/PB 历史分位数与股权风险溢价（股债性价比 ERP）综合推算。
                  </Typography>

                  <Box sx={{ p: 1.8, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #f3f4f6' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                        当前股债性价比（ERP）
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                        5.38% (处于历史 86% 高分位)
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                        十年期国债基准收益率
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                        2.15% (无风险底线)
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                  {/* 温度刻度条 */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                        0° 极度低估
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700 }}>
                        25° 低估定投
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700 }}>
                        50° 合理中枢
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700 }}>
                        75° 偏高警戒
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700 }}>
                        100° 过热分批卖
                      </Typography>
                    </Box>

                    {/* 彩色阶梯进度条 */}
                    <Box
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        background: 'linear-gradient(to right, #059669 0%, #34d399 25%, #3b82f6 50%, #f59e0b 75%, #ef4444 100%)',
                        position: 'relative',
                        mb: 2.5
                      }}
                    >
                      {/* 当前温度指针 */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -6,
                          left: `${Math.min(98, Math.max(2, simulatedTemp))}%`,
                          transform: 'translateX(-50%)',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: '#ffffff',
                          border: `4px solid ${tempStrategy.color}`,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      />
                    </Box>

                    {/* 滑块互动模拟 */}
                    <Box sx={{ p: 1.5, bgcolor: '#fbfbfa', borderRadius: 2, border: '1px dashed #e5e7eb' }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <TuneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700 }}>
                          互动模拟：滑动调整温度，查看有知有行资产配置建议联动
                        </Typography>
                      </Stack>
                      <Slider
                        value={simulatedTemp}
                        onChange={(_, val) => setSimulatedTemp(val)}
                        min={0}
                        max={100}
                        sx={{
                          color: tempStrategy.color,
                          py: 1,
                          '& .MuiSlider-thumb': {
                            width: 18,
                            height: 18
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* 孟岩/有知有行战时配置指导卡片 */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fffbf5',
                      border: '1px solid #fed7aa'
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9a3412', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <AccountBalanceIcon sx={{ fontSize: 18 }} />
                        有知有行战时股债比例指引
                      </Typography>
                      <Chip
                        label={tempStrategy.action}
                        size="small"
                        sx={{ bgcolor: '#c2410c', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem' }}
                      />
                    </Stack>

                    <Grid container spacing={2} sx={{ mb: 1.5 }}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.2, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid #ffedd5' }}>
                          <Typography variant="caption" sx={{ color: '#7c2d12', display: 'block' }}>
                            权益类资产（股票/指数基金）
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#c2410c', fontWeight: 800 }}>
                            {tempStrategy.equityRatio}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1.2, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid #ffedd5' }}>
                          <Typography variant="caption" sx={{ color: '#7c2d12', display: 'block' }}>
                            固收类资产（纯债/国债/存单）
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#1e40af', fontWeight: 800 }}>
                            {tempStrategy.bondRatio}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" sx={{ color: '#7c2d12', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {tempStrategy.desc}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* 核心宽基与行业指数温度矩阵 */}
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
              核心宽基与红利指数当前温度矩阵
            </Typography>

            <Grid container spacing={2.5}>
              {marketIndices.map((idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx.code}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.2,
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#d1d5db',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                            {idx.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                            代码 {idx.code}
                          </Typography>
                        </Box>

                        <Chip
                          label={`${idx.temperature}° ${idx.status}`}
                          size="small"
                          sx={{
                            bgcolor: idx.temperature <= 25 ? '#ecfdf5' : idx.temperature <= 50 ? '#eff6ff' : '#fee2e2',
                            color: idx.color,
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Stack>

                      {/* 迷你进度条 */}
                      <LinearProgress
                        variant="determinate"
                        value={idx.temperature}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#f3f4f6',
                          mb: 2,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: idx.color,
                            borderRadius: 3
                          }
                        }}
                      />

                      <Grid container spacing={1} sx={{ mb: 1.5 }}>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
                            市盈率 PE
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                            {idx.pe}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
                            历史分位
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                            {idx.pePercentile}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
                            股息分红率
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                            {idx.dividendYield}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ pt: 1.2, borderTop: '1px solid #f3f4f6' }}>
                      <Typography variant="caption" sx={{ color: '#4b5563', lineHeight: 1.5, display: 'block' }}>
                        {idx.advice}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 2: 四笔钱家庭资产体检 */}
        {activeTab === 'fourPots' && (
          <Box>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                <strong>有知有行“四笔钱”核心哲学：</strong>
                把钱分成四笔，各司其职。永远不要把下个月要还房贷的“活钱”、或者三年内孩子要交学费的“稳健钱”，投入高波动的股市中。只有真正做到长钱长投，才能在周期中立于不败之地。
              </Typography>
            </Alert>

            <Grid container spacing={3.5}>
              {/* 左侧：家庭财务数据输入表单 */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 2.5 }}>
                    第一步：输入家庭资产底盘数据
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, display: 'block', mb: 0.8 }}>
                        家庭可投资金融总资产 (元)
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={totalAsset}
                        onChange={(e) => setTotalAsset(Number(e.target.value))}
                        helperText="现金、存单、理财、股票与基金总和（不计自住房市值）"
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, display: 'block', mb: 0.8 }}>
                        每月家庭最低生存刚需开销 (元/月)
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={monthlyExpense}
                        onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                        helperText="包括房贷月供、柴米油盐、水电物业与基本话费"
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, display: 'block', mb: 0.8 }}>
                        未来 1-3 年内确定性大额刚性支出 (元)
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={plannedExpense3Y}
                        onChange={(e) => setPlannedExpense3Y(Number(e.target.value))}
                        helperText="如大额还贷本金、子女三年内入学学费、老人医疗预留款"
                      />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                      当前家庭各资金池实际分布 (元)
                    </Typography>

                    <Box>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>
                          1. 活钱账户 (随时要用 / 货基 / 零钱)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>
                          {currentLiving.toLocaleString()} 元
                        </Typography>
                      </Stack>
                      <Slider
                        value={currentLiving}
                        onChange={(_, val) => setCurrentLiving(val)}
                        min={0}
                        max={totalAsset}
                        step={5000}
                        sx={{ color: '#059669', py: 1 }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>
                          2. 稳健理财 (3年内要用 / 大额存单 / 纯债)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700 }}>
                          {currentSteady.toLocaleString()} 元
                        </Typography>
                      </Stack>
                      <Slider
                        value={currentSteady}
                        onChange={(_, val) => setCurrentSteady(val)}
                        min={0}
                        max={totalAsset}
                        step={5000}
                        sx={{ color: '#2563eb', py: 1 }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>
                          3. 长期投资 (3-5年以上闲钱 / 指数 / 股票)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>
                          {currentLongTerm.toLocaleString()} 元
                        </Typography>
                      </Stack>
                      <Slider
                        value={currentLongTerm}
                        onChange={(_, val) => setCurrentLongTerm(val)}
                        min={0}
                        max={totalAsset}
                        step={5000}
                        sx={{ color: '#c2410c', py: 1 }}
                      />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* 保险自查 */}
                    <Box>
                      <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, display: 'block', mb: 1 }}>
                        4. 保险保障兜底自查（家庭顶梁柱）
                      </Typography>
                      <Stack spacing={0.5}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={hasMedicalInsurance}
                              onChange={(e) => setHasMedicalInsurance(e.target.checked)}
                              sx={{ color: '#c2410c', '&.Mui-checked': { color: '#c2410c' } }}
                            />
                          }
                          label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>已配置百万医疗险（保额 400 万以上）</Typography>}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={hasTermLife}
                              onChange={(e) => setHasTermLife(e.target.checked)}
                              sx={{ color: '#c2410c', '&.Mui-checked': { color: '#c2410c' } }}
                            />
                          }
                          label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>已配置定期寿险（保额覆盖剩余房贷）</Typography>}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={hasAccident}
                              onChange={(e) => setHasAccident(e.target.checked)}
                              sx={{ color: '#c2410c', '&.Mui-checked': { color: '#c2410c' } }}
                            />
                          }
                          label={<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>已配置综合意外险（保额 100 万以上）</Typography>}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* 右侧：智能诊断与四笔钱自救方案 */}
              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    mb: 3
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
                        第二步：家庭资产四笔钱健康诊断
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        对照有知有行战时防御标准测算
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                        健康综合评分
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: fourPotsAnalysis.score >= 80 ? '#059669' : fourPotsAnalysis.score >= 60 ? '#d97706' : '#dc2626'
                        }}
                      >
                        {fourPotsAnalysis.score}
                        <Typography component="span" sx={{ fontSize: '1rem', color: '#9ca3af', ml: 0.5 }}>
                          / 100
                        </Typography>
                      </Typography>
                    </Box>
                  </Stack>

                  {/* 四笔钱罐子卡片比对 */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    {/* 1. 活钱罐子 */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #e5e7eb' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <SavingsIcon sx={{ fontSize: 18 }} />
                          活钱管理（随时要用 · 0-6个月）
                        </Typography>
                        <Chip
                          label={fourPotsAnalysis.isLivingSafe ? '储备充沛' : '跑道吃紧'}
                          size="small"
                          sx={{
                            bgcolor: fourPotsAnalysis.isLivingSafe ? '#ecfdf5' : '#fee2e2',
                            color: fourPotsAnalysis.isLivingSafe ? '#059669' : '#dc2626',
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}
                        />
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>当前持有：</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                            {currentLiving.toLocaleString()} 元 ({fourPotsAnalysis.livingMonths} 个月跑道)
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>建议达标：</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                            {fourPotsAnalysis.idealLiving.toLocaleString()} 元 (至少6个月刚需)
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* 2. 稳健理财罐子 */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #e5e7eb' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <AccountBalanceIcon sx={{ fontSize: 18 }} />
                          稳健理财（保本升值 · 3年内要用）
                        </Typography>
                        <Chip
                          label={fourPotsAnalysis.isSteadySafe ? '防线扎实' : '准备金不足'}
                          size="small"
                          sx={{
                            bgcolor: fourPotsAnalysis.isSteadySafe ? '#eff6ff' : '#fef3c7',
                            color: fourPotsAnalysis.isSteadySafe ? '#2563eb' : '#d97706',
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}
                        />
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>当前持有：</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                            {currentSteady.toLocaleString()} 元 (占比 {fourPotsAnalysis.steadyPct}%)
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>建议达标：</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#2563eb' }}>
                            {fourPotsAnalysis.idealSteady.toLocaleString()} 元 (大额支出+防断供备用)
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* 3. 长期投资罐子 */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #e5e7eb' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#c2410c', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <TrendingUpIcon sx={{ fontSize: 18 }} />
                          长期投资（追求复利 · 3-5年以上不用的闲钱）
                        </Typography>
                        <Chip
                          label={fourPotsAnalysis.isLongTermOverweight ? '仓位偏重需降杠杆' : '仓位安全'}
                          size="small"
                          sx={{
                            bgcolor: fourPotsAnalysis.isLongTermOverweight ? '#fef3c7' : '#ecfdf5',
                            color: fourPotsAnalysis.isLongTermOverweight ? '#d97706' : '#059669',
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}
                        />
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>当前持有：</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                            {currentLongTerm.toLocaleString()} 元 (占比 {fourPotsAnalysis.longPct}%)
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>建议安全上限：</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#c2410c' }}>
                            {fourPotsAnalysis.idealLongTerm.toLocaleString()} 元 (扣除前两笔后的纯闲钱)
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* 4. 保险防线 */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #e5e7eb' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <ShieldIcon sx={{ fontSize: 18 }} />
                          保险保障（对冲家庭顶梁柱极端风险）
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: hasMedicalInsurance && hasTermLife ? '#059669' : '#dc2626' }}>
                          {hasMedicalInsurance && hasTermLife ? '核心防线已建立' : '防线存在重大漏洞'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* 定制调仓自救动作建议 */}
                  <Box sx={{ p: 2.2, bgcolor: '#fffbf5', borderRadius: 2, border: '1px solid #ffedd5' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9a3412', mb: 1 }}>
                      有知有行战时调仓建议清单：
                    </Typography>
                    <Stack spacing={1}>
                      {!fourPotsAnalysis.isLivingSafe && (
                        <Typography variant="body2" sx={{ color: '#7c2d12', fontSize: '0.85rem' }}>
                          • <strong>紧急补齐活钱</strong>：当前活钱仅够维持 {fourPotsAnalysis.livingMonths} 个月，抗突发失业能力极弱。建议优先从新增收入或非必要开销中，将活钱补足至 {fourPotsAnalysis.idealLiving.toLocaleString()} 元（6个月口粮）。
                        </Typography>
                      )}
                      {fourPotsAnalysis.isLongTermOverweight && (
                        <Typography variant="body2" sx={{ color: '#7c2d12', fontSize: '0.85rem' }}>
                          • <strong>防止长钱逼成割肉钱</strong>：长期投资占比高达 {fourPotsAnalysis.longPct}%。在下行期一旦家庭现金流吃紧，极易被迫在熊市底部割肉股票赎回生活费。建议暂时停止追加长期权益投资，将每月定投资金转存至大额存单或纯债基金。
                        </Typography>
                      )}
                      {!hasTermLife && (
                        <Typography variant="body2" sx={{ color: '#7c2d12', fontSize: '0.85rem' }}>
                          • <strong>补齐定期寿险</strong>：家庭顶梁柱若背负房贷，每年花费数百元配置纯消费型定寿，防止万一人身突发意外时剩余巨额房贷连累配偶与幼子。
                        </Typography>
                      )}
                      {fourPotsAnalysis.isLivingSafe && fourPotsAnalysis.isSteadySafe && !fourPotsAnalysis.isLongTermOverweight && (
                        <Typography variant="body2" sx={{ color: '#047857', fontSize: '0.85rem' }}>
                          • <strong>底盘极其健康</strong>：您的四笔钱结构层次分明，既锁定了长达两年的生存安全底牌，又具备充沛的长期增值潜能。保持定力，无需在短期波动中心慌。
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* TAB 3: 有知有行极简投资心法 */}
        {activeTab === 'philosophy' && (
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                mb: 3.5,
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                孟岩 · 有知有行投资第一课经典心法
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                真正的投资能力，不是看你能不能抓到下个月的涨停板，而是看你在狂风暴雨的周期低谷中，能不能平静地留在牌桌上。
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fbfbfa',
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#c2410c', mb: 1 }}>
                      一、四笔钱：解决 90% 的投资焦虑
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.9rem' }}>
                      很多人之所以在股市大跌时彻夜失眠、惶恐割肉，根源不是股市跌了，而是<strong>他把明天要还房贷、后年要交学费的钱，投进了股市</strong>。
                      只要把‘随时要用的活钱’和‘三年内要用的稳健钱’隔离出来，剩下的长期投资哪怕遭遇 30% 的账面回撤，你也根本不用在低点割肉换口粮。四笔钱就是抵御恐慌的心灵锚。
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fbfbfa',
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb', mb: 1 }}>
                      二、温度计：便宜的时候多买，贵的时候少买
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.9rem' }}>
                      普通人千万不要试图去预测‘下周一市场会怎么走’，那是神仙才能做的事情。
                      我们唯一能做的是<strong>度量当下是便宜还是昂贵</strong>。在市场温度低于 20 度的时候，好公司就像菜市场暴雨后打折的蔬菜一样便宜，耐心地用闲钱定投播种，然后把剩下的事情交给时间。
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fbfbfa',
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', mb: 1 }}>
                      三、资产配置决定 90% 的长期回报
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.9rem' }}>
                      诺贝尔经济学奖得主马科维茨指出：<strong>资产配置是投资市场上唯一的免费午餐。</strong>
                      建立一个由股息率 5% 以上的高分红资产、稳健的国债存单、以及宽基指数构成的均衡组合，每年定期做一次简单的‘动态再平衡’，比每天盯盘两小时抓黑马股轻松一万倍，收益也稳健得多。
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: '#fbfbfa',
                      border: '1px solid #e5e7eb',
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#7c3aed', mb: 1 }}>
                      四、慢即是快：耐得住寂寞的智慧
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.9rem' }}>
                      巴菲特最著名的一句话：‘没有人愿意慢慢变富。’
                      人到中年，最致命的敌人是急躁——想毕其功于一役、想靠炒股把开店亏的钱翻倍回来。越是急于求成，越容易掉进借贷杠杆和杀猪盘的万劫不复深渊。守住常识，慢就是最快、最安全的高速公路。
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  )
}
