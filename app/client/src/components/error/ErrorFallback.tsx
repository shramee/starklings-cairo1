import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { BasicLayout } from "../layout/BasicLayout";

export const ErrorFallback = () => {
  return (
    <BasicLayout>
      <Box sx={{ width: '100%', height:'80%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2}}>
        <Typography variant="h3">Something went horribly wrong!</Typography>
        <Button sx={{width: '300px'}} variant="contained" href="/">
          Go back to home
        </Button>
      </Box>
    </BasicLayout>
  );
};
