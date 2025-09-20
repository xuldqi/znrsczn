import React from 'react'
import { Box, Typography } from '@mui/material'

const TestPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'background.default'
    }}>
      <Typography variant="h2" color="primary">
        测试页面 - 如果你看到这个说明React正常工作
      </Typography>
    </Box>
  )
}

export default TestPage