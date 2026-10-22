import { useMemo, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
  Tabs,
  Tab,
  Button,
  Grid,
  Slider,
  Divider,
  Checkbox,
  LinearProgress
} from '@mui/material'
import {
  WorkOutline as WorkIcon,
  AccountBalanceOutlined as AccountBalanceIcon,
  FamilyRestroomOutlined as FamilyIcon,
  CalculateOutlined as CalculateIcon,
  ArrowForward as ArrowForwardIcon,
  MonetizationOnOutlined as MonetizationOnIcon,
  AssignmentOutlined as ChecklistIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as UncheckedIcon,
  ArrowBack as ArrowBackIcon,
  RestartAlt as ResetIcon,
  GavelOutlined as GavelIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

const STORAGE_KEY_CHECKLIST = 'pmsaveself_dashboard_sop_checked'
const STORAGE_KEY_SAVINGS = 'pmsaveself_dashboard_savings'
const STORAGE_KEY_MONTHLY = 'pmsaveself_dashboard_monthly'

const sopPanels = [
  {
    id: 'layoff',
    title: '突遭裁员 72 小时应急',
    tag: '职场被动应对',
    desc: '接获离职通知时的合法权益保护、证据留存与社保接续',
    targetPath: '/career',
    steps: [
      {
        key: 's1',
        title: '01. 绝不现场盲签任何协议',
        detail: '要求对方出具正式书面解约函，将协议草案带回家复核。逐项核对 N+1 补偿基数、未休年假 300% 折算及年终奖比例。'
      },
      {
        key: 's2',
        title: '02. 固化在职流水与劳动凭证',
        detail: '在公司内网断开前，打印近 12 个月银行工资流水、出勤记录、过往绩效通知与相关工作交接邮件并妥善脱敏备份。'
      },
      {
        key: 's3',
        title: '03. 申领失业金与医保基金代缴',
        detail: '非自愿离职可申领失业金，领取期间由失业保险基金代缴职工基本医疗保险费，确保就医报销权益不断档。'
      },
      {
        key: 's4',
        title: '04. 盘点下季度硬性债务敞口',
        detail: '列出房贷、车贷与必要刚性开销，如面临短期还贷压力，尽早与银行申请按揭延期或调整还款计划。'
      }
    ]
  },
  {
    id: 'side',
    title: '35+ 副业避坑与轻量起步',
    tag: '轻资产探索',
    desc: '中年试错成本极高，坚守零边际成本与技能复用原则',
    targetPath: '/side-business',
    steps: [
      {
        key: 's5',
        title: '01. 坚决避开重资产加盟与开店',
        detail: '严禁动用家庭应急储蓄去加盟奶茶、快餐、便利店或盲目租赁办公场地，重资产投入往往会在 6~12 个月内亏尽现金。'
      },
      {
        key: 's6',
        title: '02. 经验变现：中小企业咨询与陪跑',
        detail: '将过往主业里踩过的行业坑、合规模板、工程脚手架沉淀为咨询方案，直接卖给有需求的中小公司或新人。'
      },
      {
        key: 's7',
        title: '03. 沉淀数字资产与流程模板',
        detail: '开发可复用的业务 SOP、专业设计/代码组件、行业合规表单，一次性生产，通过分发渠道形成长尾被动微收入。'
      },
      {
        key: 's8',
        title: '04. 陌生人付费验证第一单',
        detail: '在未拿到任何真实陌生用户的真实付费前，绝不采购付费开发工具、不做任何大额营销投入。'
      }
    ]
  },
  {
    id: 'finance',
    title: '家庭资产底线·四笔钱法则',
    tag: '家庭防守',
    desc: '上有老下有小的防守型资产配置，确保极端环境下家庭不致停摆',
    targetPath: '/finance',
    steps: [
      {
        key: 's9',
        title: '01. 活钱池：留存 6~12 个月刚性生活费',
        detail: '存放于大额存单、国债逆回购或高流动性货币基金，无论股市或投资市场如何波动，绝不动用这笔生活兜底钱。'
      },
      {
        key: 's10',
        title: '02. 保命钱：经济支柱纯保障底仓',
        detail: '家庭核心收入来源必须配置足额的百万医疗险与定期寿险，用每年极低的保费隔离大病直接击穿家庭的极端风险。'
      },
      {
        key: 's11',
        title: '03. 稳健长钱：养老储备确定性优先',
        detail: '以国家社保为基石，适当补充个人养老金或高信用等级稳健分红资产，不追求超额暴利，追求确定性现金流。'
      },
      {
        key: 's12',
        title: '04. 进取投资严格限额 15% 以内',
        detail: '高风险权益类资产严格限制在家庭流动净资产的 15% 以内，绝不加杠杆、绝不用负债炒股。'
      }
    ]
  }
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  // 1. 本地持久化交互状态
  const [savingsWan, setSavingsWan] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SAVINGS)
    return saved ? Number(saved) : 30
  })

  const [monthlyCost, setMonthlyCost] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MONTHLY)
    return saved ? Number(saved) : 12000
  })

  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [sopTab, setSopTab] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVINGS, String(savingsWan))
  }, [savingsWan])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONTHLY, String(monthlyCost))
  }, [monthlyCost])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(completedSteps))
  }, [completedSteps])

  // 计算极端零收入生命线跑道
  const runwayMonths = useMemo(() => {
    if (!monthlyCost) return 0
    return ((savingsWan * 10000) / monthlyCost).toFixed(1)
  }, [savingsWan, monthlyCost])

  // 退休基本养老金资金缺口（70% 替代率，生活 25 年，缺口预估 60%）
  const pensionGap = useMemo(() => {
    const needTotal = monthlyCost * 0.7 * 12 * 25
    const gapTotal = needTotal * 0.6
    return (gapTotal / 10000).toFixed(0)
  }, [monthlyCost])

  // 跑道状态评定
  const runwayStatus = useMemo(() => {
    const num = parseFloat(runwayMonths)
    if (num < 6) {
      return {
        level: '紧急警戒',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        advice: '流动储备低于 6 个月警戒线。建议立即缩减非必要弹性开支，清点家庭负债，并了解失业金申领流程。'
      }
    }
    if (num < 12) {
      return {
        level: '谨慎防守',
        color: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        advice: '现金储备处于过渡期，具备短期抵御能力。建议重点探索低成本咨询或数字副业，增加多元现金流。'
      }
    }
    return {
      level: '相对稳健',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      advice: '具备充裕的安全垫缓冲期。可从容推进中长期职业转型与稳健资产配置，杜绝高风险借贷或重资产创业。'
    }
  }, [runwayMonths])

  // SOP 完成度统计
  const allStepsCount = useMemo(() => {
    return sopPanels.reduce((acc, panel) => acc + panel.steps.length, 0)
  }, [])

  const finishedStepsCount = useMemo(() => {
    return Object.values(completedSteps).filter(Boolean).length
  }, [completedSteps])

  const completionPercent = Math.round((finishedStepsCount / allStepsCount) * 100)

  const toggleStep = (key) => {
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const resetChecklist = () => {
    if (window.confirm('确定要重置所有 SOP 的核对标记吗？')) {
      setCompletedSteps({})
    }
  }

  const currentSop = sopPanels[sopTab]
  const articlesCount = getAllArticles().filter(a => a.status === 'published').length

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf9f6', color: '#1c1917' }}>
      
      {/*  控制台顶部 Header */}
      <Box
        sx={{
          pt: 3.5,
          pb: 3,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e7e5e4'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Button
              component={Link}
              to="/"
              size="small"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: '#78716c',
                fontWeight: 600,
                p: 0,
                minWidth: 'auto',
                '&:hover': { color: '#c2410c', bgcolor: 'transparent' }
              }}
            >
              返回首页
            </Button>
            <Typography variant="caption" sx={{ color: '#d6d3d1' }}>/</Typography>
            <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
              抗风险控制台
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.4rem', sm: '1.65rem' },
                  color: '#1c1917',
                  letterSpacing: '-0.02em',
                  mb: 0.5
                }}
              >
                中年自救工作台
              </Typography>
              <Typography variant="body2" sx={{ color: '#78716c' }}>
                实时测算家庭现金流安全垫，核对关键变故应对 SOP，守护关键十年。
              </Typography>
            </Box>

            {/* 状态统计指示条 */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                bgcolor: '#faf9f6',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid #e7e5e4',
                width: { xs: '100%', md: 'auto' },
                justifyContent: { xs: 'space-between', md: 'flex-start' }
              }}
            >
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>生存跑道</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: runwayStatus.color, lineHeight: 1.3 }}>
                  {runwayMonths} 个月
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: '#e7e5e4' }} />
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>SOP 完成度</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', lineHeight: 1.3 }}>
                  {finishedStepsCount} / {allStepsCount} 项
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: '#e7e5e4' }} />
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>一线智库</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', lineHeight: 1.3 }}>
                  {articlesCount} 篇
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/*  控制台主面板 */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(2, 1fr)'
            },
            gap: 3,
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          {/* 左侧：现金流跑道与养老缺口监测器 */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalculateIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '1.08rem' }}>
                      家庭现金流跑道测算
                    </Typography>
                  </Box>
                  <Chip
                    label={runwayStatus.level}
                    size="small"
                    sx={{
                      bgcolor: runwayStatus.bg,
                      color: runwayStatus.color,
                      border: `1px solid ${runwayStatus.border}`,
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#78716c', mb: 3, fontSize: '0.86rem' }}>
                  模拟在极端被动中断收入的情况下，家庭现有流动资金能支撑的最长月数。
                </Typography>

                {/* 滑块 1：备用金 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 600 }}>
                      可用应急流动备用金：
                      <Box component="span" sx={{ color: '#c2410c', fontWeight: 700, ml: 0.5 }}>
                        {savingsWan} 万元
                      </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#a8a29e' }}>存款 + 随时可变现理财</Typography>
                  </Box>
                  <Slider
                    value={savingsWan}
                    min={0}
                    max={150}
                    step={5}
                    onChange={(e, v) => setSavingsWan(v)}
                    sx={{ color: '#c2410c' }}
                  />
                </Box>

                {/* 滑块 2：月开销 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 600 }}>
                      家庭月度刚性总开销：
                      <Box component="span" sx={{ color: '#c2410c', fontWeight: 700, ml: 0.5 }}>
                        ¥{monthlyCost.toLocaleString()} / 月
                      </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#a8a29e' }}>房贷/房租 + 饮食 + 老小赡养</Typography>
                  </Box>
                  <Slider
                    value={monthlyCost}
                    min={4000}
                    max={30000}
                    step={1000}
                    onChange={(e, v) => setMonthlyCost(v)}
                    sx={{ color: '#c2410c' }}
                  />
                </Box>

                {/* 测算诊断卡 */}
                <Box
                  sx={{
                    p: 2.2,
                    borderRadius: 2,
                    bgcolor: '#faf9f6',
                    border: '1px solid #e7e5e4',
                    mb: 2.5
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>
                        极端零收入生存跑道
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: runwayStatus.color, mt: 0.5 }}>
                        {runwayMonths}
                        <Typography component="span" variant="body2" sx={{ color: '#78716c', ml: 0.5, fontWeight: 500 }}>
                          个月
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>
                        60岁后预估养老缺口
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1c1917', mt: 0.5 }}>
                        ¥{pensionGap}
                        <Typography component="span" variant="body2" sx={{ color: '#78716c', ml: 0.5, fontWeight: 500 }}>
                          万
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="caption" sx={{ color: '#57534e', display: 'block', mt: 1.5, lineHeight: 1.5 }}>
                    诊断建议：{runwayStatus.advice}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/layoff-calculator')}
                  startIcon={<GavelIcon sx={{ fontSize: 16, color: '#c2410c' }} />}
                  sx={{
                    borderColor: '#fed7aa',
                    color: '#c2410c',
                    bgcolor: '#fff7ed',
                    textTransform: 'none',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#c2410c', bgcolor: '#ffedd5' }
                  }}
                >
                  裁员赔偿测算器 (N+1/2N)
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/pension-planner')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: '#d6d3d1',
                    color: '#44403c',
                    textTransform: 'none',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#a8a29e', bgcolor: '#fafaf9' }
                  }}
                >
                  养老精算模型
                </Button>
              </Box>
            </Paper>

          {/* 右侧：关键变故应急预案看板 */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChecklistIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '1.08rem' }}>
                      变故应急行动看板
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="text"
                    onClick={resetChecklist}
                    startIcon={<ResetIcon sx={{ fontSize: 14 }} />}
                    sx={{ color: '#a8a29e', fontSize: '0.75rem', p: 0, '&:hover': { color: '#c2410c' } }}
                  >
                    重置标记
                  </Button>
                </Box>

                {/* 总体完成度条 */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#78716c' }}>
                      防守准备度：{completionPercent}% ({finishedStepsCount}/{allStepsCount})
                    </Typography>
                    <Typography variant="caption" sx={{ color: completionPercent === 100 ? '#059669' : '#c2410c', fontWeight: 700 }}>
                      {completionPercent === 100 ? '全部核对完毕' : '核对中'}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercent}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: '#f5f5f4',
                      '& .MuiLinearProgress-bar': { bgcolor: '#c2410c', borderRadius: 3 }
                    }}
                  />
                </Box>

                {/* 场景选项卡 */}
                <Tabs
                  value={sopTab}
                  onChange={(e, val) => setSopTab(val)}
                  variant="scrollable"
                  scrollButtons={false}
                  sx={{
                    minHeight: 38,
                    mb: 2.5,
                    borderBottom: '1px solid #e7e5e4',
                    '& .MuiTabs-indicator': { backgroundColor: '#c2410c', height: 2 },
                    '& .MuiTab-root': {
                      minHeight: 38,
                      py: 0.5,
                      px: 1.5,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#78716c',
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      '&.Mui-selected': { color: '#c2410c' }
                    }
                  }}
                >
                  {sopPanels.map((p) => (
                    <Tab key={p.id} label={p.title.split('·')[0]} />
                  ))}
                </Tabs>

                {/* 裁员专享精准测算直通车 */}
                {currentSop.id === 'layoff' && (
                  <Box
                    onClick={() => navigate('/layoff-calculator')}
                    sx={{
                      p: 1.5,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: '#fff7ed',
                      border: '1px solid #fed7aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#ea580c',
                        bgcolor: '#ffedd5',
                        boxShadow: '0 2px 8px rgba(194, 65, 12, 0.08)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <GavelIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9a3412', fontSize: '0.88rem' }}>
                          一键核算应得赔偿金总包 (N+1 / 2N)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#c2410c', fontSize: '0.74rem', display: 'block' }}>
                          含各城市社平工资封顶、未休年假 300% 折算及免税额度
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: '#c2410c',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.76rem',
                        whiteSpace: 'nowrap',
                        py: 0.4,
                        px: 1.2,
                        borderRadius: 1,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#9a3412', boxShadow: 'none' }
                      }}
                    >
                      立即测算 →
                    </Button>
                  </Box>
                )}

                {/* 清单细则 */}
                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  {currentSop.steps.map((step) => {
                    const isDone = Boolean(completedSteps[step.key])
                    return (
                      <Box
                        key={step.key}
                        onClick={() => toggleStep(step.key)}
                        sx={{
                          p: 1.6,
                          borderRadius: 2,
                          bgcolor: isDone ? '#f5f5f4' : '#faf9f6',
                          border: '1px solid',
                          borderColor: isDone ? '#e7e5e4' : '#f0ece1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.2,
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            borderColor: '#d6d3d1',
                            bgcolor: isDone ? '#f5f5f4' : '#f5f2eb'
                          }
                        }}
                      >
                        <Checkbox
                          size="small"
                          checked={isDone}
                          icon={<UncheckedIcon sx={{ fontSize: 18, color: '#a8a29e' }} />}
                          checkedIcon={<CheckedIcon sx={{ fontSize: 18, color: '#059669' }} />}
                          sx={{ p: 0, mt: 0.2 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: isDone ? '#78716c' : '#1c1917',
                              textDecoration: isDone ? 'line-through' : 'none',
                              fontSize: '0.88rem'
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDone ? '#a8a29e' : '#57534e',
                              display: 'block',
                              mt: 0.3,
                              lineHeight: 1.5
                            }}
                          >
                            {step.detail}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <Box sx={{ pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                  {currentSop.desc}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate(currentSop.targetPath)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: '#c2410c',
                    fontWeight: 700,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    p: 0
                  }}
                >
                  深入查阅相关战术方案
                </Button>
              </Box>
            </Paper>
        </Box>

        {/*  四大自救战区入口 */}
        <Box sx={{ mt: 4, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.05em', mb: 2 }}>
            四大自救战区专栏
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 2,
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {[
              {
                title: '职场突围战',
                desc: '35岁破局 · 经验变现 · 合法维权',
                icon: <WorkIcon sx={{ color: '#1e40af' }} />,
                count: '38 篇',
                path: '/career'
              },
              {
                title: '副业与轻创',
                desc: '技能产品化 · 零成本起步 · 咨询变现',
                icon: <MonetizationOnIcon sx={{ color: '#065f46' }} />,
                count: '24 篇',
                path: '/side-business'
              },
              {
                title: '资产与养老',
                desc: '四笔钱法则 · 养老精算 · 债务重构',
                icon: <AccountBalanceIcon sx={{ color: '#92400e' }} />,
                count: '32 篇',
                path: '/finance'
              },
              {
                title: '身心与家庭',
                desc: '中年内耗脱敏 · 亲子沟通 · 体检指标',
                icon: <FamilyIcon sx={{ color: '#9d174d' }} />,
                count: '43 篇',
                path: '/family'
              }
            ].map((col) => (
              <Paper
                key={col.title}
                elevation={0}
                onClick={() => navigate(col.path)}
                sx={{
                  p: 2.2,
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e7e5e4',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 110,
                  '&:hover': {
                    borderColor: '#c2410c',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {col.icon}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917' }}>
                      {col.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#a8a29e', fontWeight: 600 }}>
                    {col.count}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#78716c', mt: 1.5, display: 'block' }}>
                  {col.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default Dashboard
