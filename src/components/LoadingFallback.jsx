import { Box, CircularProgress } from '@mui/material'

const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%'
      }}
    >
      <CircularProgress size={36} thickness={4} />
    </Box>
  )
}

export default LoadingFallback
