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
  Button,
  Tabs,
  Tab,
  Avatar,
  Slider
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  SpaceDashboardOutlined as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  BookmarkBorder as BookmarkIcon,
  LocalOfferOutlined as TagIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

const categoryStyles = {
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

const popularTags = [
  '离职维权',
  '失业金申领',
  '社保医保代缴',
  '四笔钱配置',
  '轻资产副业',
  '个人养老金',
  '考勤流水固化',
  '向上管理'
]

const Home = () => {
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(10)

  // 侧边栏挂件：家庭现金流跑道简易速算
  const [sidebarSavings, setSidebarSavings] = useState(30)
  const [sidebarMonthly, setSidebarMonthly] = useState(12000)

  const sidebarRunway = useMemo(() => {
    if (!sidebarMonthly) return '0.0'
    return ((sidebarSavings * 10000) / sidebarMonthly).toFixed(1)
  }, [sidebarSavings, sidebarMonthly])

  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  const sortedArticles = useMemo(() => {
    return [...publishedArticles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [publishedArticles])

  // 少数派式头条焦点（置顶重磅特稿）
  const heroArticle = sortedArticles[0] || {
    id: 'career-35-tips',
    title: '突遭裁员的 72 小时应急手册：权益防御、证据留存与社保接续',
    excerpt: '面对突如其来的离职交涉，普通人最容易犯的错误是当场盲签协议。按步骤固定考勤流水，核算 N+1 与未休年假折算，由失业基金代缴医保。',
    author: '职场战略组',
    date: '2024-01-20',
    readTime: '8分钟阅读',
    category: '职场发展'
  }

  // 少数派式热门排行前 4 篇
  const trendingArticles = useMemo(() => {
    return sortedArticles.slice(1, 5)
  }, [sortedArticles])

  // 分类 Tabs
  const feedTabs = useMemo(() => [
    { id: 'all', name: '全部实战', filter: () => true },
    { id: 'career', name: '职场突围', filter: a => ['职场发展', '转型升级'].includes(a.category) },
    { id: 'finance', name: '财务与养老', filter: a => ['财务管理'].includes(a.category) },
    { id: 'side', name: '副业轻创', filter: a => ['副业指南'].includes(a.category) },
    { id: 'mind', name: '身心与家庭', filter: a => ['中年危机', '心理健康', '家庭关系', '生活技能'].includes(a.category) },
  ], [])

  const currentTab = feedTabs[activeTab] || feedTabs[0]
  const filteredArticles = useMemo(() => {
    return sortedArticles.filter(currentTab.filter)
  }, [sortedArticles, currentTab])

  const visibleArticles = filteredArticles.slice(0, displayCount)
  const hasMore = filteredArticles.length > displayCount

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 少数派风格顶通提示条 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 1.5 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label="新功能"
                size="small"
                sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '0.72rem', height: 20, borderRadius: 1 }}
              />
              <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.85rem' }}>
                中年自救工作台已正式上线：现金流跑道测算器 & 关键变故 72h 应急看板
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={() => navigate('/dashboard')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
              sx={{
                color: '#c2410c',
                fontWeight: 700,
                fontSize: '0.85rem',
                p: 0,
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
              }}
            >
              打开工作台
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 少数派经典 Hero：左侧焦点大卡 + 右侧排行列表 (01-04) */}
      <Container maxWidth="lg" sx={{ pt: 3.5, pb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1.7fr 1fr'
            },
            gap: 2.5,
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          {/* 左侧：少数派焦点大卡 */}
          <Paper
            elevation={0}
            onClick={() => navigate(`/article/${heroArticle.id}`)}
            sx={{
              p: { xs: 3, sm: 4 },
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderTop: '3px solid #c2410c',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#c2410c',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                '& .hero-title': { color: '#c2410c' }
              }
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <Chip
                  label="焦点推荐"
                  size="small"
                  sx={{
                    bgcolor: '#c2410c',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 22,
                    borderRadius: 1
                  }}
                />
                <Chip
                  label={heroArticle.category}
                  size="small"
                  sx={{
                    bgcolor: '#f3f4f6',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 22,
                    borderRadius: 1
                  }}
                />
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  {heroArticle.readTime || '8分钟阅读'}
                </Typography>
              </Box>

              <Typography
                className="hero-title"
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#111827',
                  fontSize: { xs: '1.35rem', sm: '1.75rem' },
                  lineHeight: 1.35,
                  mb: 2,
                  transition: 'color 0.15s'
                }}
              >
                {heroArticle.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#4b5563',
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 3
                }}
              >
                {heroArticle.excerpt}
              </Typography>
            </Box>

            <Box sx={{ pt: 2, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Avatar sx={{ width: 26, height: 26, bgcolor: '#c2410c', fontSize: '0.75rem', fontWeight: 700 }}>
                  {heroArticle.author ? heroArticle.author.charAt(0) : '专'}
                </Avatar>
                <Typography variant="caption" sx={{ color: '#374151', fontWeight: 600 }}>
                  {heroArticle.author || '特约研究组'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  · {heroArticle.date || '最近更新'}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                阅读全文 →
              </Typography>
            </Box>
          </Paper>

          {/* 右侧：少数派热门排行 (01 - 04) */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
                  热门实战榜
                </Typography>
              </Box>

              <Stack spacing={2}>
                {trendingArticles.map((art, idx) => (
                  <Box
                    key={art.id || idx}
                    onClick={() => navigate(`/article/${art.id}`)}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      '&:hover .rank-title': { color: '#c2410c' }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                        color: idx === 0 ? '#c2410c' : '#9ca3af',
                        minWidth: 24,
                        fontFamily: '"SF Pro Display", sans-serif'
                      }}
                    >
                      0{idx + 1}
                    </Typography>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        className="rank-title"
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: '#1f2937',
                          lineHeight: 1.45,
                          fontSize: '0.88rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.15s'
                        }}
                      >
                        {art.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          {art.category}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          · {art.readTime || '3分钟阅读'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="text"
                onClick={() => navigate('/articles')}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                sx={{ color: '#4b5563', fontWeight: 600, fontSize: '0.8rem', p: 0, '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
              >
                查看完整榜单
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* 少数派专题专栏通栏 (4个矩阵专栏，无任何 emoji) */}
      <Box sx={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', py: 3.5 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 2,
              width: '100%'
            }}
          >
            {[
              {
                title: '职场突围战',
                tag: '职场防线',
                desc: '35岁破局 · 经验变现 · 合法维权',
                count: '38 篇实录',
                path: '/career'
              },
              {
                title: '副业与轻创',
                tag: '开源创收',
                desc: '零成本起步 · 咨询陪跑 · 数字模板',
                count: '24 篇实录',
                path: '/side-business'
              },
              {
                title: '资产与养老',
                tag: '底线防御',
                desc: '四笔钱法则 · 养老精算 · 债务重构',
                count: '32 篇实录',
                path: '/finance'
              },
              {
                title: '身心与家庭',
                tag: '基石支撑',
                desc: '中年内耗脱敏 · 亲子沟通 · 健康指标',
                count: '43 篇实录',
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
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 110,
                  '&:hover': {
                    borderColor: '#c2410c',
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.92rem' }}>
                      {col.title}
                    </Typography>
                    <Chip
                      label={col.tag}
                      size="small"
                      sx={{ bgcolor: '#e5e7eb', color: '#4b5563', fontSize: '0.7rem', height: 18, borderRadius: 0.8 }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', lineHeight: 1.5, display: 'block' }}>
                    {col.desc}
                  </Typography>
                </Box>

                <Box sx={{ pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.75rem' }}>
                    {col.count}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, fontSize: '0.75rem' }}>
                    进入专栏 →
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 少数派经典 7:3 分栏布局：左侧主流信息流 + 右侧实用工具侧边栏 */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2.3fr 1fr'
            },
            gap: 3.5,
            width: '100%',
            alignItems: 'flex-start'
          }}
        >
          {/* 左侧：主流文章流 (Feed) */}
          <Box sx={{ width: '100%' }}>
            {/* 分类 Tabs 切换条 */}
            <Box sx={{ borderBottom: '1px solid #e5e7eb', mb: 2.5, backgroundColor: '#ffffff', borderRadius: 2, p: 0.5, border: '1px solid #e5e7eb' }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => {
                  setActiveTab(val)
                  setDisplayCount(10)
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 40,
                  '& .MuiTabs-indicator': { backgroundColor: '#c2410c', height: 2 },
                  '& .MuiTab-root': {
                    minHeight: 40,
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    color: '#6b7280',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    '&.Mui-selected': { color: '#c2410c' }
                  }
                }}
              >
                {feedTabs.map((tab) => (
                  <Tab key={tab.id} label={tab.name} />
                ))}
              </Tabs>
            </Box>

            {/* 少数派标准文章卡片列表 */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              {visibleArticles.map((article, idx) => {
                const colorConfig = categoryStyles[article.category] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
                return (
                  <Paper
                    key={article.id || idx}
                    elevation={0}
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      p: 2.5,
                      width: '100%',
                      boxSizing: 'border-box',
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#c2410c',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                        '& .article-title': { color: '#c2410c' }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          bgcolor: colorConfig.bg,
                          color: colorConfig.color,
                          border: `1px solid ${colorConfig.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          height: 20,
                          borderRadius: 0.8
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        {article.readTime || '3分钟阅读'}
                      </Typography>
                    </Box>

                    <Typography
                      className="article-title"
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '1.02rem',
                        lineHeight: 1.45,
                        mb: 0.8,
                        transition: 'color 0.15s'
                      }}
                    >
                      {article.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4b5563',
                        fontSize: '0.86rem',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1.5
                      }}
                    >
                      {article.excerpt || article.summary}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f9fafb' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.65rem', bgcolor: '#c2410c' }}>
                          {article.author ? article.author.charAt(0) : '专'}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                          {article.author || '实战导师'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          · {article.date || '最近'}
                        </Typography>
                      </Box>

                      <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>
                        阅读全文 →
                      </Typography>
                    </Box>
                  </Paper>
                )
              })}
            </Stack>

            {/* 加载更多 */}
            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setDisplayCount(prev => prev + 10)}
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#374151',
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    bgcolor: '#ffffff',
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                  }}
                >
                  加载更多实战指南 ({filteredArticles.length - visibleArticles.length} 篇待展开)
                </Button>
              </Box>
            )}
          </Box>

          {/* 右侧：少数派风格侧边栏 (Sidebar Widgets) */}
          <Box sx={{ width: '100%', position: 'sticky', top: 76 }}>
            <Stack spacing={2.5}>
              
              {/* 挂件 1：工作台现金流跑道简易速测组件 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <DashboardIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    家庭跑道速测
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
                  假定极端零收入状态，测算家庭可用备用金可维持的月数。
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>流动备用金</Typography>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>{sidebarSavings} 万元</Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={sidebarSavings}
                    min={0}
                    max={120}
                    step={5}
                    onChange={(e, v) => setSidebarSavings(v)}
                    sx={{ color: '#c2410c' }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>月刚性开销</Typography>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>¥{sidebarMonthly.toLocaleString()}</Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={sidebarMonthly}
                    min={5000}
                    max={25000}
                    step={1000}
                    onChange={(e, v) => setSidebarMonthly(v)}
                    sx={{ color: '#c2410c' }}
                  />
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', textAlign: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>预计可支撑跑道</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#c2410c', my: 0.2 }}>
                    {sidebarRunway} <Typography component="span" variant="caption" sx={{ color: '#6b7280' }}>个月</Typography>
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => navigate('/dashboard')}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    bgcolor: '#111827',
                    color: '#ffffff',
                    fontWeight: 700,
                    py: 1,
                    borderRadius: 1.5,
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#c2410c' }
                  }}
                >
                  进入完整自救工作台
                </Button>
              </Paper>

              {/* 挂件 2：突发变故应急原则便签 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <BookmarkIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    72h 防御红线
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      1. 绝不现场盲签协议
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
                      要求对方出具书面解约函，把协议草案带回家复核 N+1 与年假折算。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      2. 及时固化流水凭证
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
                      在内网断开前备份考勤打卡、绩效通知与近 12 个月银行工资流水。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      3. 失业金申领医保接续
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
                      非自愿离职享受失业金，期间由失业保险基金直接代缴医疗保险。
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* 挂件 3：热门实战标签云 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TagIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    热门实战标签
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {popularTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                      sx={{
                        bgcolor: '#f3f4f6',
                        color: '#4b5563',
                        fontSize: '0.75rem',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#fee2e2', color: '#b91c1c' }
                      }}
                    />
                  ))}
                </Box>
              </Paper>

            </Stack>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default Home
