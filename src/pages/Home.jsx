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
  Divider,
  Tabs,
  Tab
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  SpaceDashboardOutlined as DashboardIcon,
  BookmarkBorder as BookmarkIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

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
  const { getAllArticles } = useArticles()

  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(8)

  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  const sortedArticles = useMemo(() => {
    return [...publishedArticles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [publishedArticles])

  // 分类筛选标签
  const pillarTabs = useMemo(() => [
    {
      id: 'all',
      name: '全部实战经验',
      badge: sortedArticles.length,
      filter: () => true
    },
    {
      id: 'career',
      name: '职场防御与转型',
      badge: sortedArticles.filter(a => ['职场发展', '转型升级'].includes(a.category)).length,
      filter: (a) => ['职场发展', '转型升级'].includes(a.category)
    },
    {
      id: 'finance',
      name: '家庭财务与养老',
      badge: sortedArticles.filter(a => ['财务管理'].includes(a.category)).length,
      filter: (a) => ['财务管理'].includes(a.category)
    },
    {
      id: 'side',
      name: '副业与轻资产变现',
      badge: sortedArticles.filter(a => ['副业指南'].includes(a.category)).length,
      filter: (a) => ['副业指南'].includes(a.category)
    },
    {
      id: 'life',
      name: '心理内耗与家庭关系',
      badge: sortedArticles.filter(a => ['中年危机', '心理健康', '家庭关系', '生活技能'].includes(a.category)).length,
      filter: (a) => ['中年危机', '心理健康', '家庭关系', '生活技能'].includes(a.category)
    }
  ], [sortedArticles])

  const currentTabObj = pillarTabs[activeTab] || pillarTabs[0]
  const currentFilteredArticles = useMemo(() => {
    return sortedArticles.filter(currentTabObj.filter)
  }, [sortedArticles, currentTabObj])

  const visibleArticles = currentFilteredArticles.slice(0, displayCount)
  const hasMore = currentFilteredArticles.length > displayCount

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf9f6', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 🧭 1. 顶端刊头栏 (Publication Masthead) */}
      <Box sx={{ borderBottom: '1px solid #e7e5e4', backgroundColor: '#ffffff', py: 1.5 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                个人与家庭抗风险内参 · 2026 第 42 辑
              </Typography>
              <Typography variant="caption" sx={{ color: '#d6d3d1' }}>|</Typography>
              <Typography variant="caption" sx={{ color: '#78716c' }}>
                共收录 137 篇经过验证的一线避坑笔记
              </Typography>
            </Box>

            {/* 工作台直达快捷提示 */}
            <Box
              onClick={() => navigate('/dashboard')}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                color: '#c2410c',
                fontSize: '0.82rem',
                fontWeight: 700,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <DashboardIcon sx={{ fontSize: 16 }} />
              <span>打开自救工作台：现金流跑道测算与 72h 应急预案 →</span>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 📰 2. 报头与刊旨声明 (Editorial Header) */}
      <Box sx={{ pt: { xs: 4, md: 6 }, pb: 4, borderBottom: '1px solid #e7e5e4', backgroundColor: '#faf9f6' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 3 }}>
            <Box sx={{ maxWidth: 760 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
                <Chip
                  label="深度实战内刊"
                  size="small"
                  sx={{
                    bgcolor: '#1c1917',
                    color: '#faf9f6',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: 1
                  }}
                />
                <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                  以确定性方案直面中年变局
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
                  color: '#1c1917',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.25,
                  mb: 1.5
                }}
              >
                中年不是危机，是一场重新清点筹码的防守反击战。
              </Typography>

              <Typography variant="body1" sx={{ color: '#57534e', fontSize: { xs: '0.95rem', sm: '1.05rem' }, lineHeight: 1.7 }}>
                面对职场裁员、被动降薪、房贷开支与养老金缺口，拒绝空洞说教。这里提供真实的现金流跑道精算模型、变故应急 SOP 与 137 篇经过验证的实战复盘，陪你安稳走过关键十年。
              </Typography>
            </Box>

            {/* 进入工作台主入口 */}
            <Box sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', sm: 'auto' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: '#c2410c',
                  color: '#ffffff',
                  py: 1.5,
                  px: 3.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 4px 14px rgba(194, 65, 12, 0.25)',
                  '&:hover': { bgcolor: '#9a3412' }
                }}
              >
                进入自救工作台
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 📖 3. 卷首特稿与自救备忘录 (杂志版面：左 2/3 特稿，右 1/3 便签) */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr'
            },
            gap: 4,
            alignItems: 'stretch'
          }}
        >
          {/* 左侧：重磅封面特稿 */}
          <Paper
            elevation={0}
            onClick={() => navigate('/article/career-35-tips')}
            sx={{
              p: { xs: 3, sm: 4.5 },
              width: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#c2410c',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                '& .lead-title': { color: '#c2410c' }
              }
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <Chip
                  label="特稿 · 深度必读"
                  size="small"
                  sx={{
                    bgcolor: '#fff7ed',
                    color: '#c2410c',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: '1px solid #ffedd5'
                  }}
                />
                <Typography variant="caption" sx={{ color: '#a8a29e', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ScheduleIcon sx={{ fontSize: 14 }} /> 10 分钟深度阅读
                </Typography>
              </Box>

              <Typography
                className="lead-title"
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#1c1917',
                  fontSize: { xs: '1.4rem', sm: '1.85rem' },
                  lineHeight: 1.35,
                  mb: 2,
                  transition: 'color 0.15s'
                }}
              >
                突遭变故的 72 小时：一份写给 35+ 职场人的权益防御与现金流止损备忘
              </Typography>

              <Typography variant="body1" sx={{ color: '#57534e', fontSize: '0.96rem', lineHeight: 1.75, mb: 3 }}>
                面对毫无征兆的裁员谈话，普通人最容易犯的三个致命错误是：当场签下协商解除单、情绪失控放弃固定证据、盲目动用储蓄重资产加盟开店。从考勤流水固定、N+1 与未休年假折算，到失业金申领期间由失业基金代缴医保——在失控的环境里，按清单逐条筑起家庭的底线。
              </Typography>
            </Box>

            <Box sx={{ pt: 2.5, borderTop: '1px solid #f0ece1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#1c1917', fontWeight: 700 }}>
                  职场战略顾问
                </Typography>
                <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                  · 一线维权与安置实录
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                阅读全文与 SOP 清单 →
              </Typography>
            </Box>
          </Paper>

          {/* 右侧：编辑部自救备忘录便签 */}
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              width: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#fffdfa',
              border: '1px solid #fed7aa',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BookmarkIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917' }}>
                  防守备忘 · 三条底线红线
                </Typography>
              </Box>

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#9a3412', fontSize: '0.9rem' }}>
                    01. 强制锁死 12 个月生存现金流
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.5, lineHeight: 1.6 }}>
                    存大额存单或高流动货币工具。无论市场如何波动，绝不能动用这笔全家吃饭还贷的救命钱。
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#9a3412', fontSize: '0.9rem' }}>
                    02. 坚决远离重资产加盟与开店
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.5, lineHeight: 1.6 }}>
                    奶茶、快餐、烘焙与盲目租办公室，是掏空中年中产积蓄最快的大坑，试错必须以 0 成本为底线。
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#9a3412', fontSize: '0.9rem' }}>
                    03. 经验咨询化是唯一轻生路
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mt: 0.5, lineHeight: 1.6 }}>
                    把你在主业踩过的坑、业务 SOP、合规模板沉淀为咨询产品，边际成本为 0，直面真实客户。
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #fdba74' }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => navigate('/dashboard')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: '#c2410c',
                  color: '#c2410c',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  py: 1,
                  '&:hover': { bgcolor: '#fff7ed', borderColor: '#9a3412' }
                }}
              >
                进入工作台自测抗风险跑道
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* 🧭 4. 四大实战专栏特区 (Four Editorial Desks) */}
      <Box sx={{ py: 6, backgroundColor: '#ffffff', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
              四大深度专栏
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.4rem', sm: '1.8rem' } }}>
              按人生现实阻力分类编排
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)'
              },
              gap: 3.5,
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {/* 专栏 1：职场防御战 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                    💼 职场防御与第二曲线
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                    38 篇实录
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#78716c', mb: 2.5, fontSize: '0.86rem' }}>
                  35岁后的职场逻辑彻底改变：从埋头干活转向预期管理、行业人脉变现与被动离职维权。
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    { title: '35岁职场人的3个生存法则：从执行者变成带头人', id: 'career-35-tips' },
                    { title: '90天转型实验：如何从普通员工逐步沉淀为行业顾问', id: 'career-35-tips' },
                    { title: '项目复盘会议的主持 SOP 与向上管理控制技巧', id: 'career-35-tips' }
                  ].map((art, idx) => (
                    <Box
                      key={idx}
                      onClick={() => navigate(`/article/${art.id}`)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: '#ffffff',
                        border: '1px solid #f0ece1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {art.title}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16, color: '#a8a29e' }} />
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ pt: 2.5, mt: 2, borderTop: '1px solid #e7e5e4', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate('/career')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#c2410c', fontWeight: 700, p: 0 }}
                >
                  进入职场专栏 →
                </Button>
              </Box>
            </Paper>

            {/* 专栏 2：家庭财务与养老底线 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                    💰 家庭财务与养老底线
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                    32 篇实录
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#78716c', mb: 2.5, fontSize: '0.86rem' }}>
                  上有老下有小的防守配置：算清家庭抗风险跑道、配置百万医疗杠杆、测算 60 岁后的真实缺口。
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    { title: '中年家庭的财务安全网：四笔钱边界与极端抗风险法则', id: 'career-35-tips' },
                    { title: '40+ 家庭的养老资产蓝图：三支柱政策与替代率真相', id: 'career-35-tips' },
                    { title: '家庭财务复盘工作坊：90分钟搞定全家预算年度共识', id: 'career-35-tips' }
                  ].map((art, idx) => (
                    <Box
                      key={idx}
                      onClick={() => navigate(`/article/${art.id}`)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: '#ffffff',
                        border: '1px solid #f0ece1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {art.title}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16, color: '#a8a29e' }} />
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ pt: 2.5, mt: 2, borderTop: '1px solid #e7e5e4', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate('/finance')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#c2410c', fontWeight: 700, p: 0 }}
                >
                  进入财务专栏 →
                </Button>
              </Box>
            </Paper>

            {/* 专栏 3：副业轻创与技能产品化 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                    ⚡ 副业轻创与技能产品化
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                    24 篇实录
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#78716c', mb: 2.5, fontSize: '0.86rem' }}>
                  中年试错成本极高。拒绝重资产开店，以行业经验咨询、业务流程模版与数字资产为切入点。
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    { title: '用微服务思维搭建你的副业：零启动成本的经验变现', id: 'career-35-tips' },
                    { title: '中年知识工作者的 AI 协作手册：用工具杠杆放大个人产出', id: 'career-35-tips' },
                    { title: '陌生人付费的第一单验证：在投入大额资金前先完成闭环', id: 'career-35-tips' }
                  ].map((art, idx) => (
                    <Box
                      key={idx}
                      onClick={() => navigate(`/article/${art.id}`)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: '#ffffff',
                        border: '1px solid #f0ece1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {art.title}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16, color: '#a8a29e' }} />
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ pt: 2.5, mt: 2, borderTop: '1px solid #e7e5e4', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate('/side-business')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#c2410c', fontWeight: 700, p: 0 }}
                >
                  进入副业专栏 →
                </Button>
              </Box>
            </Paper>

            {/* 专栏 4：身心健康与危机脱敏 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
                    🌱 身心防线与危机脱敏
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                    43 篇实录
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#78716c', mb: 2.5, fontSize: '0.86rem' }}>
                  身体是最大的确定性杠杆：慢性疲劳脱敏、体检异常指标自查、以及与伴侣和青春期孩子的降温沟通。
                </Typography>

                <Stack spacing={1.5}>
                  {[
                    { title: '中年焦虑的3个应对方法：接受限制，停止对未来的内耗', id: 'midlife-anxiety-cope' },
                    { title: '和青春期孩子沟通的3句话：从对立关系走向合作伙伴', id: 'teenager-talk-tips' },
                    { title: '重新设立家庭边界的四步练习：中年人不必拯救所有人', id: 'career-35-tips' }
                  ].map((art, idx) => (
                    <Box
                      key={idx}
                      onClick={() => navigate(`/article/${art.id}`)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: '#ffffff',
                        border: '1px solid #f0ece1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {art.title}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 16, color: '#a8a29e' }} />
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ pt: 2.5, mt: 2, borderTop: '1px solid #e7e5e4', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => navigate('/family')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ color: '#c2410c', fontWeight: 700, p: 0 }}
                >
                  进入家庭与身心专栏 →
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* 📚 5. 全部实战经验索引目录 (Editorial Table of Contents) */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
            实战文章总目
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.4rem', sm: '1.8rem' } }}>
            按问题检索指南（共 {sortedArticles.length} 篇）
          </Typography>
        </Box>

        {/* 杂志分类导航栏 */}
        <Box sx={{ borderBottom: '1px solid #e7e5e4', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => {
              setActiveTab(val)
              setDisplayCount(8)
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#c2410c', height: 2 },
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#78716c',
                textTransform: 'none',
                minWidth: 'auto',
                px: 2,
                py: 1.2,
                '&.Mui-selected': { color: '#c2410c' }
              }
            }}
          >
            {pillarTabs.map((tab) => (
              <Tab
                key={tab.id}
                label={`${tab.name} (${tab.badge})`}
              />
            ))}
          </Tabs>
        </Box>

        {/* 目录式精简文章流 (平整、紧凑、极其易读) */}
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
                  width: '100%',
                  boxSizing: 'border-box',
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
                    '& .article-title': { color: '#c2410c' }
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
                      {article.author || '特约导师'} · {article.readTime || '3分钟阅读'}
                    </Typography>
                  </Box>
                  <Typography
                    className="article-title"
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

        {/* 展开更多按钮 */}
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
              展开更多实战指南 ({currentFilteredArticles.length - visibleArticles.length} 篇待加载)
            </Button>
          </Box>
        )}
      </Container>

      {/* 📜 6. 刊尾声明：写在人生中场 (Colophon) */}
      <Box sx={{ py: 6, borderTop: '1px solid #e7e5e4', backgroundColor: '#f5f2eb' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1c1917', mb: 1.5 }}>
            写在人生的关键中场
          </Typography>
          <Typography variant="body2" sx={{ color: '#57534e', lineHeight: 1.8, fontSize: '0.92rem', maxWidth: 640, mx: 'auto', mb: 3 }}>
            关于《中年自救指南》：我们是一群经历过 35 岁转折点的前互联网人、财务策划师与生活整理者。在这里，不贩卖情绪泡沫，不兜售虚妄奇迹，只沉淀能真正帮到普通家庭的常识、工具与实操文档。
          </Typography>
          <Box sx={{ display: 'inline-flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#c2410c',
                color: '#ffffff',
                px: 3,
                py: 1,
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#9a3412' }
              }}
            >
              打开自救工作台
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Home
