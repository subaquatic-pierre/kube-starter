import {
  Divider,
  Typography,
  Button,
  Stack,
  DialogActions,
} from '@mui/material';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

interface Props {
  error: string;
  apiError: string;
  clearAll: () => void;
}

const ScanError: React.FC<Props> = ({ error, apiError, clearAll }) => {
  return (
    <>
      <DialogTitle>Error</DialogTitle>
      <Divider />
      <Stack
        spacing={2}
        p={2}
        sx={(theme) => ({
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 300 },
          width: { xs: 280, md: 600 },
        })}
      >
        <Typography textAlign="center" variant="h3" color="error">
          {error ? error : apiError}
        </Typography>
      </Stack>
      <DialogActions>
        <Button fullWidth onClick={clearAll} variant="contained">
          Reset
        </Button>
      </DialogActions>
    </>
  );
};

export default ScanError;
