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
  Tooltip
} from '@mui/material'
import {
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
  FamilyRestroom as FamilyIcon,
  Psychology as PsychologyIcon,
  Calculate as CalculateIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as SparkleIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Bolt as BoltIcon,
  MonetizationOn as MonetizationOnIcon,
  MenuBook as BookIcon,
  RateReview as RateReviewIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 分类渐变配色
const categoryGradients = {
  '职场发展': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  '转型升级': 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
  '副业指南': 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
  '财务管理': 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)',
  '中年危机': 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
  '心理健康': 'linear-gradient(135deg, #0369a1 0%, #06b6d4 100%)',
  '家庭关系': 'linear-gradient(135deg, #9d174d 0%, #ec4899 100%)',
  '生活技能': 'linear-gradient(135deg, #115e59 0%, #14b8a6 100%)',
  '兴趣爱好': 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
}

const getCategoryIcon = (category) => {
  switch (category) {
    case '职场发展':
    case '转型升级':
    case '副业指南':
      return <WorkIcon sx={{ fontSize: 28, color: 'white' }} />
    case '财务管理':
      return <AccountBalanceIcon sx={{ fontSize: 28, color: 'white' }} />
    case '家庭关系':
    case '生活技能':
      return <FamilyIcon sx={{ fontSize: 28, color: 'white' }} />
    case '中年危机':
    case '心理健康':
    case '兴趣爱好':
    default:
      return <PsychologyIcon sx={{ fontSize: 28, color: 'white' }} />
  }
}

// 稳定一致的点赞和讨论数
const getDeterministicStats = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const likes = Math.abs(hash % 50) + 24
  const comments = Math.abs((hash >> 3) % 18) + 5
  return { likes, comments }
}

const Home = () => {
  const navigate = useNavigate()
  const { getAllArticles, loading } = useArticles()

  // 1. 养老金即时速算器状态
  const [currentAge, setCurrentAge] = useState(38)
  const [retireAge, setRetireAge] = useState(60)
  const [monthlyExpense, setMonthlyExpense] = useState(10000)
  const [currentSavings, setCurrentSavings] = useState(25) // 万元

  // 2. 中年危机 4 维压力自测状态
  const [careerStress, setCareerStress] = useState(65)
  const [financeStress, setFinanceStress] = useState(70)
  const [familyStress, setFamilyStress] = useState(60)
  const [healthStress, setHealthStress] = useState(75)

  // 3. 文章信息流状态
  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(8)

  // 养老金速算计算逻辑
  const pensionCalc = useMemo(() => {
    const yearsToRetire = Math.max(1, retireAge - currentAge)
    const retirementYears = 25 // 预期退休后生活25年
    // 假设基础社保覆盖约 40%，个人缺口需补 60%
    const totalRetirementNeed = monthlyExpense * 12 * retirementYears
    const coveredByBasicPension = totalRetirementNeed * 0.4
    const futureSavingsGrowth = currentSavings * 10000 * Math.pow(1.04, yearsToRetire) // 假设4%年化积累
    const totalGap = Math.max(0, Math.round(totalRetirementNeed - coveredByBasicPension - futureSavingsGrowth))
    const monthlyGapToSave = Math.round(totalGap / (yearsToRetire * 12))

    let level = 'warning'
    let levelText = '🟡 需高度重视'
    let levelColor = '#f59e0b'
    if (totalGap > 1500000) {
      level = 'danger'
      levelText = '🔴 缺口巨大（严重承压）'
      levelColor = '#ef4444'
    } else if (totalGap < 500000) {
      level = 'safe'
      levelText = '🟢 稳健可控（防守良好）'
      levelColor = '#10b981'
    }

    return {
      yearsToRetire,
      totalGapWan: (totalGap / 10000).toFixed(1),
      monthlyGapToSave,
      level,
      levelText,
      levelColor
    }
  }, [currentAge, retireAge, monthlyExpense, currentSavings])

  // 中年危机指数综合评分
  const crisisIndex = useMemo(() => {
    const avg = Math.round((careerStress + financeStress + familyStress + healthStress) / 4)
    let diag = '当前处于平稳期，建议早做技能与资产防守。'
    let badgeColor = '#10b981'
    if (avg >= 70) {
      diag = '多重高压重叠！首要任务是“家庭现金流止血”与“心理防线建设”，切忌盲目大额投资。'
      badgeColor = '#ef4444'
    } else if (avg >= 55) {
      diag = '显性中年焦虑期，主要痛点在职场天花板与资产储备，建议重点探索轻资产副业。'
      badgeColor = '#f59e0b'
    }
    return { score: avg, diag, badgeColor }
  }, [careerStress, financeStress, familyStress, healthStress])

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
      name: '🔥 全部精选',
      badge: sortedArticles.length,
      filter: () => true
    },
    {
      id: 'career',
      name: '💼 职场·转型·副业',
      badge: sortedArticles.filter(a => ['职场发展', '转型升级', '副业指南'].includes(a.category)).length,
      filter: (a) => ['职场发展', '转型升级', '副业指南'].includes(a.category)
    },
    {
      id: 'finance',
      name: '💰 财务·养老资产',
      badge: sortedArticles.filter(a => ['财务管理'].includes(a.category)).length,
      filter: (a) => ['财务管理'].includes(a.category)
    },
    {
      id: 'family',
      name: '🏡 家庭·生活效能',
      badge: sortedArticles.filter(a => ['家庭关系', '生活技能'].includes(a.category)).length,
      filter: (a) => ['家庭关系', '生活技能'].includes(a.category)
    },
    {
      id: 'mind',
      name: '🌱 心理·危机破局',
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f1f5f9' }}>
      
      {/* 🌟 1. 震撼深空黑曜石 Hero 区域 */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          background: 'radial-gradient(ellipse 100% 80% at 50% -20%, #1e3a8a 0%, #090d16 80%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}
      >
        {/* 背景光晕装饰 */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* 顶栏徽章 */}
          <Chip
            icon={<ShieldIcon sx={{ fontSize: 16, color: '#38bdf8 !important' }} />}
            label="35+ 职场人破局 · 养老防守 · 家庭抗风险自救操作系统"
            sx={{
              mb: 3,
              px: 2,
              py: 2.2,
              borderRadius: '50px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              border: '1px solid rgba(56, 189, 248, 0.25)',
              backdropFilter: 'blur(10px)'
            }}
          />

          {/* 主标题 */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2.5,
              fontSize: { xs: '2.5rem', sm: '3.6rem', md: '4.4rem' },
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 70%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            中年不躺平，自救有系统
          </Typography>

          {/* 副标题 */}
          <Typography
            variant="h5"
            sx={{
              color: '#94a3b8',
              fontWeight: 400,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              mb: 5,
              lineHeight: 1.6,
              maxWidth: '780px',
              mx: 'auto'
            }}
          >
            应对 35 岁职场瓶颈、测算未来养老金缺口、筑牢家庭资产防火墙、拒绝空洞精神内耗。
            <Box component="span" sx={{ color: '#38bdf8', fontWeight: 600, display: 'block', mt: 0.5 }}>
              拒绝鸡汤，用真实数据、量化工具与 137 篇落地作战手册赋能人生下半场。
            </Box>
          </Typography>

          {/* 核心亮点数据条 */}
          <Stack
            direction="row"
            spacing={{ xs: 1.5, sm: 4 }}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 600 }}>
              <BookIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              <span>137 篇实战自救指南</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 600 }}>
              <CalculateIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <span>智能养老金缺口测算器</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 600 }}>
              <BoltIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
              <span>35+ 轻创业避坑沙盘</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e2e8f0', fontSize: '0.92rem', fontWeight: 600 }}>
              <FireIcon sx={{ color: '#ef4444', fontSize: 20 }} />
              <span>危机压力四维自测</span>
            </Box>
          </Stack>

          {/* 快捷跳转按钮 */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ maxWidth: 520, mx: 'auto' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                const el = document.getElementById('instant-pension-calculator')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              startIcon={<CalculateIcon />}
              sx={{
                bgcolor: '#2563eb',
                py: 1.6,
                px: 3.5,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
                '&:hover': { bgcolor: '#1d4ed8' }
              }}
            >
              30秒测算我的养老金缺口
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const el = document.getElementById('articles-feed-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.25)',
                color: '#e2e8f0',
                py: 1.6,
                px: 3.5,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' }
              }}
            >
              浏览 137 篇突围文库
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 🧮 2. 首页核心杀手锏：30秒退休养老金缺口速算器 */}
      <Box
        id="instant-pension-calculator"
        sx={{
          py: 8,
          backgroundColor: '#0d131f',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* 顶栏标题 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Box>
                <Chip
                  label="即开即测 · 真实量化"
                  size="small"
                  sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontWeight: 700, mb: 1.5 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  🧮 中年退休养老资金缺口速算
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                  拖动下方滑块，实时预演您的退休生活资金赤字与每月被动现金流补充需求
                </Typography>
              </Box>

              <Button
                variant="outlined"
                onClick={() => navigate('/pension-planner')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: '#3b82f6',
                  color: '#60a5fa',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#60a5fa', bgcolor: 'rgba(59, 130, 246, 0.1)' }
                }}
              >
                打开完整版 10 年现金流测算器 →
              </Button>
            </Box>

            {/* 双栏：左侧滑块交互，右侧实时计算面板 */}
            <Grid container spacing={4} alignItems="center">
              {/* 左侧控制滑块 */}
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                        当前年龄：<Box component="span" sx={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 700 }}>{currentAge}</Box> 岁
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>范围：30 - 55 岁</Typography>
                    </Box>
                    <Slider
                      value={currentAge}
                      min={30}
                      max={55}
                      onChange={(e, val) => setCurrentAge(val)}
                      sx={{ color: '#38bdf8' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                        期望退休年龄：<Box component="span" sx={{ color: '#818cf8', fontSize: '1.1rem', fontWeight: 700 }}>{retireAge}</Box> 岁
                        <Box component="span" sx={{ color: '#94a3b8', ml: 1, fontSize: '0.8rem' }}>（距退休还有 {pensionCalc.yearsToRetire} 年）</Box>
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>范围：50 - 65 岁</Typography>
                    </Box>
                    <Slider
                      value={retireAge}
                      min={50}
                      max={65}
                      onChange={(e, val) => setRetireAge(val)}
                      sx={{ color: '#818cf8' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                        退休后期望月支出：<Box component="span" sx={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 700 }}>¥{monthlyExpense.toLocaleString()}</Box> / 月
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>维持基础生活至高品质</Typography>
                    </Box>
                    <Slider
                      value={monthlyExpense}
                      min={4000}
                      max={30000}
                      step={1000}
                      onChange={(e, val) => setMonthlyExpense(val)}
                      sx={{ color: '#fbbf24' }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                        目前家庭养老专项储蓄储备：<Box component="span" sx={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 700 }}>{currentSavings}</Box> 万元
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>存款 + 稳健理财</Typography>
                    </Box>
                    <Slider
                      value={currentSavings}
                      min={0}
                      max={200}
                      step={5}
                      onChange={(e, val) => setCurrentSavings(val)}
                      sx={{ color: '#34d399' }}
                    />
                  </Box>
                </Stack>
              </Grid>

              {/* 右侧实时计算结果卡片 */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    border: '1px solid',
                    borderColor: pensionCalc.levelColor,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${pensionCalc.levelColor}22`
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      测算风险评级
                    </Typography>
                    <Chip
                      label={pensionCalc.levelText}
                      size="small"
                      sx={{
                        bgcolor: `${pensionCalc.levelColor}22`,
                        color: pensionCalc.levelColor,
                        fontWeight: 700,
                        border: `1px solid ${pensionCalc.levelColor}44`
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                    预计退休总资金缺口：
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: pensionCalc.levelColor,
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      mb: 2,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    ¥ {pensionCalc.totalGapWan} <Typography component="span" variant="h5" sx={{ color: '#cbd5e1' }}>万元</Typography>
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>建议每月需补充积攒：</Typography>
                      <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 700 }}>
                        约 ¥{pensionCalc.monthlyGapToSave.toLocaleString()} / 月
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>自救建议路径：</Typography>
                      <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                        开拓轻资产副业 + 提高抗风险现金流
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/finance')}
                    sx={{
                      bgcolor: '#2563eb',
                      fontWeight: 700,
                      borderRadius: 2,
                      py: 1.2,
                      boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
                      '&:hover': { bgcolor: '#1d4ed8' }
                    }}
                  >
                    查看家庭财务防守方案
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* 🎯 3. 中年危机 4 维压力自测雷达 */}
      <Box
        sx={{
          py: 8,
          backgroundColor: '#090d16',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              icon={<FireIcon sx={{ color: '#ef4444 !important' }} />}
              label="中年承压体检"
              size="small"
              sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
              🎯 中年危机 4 维压力指数自测
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 650, mx: 'auto' }}>
              职场、家庭、财务、情绪多头挤压？滑动评估您当前的负荷分布，获取量身定制的破局处方
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            {/* 4 维滑块 */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon sx={{ fontSize: 18, color: '#3b82f6' }} /> 职场天花板与裁员焦虑
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>{careerStress} 分</Typography>
                    </Box>
                    <Slider value={careerStress} onChange={(e, v) => setCareerStress(v)} sx={{ color: '#3b82f6' }} />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonetizationOnIcon sx={{ fontSize: 18, color: '#f59e0b' }} /> 房贷/车贷/现金流紧绷度
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>{financeStress} 分</Typography>
                    </Box>
                    <Slider value={financeStress} onChange={(e, v) => setFinanceStress(v)} sx={{ color: '#f59e0b' }} />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FamilyIcon sx={{ fontSize: 18, color: '#ec4899' }} /> 子女教育与老人医疗精力负荷
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#f472b6', fontWeight: 700 }}>{familyStress} 分</Typography>
                    </Box>
                    <Slider value={familyStress} onChange={(e, v) => setFamilyStress(v)} sx={{ color: '#ec4899' }} />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PsychologyIcon sx={{ fontSize: 18, color: '#8b5cf6' }} /> 精神内耗/失眠/意义感缺失
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700 }}>{healthStress} 分</Typography>
                    </Box>
                    <Slider value={healthStress} onChange={(e, v) => setHealthStress(v)} sx={{ color: '#8b5cf6' }} />
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* 诊断报告面板 */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}
              >
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  综合中年危机指数
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, my: 1.5 }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: crisisIndex.badgeColor }}>
                    {crisisIndex.score}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#94a3b8' }}>/ 100 分</Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={crisisIndex.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': { bgcolor: crisisIndex.badgeColor }
                  }}
                />

                <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    💡 破局诊断建议：
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                    {crisisIndex.diag}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/midlife-crisis')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 3,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' }
                  }}
                >
                  查看《中年危机破局全指南》
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 💼 4. 35+ 职场破局与副业轻创业沙盘 */}
      <Box
        sx={{
          py: 8,
          backgroundColor: '#0d131f',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 5 }}>
            <Box>
              <Chip
                label="第二曲线 · 技能变现"
                size="small"
                sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, mb: 1.5 }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                💼 35+ 副业与轻资产创业突围沙盒
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                中年创业千万不要盲目租店开奶茶店！精选适合职场沉淀的 4 大轻资产变现路径
              </Typography>
            </Box>

            <Button
              variant="text"
              onClick={() => navigate('/side-business')}
              endIcon={<ArrowForwardIcon />}
              sx={{ color: '#34d399', fontWeight: 600 }}
            >
              浏览全部 15 套副业模式 →
            </Button>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title: '01 技能咨询与知识陪跑',
                badge: '极低门槛 · 快速现金流',
                fit: '技术骨干 / 财务法务 / 管理者 / HR',
                cost: '启动成本：0 元',
                income: '预期：5K - 30K/月',
                desc: '把多年一线踩坑经验转化为企业或新人急需的一对一咨询、求职辅导或诊断报告。',
                tag: '副业首选',
                color: '#10b981'
              },
              {
                title: '02 数字资产与专业模板',
                badge: '睡后收入 · 一次制作多次卖',
                fit: '产品经理 / 设计师 / 程序员 / 运营',
                cost: '启动成本：软件工具费',
                income: '预期：3K - 20K/月（复利）',
                desc: '制作行业标准化文档模板、低代码脚本、行业研报或Prompt库，在垂直受众中持续变现。',
                tag: '长效复利',
                color: '#3b82f6'
              },
              {
                title: '03 垂直领域个人IP孵化',
                badge: '品牌溢价 · 资源连接器',
                fit: '有独到业务见解与表达欲的专家',
                cost: '启动成本：时间与持续输出',
                income: '预期：广告/私域/高客单服务',
                desc: '在小红书、微信公众号深耕中年痛点或细分行业，建立“可信任的行家里手”标签。',
                tag: '个人品牌',
                color: '#8b5cf6'
              },
              {
                title: '04 轻量级服务出海/跨境',
                badge: '汇率优势 · 差异化套利',
                fit: '有国际视野、懂开发或供应链的职场人',
                cost: '启动成本：5K - 20K',
                income: '预期：美金收入 · 空间广阔',
                desc: '海外独立站微型 SaaS、数字服务外包（Upwork/Fiverr）或轻量跨境电商品牌。',
                tag: '出海突围',
                color: '#f59e0b'
              }
            ].map((box) => (
              <Grid item xs={12} sm={6} md={3} key={box.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: box.color,
                      boxShadow: `0 15px 30px rgba(0,0,0,0.4), 0 0 20px ${box.color}20`
                    }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Chip
                        label={box.tag}
                        size="small"
                        sx={{ bgcolor: `${box.color}22`, color: box.color, fontWeight: 700, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{box.cost}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1, fontSize: '1.05rem' }}>
                      {box.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.84rem', mb: 2, lineHeight: 1.6 }}>
                      {box.desc}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', mb: 0.5, fontWeight: 600 }}>
                      适合：{box.fit}
                    </Typography>
                    <Typography variant="caption" sx={{ color: box.color, fontWeight: 700 }}>
                      收益：{box.income}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 🛡️ 5. 中年应急突围锦囊箱 (Survival Toolboxes) */}
      <Box
        sx={{
          py: 8,
          backgroundColor: '#090d16',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              icon={<ShieldIcon sx={{ color: '#38bdf8 !important' }} />}
              label="应急止血手册"
              size="small"
              sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
              🛡️ 中年危机避坑急救箱
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              关键时刻不慌乱：三大高频危机场景的行动避坑 SOP
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                onClick={() => navigate('/career')}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: '#ef4444' }
                }}
              >
                <WarningIcon sx={{ color: '#ef4444', fontSize: 32, mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  《突遭裁员的黄金 72 小时生存 SOP》
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 2 }}>
                  1. 不要当场签字承诺书；<br />
                  2. 打印绩效与加班证据留存；<br />
                  3. 盘点社保公积金接续方案；<br />
                  4. 第一时间召开家庭财务紧缩会议。
                </Typography>
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  查看裁员防坑应对法则 →
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                onClick={() => navigate('/finance')}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: '#f59e0b' }
                }}
              >
                <AccountBalanceIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  《家庭抗风险“四笔钱”配置指南》
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 2 }}>
                  1. 活钱：6-12个月无收入应急金；<br />
                  2. 杠杆钱：家庭顶梁柱百万医疗与重疾；<br />
                  3. 稳健钱：年金险与国债锁定养老底仓；<br />
                  4. 进攻钱：严控比例在20%以内。
                </Typography>
                <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  查看家庭资产防守配置法 →
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                onClick={() => navigate('/family')}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: '#8b5cf6' }
                }}
              >
                <FamilyIcon sx={{ color: '#8b5cf6', fontSize: 32, mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                  《青春期逆反“闭嘴倾听”沟通公式》
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 2 }}>
                  1. 用“你觉得呢”替代“你必须”；<br />
                  2. 承认孩子的独立心理边界；<br />
                  3. 不在饭桌和睡前进行教训复盘；<br />
                  4. 从说教者退回到坚实的后盾伙伴。
                </Typography>
                <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  查看家庭亲子降温手册 →
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 📚 6. 实战文库精选（四大支柱文章流） */}
      <Container
        id="articles-feed-section"
        maxWidth="lg"
        sx={{
          pt: 8,
          pb: 12,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            icon={<BookIcon sx={{ color: '#38bdf8 !important' }} />}
            label="深度知识库"
            size="small"
            sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 700, mb: 1.5 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
            📚 137 篇自救实战智库精选
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            覆盖职场、副业、养老金、家庭与心理的全景作战方案
          </Typography>
        </Box>

        {/* 分类 Tabs 导航 */}
        <Box
          sx={{
            mb: 4,
            position: 'sticky',
            top: 64,
            zIndex: 10,
            backgroundColor: 'rgba(9, 13, 22, 0.95)',
            backdropFilter: 'blur(16px)',
            py: 1,
            borderBottom: '1px solid rgba(255,255,255,0.08)'
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
                backgroundColor: '#3b82f6'
              },
              '& .MuiTab-root': {
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 'auto',
                px: { xs: 2, sm: 2.8 },
                py: 1.5,
                mr: 1,
                borderRadius: 2,
                color: '#94a3b8',
                '&.Mui-selected': {
                  color: '#38bdf8'
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
                        fontSize: '0.75rem',
                        bgcolor: activeTab === index ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.06)',
                        color: activeTab === index ? '#38bdf8' : '#64748b',
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
              <Grid item xs={12} sm={6} md={6} key={n}>
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#0f172a' }}>
                  <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="100%" height={20} />
                </Paper>
              </Grid>
            ))
          ) : visibleArticles.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(15,23,42,0.6)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Typography color="text.secondary">该分类下正在整理更多干货，敬请期待！</Typography>
              </Paper>
            </Grid>
          ) : (
            visibleArticles.map((article, idx) => {
              const stats = getDeterministicStats(article.id || article.title)
              const gradient = categoryGradients[article.category] || 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'

              return (
                <Grid item xs={12} sm={6} key={article.id || idx}>
                  <Card
                    onClick={() => navigate(`/article/${article.id}`)}
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                        borderColor: 'rgba(56, 189, 248, 0.4)',
                        '& .card-title': { color: '#38bdf8' }
                      }
                    }}
                  >
                    {/* 左侧封面 */}
                    <Box
                      sx={{
                        width: { xs: '100%', sm: 170 },
                        minWidth: { sm: 170 },
                        minHeight: { xs: 130, sm: 170 },
                        background: article.image ? `url(${article.image})` : gradient,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        color: 'white',
                        textAlign: 'center'
                      }}
                    >
                      {!article.image && (
                        <>
                          <Box sx={{ mb: 0.8 }}>{getCategoryIcon(article.category)}</Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                            {article.category}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* 右侧内容 */}
                    <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{
                            mb: 1,
                            bgcolor: 'rgba(255,255,255,0.06)',
                            color: '#94a3b8',
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}
                        />
                        <Typography
                          className="card-title"
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.05rem',
                            lineHeight: 1.4,
                            color: '#f8fafc',
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
                            color: '#64748b',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.84rem',
                            lineHeight: 1.5
                          }}
                        >
                          {article.excerpt || article.summary}
                        </Typography>
                      </Box>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {article.readTime || '3分钟阅读'} · {article.author}
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ color: '#64748b' }}>
                          <Typography variant="caption">👍 {article.likes ?? stats.likes}</Typography>
                          <Typography variant="caption">💬 {article.comments ?? stats.comments}</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>

        {/* 加载更多按钮 */}
        {visibleArticles.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
              已展示 {visibleArticles.length} / {currentFilteredArticles.length} 篇精选指南
            </Typography>
            {hasMore && (
              <Button
                variant="outlined"
                onClick={() => setDisplayCount(prev => prev + 6)}
                sx={{
                  borderRadius: 3,
                  px: 5,
                  py: 1.4,
                  fontWeight: 700,
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  bgcolor: 'rgba(56, 189, 248, 0.05)',
                  '&:hover': {
                    borderColor: '#38bdf8',
                    bgcolor: 'rgba(56, 189, 248, 0.15)'
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
