import {
  Divider,
  Typography,
  Button,
  Stack,
  DialogActions,
} from '@mui/material';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
interface Props {
  clearAll: () => void;
  handleLocationChange: (e: any, location: string) => void;
}

const LocationError: React.FC<Props> = ({ clearAll, handleLocationChange }) => {
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
        <Typography textAlign="center" variant="h4" color="error">
          Please select location
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={location}
          exclusive
          onChange={handleLocationChange}
          fullWidth
        >
          <ToggleButton value="Hall A">Hall A</ToggleButton>
          <ToggleButton value="Hall B">Hall B</ToggleButton>
          <ToggleButton value="Hall C">Hall C</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <DialogActions>
        <Button fullWidth onClick={clearAll} variant="contained">
          Reset
        </Button>
      </DialogActions>
    </>
  );
};

export default LocationError;
