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

const PassportInfo: React.FC<SimpleDialogProps> = (
  props: SimpleDialogProps,
) => {
  const { setOpen, open } = props;

  return (
    // <Dialog onClose={() => setOpen(false)} open={open}>
    //   <DialogTitle>Passport Photo Information</DialogTitle>

    //   <DialogContent>
    <Box minHeight={100}>
      <Typography paragraph variant="h5">
        Guidelines for Official Personal Photo Upload
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} order={{ md: 1, xs: 2 }}>
          <Stack>
            <Typography variant="caption" textAlign="center">
              Example photo:
            </Typography>
            <Box
              height="100%"
              display="flex"
              justifyContent="center"
              mb={4}
              // alignItems="center"
            >
              <Image
                alt="Offical Personal Photo"
                height={180}
                style={{ objectFit: 'contain' }}
                width={180}
                src={`${basePath}/images/samplePassport.jpg`}
              />
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={8} order={{ md: 1, xs: 1 }}>
          <Stack>
            <Typography variant="caption" paragraph>
              Ensure your photo meets the following criteria for smooth
              processing:
            </Typography>
            <Typography variant="caption">
              <b>Image:</b> Color, recent, and high-quality (minimum 40x35mm),
              no older than 6 months.
            </Typography>
            <Typography variant="caption">
              <b>Background:</b> White
            </Typography>
            <Typography variant="caption">
              <b>Expression:</b> Keep it natural and unexaggerated.
            </Typography>
            <Typography variant="caption">
              <b>Resolution:</b> Minimum 600 dpi, free from ink marks or
              distortions.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
    //   </DialogContent>
    // </Dialog>
  );
};

export default PassportInfo;
