import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { Box, DialogContent, Grid, Stack } from '@mui/material';
import Image from 'next/image';
import { basePath } from 'utils/const';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const IdInfo: React.FC<SimpleDialogProps> = (props: SimpleDialogProps) => {
  const { setOpen, open } = props;

  return (
    // <Dialog onClose={() => setOpen(false)} open={open}>
    //   <DialogTitle>Passport Photo Information</DialogTitle>

    //   <DialogContent>
    <Box minHeight={100}>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Stack>
            <Typography paragraph variant="h5">
              Upload passport copy or EmiratesID (UAE residents only)
            </Typography>
            <Typography variant="caption" paragraph>
              Ensure uploaded copy meets the following criteria for smooth
              processing:
            </Typography>
            <Typography variant="caption">
              <b>File Format:</b> Acceptable formats are JPEG, PNG, or PDF.
            </Typography>
            <Typography variant="caption">
              <b>File Size:</b> Maximum 5MB.
            </Typography>
            <Typography variant="caption">
              <b>Quality:</b> Upload a clear copy. All details should be
              readable with no obstructions.
            </Typography>
            <Typography variant="caption">
              <b>Validity:</b> Ensure your passport is valid and has not
              expired.
            </Typography>
            <Typography variant="caption">
              <b>Information:</b> Include all pages with personal information
            </Typography>
            <Typography variant="caption">
              <b>Note:</b> Your information is secured and will be used strictly
              for verification purposes.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
    //   </DialogContent>
    // </Dialog>
  );
};

export default IdInfo;
