import { useState, useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar
} from '@mui/material'
import {
  Search,
  Clear,
  Star,
  OpenInNew,
  GitHub,
  SwapHoriz,
  VerifiedOutlined,
  ArticleOutlined,
  AppsOutlined,
  InfoOutlined
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import alternativesData from '../data/alternativesData.json'
import {
  FREE_TIER_META,
  formatStars
} from '../data/alternativesConstants'

const Products = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()

  // 原始好物文章
  const productArticles = getArticlesByCategory('好物推荐') || []

  // 当前主视图：'alternatives' (平替软件库) 或 'articles' (精选好物文章)
  const [activeTab, setActiveTab] = useState('alternatives')

  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState('all') // 'all' or 1..5
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all' or category slug
  const [selectedPlatform, setSelectedPlatform] = useState('all') // 'all' or platform name
  const [selectedTarget, setSelectedTarget] = useState('all') // 'all' or target slug
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'stars' | 'tier'

  const { categories, targets, alternatives } = alternativesData

  // 国产中文付费平替总数
  const chineseAltsCount = useMemo(() => {
    return alternatives.filter((a) => a.is_chinese || a.target?.is_chinese).length
  }, [alternatives])

  // 各分类数量统计
  const categoryCounts = useMemo(() => {
    const counts = {}
    alternatives.forEach((alt) => {
      const cslug = alt.target?.category_slug
      if (cslug) {
        counts[cslug] = (counts[cslug] || 0) + 1
      }
      if (alt.is_chinese || alt.target?.is_chinese) {
        counts['china'] = (counts['china'] || 0) + 1
      }
    })
    return counts
  }, [alternatives])

  // 热门被替代软件快捷入口（优先展示国内高频收费软件）
  const hotTargets = useMemo(() => {
    const counts = {}
    alternatives.forEach((alt) => {
      const slug = alt.target?.slug
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1
      }
    })

    const prioritySlugs = [
      'wps',
      'baidu-pan',
      'capcut-pro',
      'sunlogin-todesk',
      'xmind',
      'youdao-note',
      'netease-music',
      'xunlei',
      'china-pdf-tools',
      'china-screen-mirror',
      'wechat-backup-tools',
      'photoshop',
      'cursor',
      'notion'
    ]

    return targets
      .map((t) => ({ ...t, count: counts[t.slug] || 0 }))
      .filter((t) => t.count > 0)
      .sort((a, b) => {
        const pA = prioritySlugs.indexOf(a.slug)
        const pB = prioritySlugs.indexOf(b.slug)
        if (pA !== -1 && pB !== -1) return pA - pB
        if (pA !== -1) return -1
        if (pB !== -1) return 1
        return b.count - a.count
      })
      .slice(0, 14)
  }, [targets, alternatives])

  // 所有可用平台列表
  const allPlatforms = useMemo(() => {
    const set = new Set()
    alternatives.forEach((alt) => {
      if (Array.isArray(alt.platforms)) {
        alt.platforms.forEach((p) => set.add(p))
      }
    })
    return ['Windows', 'macOS', 'Linux', 'Web', 'iOS', 'Android']
  }, [alternatives])

  // 过滤与排序
  const filteredAlternatives = useMemo(() => {
    return alternatives.filter((item) => {
      // 1. 搜索
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchTarget = item.target?.name?.toLowerCase().includes(q)
        const matchDesc = (item.description || '').toLowerCase().includes(q)
        const matchDetail = (item.free_tier_detail || '').toLowerCase().includes(q)
        const matchTags = Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchName && !matchTarget && !matchDesc && !matchDetail && !matchTags) {
          return false
        }
      }

      // 2. 免费等级
      if (selectedTier !== 'all' && item.free_tier !== Number(selectedTier)) {
        return false
      }

      // 3. 分类（当选择「国产软件」时，包含所有替代国内收费软件的项目）
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'china') {
          if (!item.is_chinese && !item.target?.is_chinese && item.target?.category_slug !== 'china') {
            return false
          }
        } else if (item.target?.category_slug !== selectedCategory) {
          return false
        }
      }

      // 4. 平台
      if (selectedPlatform !== 'all' && (!Array.isArray(item.platforms) || !item.platforms.includes(selectedPlatform))) {
        return false
      }

      // 5. 目标软件
      if (selectedTarget !== 'all' && item.target?.slug !== selectedTarget) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'stars') {
        return (b.github_stars || 0) - (a.github_stars || 0)
      }
      if (sortBy === 'tier') {
        return a.free_tier - b.free_tier
      }
      // 'featured'
      return a.free_tier - b.free_tier || (b.github_stars || 0) - (a.github_stars || 0)
    })
  }, [alternatives, searchQuery, selectedTier, selectedCategory, selectedPlatform, selectedTarget, sortBy])

  // 重置所有筛选
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedTier('all')
    setSelectedCategory('all')
    setSelectedPlatform('all')
    setSelectedTarget('all')
    setSortBy('featured')
  }

  const hasActiveFilters = searchQuery || selectedTier !== 'all' || selectedCategory !== 'all' || selectedPlatform !== 'all' || selectedTarget !== 'all'

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* 页头 Hero 区域 */}
        <Box sx={{ textAlign: 'center', mb: 4, pt: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.6, borderRadius: 10, bgcolor: 'rgba(194, 65, 12, 0.08)', mb: 2 }}>
            <VerifiedOutlined sx={{ fontSize: 16, color: '#c2410c' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#c2410c' }}>
              35+ 数字化自救与开源平替专栏
            </Typography>
          </Box>

          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
              letterSpacing: '-0.02em',
              mb: 1.5
            }}
          >
            开源软件与实用工具平替库
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.7,
              maxWidth: 780,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              mb: 3
            }}
          >
            免费边界讲清楚，再推荐平替。按 5 级免费严格分级，帮你省下每一笔不必要的软件高昂订阅费，附避坑真相雷达与白嫖使用技巧。
          </Typography>

          {/* 数据总览统计 */}
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mb: 3 }}
          >
            <Chip
              label={`收录 ${alternatives.length} 款平替工具`}
              variant="outlined"
              size="medium"
              sx={{ borderColor: '#e7e5e4', fontWeight: 600, bgcolor: '#ffffff' }}
            />
            <Chip
              label={`覆盖 ${targets.length} 款主流付费软件`}
              variant="outlined"
              size="medium"
              sx={{ borderColor: '#e7e5e4', fontWeight: 600, bgcolor: '#ffffff' }}
            />
            <Chip
              label="5 级透明免费边界"
              variant="outlined"
              size="medium"
              sx={{ borderColor: '#e7e5e4', fontWeight: 600, bgcolor: '#ffffff' }}
            />
            <Chip
              label="100% 避坑折腾指南"
              variant="outlined"
              size="medium"
              sx={{ borderColor: '#e7e5e4', fontWeight: 600, bgcolor: '#ffffff' }}
            />
          </Stack>

          {/* 切换 Tab：平替软件库 / 精选好物推荐文章 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: 420, mx: 'auto', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              centered
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                value="alternatives"
                icon={<AppsOutlined sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label={`平替软件库 (${alternatives.length})`}
                sx={{ fontWeight: 600, fontSize: '0.95rem' }}
              />
              <Tab
                value="articles"
                icon={<ArticleOutlined sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label={`好物推荐文章 (${productArticles.length})`}
                sx={{ fontWeight: 600, fontSize: '0.95rem' }}
              />
            </Tabs>
          </Box>
        </Box>

        {/* 视图 1：平替软件库 */}
        {activeTab === 'alternatives' && (
          <Box>
            {/* 5 级免费等级说明卡片 */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 4,
                borderRadius: 3,
                border: '1px solid #e7e5e4',
                backgroundColor: '#ffffff'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoOutlined sx={{ fontSize: 18, color: '#78716c' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917' }}>
                    5 级免费分级标准（点击等级可直接筛选）
                  </Typography>
                </Box>
                {selectedTier !== 'all' && (
                  <Button
                    size="small"
                    onClick={() => setSelectedTier('all')}
                    sx={{ color: '#c2410c', textTransform: 'none', fontSize: '0.82rem', p: 0 }}
                  >
                    查看全部等级
                  </Button>
                )}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(5, 1fr)'
                  },
                  gap: 1.5
                }}
              >
                {Object.values(FREE_TIER_META).map((tier) => {
                  const isSelected = selectedTier === String(tier.level)
                  return (
                    <Box
                      key={tier.level}
                      onClick={() => setSelectedTier(isSelected ? 'all' : String(tier.level))}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: `1.5px solid ${isSelected ? tier.color : tier.borderColor}`,
                        bgcolor: tier.bgColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 0 0 2px ${tier.color}33` : 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          borderColor: tier.color
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: tier.color, fontSize: '0.88rem' }}>
                          {tier.label}
                        </Typography>
                        {isSelected && <Check sx={{ fontSize: 16, color: tier.color }} />}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#57534e', display: 'block', lineHeight: 1.4, fontSize: '0.75rem' }}>
                        {tier.description}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Paper>

            {/* 搜索与分类控制台 */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 4,
                borderRadius: 3,
                border: '1px solid #e7e5e4',
                backgroundColor: '#ffffff'
              }}
            >
              {/* 搜索框 */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="搜索平替软件、被替代原版 (如 WPS, 百度网盘, 剪映, 向日葵, XMind, Photoshop, Cursor)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#78716c' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <Clear sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      bgcolor: '#faf9f6',
                      '&:hover fieldset': { borderColor: '#c2410c' },
                      '&.Mui-focused fieldset': { borderColor: '#c2410c' }
                    }
                  }}
                />
              </Box>

              {/* 热门目标软件快捷跳转 */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#78716c', mb: 1, display: 'block' }}>
                  热门替代专题（点击直达对应原版平替）：
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                  <Chip
                    label="全部软件"
                    size="small"
                    clickable
                    onClick={() => setSelectedTarget('all')}
                    sx={{
                      fontWeight: 600,
                      bgcolor: selectedTarget === 'all' ? '#1c1917' : '#f5f5f4',
                      color: selectedTarget === 'all' ? '#ffffff' : '#57534e'
                    }}
                  />
                  {hotTargets.map((t) => (
                    <Chip
                      key={t.slug}
                      label={`${t.name} (${t.count})`}
                      size="small"
                      clickable
                      onClick={() => setSelectedTarget(selectedTarget === t.slug ? 'all' : t.slug)}
                      sx={{
                        fontWeight: 500,
                        bgcolor: selectedTarget === t.slug ? '#c2410c' : '#f5f5f4',
                        color: selectedTarget === t.slug ? '#ffffff' : '#44403c',
                        border: '1px solid',
                        borderColor: selectedTarget === t.slug ? '#c2410c' : '#e7e5e4'
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* 分类筛选 Chips */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#78716c', mb: 1, display: 'block' }}>
                  应用分类：
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                  <Chip
                    label="全部分类"
                    size="small"
                    clickable
                    onClick={() => setSelectedCategory('all')}
                    sx={{
                      fontWeight: 600,
                      bgcolor: selectedCategory === 'all' ? '#1c1917' : '#f5f5f4',
                      color: selectedCategory === 'all' ? '#ffffff' : '#57534e'
                    }}
                  />
                  {categories.map((cat) => {
                    const count = cat.slug === 'china' ? chineseAltsCount : (categoryCounts[cat.slug] || 0)
                    return (
                      <Chip
                        key={cat.slug}
                        label={`${cat.name} (${count})`}
                        size="small"
                        clickable
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)
                        }}
                        sx={{
                          fontWeight: 500,
                          bgcolor: selectedCategory === cat.slug ? '#c2410c' : '#f5f5f4',
                          color: selectedCategory === cat.slug ? '#ffffff' : '#44403c',
                          border: '1px solid',
                          borderColor: selectedCategory === cat.slug ? '#c2410c' : '#e7e5e4'
                        }}
                      />
                    )
                  })}
                </Stack>
              </Box>

              {/* 平台筛选 & 排序栏 */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, pt: 1, borderTop: '1px dashed #e7e5e4' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#78716c' }}>
                    支持系统：
                  </Typography>
                  <Chip
                    label="全部"
                    size="small"
                    clickable
                    onClick={() => setSelectedPlatform('all')}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      bgcolor: selectedPlatform === 'all' ? '#1c1917' : '#f5f5f4',
                      color: selectedPlatform === 'all' ? '#ffffff' : '#57534e'
                    }}
                  />
                  {allPlatforms.map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      size="small"
                      clickable
                      onClick={() => setSelectedPlatform(selectedPlatform === p ? 'all' : p)}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        bgcolor: selectedPlatform === p ? '#c2410c' : '#f5f5f4',
                        color: selectedPlatform === p ? '#ffffff' : '#57534e'
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel id="sort-select-label" sx={{ fontSize: '0.85rem' }}>排序方式</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      value={sortBy}
                      label="排序方式"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ height: 32, fontSize: '0.85rem', borderRadius: 2 }}
                    >
                      <MenuItem value="featured" sx={{ fontSize: '0.85rem' }}>综合推荐</MenuItem>
                      <MenuItem value="stars" sx={{ fontSize: '0.85rem' }}>GitHub 星标降序</MenuItem>
                      <MenuItem value="tier" sx={{ fontSize: '0.85rem' }}>免费等级 (L1 优先)</MenuItem>
                    </Select>
                  </FormControl>

                  {hasActiveFilters && (
                    <Button
                      size="small"
                      onClick={handleResetFilters}
                      sx={{ color: '#78716c', textTransform: 'none', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                    >
                      重置筛选
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* 结果计数提示 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, px: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#57534e', fontWeight: 500 }}>
                共找到 <Box component="span" sx={{ fontWeight: 700, color: '#c2410c' }}>{filteredAlternatives.length}</Box> 款平替方案
              </Typography>
              {selectedTier !== 'all' && (
                <Chip
                  size="small"
                  label={`已选：${FREE_TIER_META[selectedTier]?.label}`}
                  onDelete={() => setSelectedTier('all')}
                  sx={{ bgcolor: FREE_TIER_META[selectedTier]?.bgColor, color: FREE_TIER_META[selectedTier]?.color, fontWeight: 600 }}
                />
              )}
            </Box>

            {/* 平替列表网格 */}
            {filteredAlternatives.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #d6d3d1', bgcolor: '#ffffff' }}>
                <Typography variant="h6" sx={{ color: '#1c1917', mb: 1, fontWeight: 600 }}>
                  没有找到匹配的平替软件
                </Typography>
                <Typography variant="body2" sx={{ color: '#78716c', mb: 3 }}>
                  请尝试调整搜索关键词，或重置免费等级和分类筛选条件。
                </Typography>
                <Button variant="contained" onClick={handleResetFilters} sx={{ bgcolor: '#c2410c', '&:hover': { bgcolor: '#9a3412' } }}>
                  重置所有筛选
                </Button>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: 2.5
                }}
              >
                {filteredAlternatives.map((item) => {
                  const tier = FREE_TIER_META[item.free_tier] || FREE_TIER_META[1]
                  return (
                    <Card
                      key={item.id}
                      onClick={() => navigate(`/products/${item.slug}`)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        border: '1px solid #e7e5e4',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
                          borderColor: '#c2410c'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1.5, display: 'flex', flexDirection: 'column' }}>
                        {/* 头部：名称 + Stars + 免费等级 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.8 }}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                  fontWeight: 700,
                                  color: '#1c1917',
                                  fontSize: '1.05rem',
                                  lineHeight: 1.3
                                }}
                              >
                                {item.name}
                              </Typography>
                              {item.github_stars > 0 && (
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.3,
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: 1,
                                    bgcolor: '#f5f5f4',
                                    color: '#78716c',
                                    fontSize: '0.72rem',
                                    fontWeight: 600
                                  }}
                                >
                                  <Star sx={{ fontSize: 13, color: '#f59e0b' }} />
                                  {formatStars(item.github_stars)}
                                </Box>
                              )}
                            </Box>

                            {/* 替代目标 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                              <SwapHoriz sx={{ fontSize: 15, color: '#c2410c' }} />
                              <Typography variant="caption" sx={{ color: '#78716c' }}>
                                替代{' '}
                                <Box component="span" sx={{ fontWeight: 600, color: '#44403c' }}>
                                  {item.target?.name}
                                </Box>
                                {item.target?.price_info && (
                                  <Box component="span" sx={{ color: '#a8a29e', ml: 0.5 }}>
                                    ({item.target.price_info})
                                  </Box>
                                )}
                              </Typography>
                              {(item.is_chinese || item.target?.is_chinese) && (
                                <Box
                                  sx={{
                                    px: 0.6,
                                    py: 0.1,
                                    borderRadius: 0.8,
                                    bgcolor: 'rgba(194, 65, 12, 0.08)',
                                    color: '#c2410c',
                                    fontSize: '0.68rem',
                                    fontWeight: 600
                                  }}
                                >
                                  国产替代
                                </Box>
                              )}
                            </Box>
                          </Box>

                          {/* 等级徽章 */}
                          <Box
                            sx={{
                              px: 1.2,
                              py: 0.4,
                              borderRadius: 10,
                              bgcolor: tier.bgColor,
                              border: `1px solid ${tier.borderColor}`,
                              color: tier.color,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}
                          >
                            {tier.shortLabel}
                          </Box>
                        </Box>

                        {/* 简短描述：统一 minHeight 与 2 行截断，保证整行动齐 */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#57534e',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            mt: 1,
                            mb: 1.5,
                            minHeight: 38,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {item.description || '暂无详细描述'}
                        </Typography>

                        {/* 平台支持 */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 'auto', pt: 1, alignItems: 'center' }}>
                          {Array.isArray(item.platforms) && item.platforms.map((p) => (
                            <Chip
                              key={p}
                              label={p}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: '0.72rem',
                                bgcolor: '#f5f5f4',
                                color: '#57534e',
                                border: '1px solid #e7e5e4'
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>

                      {/* 卡片底栏操作按钮 */}
                      <CardActions
                        sx={{ px: 2.5, py: 1.2, justifyContent: 'space-between', borderTop: '1px solid #f5f5f4' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/products/${item.slug}`)}
                          sx={{
                            bgcolor: '#c2410c',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            textTransform: 'none',
                            borderRadius: 1.5,
                            px: 1.8,
                            py: 0.5,
                            '&:hover': { bgcolor: '#9a3412' }
                          }}
                        >
                          查看详情与避坑指南
                        </Button>

                        <Box sx={{ display: 'flex', gap: 0.6 }}>
                          {item.github_url && (
                            <IconButton
                              size="small"
                              component="a"
                              href={item.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="前往 GitHub 仓库"
                              onClick={(e) => e.stopPropagation()}
                              sx={{ color: '#78716c', '&:hover': { color: '#1c1917' } }}
                            >
                              <GitHub sx={{ fontSize: 18 }} />
                            </IconButton>
                          )}
                          {item.official_url && (
                            <Button
                              size="small"
                              component="a"
                              href={item.official_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                color: '#78716c',
                                fontSize: '0.78rem',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': { color: '#c2410c' }
                              }}
                            >
                              官网直达
                            </Button>
                          )}
                        </Box>
                      </CardActions>
                    </Card>
                  )
                })}
              </Box>
            )}
          </Box>
        )}

        {/* 视图 2：好物推荐文章 */}
        {activeTab === 'articles' && (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1c1917', mb: 1 }}>
                精选好物推荐文章
              </Typography>
              <Typography variant="body2" sx={{ color: '#78716c' }}>
                来自 35+ 社区用户的深度测评、硬件好物与效率生活指南
              </Typography>
            </Box>

            {productArticles.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #d6d3d1' }}>
                <Typography variant="body1" sx={{ color: '#78716c' }}>
                  暂无好物推荐文章
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 3
                }}
              >
                {productArticles.map((article, index) => (
                  <Card
                    key={article.id || index}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid #e7e5e4',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 2,
                          lineHeight: 1.3
                        }}
                      >
                        {article.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.excerpt}
                      </Typography>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#c2410c' }}>
                            物
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">
                            {article.category}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {article.readTime}
                        </Typography>
                      </Stack>

                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          backgroundColor: '#c2410c',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Products
