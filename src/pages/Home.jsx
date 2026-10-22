import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Card,
  CardContent,
  Skeleton,
  Grid,
  Slider,
  Divider,
  Checkbox,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  WorkOutline as WorkIcon,
  AccountBalanceOutlined as AccountBalanceIcon,
  FamilyRestroomOutlined as FamilyIcon,
  CalculateOutlined as CalculateIcon,
  ArrowForward as ArrowForwardIcon,
  MonetizationOnOutlined as MonetizationOnIcon,
  AssignmentOutlined as ChecklistIcon,
  ViewAgendaOutlined as ListViewIcon,
  GridViewOutlined as GridViewIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as UncheckedIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 沉稳专业的内容标签配色
const categoryStyles = {
  '职场发展': { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  '转型升级': { bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe' },
  '副业指南': { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  '财务管理': { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  '中年危机': { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  '心理健康': { bg: '#f0fdfa', color: '#115e59', border: '#99f6e4' },
  '家庭关系': { bg: '#fdf2f8', color: '#9d174d', border: '#fbcfe8' },
  '生活技能': { bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
  '兴趣爱好': { bg: '#faf5ff', color: '#6b21a8', border: '#e9d5ff' },
}

const Home = () => {
  const navigate = useNavigate()
  const { getAllArticles, loading } = useArticles()

  // 1. 家庭抗风险测算交互状态
  const [savingsWan, setSavingsWan] = useState(30)
  const [monthlyCost, setMonthlyCost] = useState(12000)

  // 2. 变故应急 SOP 看板状态
  const [sopTab, setSopTab] = useState(0)
  const [completedSteps, setCompletedSteps] = useState({})

  // 3. 文章信息流分类、视图与翻页
  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(8)
  const [viewMode, setViewMode] = useState('list') // 'list' | 'grid'

  // 计算极端零收入状态下的生命线跑道（Runway）
  const runwayMonths = useMemo(() => {
    if (!monthlyCost) return 0
    return ((savingsWan * 10000) / monthlyCost).toFixed(1)
  }, [savingsWan, monthlyCost])

  // 退休基本养老金资金缺口（基于现支出 70% 替代率，生活 25 年，缺口预估 60%）
  const pensionGap = useMemo(() => {
    const needTotal = monthlyCost * 0.7 * 12 * 25
    const gapTotal = needTotal * 0.6
    return (gapTotal / 10000).toFixed(0)
  }, [monthlyCost])

  // 跑道安全度评级与建议
  const runwayStatus = useMemo(() => {
    const num = parseFloat(runwayMonths)
    if (num < 6) {
      return {
        level: '紧急警戒',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        advice: '流动储备低于6个月安全红线。建议立即压缩弹性消费，梳理家庭账目并考虑申领失业金。'
      }
    }
    if (num < 12) {
      return {
        level: '谨慎防守',
        color: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        advice: '现金储备处于过渡期，具备抵御短期波动的能力，建议重点探索轻资产副业以增加现金流。'
      }
    }
    return {
      level: '相对稳健',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      advice: '具备较充足的安全垫缓冲期。可专注中长线职业与资产布局，杜绝高风险借贷与重资产盲目创业。'
    }
  }, [runwayMonths])

  // 文章数据与四大支柱
  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  const sortedArticles = useMemo(() => {
    return [...publishedArticles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [publishedArticles])

  const pillarTabs = useMemo(() => [
    {
      id: 'all',
      name: '全部实战指南',
      badge: sortedArticles.length,
      filter: () => true
    },
    {
      id: 'career',
      name: '职场突围',
      badge: sortedArticles.filter(a => ['职场发展', '转型升级'].includes(a.category)).length,
      filter: (a) => ['职场发展', '转型升级'].includes(a.category)
    },
    {
      id: 'side',
      name: '副业轻创',
      badge: sortedArticles.filter(a => ['副业指南'].includes(a.category)).length,
      filter: (a) => ['副业指南'].includes(a.category)
    },
    {
      id: 'finance',
      name: '财务与养老',
      badge: sortedArticles.filter(a => ['财务管理'].includes(a.category)).length,
      filter: (a) => ['财务管理'].includes(a.category)
    },
    {
      id: 'family',
      name: '家庭与沟通',
      badge: sortedArticles.filter(a => ['家庭关系', '生活技能'].includes(a.category)).length,
      filter: (a) => ['家庭关系', '生活技能'].includes(a.category)
    },
    {
      id: 'mind',
      name: '危机脱敏',
      badge: sortedArticles.filter(a => ['中年危机', '心理健康', '兴趣爱好'].includes(a.category)).length,
      filter: (a) => ['中年危机', '心理健康', '兴趣爱好'].includes(a.category)
    }
  ], [sortedArticles])

  const currentTabObj = pillarTabs[activeTab] || pillarTabs[0]
  const currentFilteredArticles = useMemo(() => {
    return sortedArticles.filter(currentTabObj.filter)
  }, [sortedArticles, currentTabObj])

  const visibleArticles = currentFilteredArticles.slice(0, displayCount)
  const hasMore = currentFilteredArticles.length > displayCount

  // SOP 预案数据
  const sopPanels = [
    {
      id: 'layoff',
      title: '突遭裁员 72 小时应急',
      desc: '突然接获离职通知时的合法权益保护与心理止损 SOP',
      targetPath: '/career',
      steps: [
        {
          key: 's1',
          title: '01. 绝不现场盲签离职协议',
          detail: '要求对方出具书面解约函，将协议草案带回复核。逐项核对 N+1 补偿基数、未休年假 300% 折算及年终奖比例。'
        },
        {
          key: 's2',
          title: '02. 固化在职流水与劳动凭证',
          detail: '在公司内网切断前，打印近 12 个月银行工资流水、打卡记录、过往绩效通知与相关工作交接邮件并妥善脱敏备份。'
        },
        {
          key: 's3',
          title: '03. 申领失业保险金与医保代缴',
          detail: '非自愿离职可申领失业金，期间由失业保险基金代缴职工基本医疗保险费，确保看病报销不断档。'
        },
        {
          key: 's4',
          title: '04. 盘点下季度硬性债务敞口',
          detail: '列出房贷、车贷与必要刚性开销，如面临短期还贷压力，尽早与银行申请按揭延期或优化还款计划。'
        }
      ]
    },
    {
      id: 'side',
      title: '35+ 副业避坑与轻量起步',
      desc: '中年试错成本极高，以轻资产、技能复用与零边际成本为原则',
      targetPath: '/side-business',
      steps: [
        {
          key: 's5',
          title: '01. 坚决避开重资产加盟与开店',
          detail: '严禁动用家庭应急储蓄去加盟奶茶、烘焙或盲目租赁办公场地，重资产投入往往会在 6~12 个月内亏尽现金。'
        },
        {
          key: 's6',
          title: '02. 经验变现：中小企业咨询与陪跑',
          detail: '将过往主业里踩过的行业坑、合规模板、工程脚手架沉淀为咨询方案，直接卖给有需求的中小公司或新人。'
        },
        {
          key: 's7',
          title: '03. 沉淀数字资产与流程模板',
          detail: '开发可复用的提示词库、业务 SOP、专业设计/代码组件，一次性生产，通过分发渠道形成长尾被动微收入。'
        },
        {
          key: 's8',
          title: '04. 陌生人付费验证第一单',
          detail: '在未拿到任何真实陌生用户的真实付费前，绝不采购付费开发工具、不做大额推广投入。'
        }
      ]
    },
    {
      id: 'finance',
      title: '家庭资产底线·四笔钱法则',
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
          detail: '家庭核心收入来源必须配置足额的百万医疗险与定期寿险，用每年极低的杠杆保费隔离大病直接击穿家庭的极端风险。'
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

  const toggleStep = (key) => {
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const currentSop = sopPanels[sopTab]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf8f5', color: '#1c1917' }}>
      
      {/* 🧭 控制台顶部仪表区 (Dashboard Header) */}
      <Box
        sx={{
          pt: { xs: 3.5, md: 5 },
          pb: { xs: 3.5, md: 4.5 },
          borderBottom: '1px solid #e7e5e4',
          backgroundColor: '#ffffff'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2.5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.4rem', sm: '1.65rem' },
                    color: '#1c1917',
                    letterSpacing: '-0.02em'
                  }}
                >
                  中年自救工作台
                </Typography>
                <Chip
                  label="实操与防守控制台"
                  size="small"
                  sx={{
                    bgcolor: '#f5f5f4',
                    color: '#57534e',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderRadius: 1
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#78716c', maxWidth: 640 }}>
                面向现实阻力的抗风险雷达、关键变故应急预案与一线落地实操指南。
              </Typography>
            </Box>

            {/* 核心指标概览小卡 */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                bgcolor: '#faf8f5',
                p: 1.5,
                borderRadius: 2,
                border: '1px solid #e7e5e4',
                width: { xs: '100%', md: 'auto' },
                justifyContent: { xs: 'space-between', md: 'flex-start' }
              }}
            >
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>生存跑道测算</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: runwayStatus.color, lineHeight: 1.3 }}>
                  {runwayMonths} 个月
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: '#e7e5e4' }} />
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>应急防御预案</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', lineHeight: 1.3 }}>
                  3 套 SOP 就绪
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: '#e7e5e4' }} />
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block' }}>一线避坑实战</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', lineHeight: 1.3 }}>
                  {sortedArticles.length} 篇精选
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 📊 控制台双核心面板：左侧雷达 + 右侧应急 SOP 看板 */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          
          {/* 左侧：家庭抗风险生命线与养老跑道雷达 */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                height: '100%',
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
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
                      fontSize: '0.72rem'
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#78716c', mb: 3, fontSize: '0.86rem' }}>
                  假定极端情况下收入完全中断，评估家庭现有流动现金可维持基本开销的月数。
                </Typography>

                {/* 滑块调节 1：现有应急储备 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 600 }}>
                      可用流动备用金：
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

                {/* 滑块调节 2：月均刚性支出 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 600 }}>
                      每月全家刚性硬开销：
                      <Box component="span" sx={{ color: '#c2410c', fontWeight: 700, ml: 0.5 }}>
                        ¥{monthlyCost.toLocaleString()} / 月
                      </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#a8a29e' }}>房贷 + 饮食 + 老小赡养</Typography>
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

                {/* 测算诊断结果卡 */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#faf8f5',
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
                    💡 诊断建议：{runwayStatus.advice}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ pt: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
                  打开完整版养老精算模型
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* 右侧：关键变故应急预案看板 (SOP Board) */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                height: '100%',
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
                    <ChecklistIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '1.08rem' }}>
                      变故应急行动看板
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#78716c' }}>
                    逐项核对 · 点击可标记
                  </Typography>
                </Box>

                {/* 场景切换选项卡 */}
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

                {/* 清单项目 */}
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
                          bgcolor: isDone ? '#f5f5f4' : '#faf8f5',
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
          </Grid>
        </Grid>

        {/* 🧭 四大自救战区入口（对称分布） */}
        <Box sx={{ mt: 4, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.05em', mb: 2 }}>
            四大自救领域专栏
          </Typography>
          <Grid container spacing={2}>
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
              <Grid item xs={12} sm={6} md={3} key={col.title}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(col.path)}
                  sx={{
                    p: 2.2,
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
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 📚 实战智库列表（支持精简列表 / 卡片网格两种视图，彻底解决卡片杂乱断行） */}
        <Box sx={{ mt: 6, mb: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.25rem' }}>
                实战经验智库
              </Typography>
              <Typography variant="body2" sx={{ color: '#78716c', mt: 0.3 }}>
                按具体问题分类整理，共收录 137 篇一线落地经验与避坑记录。
              </Typography>
            </Box>

            {/* 视图切换按钮 */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="精简列表视图">
                <IconButton
                  size="small"
                  onClick={() => setViewMode('list')}
                  sx={{
                    bgcolor: viewMode === 'list' ? '#e7e5e4' : '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: 1.5
                  }}
                >
                  <ListViewIcon sx={{ fontSize: 18, color: viewMode === 'list' ? '#1c1917' : '#78716c' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="卡片网格视图">
                <IconButton
                  size="small"
                  onClick={() => setViewMode('grid')}
                  sx={{
                    bgcolor: viewMode === 'grid' ? '#e7e5e4' : '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: 1.5
                  }}
                >
                  <GridViewIcon sx={{ fontSize: 18, color: viewMode === 'grid' ? '#1c1917' : '#78716c' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* 分类 Tabs 导航 */}
          <Box
            sx={{
              mb: 3,
              position: 'sticky',
              top: 68,
              zIndex: 10,
              backgroundColor: 'rgba(250, 248, 245, 0.96)',
              backdropFilter: 'blur(12px)',
              py: 0.8,
              borderBottom: '1px solid #e7e5e4'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, val) => {
                setActiveTab(val)
                setDisplayCount(8)
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 2.5,
                  borderRadius: 1,
                  backgroundColor: '#c2410c'
                },
                '& .MuiTab-root': {
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: { xs: 1.6, sm: 2 },
                  py: 1,
                  mr: 1,
                  borderRadius: 1.5,
                  color: '#78716c',
                  '&.Mui-selected': {
                    color: '#c2410c'
                  }
                }
              }}
            >
              {pillarTabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <span>{tab.name}</span>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.72rem',
                          bgcolor: activeTab === index ? 'rgba(194, 65, 12, 0.1)' : '#f5f5f4',
                          color: activeTab === index ? '#c2410c' : '#78716c',
                          px: 0.8,
                          py: 0.2,
                          borderRadius: '10px',
                          fontWeight: 700
                        }}
                      >
                        {tab.badge}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* 文章展示：根据 viewMode 渲染列表或规整卡片 */}
          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3, 4].map((n) => (
                <Paper key={n} sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff' }}>
                  <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={20} />
                </Paper>
              ))}
            </Stack>
          ) : visibleArticles.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#ffffff', border: '1px dashed #d6d3d1', borderRadius: 2 }}>
              <Typography color="text.secondary">该分类下正在整理更多实战干货，敬请期待！</Typography>
            </Paper>
          ) : viewMode === 'list' ? (
            /* 1. 精简列表视图 (List View) - 类似 Notion / 经济学人 目录，排版极为平整干净 */
            <Stack spacing={1.5}>
              {visibleArticles.map((article, idx) => {
                const colorConfig = categoryStyles[article.category] || { bg: '#f5f5f4', color: '#44403c', border: '#e7e5e4' }
                return (
                  <Paper
                    key={article.id || idx}
                    elevation={0}
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e7e5e4',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 1.5,
                      '&:hover': {
                        borderColor: '#c2410c',
                        backgroundColor: '#fffdfa',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        '& .list-title': { color: '#c2410c' }
                      }
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.8 }}>
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{
                            bgcolor: colorConfig.bg,
                            color: colorConfig.color,
                            border: `1px solid ${colorConfig.border}`,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            height: 22
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                          {article.author || '实战导师'} · {article.readTime || '3分钟阅读'}
                        </Typography>
                      </Box>
                      <Typography
                        className="list-title"
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#1c1917',
                          fontSize: '1rem',
                          lineHeight: 1.4,
                          transition: 'color 0.15s'
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#78716c',
                          fontSize: '0.85rem',
                          mt: 0.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.excerpt || article.summary}
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      variant="text"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        color: '#78716c',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        alignSelf: { xs: 'flex-end', sm: 'center' },
                        p: 0,
                        minWidth: 'auto',
                        '&:hover': { color: '#c2410c', bgcolor: 'transparent' }
                      }}
                    >
                      阅读
                    </Button>
                  </Paper>
                )
              })}
            </Stack>
          ) : (
            /* 2. 规整卡片网格视图 (Grid View) - 严格等高与对齐 */
            <Grid container spacing={2.5}>
              {visibleArticles.map((article, idx) => {
                const colorConfig = categoryStyles[article.category] || { bg: '#f5f5f4', color: '#44403c', border: '#e7e5e4' }
                return (
                  <Grid item xs={12} sm={6} key={article.id || idx}>
                    <Card
                      onClick={() => navigate(`/article/${article.id}`)}
                      elevation={0}
                      sx={{
                        height: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e7e5e4',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        '&:hover': {
                          borderColor: '#c2410c',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
                          '& .grid-title': { color: '#c2410c' }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Chip
                            label={article.category}
                            size="small"
                            sx={{
                              bgcolor: colorConfig.bg,
                              color: colorConfig.color,
                              border: `1px solid ${colorConfig.border}`,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              height: 22
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                            {article.readTime || '3分钟阅读'}
                          </Typography>
                        </Box>

                        <Typography
                          className="grid-title"
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.02rem',
                            lineHeight: 1.4,
                            color: '#1c1917',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 0.15s'
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: '#78716c',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.85rem',
                            lineHeight: 1.5
                          }}
                        >
                          {article.excerpt || article.summary}
                        </Typography>
                      </CardContent>

                      <Box sx={{ px: 2.5, pb: 2, pt: 0 }}>
                        <Divider sx={{ mb: 1.2, borderColor: '#f5f5f4' }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                            {article.author || '实战导师'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            查阅全文 →
                          </Typography>
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}

          {/* 加载更多按钮 */}
          {hasMore && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setDisplayCount(prev => prev + 8)}
                sx={{
                  borderColor: '#d6d3d1',
                  color: '#44403c',
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    borderColor: '#a8a29e',
                    bgcolor: '#fafaf9'
                  }
                }}
              >
                加载更多实战指南 ({currentFilteredArticles.length - visibleArticles.length} 篇待展开)
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* 底部 */}
      <Footer />
    </Box>
  )
}

export default Home
