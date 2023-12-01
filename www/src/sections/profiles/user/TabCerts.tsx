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
} from '@mui/material';

import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  Row,
  HeaderGroup,
  Cell,
} from 'react-table';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// project import
import makeData from 'data/react-table';
import ScrollX from 'components/ScrollX';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import {
  // CSVExport,
  HeaderSort,
  TablePagination,
} from 'components/third-party/ReactTable';
import { ProfileLog, reduceProfileLogs } from 'models/profileLog';
import { buildCertTableCols } from 'utils/certificate';
import { useRouter } from 'next/router';
import { strapiReqWithAuth } from 'lib/api';
import {
  DASH_ATTEND_RECORD,
  GET_ATTEND_RECORD_BY_USER_ID,
  GET_CERT_PNG,
  GET_PROFILE_LOGS,
} from 'lib/endpoints';
import {
  CertGenData,
  CertType,
  buildCertGenData,
  generateCertificate,
} from 'lib/certificate';
import { AttendRecord, reduceAttendRecord } from 'models/record';
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';
import axios from 'axios';
import { UserProfile } from 'models/auth';
import { toDataUrl, handleGenerateCertificate } from 'utils/certificate';
import FeedbackForm from 'components/FeedbackForm';
import { sleep } from 'utils/sleep';

const TabCerts: React.FC = () => {
  const { profile, role } = useAuth();
  const [formCompleted, setFormCompleted] = useState(false);
  const [record, setRecord] = useState<AttendRecord>(null);

  const [loading, setLoading] = useState(true);
  const [imageData, setImageData] = useState<{
    src: string;
    width: number;
    height: number;
    downloadUrl: string;
  }>(null);

  const loadCertData = async () => {
    await sleep(0.2);
    if (record) {
      // handle generating certificate, handles speaker or visitor or online type
      // handles creating certificate if not created yet, or just returns
      // url of certificate on record
      const url = await handleGenerateCertificate(record);
      const res = await axios({
        url: GET_CERT_PNG,
        method: 'POST',
        data: { certUrl: url },
      });

      // build png from pdf
      const blob = Buffer.from(res.data.buffer);
      const { width, height } = res.data;
      const file = new File([blob], 'cert.png', { type: 'image/png' });
      const dataUrl = await toDataUrl(file);

      // set image data to be displayed as well
      // as download link
      setImageData({
        src: dataUrl,
        width,
        height,
        downloadUrl: url,
      });
    }
    setLoading(false);
  };

  const handleLoad = async () => {
    const record = await strapiReqWithAuth<any>({
      endpoint: GET_ATTEND_RECORD_BY_USER_ID(`${profile.id}`),
    });

    // ensure attendance record exists
    if (record && record.data && record.data.data.length !== 0) {
      const existingRecord = reduceAttendRecord(record.data.data[0]);
      setRecord(existingRecord);
    }

    let completed = false;

    const val = window.localStorage.getItem('feedbackFormCompleted');

    if (val !== null) {
      completed = true;
    }

    setFormCompleted(completed);
    // only clear loading if form is not completed,
    // if form is completed then loading will be set false
    // by loadCertData handler
    if (!completed) setLoading(false);
  };

  const handleFormCompleteClick = () => {
    setLoading(true);
    setFormCompleted(true);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  useEffect(() => {
    if (formCompleted && profile) loadCertData();
  }, [formCompleted]);

  if (loading) return <Loader />;

  // under construction
  // if (!loading && role !== 'speaker') {
  //   return (
  //     <MainCard title="Certificate">
  //       <Stack minHeight={{ xs: 450, md: 900 }} alignItems="center">
  //         <Alert color="warning">
  //           Currently under construction, your certificate will be available
  //           soon
  //         </Alert>
  //       </Stack>
  //     </MainCard>
  //   );
  // }

  // show no attend record found
  if (!loading && !record)
    return (
      <MainCard title="Certificate">
        <Stack minHeight={{ xs: 450, md: 900 }} alignItems="center">
          <Alert color="error">
            No attendance records found, send message to admin if you think
            there is an error
          </Alert>
        </Stack>
      </MainCard>
    );

  // show feedback form if not yet completed
  if (!loading && !formCompleted)
    return (
      <MainCard title="Certificate">
        <FeedbackForm setFormCompleted={handleFormCompleteClick} />
      </MainCard>
    );

  // show certificate if all passed
  if (!loading && formCompleted && imageData)
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
              <Alert color="error">
                Unable to generate certificate, please send message to an admin
              </Alert>
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
                  href={imageData.downloadUrl}
                  variant="contained"
                  download="certificate.pdf"
                  disabled={loading}
                  target="blank"
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
