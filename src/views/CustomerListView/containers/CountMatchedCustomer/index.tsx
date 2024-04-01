// Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Replay from "@mui/icons-material/Replay";
import IconButton from '@mui/material/IconButton'

const CountMatchedCustomer = () => {
  const handleRefresh = () => {

  }

  return (
    <div style={{ display: 'flex', alignItems: "center", marginTop: 10 }}>
      <Box width={4 / 12} pt={1.5}>
        <Typography style={{ verticalAlign: 'text-bottom' }} variant={'subtitle1'}>
          Số khách hàng khớp tiêu chí:
        </Typography>
      </Box>
      <Box width={8 / 12} style={{ display: 'flex', alignItems: 'center' }}>
        <Box display={'inline'} fontWeight={500} fontSize={16}>
          {/* <CircularProgress size={20} /> */}0
        </Box>
        <IconButton
          color="primary"
          component="span"
          onClick={handleRefresh}
        >
          <Replay />
        </IconButton>
      </Box>
    </div>
  )
};

export default CountMatchedCustomer;