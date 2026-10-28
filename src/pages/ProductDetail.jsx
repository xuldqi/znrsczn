import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Stack,
  Breadcrumbs,
  IconButton,
  Snackbar,
  Alert,
  Divider
} from '@mui/material'
import {
  ArrowBack,
  Star,
  OpenInNew,
  GitHub,
  CheckCircleOutline,
  WarningAmber,
  SwapHoriz,
  LightbulbOutlined,
  VerifiedOutlined,
  FilterList,
  Share,
  ContentCopy,
  Check,
  AppsOutlined,
  NavigateNext,
  InfoOutlined,
  ShieldOutlined,
  ComputerOutlined
} from '@mui/icons-material'
import alternativesData from '../data/alternativesData.json'
import {
  FREE_TIER_META,
  PRICING_STATUS_META,
  PRICING_ROW_LABELS,
  DIFFICULTY_LABELS,
  formatStars
} from '../data/alternativesConstants'
import Footer from '../components/Footer'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { alternatives, categories } = alternativesData

  // 匹配对应平替软件
  const item = useMemo(() => {
    if (!slug) return null
    return (
      alternatives.find((a) => a.slug === slug || String(a.id) === slug) ||
      alternatives.find((a) => a.slug.toLowerCase() === slug.toLowerCase()) ||
      null
    )
  }, [slug, alternatives])

  // 所属分类
  const category = useMemo(() => {
    if (!item?.target?.category_slug) return null
    return categories.find((c) => c.slug === item.target.category_slug) || null
  }, [item, categories])

  // 相同替代目标的其他平替推荐
  const relatedAlternatives = useMemo(() => {
    if (!item) return []
    const targetSlug = item.target?.slug
    const sameTarget = alternatives.filter(
      (a) => a.id !== item.id && a.target?.slug === targetSlug
    )
    if (sameTarget.length >= 3) return sameTarget.slice(0, 3)

    // 若不足 3 款，补充同大类下的精选平替
    const catSlug = item.target?.category_slug
    const sameCat = alternatives.filter(
      (a) => a.id !== item.id && a.target?.category_slug === catSlug && !sameTarget.some((t) => t.id === a.id)
    )
    return [...sameTarget, ...sameCat].slice(0, 3)
  }, [item, alternatives])

  // 分享当前平替软件页面
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setToastMessage('链接已复制到剪贴板，可直接分享给好友！')
      setToastOpen(true)
    } else {
      setToastMessage('当前浏览器不支持自动复制，请手动复制地址栏网址')
      setToastOpen(true)
    }
  }

  // 404 状态
  if (!item) {
    return (
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px dashed #d6d3d1' }}>
            <InfoOutlined sx={{ fontSize: 48, color: '#a8a29e', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1c1917', mb: 1.5 }}>
              未找到该平替软件
            </Typography>
            <Typography variant="body2" sx={{ color: '#78716c', mb: 3 }}>
              可能该软件已被整合调整，或输入的网址有误。请返回平替软件库浏览全部收录工具。
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/products')}
              sx={{ bgcolor: '#c2410c', textTransform: 'none', '&:hover': { bgcolor: '#9a3412' } }}
            >
              返回平替软件库
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  const tier = FREE_TIER_META[item.free_tier] || FREE_TIER_META[1]
  const pricing = item.pricing_truth || {}
  const hack = item.hack_guide
  const pricingKeys = Object.keys(pricing).filter((k) => pricing[k])

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        {/* 面包屑导航与返回 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ fontSize: '0.88rem' }}>
            <Link to="/" style={{ color: '#78716c', textDecoration: 'none' }}>
              首页
            </Link>
            <Link to="/products" style={{ color: '#78716c', textDecoration: 'none' }}>
              平替库
            </Link>
            {category && (
              <Typography color="text.secondary" sx={{ fontSize: '0.88rem' }}>
                {category.name}
              </Typography>
            )}
            <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
              {item.name}
            </Typography>
          </Breadcrumbs>

          <Button
            size="small"
            variant="text"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/products')}
            sx={{ color: '#78716c', '&:hover': { color: '#c2410c' } }}
          >
            返回平替库列表
          </Button>
        </Box>

        {/* 头部 Hero 区域 */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            mb: 3,
            borderRadius: 3,
            border: '1px solid #e7e5e4',
            bgcolor: '#ffffff'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2.5 }}>
            {/* 左侧：软件标题、等级、被替代软件 */}
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
                  {item.name}
                </Typography>
                <Chip
                  label={tier.label}
                  sx={{
                    bgcolor: tier.bgColor,
                    color: tier.color,
                    border: `1px solid ${tier.borderColor}`,
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                />
                {item.github_stars > 0 && (
                  <Chip
                    icon={<Star sx={{ fontSize: 16, color: '#f59e0b' }} />}
                    label={`GitHub ${formatStars(item.github_stars)}`}
                    component={item.github_url ? 'a' : 'div'}
                    href={item.github_url || undefined}
                    target={item.github_url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    clickable={Boolean(item.github_url)}
                    sx={{ bgcolor: '#f5f5f4', color: '#57534e', fontWeight: 600 }}
                  />
                )}
                {(item.is_chinese || item.target?.is_chinese) && (
                  <Chip
                    label="国产付费平替"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(194, 65, 12, 0.08)',
                      color: '#c2410c',
                      border: '1px solid rgba(194, 65, 12, 0.2)',
                      fontWeight: 700
                    }}
                  />
                )}
              </Box>

              {/* 核心替代目标标语 */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 2,
                  bgcolor: '#faf9f6',
                  border: '1px solid #f5f5f4',
                  mb: 2,
                  flexWrap: 'wrap'
                }}
              >
                <SwapHoriz sx={{ fontSize: 18, color: '#c2410c' }} />
                <Typography variant="body2" sx={{ color: '#44403c', fontWeight: 500 }}>
                  精准替代商业软件：
                  <Box component="span" sx={{ fontWeight: 700, color: '#1c1917', ml: 0.5 }}>
                    {item.target?.name || '商业收费软件'}
                  </Box>
                </Typography>
                {item.target?.price_info && (
                  <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 600, bgcolor: 'rgba(234, 88, 12, 0.08)', px: 0.8, py: 0.2, borderRadius: 1 }}>
                    原版收费：{item.target.price_info}
                  </Typography>
                )}
              </Box>

              {/* 软件概述 */}
              <Typography variant="body1" sx={{ color: '#57534e', lineHeight: 1.7, fontSize: '1rem', mb: 2 }}>
                {item.description || '暂无详细描述'}
              </Typography>

              {/* 支持平台 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                  支持平台：
                </Typography>
                {Array.isArray(item.platforms) && item.platforms.map((p) => (
                  <Chip
                    key={p}
                    label={p}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.75rem',
                      bgcolor: '#f5f5f4',
                      color: '#44403c',
                      fontWeight: 500
                    }}
                  />
                ))}
                {Array.isArray(item.tags) && item.tags.slice(0, 4).map((t) => (
                  <Chip
                    key={t}
                    label={`# ${t}`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.72rem',
                      bgcolor: '#faf9f6',
                      color: '#78716c',
                      border: '1px dashed #e7e5e4'
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* 右侧：快捷操作按钮 */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                gap: 1.5,
                minWidth: { md: 170 },
                justifyContent: 'flex-start',
                flexShrink: 0
              }}
            >
              {item.official_url && (
                <Button
                  variant="contained"
                  component="a"
                  href={item.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNew />}
                  sx={{
                    bgcolor: '#c2410c',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    py: 1,
                    '&:hover': { bgcolor: '#9a3412' }
                  }}
                >
                  访问官方网站
                </Button>
              )}

              {item.github_url && (
                <Button
                  variant="outlined"
                  component="a"
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<GitHub />}
                  sx={{
                    borderColor: '#d6d3d1',
                    color: '#1c1917',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 0.9,
                    '&:hover': { borderColor: '#1c1917', bgcolor: '#faf9f6' }
                  }}
                >
                  GitHub 开源仓库
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
                sx={{
                  borderColor: '#e7e5e4',
                  color: '#78716c',
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  borderRadius: 2,
                  py: 0.8,
                  '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                }}
              >
                分享此平替方案
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* 核心替代对比横幅 (Commercial vs Alternative Proposition) */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2.5,
            border: '1px solid #fed7aa',
            bgcolor: '#fff7ed',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: '#ffffff', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldOutlined sx={{ fontSize: 26, color: '#ea580c' }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9a3412', fontSize: '0.95rem' }}>
                平替省钱保障与拒绝被收割
              </Typography>
              <Typography variant="body2" sx={{ color: '#7c2d12', fontSize: '0.85rem', mt: 0.3 }}>
                原收费软件【{item.target?.name}】需长期持续续费；推荐选用【{item.name}】（{tier.shortLabel}），无需担心试用期结束扣费与捆绑套路。
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 深度模块 1：免费边界详情与定义 */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid #e7e5e4',
            bgcolor: '#ffffff'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <VerifiedOutlined sx={{ fontSize: 22, color: tier.color }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
              免费边界详述 ({tier.label})
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: tier.bgColor,
              border: `1px solid ${tier.borderColor}`
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: tier.color, mb: 0.6 }}>
              【分级定义】{tier.description}
            </Typography>
            <Typography variant="body2" sx={{ color: '#44403c', lineHeight: 1.6, fontSize: '0.92rem' }}>
              【实测免费边界】{item.free_tier_detail || '核心基础功能开源免费，个人使用无门槛。'}
            </Typography>
          </Box>
        </Paper>

        {/* 深度模块 2：免费真相雷达（逐项拆解收费边界） */}
        {pricingKeys.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #e7e5e4',
              bgcolor: '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList sx={{ fontSize: 22, color: '#c2410c' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                  免费真相雷达：逐项拆解收费与功能边界
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#78716c' }}>
                拒绝含糊其辞，明确标注哪些功能免费、哪些需要自建或收费
              </Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #e7e5e4', overflow: 'hidden' }}>
              {pricingKeys.map((key, idx) => {
                const itemVal = pricing[key]
                const statusMeta = PRICING_STATUS_META[itemVal.status] || PRICING_STATUS_META.free
                const label = PRICING_ROW_LABELS[key] || key
                return (
                  <Box
                    key={key}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '140px 110px 1fr' },
                      gap: 1.5,
                      alignItems: 'center',
                      p: 2,
                      borderBottom: idx < pricingKeys.length - 1 ? '1px solid #f5f5f4' : 'none',
                      bgcolor: idx % 2 === 0 ? '#ffffff' : '#faf9f6'
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '0.9rem' }}>
                      {label}
                    </Typography>
                    <Box>
                      <Chip
                        size="small"
                        label={statusMeta.label}
                        sx={{
                          bgcolor: statusMeta.bg,
                          color: statusMeta.color,
                          border: `1px solid ${statusMeta.border}`,
                          fontWeight: 700,
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#44403c', fontSize: '0.88rem', lineHeight: 1.6 }}>
                      {itemVal.note}
                    </Typography>
                  </Box>
                )
              })}
            </Paper>
          </Paper>
        )}

        {/* 深度模块 3：优劣势实测深度测评 (Pros & Cons) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2.5,
            mb: 3
          }}
        >
          {/* 推荐优势 */}
          {Array.isArray(item.pros) && item.pros.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                height: '100%'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#166534', mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                <CheckCircleOutline sx={{ fontSize: 20, color: '#166534' }} />
                核心推荐优势（为什么选择它）
              </Typography>
              <Stack spacing={1.5}>
                {item.pros.map((p, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#166534',
                        mt: 1,
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#14532d', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {p}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* 不足与避坑点 */}
          {Array.isArray(item.cons) && item.cons.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#fffbeb',
                border: '1px solid #fde68a',
                height: '100%'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#92400e', mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
                <WarningAmber sx={{ fontSize: 20, color: '#d97706' }} />
                客观短板与使用避坑注意
              </Typography>
              <Stack spacing={1.5}>
                {item.cons.map((c, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#d97706',
                        mt: 1,
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#78350f', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {c}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>

        {/* 深度模块 4：免费避坑与折腾指南 (Hack Guide) */}
        {hack && hack.has_hack && Array.isArray(hack.steps) && hack.steps.length > 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '2px dashed #fde68a',
              bgcolor: '#fffbeb'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbOutlined sx={{ fontSize: 22, color: '#d97706' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#78350f', fontSize: '1.15rem' }}>
                  {hack.title || '免费避坑与折腾配置指南'}
                </Typography>
              </Box>
              {hack.difficulty && DIFFICULTY_LABELS[hack.difficulty] && (
                <Chip
                  size="small"
                  label={DIFFICULTY_LABELS[hack.difficulty].label}
                  sx={{
                    bgcolor: DIFFICULTY_LABELS[hack.difficulty].bg,
                    color: DIFFICULTY_LABELS[hack.difficulty].color,
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}
                />
              )}
            </Box>

            <Stack spacing={1.8}>
              {hack.steps.map((step, sIdx) => (
                <Box
                  key={sIdx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.8,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      bgcolor: '#fde68a',
                      color: '#78350f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      mt: 0.1
                    }}
                  >
                    {sIdx + 1}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#78350f', lineHeight: 1.7, fontSize: '0.92rem' }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #e7e5e4',
              bgcolor: '#faf9f6'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <LightbulbOutlined sx={{ fontSize: 22, color: '#c2410c' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                新手上手与避坑建议
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#57534e', lineHeight: 1.7, fontSize: '0.9rem' }}>
              建议直接前往官方网站或 GitHub Releases 页面下载安装，切勿在非官方软件下载站下载带有高速下载器与捆绑安装包的镜像。如果涉及云端同步或多端使用，推荐优先使用本地存储或个人 WebDAV 服务，数据更安全可控。
            </Typography>
          </Paper>
        )}

        {/* 深度模块 5：同类其他平替推荐 */}
        {relatedAlternatives.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                更多同类替代方案（针对 {item.target?.name || '同类工具'}）
              </Typography>
              <Button
                size="small"
                variant="text"
                onClick={() => navigate('/products')}
                sx={{ color: '#c2410c', fontWeight: 600 }}
              >
                查看全部平替库
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 2
              }}
            >
              {relatedAlternatives.map((rel) => {
                const relTier = FREE_TIER_META[rel.free_tier] || FREE_TIER_META[1]
                return (
                  <Card
                    key={rel.id}
                    sx={{
                      borderRadius: 2.5,
                      border: '1px solid #e7e5e4',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                        borderColor: '#c2410c'
                      }
                    }}
                    onClick={() => {
                      navigate(`/products/${rel.slug}`)
                      window.scrollTo(0, 0)
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1c1917' }}>
                          {rel.name}
                        </Typography>
                        <Chip
                          label={relTier.shortLabel}
                          size="small"
                          sx={{
                            bgcolor: relTier.bgColor,
                            color: relTier.color,
                            fontWeight: 700,
                            height: 22,
                            fontSize: '0.72rem'
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#57534e',
                          fontSize: '0.82rem',
                          lineHeight: 1.5,
                          mb: 1.5,
                          minHeight: 36,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {rel.description}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: '#e7e5e4',
                          color: '#44403c',
                          textTransform: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                        }}
                      >
                        查看详细档案与雷达
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Box>
        )}

        {/* 底部免责声明与社区反馈 */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: '1px solid #e7e5e4',
            bgcolor: '#ffffff',
            textAlign: 'center'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917', mb: 0.8 }}>
            平替库收录标准与社区共建
          </Typography>
          <Typography variant="body2" sx={{ color: '#78716c', maxWidth: 680, mx: 'auto', lineHeight: 1.7, mb: 2 }}>
            本平替库致力于为 35+ 职场人抵御连环扣费与会员收割，所有工具经过实测。开源与免费软件商业策略可能发生变动，若发现某款工具开始收费或有更好的平替，欢迎在社区中分享反馈。
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ bgcolor: '#c2410c', fontWeight: 600, borderRadius: 2, px: 3, '&:hover': { bgcolor: '#9a3412' } }}
          >
            浏览平替库全部 141 款方案
          </Button>
        </Paper>
      </Container>

      {/* 消息提示 */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}

export default ProductDetail
