import { useState, useEffect } from 'react'
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    Button,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    Alert,
    Paper,
    Stack
} from '@mui/material'
import {
    CheckCircle,
    WorkspacePremium,
    LockReset,
    ArrowBack,
    FindReplace
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

// 暂时隐藏会员开通与支付功能控制开关
const SHOW_MEMBERSHIP_PAYMENT = false

const Membership = () => {
    const theme = useTheme()
    const { user, updateProfile } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        if (!SHOW_MEMBERSHIP_PAYMENT) return

        const params = new URLSearchParams(location.search)
        if (params.get('status') === 'success') {
            setSuccessMsg('支付成功！您已成为专业会员。')
            if (user) {
                const API_BASE = import.meta.env.VITE_API_BASE || ''
                fetch(`${API_BASE}/api/payment/mock-success`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.username, level: 'pro' })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && updateProfile) {
                            updateProfile({ membershipLevel: 'pro' })
                        }
                    })
            }
        }
    }, [location, user, updateProfile])

    const handleSubscribe = async (plan) => {
        if (!SHOW_MEMBERSHIP_PAYMENT) return
        if (!user) {
            navigate('/login', { state: { from: location } })
            return
        }

        setLoading(true)
        try {
            const API_BASE = import.meta.env.VITE_API_BASE || ''
            const response = await fetch(`${API_BASE}/api/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: `${plan.title} Membership`,
                    totalAmount: plan.price,
                    userId: user.id || user.username || user.email
                })
            })

            const data = await response.json()
            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl
            } else {
                alert('发起支付失败')
            }
        } catch (error) {
            console.error('Payment Error', error)
            alert('支付服务暂不可用')
        } finally {
            setLoading(false)
        }
    }

    const plans = [
        {
            title: '基础版',
            price: '0.00',
            period: '/ 月',
            features: [
                '基础文章访问',
                '社区论坛只读',
                '每周简报'
            ],
            buttonText: '当前方案',
            buttonVariant: 'outlined'
        },
        {
            title: '专业版',
            price: '99.00',
            period: '/ 年',
            popular: true,
            features: [
                '全部会员文章',
                'AI 优先咨询',
                '会员专属直播',
                '无广告体验',
                '社区发帖权限'
            ],
            buttonText: '支付宝升级',
            buttonVariant: 'contained'
        }
    ]

    // 如果暂时隐藏会员和支付通道，显示友好温馨的系统维护提示
    if (!SHOW_MEMBERSHIP_PAYMENT) {
        return (
            <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 8 }}>
                <Container maxWidth="sm">
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            borderRadius: 4,
                            border: '1px solid #e7e5e4',
                            bgcolor: '#ffffff',
                            textAlign: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                bgcolor: 'rgba(194, 65, 12, 0.08)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2.5
                            }}
                        >
                            <WorkspacePremium sx={{ fontSize: 32, color: '#c2410c' }} />
                        </Box>

                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: '#1c1917',
                                mb: 1.5,
                                fontSize: { xs: '1.4rem', sm: '1.6rem' }
                            }}
                        >
                            会员与支付通道升级中
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#78716c',
                                lineHeight: 1.8,
                                mb: 4,
                                fontSize: '0.95rem'
                            }}
                        >
                            为保障更好的阅读体验，本站会员订阅与在线支付通道正在系统升级维护中，暂时停止付费办理。目前全站所有深度实战文章、量化自救工具与开源平替库均面向所有用户完全免费开放体验。
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={<ArrowBack />}
                                onClick={() => navigate('/')}
                                sx={{
                                    bgcolor: '#c2410c',
                                    borderRadius: 2,
                                    py: 1.2,
                                    px: 3,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#9a3412' }
                                }}
                            >
                                返回首页
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<FindReplace />}
                                onClick={() => navigate('/products')}
                                sx={{
                                    borderColor: '#d6d3d1',
                                    color: '#44403c',
                                    borderRadius: 2,
                                    py: 1.2,
                                    px: 3,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                                }}
                            >
                                逛逛开源平替库
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography
                    component="h1"
                    variant="h2"
                    color="text.primary"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    投资你的成长
                </Typography>
                <Typography variant="h5" color="text.secondary" component="p">
                    加入我们的会员社区，加速你的个人与职业发展。
                </Typography>
            </Box>

            {successMsg && (
                <Alert severity="success" sx={{ mb: 4, mx: 'auto', maxWidth: 600 }}>
                    {successMsg}
                </Alert>
            )}

            <Grid
                container
                spacing={4}
                alignItems="stretch"
                justifyContent="center"
            >
                {plans.map((plan) => (
                    <Grid
                        item
                        key={plan.title}
                        xs={12}
                        sm={6}
                        md={4}
                    >
                        <Card
                            sx={{
                                position: 'relative',
                                border: plan.popular ? `2px solid ${theme.palette.primary.main}` : undefined,
                                boxShadow: plan.popular ? '0 8px 40px rgba(37, 99, 235, 0.12)' : undefined,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%'
                            }}
                        >
                            {plan.popular && (
                                <Chip
                                    label="最受欢迎"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        fontWeight: 'bold'
                                    }}
                                />
                            )}
                            <CardHeader
                                title={plan.title}
                                titleTypographyProps={{ align: 'center', fontWeight: 'bold' }}
                                subheaderTypographyProps={{ align: 'center' }}
                                sx={{
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'light'
                                            ? theme.palette.grey[50]
                                             : theme.palette.grey[700],
                                    pb: 0
                                }}
                            />
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'baseline',
                                        mb: 2,
                                    }}
                                >
                                    <Typography component="h2" variant="h3" color="text.primary">
                                        ¥{plan.price}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary">
                                        {plan.period}
                                    </Typography>
                                </Box>
                                <List sx={{ flex: 1 }}>
                                    {plan.features.map((line) => (
                                        <ListItem key={line} sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CheckCircle fontSize="small" color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={line} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button
                                    fullWidth
                                    variant={plan.buttonVariant}
                                    color="primary"
                                    size="large"
                                    onClick={() => plan.buttonText.includes('支付宝') && handleSubscribe(plan)}
                                    disabled={plan.title === '基础版' || loading}
                                    startIcon={plan.popular && <WorkspacePremium />}
                                >
                                    {loading && plan.popular ? '处理中...' : plan.buttonText}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default Membership
