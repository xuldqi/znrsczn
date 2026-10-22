import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Grid,
  Slider,
  Divider,
  Chip,
  Alert,
  Tooltip,
  LinearProgress,
  IconButton
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  HelpOutline as HelpIcon,
  SavingsOutlined as SavingsIcon,
  TrendingDown as TrendingDownIcon,
  ShieldOutlined as ShieldIcon,
  CheckCircle as CheckedIcon,
  RestartAlt as ResetIcon,
  AccountBalanceWalletOutlined as WalletIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

const STORAGE_SAVINGS_PLAN = 'pmsaveself_savings_planner_state'

// 消费项目预设与默认三级跳数据
const defaultExpenseItems = [
  { id: 'housing', label: '房贷 / 房租', desc: '刚性居住成本，较难快速压缩', normal: 8000, practical: 8000, extreme: 4000 },
  { id: 'food', label: '餐饮与外食', desc: '外卖咖啡聚餐 vs 自制三餐极简食材', normal: 4500, practical: 2000, extreme: 1200 },
  { id: 'children', label: '子女教育与培训', desc: '高额补习班特长班 vs 基础刚性杂费', normal: 3500, practical: 1200, extreme: 500 },
  { id: 'transport', label: '交通出行', desc: '养车油费车险车贷 vs 公共交通与电单车', normal: 2200, practical: 800, extreme: 300 },
  { id: 'shopping', label: '服饰美妆与数码', desc: '品牌鞋包大件数码 vs 穿旧衣停买非必需品', normal: 2500, practical: 500, extreme: 100 },
  { id: 'lifestyle', label: '娱乐旅游与订阅', desc: '旅行健身会员流媒体 vs 户外徒步与公共图书馆', normal: 2000, practical: 300, extreme: 0 },
  { id: 'medical', label: '商保与医疗备用', desc: '消费型百万医疗险与必要常备药', normal: 1000, practical: 800, extreme: 600 }
]

const SavingsPlanner = () => {
  const navigate = useNavigate()

  // 1. 现有可动用流动资产（现金、大额存单、随时可变现理财）
  const [currentCashWan, setCurrentCashWan] = useState(25)

  // 2. 当前选择的生活模式: 'normal' (原中产状态), 'practical' (务实降级), 'extreme' (极端生存底线), 'custom' (自定义微调)
  const [activeTier, setActiveTier] = useState('practical')

  // 3. 各单项开销
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVINGS_PLAN)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.expenses) return parsed.expenses
      }
    } catch {
      // fallback
    }
    const initial = {}
    defaultExpenseItems.forEach(item => {
      initial[item.id] = item.practical
    })
    return initial
  })

  // 本地持久化保存
  useEffect(() => {
    localStorage.setItem(STORAGE_SAVINGS_PLAN, JSON.stringify({
      currentCashWan,
      expenses,
      activeTier
    }))
  }, [currentCashWan, expenses, activeTier])

  // 一键切换预设档位
  const applyPresetTier = (tierKey) => {
    setActiveTier(tierKey)
    const updated = {}
    defaultExpenseItems.forEach(item => {
      updated[item.id] = item[tierKey]
    })
    setExpenses(updated)
  }

  // 修改某单项开销
  const handleExpenseChange = (id, val) => {
    setActiveTier('custom')
    setExpenses(prev => ({
      ...prev,
      [id]: val
    }))
  }

  // 重置
  const resetToDefault = () => {
    applyPresetTier('practical')
    setCurrentCashWan(25)
  }

  // -------------------------------------------------------------
  // 核心测算：各档位月度总开销
  // -------------------------------------------------------------
  const normalTotalMonthly = useMemo(() => {
    return defaultExpenseItems.reduce((acc, it) => acc + it.normal, 0)
  }, [])

  const practicalTotalMonthly = useMemo(() => {
    return defaultExpenseItems.reduce((acc, it) => acc + it.practical, 0)
  }, [])

  const extremeTotalMonthly = useMemo(() => {
    return defaultExpenseItems.reduce((acc, it) => acc + it.extreme, 0)
  }, [])

  const currentTotalMonthly = useMemo(() => {
    return Object.values(expenses).reduce((acc, v) => acc + (Number(v) || 0), 0)
  }, [expenses])

  // 每月省下的现金与比例
  const monthlySaved = Math.max(0, normalTotalMonthly - currentTotalMonthly)
  const yearlySaved = monthlySaved * 12
  const cutPercentage = Math.round((monthlySaved / normalTotalMonthly) * 100)

  // -------------------------------------------------------------
  // 核心测算：极端零收入生存跑道（当前开销 vs 降级后开销）
  // -------------------------------------------------------------
  const currentRunwayMonths = useMemo(() => {
    if (currentTotalMonthly <= 0) return 0
    return ((currentCashWan * 10000) / currentTotalMonthly).toFixed(1)
  }, [currentCashWan, currentTotalMonthly])

  const normalRunwayMonths = useMemo(() => {
    if (normalTotalMonthly <= 0) return 0
    return ((currentCashWan * 10000) / normalTotalMonthly).toFixed(1)
  }, [currentCashWan, normalTotalMonthly])

  // 延长的月数倍率
  const extendedMonths = (parseFloat(currentRunwayMonths) - parseFloat(normalRunwayMonths)).toFixed(1)

  // -------------------------------------------------------------
  // 36 个月生存安全感里程碑达成度测算
  // -------------------------------------------------------------
  const runwayNum = parseFloat(currentRunwayMonths)
  const milestone6Percent = Math.min(100, Math.round((runwayNum / 6) * 100))
  const milestone18Percent = Math.min(100, Math.round((runwayNum / 18) * 100))
  const milestone36Percent = Math.min(100, Math.round((runwayNum / 36) * 100))

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf9f6', color: '#1c1917', pb: 10 }}>
      {/* 顶部面包屑与标题区 */}
      <Box sx={{ pt: 3.5, pb: 3, backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e4' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Button
              component={Link}
              to="/"
              size="small"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{ color: '#78716c', fontWeight: 600, p: 0, minWidth: 'auto', '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
            >
              返回首页
            </Button>
            <Typography variant="caption" sx={{ color: '#d6d3d1' }}>/</Typography>
            <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
              存钱与消费降级规划
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.35rem', sm: '1.65rem' }, color: '#1c1917' }}>
                  36个月极简生存基金与消费降级规划器
                </Typography>
                <Chip
                  label="建立不慌张的现金流金钟罩"
                  size="small"
                  sx={{ bgcolor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontWeight: 700, fontSize: '0.74rem' }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#78716c' }}>
                模拟中产消费降级三级跳，将每月开销精准挤干水分，把现有存款转化为抵抗失业周期的终身底气。
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/retirement-calculator')}
                sx={{ borderColor: '#e7e5e4', color: '#44403c', fontSize: '0.82rem' }}
              >
                法定退休金测算
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/layoff-calculator')}
                sx={{ borderColor: '#e7e5e4', color: '#44403c', fontSize: '0.82rem' }}
              >
                裁员赔偿测算
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 主体交互区域 */}
      <Container maxWidth="lg" sx={{ py: 3.5 }}>
        
        {/* 顶部总览卡片：生存跑道倍增器 */}
        <Paper elevation={0} sx={{ p: { xs: 2.2, sm: 3 }, mb: 3.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4' }}>
          <Grid container spacing={3} alignItems="center">
            {/* 左侧：现有备用金滑动条 */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#faf9f6', border: '1px solid #e7e5e4' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 700, fontSize: '0.78rem' }}>
                    家庭可用流动储备金总额
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#c2410c' }}>
                    {currentCashWan} 万元
                  </Typography>
                </Box>
                <Slider
                  size="small"
                  value={currentCashWan}
                  min={2}
                  max={120}
                  step={2}
                  onChange={(e, v) => setCurrentCashWan(v)}
                  sx={{ color: '#c2410c', py: 0.8 }}
                />
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem', display: 'block' }}>
                  活期存款 + 大额存单 + 稳健低波流动资产（扣除不可变现房产）
                </Typography>
              </Box>
            </Grid>

            {/* 中间与右侧：跑道对比核心大屏 */}
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 2.2, borderRadius: 2, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 600 }}>原开销生存跑道</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#78716c', mt: 0.5 }}>
                      {normalRunwayMonths}
                      <Typography component="span" variant="caption" sx={{ color: '#78716c', ml: 0.5 }}>个月</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.72rem' }}>
                      月均 ¥{normalTotalMonthly.toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 700 }}>降级后当前生存跑道</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#c2410c', mt: 0.2 }}>
                      {currentRunwayMonths}
                      <Typography component="span" variant="caption" sx={{ color: '#9a3412', ml: 0.5, fontWeight: 700 }}>个月</Typography>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontSize: '0.72rem', fontWeight: 600 }}>
                      月均 ¥{currentTotalMonthly.toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#9a3412', fontWeight: 600 }}>每月挤出纯现金 / 延长时间</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#047857', mt: 0.5 }}>
                      + ¥{monthlySaved.toLocaleString()} / 月
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#047857', fontSize: '0.72rem', fontWeight: 600 }}>
                      开销降幅 {cutPercentage}% · 净延长 {extendedMonths} 个月
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 第二部分：消费降级三级跳与支出项调节 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* 左侧：各项支出细节调节 */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDownIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1rem' }}>
                    消费降级三级跳模拟器
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="text"
                  onClick={resetToDefault}
                  startIcon={<ResetIcon sx={{ fontSize: 14 }} />}
                  sx={{ color: '#a8a29e', fontSize: '0.75rem', p: 0, '&:hover': { color: '#c2410c' } }}
                >
                  恢复预设
                </Button>
              </Box>

              {/* 三级跳快速切换按钮组 */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1, mb: 2.5 }}>
                {[
                  { id: 'normal', label: '1. 原中产状态', total: normalTotalMonthly, sub: '未砍开销 · 习惯性高消费' },
                  { id: 'practical', label: '2. 务实断舍离', total: practicalTotalMonthly, sub: '砍掉非必要 · 降幅约45%' },
                  { id: 'extreme', label: '3. 极端生存底线', total: extremeTotalMonthly, sub: '极简保命 · 降幅约70%' }
                ].map(item => {
                  const isSelected = activeTier === item.id
                  return (
                    <Box
                      key={item.id}
                      onClick={() => applyPresetTier(item.id)}
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem', color: isSelected ? '#c2410c' : '#111827' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isSelected ? '#c2410c' : '#4b5563', fontWeight: 700, display: 'block', my: 0.2 }}>
                        ¥{item.total.toLocaleString()} / 月
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.66rem', display: 'block' }}>
                        {item.sub}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>

              {/* 逐项开销调节清单 */}
              <Stack spacing={1.8}>
                {defaultExpenseItems.map(item => {
                  const val = expenses[item.id] !== undefined ? expenses[item.id] : item.practical
                  const diff = item.normal - val
                  return (
                    <Box key={item.id} sx={{ p: 1.6, borderRadius: 1.8, bgcolor: '#faf9f6', border: '1px solid #f3f4f6' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#111827' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.72rem' }}>
                            {item.desc}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                            ¥{val.toLocaleString()} / 月
                          </Typography>
                          {diff > 0 && (
                            <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700, fontSize: '0.7rem' }}>
                              已节省 ¥{diff}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Slider
                        size="small"
                        value={val}
                        min={0}
                        max={item.normal * 1.3}
                        step={100}
                        onChange={(e, v) => handleExpenseChange(item.id, v)}
                        sx={{ color: '#c2410c', py: 0.6 }}
                      />
                    </Box>
                  )
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* 右侧：36个月生存金钟罩与防御资产配置法则 */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {/* 36个月里程碑达成卡 */}
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ShieldIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '0.98rem' }}>
                    36 个月生存安全感里程碑
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#78716c', display: 'block', mb: 2 }}>
                  中年自救的核心不是奢望赚暴利，而是储备足够长的生命线，确保不会被短期风浪击穿。
                </Typography>

                <Stack spacing={2.2}>
                  {/* 里程碑 1：6 个月防猝死底线 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                        里程碑 1：6 个月防猝死底线 (防断供网贷)
                      </Typography>
                      <Typography variant="caption" sx={{ color: milestone6Percent >= 100 ? '#047857' : '#c2410c', fontWeight: 700 }}>
                        {milestone6Percent >= 100 ? '已达成 100%' : `${milestone6Percent}%`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={milestone6Percent}
                      sx={{ height: 6, borderRadius: 3, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: milestone6Percent >= 100 ? '#047857' : '#c2410c' } }}
                    />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                      需准备底资：¥{Math.round((currentTotalMonthly * 6) / 10000)} 万元（保证突遭变故时家庭正常运转半年）
                    </Typography>
                  </Box>

                  {/* 里程碑 2：18 个月转型蓄水池 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                        里程碑 2：18 个月转型蓄水池 (从容找工作与轻创)
                      </Typography>
                      <Typography variant="caption" sx={{ color: milestone18Percent >= 100 ? '#047857' : '#c2410c', fontWeight: 700 }}>
                        {milestone18Percent >= 100 ? '已达成 100%' : `${milestone18Percent}%`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={milestone18Percent}
                      sx={{ height: 6, borderRadius: 3, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: milestone18Percent >= 100 ? '#047857' : '#d97706' } }}
                    />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                      需准备底资：¥{Math.round((currentTotalMonthly * 18) / 10000)} 万元（绝不病急乱投医、不盲目重资产开店加盟）
                    </Typography>
                  </Box>

                  {/* 里程碑 3：36 个月周期金钟罩 */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                        里程碑 3：36 个月金钟罩 (穿越下行与心态自由)
                      </Typography>
                      <Typography variant="caption" sx={{ color: milestone36Percent >= 100 ? '#047857' : '#c2410c', fontWeight: 700 }}>
                        {milestone36Percent >= 100 ? '已达成 100%' : `${milestone36Percent}%`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={milestone36Percent}
                      sx={{ height: 6, borderRadius: 3, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: milestone36Percent >= 100 ? '#047857' : '#c2410c' } }}
                    />
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.68rem', mt: 0.3, display: 'block' }}>
                      需准备底资：¥{Math.round((currentTotalMonthly * 36) / 10000)} 万元（彻底戒除职场精神内耗与降薪焦虑）
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* 四笔钱防御型资产配置模型 */}
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#ffffff', border: '1px solid #e7e5e4' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WalletIcon sx={{ color: '#047857', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    家庭四笔钱防御配置标准模版
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>
                      1. 活钱池 (占比约 15%~25%)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                      大额存单、国债逆回购或高流动性零钱。无论投资市场如何，坚决不动用。
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>
                      2. 稳健长钱 (占比约 50%~60%)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                      国家储蓄国债、政策性养老金或高信用等级分红资产，追求确定性，拒绝暴利诱惑。
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: 'block' }}>
                      3. 保命钱 (每年千元纯消费保费)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                      核心经济支柱配置消费型百万医疗险与定寿，防止极端大病直接击穿三代家庭。
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#b91c1c', display: 'block' }}>
                      4. 进取投资 (严格限额 15% 以内)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                      任何权益资产严禁加杠杆，坚决不用失业金、养老金去借钱炒股炒币。
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

      </Container>

      <Footer />
    </Box>
  )
}

export default SavingsPlanner