import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Skeleton,
  Grid,
  Slider,
  LinearProgress,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import {
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
  FamilyRestroom as FamilyIcon,
  Psychology as PsychologyIcon,
  Calculate as CalculateIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  AutoStories as BookIcon,
  Shield as ShieldIcon,
  WarningAmber as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as ChecklistIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 柔和优雅的杂志色系
const categoryColors = {
  '职场发展': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  '转型升级': { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  '副业指南': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  '财务管理': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  '中年危机': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  '心理健康': { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' },
  '家庭关系': { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' },
  '生活技能': { bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
  '兴趣爱好': { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
}

// 稳定一致的点赞和讨论数
const getDeterministicStats = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const likes = Math.abs(hash % 40) + 16
  const comments = Math.abs((hash >> 3) % 15) + 3
  return { likes, comments }
}

const Home = () => {
  const navigate = useNavigate()
  const { getAllArticles, loading } = useArticles()

  // 1. 家庭现金流生命线 & 养老金速算交互
  const [savingsWan, setSavingsWan] = useState(30) // 家庭可用应急金（万元）
  const [monthlyCost, setMonthlyCost] = useState(12000) // 每月刚性支出

  // 2. 文章信息流分类与翻页
  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(8)

  // 计算家庭安全跑道（Runway）与养老缺口
  const runwayMonths = useMemo(() => {
    if (!monthlyCost) return 0
    return ((savingsWan * 10000) / monthlyCost).toFixed(1)
  }, [savingsWan, monthlyCost])

  const pensionGap = useMemo(() => {
    // 假设退休后每月生活费按当前支出的70%，生活25年，社保预计能发40%，缺口60%
    const needTotal = monthlyCost * 0.7 * 12 * 25
    const gapTotal = needTotal * 0.6
    return (gapTotal / 10000).toFixed(0)
  }, [monthlyCost])

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
      name: '💼 职场突围·转型',
      badge: sortedArticles.filter(a => ['职场发展', '转型升级'].includes(a.category)).length,
      filter: (a) => ['职场发展', '转型升级'].includes(a.category)
    },
    {
      id: 'side',
      name: '⚡ 副业搞钱·轻创',
      badge: sortedArticles.filter(a => ['副业指南'].includes(a.category)).length,
      filter: (a) => ['副业指南'].includes(a.category)
    },
    {
      id: 'finance',
      name: '💰 财务账本·养老',
      badge: sortedArticles.filter(a => ['财务管理'].includes(a.category)).length,
      filter: (a) => ['财务管理'].includes(a.category)
    },
    {
      id: 'family',
      name: '🏡 家庭关系·沟通',
      badge: sortedArticles.filter(a => ['家庭关系', '生活技能'].includes(a.category)).length,
      filter: (a) => ['家庭关系', '生活技能'].includes(a.category)
    },
    {
      id: 'mind',
      name: '🌱 心理内耗·危机',
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf8f5', color: '#1c1917' }}>
      
      {/* 📖 1. 温暖、沉静、克制的杂志书卷 Hero */}
      <Box
        sx={{
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 8 },
          borderBottom: '1px solid #e7e5e4',
          background: 'linear-gradient(180deg, #f5f2eb 0%, #faf8f5 100%)'
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          {/* 顶栏温润标签 */}
          <Chip
            icon={<BookIcon sx={{ fontSize: 16, color: '#c2410c !important' }} />}
            label="一本写给 35+ 职场人的自救与避险备忘录"
            sx={{
              mb: 3,
              px: 2,
              py: 2,
              borderRadius: '50px',
              backgroundColor: '#fffbeb',
              color: '#92400e',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.88rem' },
              border: '1px solid #fde68a'
            }}
          />

          {/* 主标题 */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#1c1917',
              fontSize: { xs: '2.4rem', sm: '3.4rem', md: '3.8rem' },
              letterSpacing: '-0.025em',
              lineHeight: 1.18
            }}
          >
            中年自救指南
          </Typography>

          {/* 副标题：只有一句话，绝不说教 */}
          <Typography
            variant="h5"
            sx={{
              color: '#57534e',
              fontWeight: 400,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '680px',
              mx: 'auto'
            }}
          >
            用真实量化工具与 137 篇一线实操方案，陪你安稳走过人生的关键十年。
          </Typography>

          {/* 核心价值三大锚点 */}
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 4.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#44403c', fontSize: '0.92rem', fontWeight: 600 }}>
              <CheckCircleIcon sx={{ color: '#059669', fontSize: 18 }} />
              <span>137 篇落地避坑指南</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#44403c', fontSize: '0.92rem', fontWeight: 600 }}>
              <CalculateIcon sx={{ color: '#d97706', fontSize: 18 }} />
              <span>家庭生命线 & 养老金速算</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#44403c', fontSize: '0.92rem', fontWeight: 600 }}>
              <ShieldIcon sx={{ color: '#2563eb', fontSize: 18 }} />
              <span>突遭裁员与失业应急 SOP</span>
            </Box>
          </Stack>

          {/* 快捷按钮 */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ maxWidth: 440, mx: 'auto' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                const el = document.getElementById('action-checklists-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              startIcon={<ChecklistIcon />}
              sx={{
                bgcolor: '#c2410c',
                color: '#ffffff',
                py: 1.3,
                px: 3.5,
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#9a3412', boxShadow: 'none' }
              }}
            >
              直接看自救行动清单
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const el = document.getElementById('cashflow-calculator')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              startIcon={<CalculateIcon />}
              sx={{
                borderColor: '#d6d3d1',
                color: '#44403c',
                py: 1.3,
                px: 3.5,
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 600,
                bgcolor: '#ffffff',
                '&:hover': { borderColor: '#a8a29e', bgcolor: '#fafaf9' }
              }}
            >
              测算家庭抗风险跑道
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 🚨 2. 真正解决问题的核心：四大落地避坑行动清单（拿来即用） */}
      <Box
        id="action-checklists-section"
        sx={{
          py: 7,
          backgroundColor: '#faf8f5',
          borderBottom: '1px solid #e7e5e4'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ color: '#c2410c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
              ACTION CHECKLISTS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.5rem', sm: '1.9rem' } }}>
              📋 拿来即用的自救行动手册
            </Typography>
            <Typography variant="body2" sx={{ color: '#78716c', mt: 0.5 }}>
              不讲空洞大道理。遭遇变故时，按清单逐条核对，保护好家庭的底线。
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {/* 清单 1：裁员失业应急 SOP */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #fed7aa',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <WarningIcon sx={{ color: '#ea580c', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '1.1rem' }}>
                      裁员发生时的 72 小时应急
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#78716c', mb: 2, fontSize: '0.84rem' }}>
                    突然被通知“毕业”？别慌乱，按此顺序避开权益大坑：
                  </Typography>

                  <Stack spacing={1}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fff7ed', border: '1px solid #ffedd5' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#9a3412', fontSize: '0.86rem' }}>
                        1. 绝不当场签字离职协议
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        要求对方出具正式解约函，把协议带回家复核 N+1 与未休年假折算。
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #f5f5f4' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#292524', fontSize: '0.86rem' }}>
                        2. 备份在职证据与流水
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        打印考勤记录、过往绩效评价及近 12 个月银行工资流水备用。
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #f5f5f4' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#292524', fontSize: '0.86rem' }}>
                        3. 社保不断缴，申领失业金
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        非自愿离职可申领失业金（医疗保险国家代缴），按灵活就业接续。
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Button
                  variant="text"
                  onClick={() => navigate('/career')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#c2410c', fontWeight: 700, p: 0, mt: 2.5, justifyContent: 'flex-start' }}
                >
                  查看职场突围完整战术 →
                </Button>
              </Paper>
            </Grid>

            {/* 清单 2：副业搞钱避坑 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #bbf7d0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <MonetizationOnIcon sx={{ color: '#16a34a', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '1.1rem' }}>
                      35+ 副业探索·避坑指南
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#78716c', mb: 2, fontSize: '0.84rem' }}>
                    中年试错成本极高。轻资产是唯一的生路：
                  </Typography>

                  <Stack spacing={1}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#166534', fontSize: '0.86rem' }}>
                        ✅ 首选：经验咨询与企业培训
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        启动成本为 0。将你踩过坑的行业方案，卖给有需求的中小公司或新人。
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#166534', fontSize: '0.86rem' }}>
                        ✅ 沉淀：专业数字资产与模板
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        开发脚手架、业务流程 SOP、合规模板。一次制作，睡后长期变现。
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fee2e2' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#991b1b', fontSize: '0.86rem' }}>
                        ❌ 坚决避开：重资产加盟与开店
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        千万不要掏空积蓄去加盟奶茶、快餐或盲目租办公室，极易血本无归。
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Button
                  variant="text"
                  onClick={() => navigate('/side-business')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#15803d', fontWeight: 700, p: 0, mt: 2.5, justifyContent: 'flex-start' }}
                >
                  查看 15 套副业轻创实操 →
                </Button>
              </Paper>
            </Grid>

            {/* 清单 3：家庭四笔钱 */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: '#ffffff',
                  border: '1px solid #bfdbfe',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <ShieldIcon sx={{ color: '#2563eb', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '1.1rem' }}>
                      家庭底线防守·四笔钱法则
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#78716c', mb: 2, fontSize: '0.84rem' }}>
                    上有老下有小，家庭资产必须划分清楚边界：
                  </Typography>

                  <Stack spacing={1}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #dbeafe' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e40af', fontSize: '0.86rem' }}>
                        1. 活钱：6~12 个月刚性生活费
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        存大额存单或高流动货币工具，任何情况下都不能用于股市或风险投资。
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #f5f5f4' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#292524', fontSize: '0.86rem' }}>
                        2. 保命钱：顶梁柱纯保障底仓
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        经济支柱必须配置百万医疗 + 定期寿险，防止一次大病直接掏空家庭。
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#fbfbfa', border: '1px solid #f5f5f4' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#292524', fontSize: '0.86rem' }}>
                        3. 长钱与进取钱严格限额
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.3 }}>
                        养老金底仓追求确定性；风险投资绝不超过总流动资产的 15%。
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Button
                  variant="text"
                  onClick={() => navigate('/finance')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#2563eb', fontWeight: 700, p: 0, mt: 2.5, justifyContent: 'flex-start' }}
                >
                  查看家庭资产配置全方案 →
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 🧮 3. 真正有用的计算器：家庭安全生命线 & 养老缺口真实测算 */}
      <Box
        id="cashflow-calculator"
        sx={{
          py: 7,
          backgroundColor: '#f5f2eb',
          borderBottom: '1px solid #e7e5e4'
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#d97706', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                  RUNWAY & PENSION CALCULATOR
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.4rem', sm: '1.8rem' } }}>
                  🧮 家庭安全跑道 & 养老资金缺口速算
                </Typography>
                <Typography variant="body2" sx={{ color: '#78716c', mt: 0.5 }}>
                  算清账本才不心慌。输入真实开销，量化家庭在无收入状态下能支撑多久。
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={() => navigate('/pension-planner')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: '#d6d3d1',
                  color: '#44403c',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#a8a29e', bgcolor: '#fafaf9' }
                }}
              >
                打开完整版养老精算模型 →
              </Button>
            </Box>

            <Grid container spacing={4} alignItems="center">
              {/* 滑块调节 */}
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 600 }}>
                        家庭现有可用应急活钱储备：<Box component="span" sx={{ color: '#c2410c', fontWeight: 800, fontSize: '1.1rem' }}>{savingsWan}</Box> 万元
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

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 600 }}>
                        全家每月刚性硬性开支：<Box component="span" sx={{ color: '#c2410c', fontWeight: 800, fontSize: '1.1rem' }}>¥{monthlyCost.toLocaleString()}</Box> / 月
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#a8a29e' }}>房贷 + 伙食 + 老人小孩开销</Typography>
                    </Box>
                    <Slider
                      value={monthlyCost}
                      min={5000}
                      max={30000}
                      step={1000}
                      onChange={(e, v) => setMonthlyCost(v)}
                      sx={{ color: '#c2410c' }}
                    />
                  </Box>
                </Stack>
              </Grid>

              {/* 量化结果展示 */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    bgcolor: '#faf8f5',
                    border: '1px solid #e7e5e4'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    家庭生命线抗风险评估
                  </Typography>

                  <Box sx={{ my: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#78716c' }}>
                      若家庭收入突然归零，当前储备可支撑：
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: runwayMonths >= 12 ? '#15803d' : '#c2410c', my: 0.5 }}>
                      {runwayMonths} <Typography component="span" variant="h6" sx={{ color: '#57534e' }}>个月</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: runwayMonths >= 12 ? '#15803d' : '#ea580c', fontWeight: 700 }}>
                      {runwayMonths >= 12 ? '🟢 具备健康安全跑道，有充裕时间换道' : '⚠️ 低于12个月警戒线，需立刻缩减开支并开拓副业'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#78716c' }}>
                      预估个人养老金缺口：
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917' }}>
                      约 ¥{pensionGap} 万元
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* 📚 4. 137 篇分专题实战文库（温暖优雅的杂志排版） */}
      <Container
        id="articles-feed-section"
        maxWidth="lg"
        sx={{
          pt: 7,
          pb: 10,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ mb: 3.5 }}>
          <Typography variant="overline" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
            THE KNOWLEDGE BASE
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.5rem', sm: '1.9rem' } }}>
            📚 137 篇自救实战智库
          </Typography>
          <Typography variant="body2" sx={{ color: '#78716c', mt: 0.5 }}>
            按具体生活与职场问题分类，每篇均经过沉淀整理，拒绝无价值的互联网噪音。
          </Typography>
        </Box>

        {/* 分类 Tabs 导航 */}
        <Box
          sx={{
            mb: 3.5,
            position: 'sticky',
            top: 68,
            zIndex: 10,
            backgroundColor: 'rgba(250, 248, 245, 0.95)',
            backdropFilter: 'blur(16px)',
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
                height: 3,
                borderRadius: 2,
                backgroundColor: '#c2410c'
              },
              '& .MuiTab-root': {
                fontSize: '0.92rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 'auto',
                px: { xs: 1.8, sm: 2.2 },
                py: 1.2,
                mr: 1,
                borderRadius: 2,
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

        {/* 文章网格展示 */}
        <Grid container spacing={3}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
              <Grid item xs={12} sm={6} key={n}>
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#ffffff' }}>
                  <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="85%" height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} />
                </Paper>
              </Grid>
            ))
          ) : visibleArticles.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#ffffff', border: '1px dashed #d6d3d1', borderRadius: 3 }}>
                <Typography color="text.secondary">该分类下正在整理更多干货，敬请期待！</Typography>
              </Paper>
            </Grid>
          ) : (
            visibleArticles.map((article, idx) => {
              const stats = getDeterministicStats(article.id || article.title)
              const colorConfig = categoryColors[article.category] || { bg: '#f5f5f4', color: '#44403c', border: '#e7e5e4' }

              return (
                <Grid item xs={12} sm={6} key={article.id || idx}>
                  <Card
                    onClick={() => navigate(`/article/${article.id}`)}
                    elevation={0}
                    sx={{
                      height: '100%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e7e5e4',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                        borderColor: '#d6d3d1',
                        '& .card-title': { color: '#c2410c' }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{
                            bgcolor: colorConfig.bg,
                            color: colorConfig.color,
                            border: `1px solid ${colorConfig.border}`,
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                          {article.readTime || '3分钟阅读'}
                        </Typography>
                      </Box>

                      <Typography
                        className="card-title"
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.2,
                          fontSize: '1.08rem',
                          lineHeight: 1.4,
                          color: '#1c1917',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.2s'
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
                          fontSize: '0.86rem',
                          lineHeight: 1.6
                        }}
                      >
                        {article.excerpt || article.summary}
                      </Typography>
                    </CardContent>

                    <Box sx={{ px: 3, pb: 2.5, pt: 0 }}>
                      <Divider sx={{ mb: 1.5, borderColor: '#f5f5f4' }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 22, height: 22, fontSize: '0.65rem', bgcolor: '#c2410c', color: 'white' }}>
                            {article.author?.charAt(0) || '指'}
                          </Avatar>
                          <Typography variant="caption" sx={{ color: '#57534e', fontWeight: 600 }}>
                            {article.author || '特约导师'}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} sx={{ color: '#a8a29e' }}>
                          <Typography variant="caption">👍 {article.likes ?? stats.likes}</Typography>
                          <Typography variant="caption">💬 {article.comments ?? stats.comments}</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>

        {/* 加载更多 */}
        {visibleArticles.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="caption" sx={{ color: '#a8a29e', display: 'block', mb: 2 }}>
              已展示 {visibleArticles.length} / {currentFilteredArticles.length} 篇实操指南
            </Typography>
            {hasMore && (
              <Button
                variant="outlined"
                onClick={() => setDisplayCount(prev => prev + 6)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  borderColor: '#d6d3d1',
                  color: '#44403c',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    borderColor: '#c2410c',
                    color: '#c2410c',
                    bgcolor: '#fff7ed'
                  }
                }}
              >
                加载更多实战文章 ({currentFilteredArticles.length - visibleArticles.length} 篇)
              </Button>
            )}
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  )
}

export default Home
