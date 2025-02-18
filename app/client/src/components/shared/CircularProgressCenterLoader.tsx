import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export const CircularProgressCenterLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: 200,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress data-testid="loader" color="primary" />
    </Box>
  )
}
