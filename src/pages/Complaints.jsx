import { useState } from 'react'
import { 
  Container, Typography, Box, Grid, Card, CardContent, Button, 
  Chip, Paper, Stack, Divider, TextField, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { 
  Mood, MoodBad, Work, Favorite, ThumbUp, Comment, 
  AccessTime, CalendarToday, Add, Send 
} from '@mui/icons-material'

const Complaints = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [newComplaint, setNewComplaint] = useState({ title: '', content: '', mood: 'frustrated' })

  const complaints = [
    {
      id: 1,
      title: '又被老板画饼了',
      content: '今天老板又说什么"这个需求很重要，关系到公司未来发展"，然后排期就两天。我真的服了，每次都是这样，紧急需求永远比合理规划多。',
      mood: 'frustrated',
      author: '匿名用户A',
      date: '2024-01-20',
      time: '14:30',
      likes: 28,
      comments: 12,
      tags: ['工作压力', '需求管理', '时间紧迫']
    },
    {
      id: 2,
      title: '开发说技术难度太大',
      content: '好不容易想出一个创新功能，开发直接说"这个技术实现太复杂了，要不换个简单的？"，感觉自己的创新理念总是被技术限制住。',
      mood: 'helpless',
      author: '匿名用户B',
      date: '2024-01-19',
      time: '16:45',
      likes: 15,
      comments: 8,
      tags: ['技术沟通', '项目创新', '团队协作']
    },
    {
      id: 3,
      title: '用户反馈看不懂',
      content: '用户说"这个功能不好用"，但是问具体哪里不好用，就说不出来了。感觉在做哑谜游戏，到底要怎么样才能真正了解用户需求？',
      mood: 'confused',
      author: '匿名用户C',
      date: '2024-01-18',
      time: '10:20',
      likes: 22,
      comments: 15,
      tags: ['用户研究', '需求分析', '反馈收集']
    },
    {
      id: 4,
      title: '数据又下降了',
      content: '明明觉得新功能做得很好，结果上线后数据反而下降了。老板问原因，我也不知道该怎么解释，感觉自己的判断力有问题。',
      mood: 'disappointed',
      author: '匿名用户D',
      date: '2024-01-17',
      time: '09:15',
      likes: 31,
      comments: 18,
      tags: ['数据分析', '功能优化', '自我怀疑']
    },
    {
      id: 5,
      title: '设计师总是不理解我',
      content: '跟设计师解释了半天交互逻辑，结果出来的设计完全不是我想要的效果。感觉沟通成本太高了，有时候真想自己上手做设计。',
      mood: 'tired',
      author: '匿名用户E',
      date: '2024-01-16',
      time: '11:30',
      likes: 19,
      comments: 9,
      tags: ['设计沟通', '交互设计', '团队协作']
    }
  ]

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

  const handleSubmitComplaint = () => {
    // TODO: 实现提交想法的逻辑
    console.log('新想法:', newComplaint)
    setOpenDialog(false)
    setNewComplaint({ title: '', content: '', mood: 'frustrated' })
  }

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
            onClick={() => setOpenDialog(true)}
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

      <Stack spacing={3}>
        {complaints.map((complaint) => (
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
                    {complaint.title}
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
        ))}
      </Stack>

      {/* 发表牢骚对话框 */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          分享你的想法
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="标题"
            fullWidth
            variant="outlined"
            value={newComplaint.title}
            onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSubmitComplaint}
            variant="contained"
            startIcon={<Send />}
            disabled={!newComplaint.title || !newComplaint.content}
          >
            发表
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Complaints