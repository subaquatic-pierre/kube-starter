import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import Image from 'next/image';

// material-ui
import { Box, Button, Stack, Alert } from '@mui/material';

import { strapiReqWithAuth } from 'lib/api';
import {
  DASH_ATTEND_RECORD,
  GET_ATTEND_RECORD_BY_USER_ID,
  GET_CERT_PNG,
  GET_PROFILE_LOGS,
} from 'lib/endpoints';
import { AttendRecord, reduceAttendRecord } from 'models/record';
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';
import axios from 'axios';
import { UserProfile } from 'models/auth';
import { toDataUrl, handleGenerateCertificate } from 'utils/certificate';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

interface Props {
  profile: Partial<UserProfile>;
}

const TabCerts: React.FC<Props> = ({ profile }) => {
  const [record, setRecord] = useState<AttendRecord>(null);
  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState<{
    src: string;
    width: number;
    height: number;
    downloadUrl: string;
  }>(null);

  const loadData = async (profile: Partial<UserProfile>, force?: boolean) => {
    if (force) setLoading(true);
    const record = await strapiReqWithAuth<any>({
      endpoint: GET_ATTEND_RECORD_BY_USER_ID(`${profile.id}`),
    });

    // ensure attendance record exists
    if (record && record.data && record.data.data.length !== 0) {
      const existingRecord = reduceAttendRecord(record.data.data[0]);
      setRecord(existingRecord);

      const url = await handleGenerateCertificate(existingRecord, force);

      const res = await axios({
        url: GET_CERT_PNG,
        method: 'POST',
        data: { certUrl: url },
      });

      const blob = Buffer.from(res.data.buffer);
      const { width, height } = res.data;
      const file = new File([blob], 'cert.png', { type: 'image/png' });
      const dataUrl = await toDataUrl(file);

      setImageData({
        src: dataUrl,
        width,
        height,
        downloadUrl: url,
      });
    }
    setLoading(false);

    if (force) {
      dispatch(
        openSnackbar({
          open: true,
          message:
            'Certificate refreshed, please wait up to 5 minutes for new certificate.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
    }
  };

  useEffect(() => {
    if (profile) loadData(profile);
  }, [profile]);

  if (loading) return <Loader />;

  return (
    <MainCard title="Certificate">
      <Stack minHeight={{ xs: 450, md: 900 }} justifyContent="space-between">
        <Box display="flex" justifyContent="center">
          {imageData ? (
            <Box
              width={{ xs: 315, md: imageData.width }}
              height={{ xs: 400, md: imageData.height }}
              sx={{ overflow: 'visible' }}
              position="relative"
            >
              <Image
                sizes="md"
                priority
                fill
                src={imageData.src}
                alt="ticket"
                style={{ objectFit: 'contain', overflow: 'visible' }}
              />
            </Box>
          ) : (
            <Alert color="error">No attendance records found</Alert>
          )}
        </Box>
        <Box>
          {imageData && imageData.downloadUrl && (
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              sx={{ mt: 2.5 }}
            >
              <Button
                onClick={() => loadData(profile, true)}
                color="info"
                variant="contained"
                disabled={loading}
              >
                Regenerate
              </Button>
              <Button
                href={imageData.downloadUrl}
                variant="contained"
                download="certificate.pdf"
                target="blank"
                disabled={loading}
              >
                Download
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>
    </MainCard>
  );
};

export default TabCerts;
