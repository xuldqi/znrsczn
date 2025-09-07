import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ClickAwayListener,
  Popper,
  Typography,
  Divider
} from '@mui/material'
import { Search, Clear, TrendingUp } from '@mui/icons-material'

const SearchBar = ({ onSearch, placeholder = "搜索中年人自救指南...", variant = "outlined" }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  // 热门搜索建议
  const hotSearches = [
    '35岁职场危机',
    '中年转行指南', 
    '副业赚钱',
    '职场沟通技巧',
    '时间管理',
    '压力管理',
    '职业规划',
    '团队管理'
  ]

  // 搜索历史 (模拟数据)
  const searchHistory = [
    '如何提升工作效率',
    '中年人职业转型',
    '职场心理调节'
  ]

  const handleInputChange = (event) => {
    setQuery(event.target.value)
    setAnchorEl(event.currentTarget)
    if (event.target.value.trim() && !isOpen) {
      setIsOpen(true)
    }
  }

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      setIsOpen(false)
      if (onSearch) {
        onSearch(searchQuery.trim())
      }
      // 跳转到搜索结果页面
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
  }

  const handleClickAway = () => {
    setIsOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          variant={variant}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{ p: 0.5 }}
                >
                  <Clear sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'background.paper',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'grey.300',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            }
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.9rem',
              py: 1.5,
            }
          }}
        />

        <Popper
          open={isOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          sx={{ 
            zIndex: 1300,
            width: anchorEl ? anchorEl.clientWidth : 'auto',
            mt: 0.5
          }}
        >
          <Paper
            elevation={4}
            sx={{
              maxHeight: 400,
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
            }}
          >
            {query.trim() ? (
              // 搜索结果建议
              <Box>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    搜索建议
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {hotSearches
                      .filter(item => item.toLowerCase().includes(query.toLowerCase()))
                      .slice(0, 5)
                      .map((suggestion, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                            px: 0,
                            py: 0.5,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'grey.50',
                            }
                          }}
                        >
                          <Search sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <ListItemText
                            primary={suggestion}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              color: 'text.primary'
                            }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              </Box>
            ) : (
              // 默认显示热门搜索和历史
              <Box>
                {searchHistory.length > 0 && (
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      搜索历史
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchHistory.slice(0, 3).map((item, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleSuggestionClick(item)}
                          sx={{
                            px: 0,
                            py: 0.5,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'grey.50',
                            }
                          }}
                        >
                          <Search sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              fontSize: '0.875rem',
                              color: 'text.primary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                <Divider />
                
                <Box sx={{ p: 2, pt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUp sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      热门搜索
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {hotSearches.slice(0, 6).map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => handleSuggestionClick(item)}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: 'grey.100',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          color: 'text.secondary',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

export default SearchBar