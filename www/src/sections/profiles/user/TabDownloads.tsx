import { useEffect, useMemo, useState } from 'react';
import MainCard from 'components/MainCard';
import Image from 'next/image';
import { PDFDocument } from 'pdf-lib';

import { updateProfile } from 'lib/profile';

// material-ui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';

const TabDownloads: React.FC = () => {
  return (
    <MainCard title="Download Materials">
      <Grid container spacing={4} direction="column">
        <Grid item xs={12}>
          <Box
            component={Card}
            display={'flex'}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <CardMedia
              title="Ras Al Khaimah First International Forensic Sciences Conference 2023 - BOOK"
              image="../upload/final-book.jpg"
              sx={{
                minHeight: 250,
                height: { xs: 350, sm: 'auto' },
                width: { xs: 1, sm: 250 },
              }}
            />
            <CardContent>
              <Box>
                <Typography variant="h6" gutterBottom color="text.primary">
                  Ras Al Khaimah First International Forensic Sciences
                  Conference 2023 - BOOK
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Conference booklet
                </Typography>
              </Box>
              <CardActions sx={{ justifyContent: 'flex-start' }}>
                <Button
                  href="../upload/RAKFSC2023-FINAL-BOOK.pdf"
                  target="_blank"
                  variant="contained"
                >
                  Click here to Download
                </Button>
              </CardActions>
            </CardContent>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            component={Card}
            display={'flex'}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <CardMedia
              title="Ras Al Khaimah First International Forensic Sciences Conference 2023 - BOOK"
              image="../upload/magazine.jpg"
              sx={{
                minHeight: 250,
                height: { xs: 350, sm: 'auto' },
                width: { xs: 1, sm: 250 },
              }}
            />
            <CardContent>
              <Box>
                <Typography variant="h6" gutterBottom color="text.primary">
                  Ras Al Khaimah First International Forensic Sciences
                  Conference 2023 - MAGAZINE
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Forensic magazine
                </Typography>
              </Box>
              <CardActions sx={{ justifyContent: 'flex-start' }}>
                <Button
                  href="../upload/FORENSIC-MAGAZINE.pdf"
                  target="_blank"
                  variant="contained"
                >
                  Click here to Download
                </Button>
              </CardActions>
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default TabDownloads;
