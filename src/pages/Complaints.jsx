import { useState, useMemo, useEffect } from 'react'
import { 
  Container, Typography, Box, Grid, Card, CardContent, Button, 
  Chip, Paper, Stack, Divider, TextField, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Switch, FormControlLabel
} from '@mui/material'
import { 
  Mood, MoodBad, ThumbUp, Comment, 
  CalendarToday, Add, Send 
} from '@mui/icons-material'

const Complaints = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [newComplaint, setNewComplaint] = useState({ content: '', mood: 'frustrated' })
  const [validationError, setValidationError] = useState(null)
  const [requireApproval, setRequireApproval] = useState(true)
  const [loadingComplaints, setLoadingComplaints] = useState(true)
  const [complaints, setComplaints] = useState([])
  const [fetchError, setFetchError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [clientId, setClientId] = useState('')

  const moodIcons = {
    frustrated: <MoodBad sx={{ color: '#f44336' }} />,
    helpless: <Mood sx={{ color: '#ff9800' }} />,
    confused: <Mood sx={{ color: '#2196f3' }} />,
    disappointed: <MoodBad sx={{ color: '#9c27b0' }} />,
    tired: <Mood sx={{ color: '#607d8b' }} />
  }

  const moodLabels = {
    frustrated: '愤怒',
    helpless: '无奈',
    confused: '困惑',
    disappointed: '失望',
    tired: '疲惫'
  }

  const moodColors = {
    frustrated: '#f44336',
    helpless: '#ff9800',
    confused: '#2196f3',
    disappointed: '#9c27b0',
    tired: '#607d8b'
  }

  const forbiddenPatterns = useMemo(() => ([
    { regex: /(赌博|博彩|彩票代购|赌球|黑彩)/i, message: '包含赌博相关敏感词，无法发布。' },
    { regex: /(色情|约炮|招嫖|裸聊|黄片)/i, message: '包含违规内容，请重新编辑。' },
    { regex: /(发票|代开发票|开票|免税发票)/i, message: '抱歉，禁止发布票务广告。' },
    { regex: /(贷款|信用卡代办|小额贷|高利贷|网贷)/i, message: '检测到金融广告，无法发布。' },
    { regex: /(推广|代理|招商|加盟|返利)/i, message: '包含推广营销类内容，请调整后再发。' },
    { regex: /(加\s*(我|vx|微信|V信)|VX[:：]|v信)/i, message: '请勿发布联系方式或广告。' },
    { regex: /(QQ|企鹅号)[^\d]*(\d{6,})/i, message: '请勿留下 QQ 号等联系方式。' },
    { regex: /((https?:\/\/|www\.)[^\s]+)/i, message: '请勿发布外部链接。' },
    { regex: /\d{3,}[-\s]?\d{3,}[-\s]?\d{4,}/, message: '检测到疑似手机号，请勿留下联系方式。' },
    { regex: /(代购|海淘|包邮|低价出售)/i, message: '禁止发布商品推广或售卖信息。' }
  ]), [])

  const validateComplaint = ({ title = '', content = '' }) => {
    const trimmedContent = (content || '').trim()
    if (!trimmedContent) return '内容不能为空。'
    const combined = [title, trimmedContent].filter(Boolean).join(' ')
    for (const { regex, message } of forbiddenPatterns) {
      if (regex.test(combined)) {
        return message
      }
    }
    return null
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const STORAGE_KEY = 'complaintsClientId'
    try {
      let stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        stored = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        window.localStorage.setItem(STORAGE_KEY, stored)
      }
      setClientId(stored)
    } catch (error) {
      console.error('获取客户端标识失败:', error)
      setClientId(`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
    }
  }, [])

  useEffect(() => {
    if (!clientId) return
    let cancelled = false
    const fetchComplaints = async () => {
      setLoadingComplaints(true)
      try {
        const response = await fetch(`/api/complaints?clientId=${encodeURIComponent(clientId)}`)
        if (!response.ok) {
          throw new Error('加载留言失败')
        }
        const data = await response.json()
        if (!cancelled) {
          setComplaints(Array.isArray(data) ? data : [])
          setFetchError(null)
        }
      } catch (error) {
        console.error('加载留言失败:', error)
        if (!cancelled) {
          setFetchError(error.message || '加载留言失败')
        }
      } finally {
        if (!cancelled) {
          setLoadingComplaints(false)
        }
      }
    }
    fetchComplaints()
    return () => {
      cancelled = true
    }
  }, [clientId])

  const handleSubmitComplaint = async () => {
    const trimmedComplaint = {
      ...newComplaint,
      content: (newComplaint.content || '').trim()
    }
    const errorMessage = validateComplaint(trimmedComplaint)
    if (errorMessage) {
      setValidationError(errorMessage)
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: trimmedComplaint.content,
          mood: trimmedComplaint.mood,
          requireApproval,
          clientId
        })
      })
      const result = await response.json()
      if (!response.ok) {
        const errorMessage = result?.error || '提交失败，请稍后重试'
        setSubmitError(errorMessage)
        return
      }
      setComplaints((prev) => {
        if (prev.some(item => item.id === result.id)) {
          return prev
        }
        return [result, ...prev]
      })
      setValidationError(null)
      setOpenDialog(false)
      setNewComplaint({ content: '', mood: 'frustrated' })
    } catch (error) {
      console.error('提交留言失败:', error)
      setSubmitError('提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const approvedComplaints = useMemo(
    () => complaints.filter(item => item.status === 'approved'),
    [complaints]
  )

  const pendingComplaints = useMemo(
    () => complaints.filter(item => item.status === 'pending'),
    [complaints]
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          到此一游
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          这里是中年人的表达空间，工作烦恼、生活感悟、职场心得，都可以在这里分享交流
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setValidationError(null)
              setOpenDialog(true)
            }}
            sx={{ px: 4, py: 1.5, borderRadius: 3 }}
          >
            发表想法
          </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            💡 这里是分享交流的温馨空间，说出你的故事和感悟，让我们互相陪伴共同成长。
          </Typography>
        </Paper>
      </Box>

      {pendingComplaints.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e0e7ff', backgroundColor: '#f8fafc' }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                我的待审核留言
              </Typography>
              <Chip label="仅自己可见" size="small" color="primary" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              内容已保存，后台审核通过后会自动公开。在此之前仅你本人可见。
            </Typography>
            <Stack spacing={2}>
              {pendingComplaints.map((item) => (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{ p: 2.5, borderRadius: 2, borderColor: 'rgba(37, 99, 235, 0.2)' }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {item.title?.trim() || '匿名分享'}
                      </Typography>
                      <Chip label="待审核" size="small" color="warning" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {item.content}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                      <Typography variant="caption">
                        {item.date} {item.time}
                      </Typography>
                      <Chip label={moodLabels[item.mood]} size="small" />
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Paper>
      )}
      {fetchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {fetchError}
        </Alert>
      )}

      <Stack spacing={3}>
        {loadingComplaints ? (
          <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">
              正在加载留言...
            </Typography>
          </Paper>
        ) : approvedComplaints.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              还没有公开的留言，来分享你的故事吧。
            </Typography>
          </Paper>
        ) : (
        approvedComplaints.map((complaint) => (
          <Paper 
            key={complaint.id}
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              border: '1px solid #f0f0f0',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: moodColors[complaint.mood] + '40'
              }
            }}
          >
            {/* 心情状态条 */}
            <Box 
              sx={{ 
                height: 6, 
                background: `linear-gradient(90deg, ${moodColors[complaint.mood]} 0%, ${moodColors[complaint.mood]}80 100%)`
              }} 
            />
            
            <Box sx={{ p: 4 }}>
              {/* 头部区域 */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Box 
                  sx={{ 
                    p: 2,
                    borderRadius: '50%',
                    backgroundColor: `${moodColors[complaint.mood]}15`,
                    mr: 3,
                    flexShrink: 0
                  }}
                >
                  {moodIcons[complaint.mood]}
                </Box>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    {complaint.title?.trim() || '匿名分享'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      label={moodLabels[complaint.mood]}
                      size="medium"
                      sx={{ 
                        backgroundColor: `${moodColors[complaint.mood]}20`,
                        color: moodColors[complaint.mood],
                        fontWeight: 600,
                        px: 2
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <CalendarToday sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {complaint.date} {complaint.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* 内容区域 */}
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.8, 
                  fontSize: '1.1rem',
                  color: 'text.primary',
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                {complaint.content}
              </Typography>

              {/* 标签区域 */}
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {complaint.tags.map((tag) => (
                  <Chip 
                    key={tag}
                    label={`# ${tag}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.8rem',
                      borderRadius: 20,
                      borderColor: 'grey.300',
                      '&:hover': {
                        backgroundColor: 'grey.50'
                      }
                    }}
                  />
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* 底部互动区域 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: moodColors[complaint.mood],
                      fontWeight: 600
                    }}
                  >
                    {complaint.author.slice(-1)}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    {complaint.author}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Button
                    size="small"
                    startIcon={<ThumbUp />}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { 
                        color: moodColors[complaint.mood],
                        backgroundColor: `${moodColors[complaint.mood]}10`
                      }
                    }}
                  >
                    {complaint.likes}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Comment />}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { 
                        color: 'primary.main',
                        backgroundColor: 'primary.50'
                      }
                    }}
                  >
                    {complaint.comments}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        )))}
      </Stack>

      {/* 发表牢骚对话框 */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false)
          setValidationError(null)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          分享你的想法
        </DialogTitle>
        <DialogContent>
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="说说你的想法..."
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newComplaint.content}
            onChange={(e) => setNewComplaint({ ...newComplaint, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              选择心情：
            </Typography>
            <Stack direction="row" spacing={1}>
              {Object.entries(moodLabels).map(([mood, label]) => (
                <Chip
                  key={mood}
                  label={label}
                  variant={newComplaint.mood === mood ? "filled" : "outlined"}
                  onClick={() => setNewComplaint({ ...newComplaint, mood })}
                  sx={{
                    backgroundColor: newComplaint.mood === mood ? `${moodColors[mood]}20` : 'transparent',
                    color: newComplaint.mood === mood ? moodColors[mood] : 'text.secondary',
                    borderColor: moodColors[mood]
                  }}
                />
              ))}
            </Stack>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={requireApproval}
                onChange={(event) => setRequireApproval(event.target.checked)}
              />
            }
            label="提交后需要后台审核"
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            开启后留言仅自己可见，后台审核通过后才会公开；关闭后将立即发布为公开内容。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false)
            setValidationError(null)
          }}>
            取消
          </Button>
          <Button 
            onClick={handleSubmitComplaint}
            variant="contained"
            startIcon={<Send />}
            disabled={!(newComplaint.content || '').trim() || submitting}
          >
            {submitting ? '提交中...' : '发表'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Complaints
