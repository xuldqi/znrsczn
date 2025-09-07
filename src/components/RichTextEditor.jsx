import { useState, useRef } from 'react'
import {
  Box,
  Paper,
  IconButton,
  Divider,
  Stack,
  Tooltip,
  Typography,
  ButtonGroup,
  TextField,
  Tabs,
  Tab
} from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Link as LinkIcon,
  Code,
  Title,
  FormatSize,
  Undo,
  Redo,
  Visibility,
  Edit
} from '@mui/icons-material'

const RichTextEditor = ({ value, onChange, placeholder = "开始编写你的文章..." }) => {
  const editorRef = useRef(null)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0: 编辑, 1: 预览

  // 执行格式化命令
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
    editorRef.current?.focus()
  }

  // 插入Markdown语法
  const insertMarkdown = (syntax) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    
    if (range) {
      const selectedText = range.toString()
      let newContent = ''
      
      switch (syntax) {
        case 'h1':
          newContent = `# ${selectedText || '标题一'}`
          break
        case 'h2':
          newContent = `## ${selectedText || '标题二'}`
          break
        case 'h3':
          newContent = `### ${selectedText || '标题三'}`
          break
        case 'bold':
          newContent = `**${selectedText || '粗体文字'}**`
          break
        case 'italic':
          newContent = `*${selectedText || '斜体文字'}*`
          break
        case 'code':
          newContent = `\`${selectedText || '代码'}\``
          break
        case 'quote':
          newContent = `> ${selectedText || '引用文字'}`
          break
        case 'list':
          newContent = `- ${selectedText || '列表项'}`
          break
        case 'numberList':
          newContent = `1. ${selectedText || '编号列表项'}`
          break
        case 'link':
          newContent = `[${selectedText || '链接文字'}](链接地址)`
          break
        default:
          return
      }

      // 替换选中的文本
      range.deleteContents()
      range.insertNode(document.createTextNode(newContent))
      
      // 更新编辑器内容
      if (editorRef.current) {
        onChange(editorRef.current.innerText)
      }
    }
  }

  // 处理内容变化
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerText
      onChange(content)
    }
  }

  // 处理粘贴事件，清理格式
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    handleContentChange()
  }

  // 简单的 Markdown 渲染函数
  const renderMarkdown = (text) => {
    if (!text) return ''
    
    return text
      // 标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 粗体和斜体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 代码
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // 列表
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^[0-9]+\. (.*$)/gim, '<li>$1</li>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // 段落
      .split('\n')
      .map(line => {
        if (line.trim() === '') return '<br>'
        if (line.match(/^<h[1-6]>|^<blockquote>|^<li>/)) return line
        return `<p>${line}</p>`
      })
      .join('')
  }

  const toolbarButtons = [
    { 
      icon: <Title />, 
      label: '标题一', 
      action: () => insertMarkdown('h1'),
      group: 'heading'
    },
    { 
      icon: <FormatSize />, 
      label: '标题二', 
      action: () => insertMarkdown('h2'),
      group: 'heading'
    },
    { 
      icon: <FormatBold />, 
      label: '粗体', 
      action: () => insertMarkdown('bold'),
      group: 'format'
    },
    { 
      icon: <FormatItalic />, 
      label: '斜体', 
      action: () => insertMarkdown('italic'),
      group: 'format'
    },
    { 
      icon: <Code />, 
      label: '代码', 
      action: () => insertMarkdown('code'),
      group: 'format'
    },
    { 
      icon: <FormatQuote />, 
      label: '引用', 
      action: () => insertMarkdown('quote'),
      group: 'block'
    },
    { 
      icon: <FormatListBulleted />, 
      label: '无序列表', 
      action: () => insertMarkdown('list'),
      group: 'block'
    },
    { 
      icon: <FormatListNumbered />, 
      label: '有序列表', 
      action: () => insertMarkdown('numberList'),
      group: 'block'
    },
    { 
      icon: <LinkIcon />, 
      label: '链接', 
      action: () => insertMarkdown('link'),
      group: 'insert'
    }
  ]

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
          <Tab icon={<Edit />} label="编辑" />
          <Tab icon={<Visibility />} label="预览" />
        </Tabs>
      </Box>

      {/* 工具栏 - 只在编辑模式显示 */}
      {activeTab === 0 && (
        <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {toolbarButtons.map((button, index) => {
              const showDivider = index > 0 && 
                toolbarButtons[index - 1].group !== button.group
              
              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  {showDivider && (
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24 }} />
                  )}
                  <Tooltip title={button.label} arrow>
                    <IconButton
                      size="small"
                      onClick={button.action}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    >
                      {button.icon}
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            })}
          </Stack>
        </Box>
      )}

      {/* 编辑器主体 */}
      {activeTab === 0 ? (
        // 编辑模式
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleContentChange}
          onPaste={handlePaste}
          sx={{
            minHeight: 300,
            p: 3,
            outline: 'none',
            fontSize: '14px',
            lineHeight: 1.6,
            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '&:focus': {
              backgroundColor: '#fafafa'
            }
          }}
        >
          {!value && (
            <Typography 
              color="text.secondary" 
              sx={{ 
                position: 'absolute',
                pointerEvents: 'none',
                userSelect: 'none',
                opacity: 0.6
              }}
            >
              {placeholder}
            </Typography>
          )}
        </Box>
      ) : (
        // 预览模式
        <Box
          sx={{
            minHeight: 300,
            p: 3,
            fontSize: '14px',
            lineHeight: 1.6,
            '& h1, & h2, & h3': {
              fontWeight: 600,
              margin: '16px 0 8px 0',
              color: 'text.primary'
            },
            '& h1': { fontSize: '1.8rem' },
            '& h2': { fontSize: '1.4rem' },
            '& h3': { fontSize: '1.2rem' },
            '& p': {
              margin: '8px 0',
              lineHeight: 1.6
            },
            '& blockquote': {
              borderLeft: '4px solid #2196f3',
              backgroundColor: '#f5f9ff',
              margin: '16px 0',
              padding: '12px 16px',
              borderRadius: '0 4px 4px 0'
            },
            '& code': {
              backgroundColor: '#f5f5f5',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '0.9em'
            },
            '& strong': {
              fontWeight: 600,
              color: 'primary.main'
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline'
            }
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      )}

      {/* 底部状态栏 */}
      <Box sx={{ 
        p: 1, 
        borderTop: '1px solid #e0e0e0', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          支持 Markdown 语法
        </Typography>
        <Typography variant="caption" color="text.secondary">
          字符数: {value?.length || 0}
        </Typography>
      </Box>
    </Paper>
  )
}

export default RichTextEditor