import React, { useEffect, useRef, useState } from 'react';
import differenceInDays from 'date-fns/differenceInDays';
import isEqual from 'date-fns/isEqual';
import {
  Box,
  Divider,
  getButtonUtilityClass,
  useTheme,
  Typography,
  Button,
  Stack,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import QrReader from 'qr-scanner';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { sleep } from 'utils/sleep';
import { getProfile, strapiReqWithAuth } from 'lib/api';
import {
  GET_ATTEND_RECORD,
  GET_ATTEND_RECORD_BY_USER_ID,
  NEW_ATTEND_RECORD,
} from 'lib/endpoints';
import useAuth from 'hooks/useAuth';
import { AttendRecord, reduceAttendRecord } from 'models/record';
import { UserProfile } from 'models/auth';

import {
  getDateByDay,
  getToday,
  getDayByDate,
  addDays,
  getCheckInKey,
  getDayLabelByDate,
  DAY_1,
} from './utils';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// import QrScanner from './Scanner';
import QrScanner from './NewScanner';
import { formatDate } from 'utils/date';
import Image from 'next/image';
import NewRecordData from './NewRecordData';
import ExistingRecordData from './ExistingRecordData';
import ScanError from './ScanError';
import LocationError from './LocationError';

interface Props {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

const QrScannerWrapper: React.FC<Props> = ({ location, setLocation }) => {
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');

  const { profile: admin } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [record, setRecord] = useState<AttendRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const active = useRef(false);

  const handleResetClick = () => {
    if (window !== undefined) {
      window.location.reload();
    }
  };

  const clearAll = () => {
    // clear errors
    setError('');
    setApiError('');

    // close dialog
    setDialogOpen(false);

    // clear records and profile
    setProfile(null);
    setRecord(null);

    // set hall to default
    // setLocation('Hall A');
    // localStorage.removeItem('location');

    // remove active state
    active.current = false;
  };

  const handleScan = async (value, decodedResult) => {
    const qrVal = Number.parseInt(value);
    if (Number.isNaN(qrVal)) {
      console.debug('Not a valid number');
      return;
    }

    try {
      // current active used to prevent multiple api request
      if (!active.current) {
        const profileId = value;
        const record = await strapiReqWithAuth<any>({
          endpoint: GET_ATTEND_RECORD_BY_USER_ID(profileId),
        });

        // if length record is zero, no record exists, then must create record
        if (record && record.data && record.data.data.length === 0) {
          const profile = await getProfile(profileId);
          setProfile(profile);
          setDialogOpen(true);
          active.current = true;
        } else if (record && record.data && record.data.data.length >= 1) {
          const existingRecord = reduceAttendRecord(record.data.data[0]);
          setRecord(existingRecord);
          setDialogOpen(true);
          active.current = true;
        }
      }
    } catch (e) {
      active.current = true;
      setDialogOpen(true);
      setApiError(`There was an error handling scan, invalid QR Code`);
    }
  };

  const handleLocationChange = (
    event: React.MouseEvent<HTMLElement>,
    newLocation: string,
  ) => {
    if (newLocation === '') {
      localStorage.removeItem('location');
    }
    if (window !== undefined && newLocation !== null) {
      localStorage.setItem('location', newLocation);
      setLocation(newLocation);
    }
  };

  const handleError = (error) => {
    // console.log(error);
    // if (
    //   !error.includes('NotFoundException')
    //   // !error.includes('')
    // ) {
    //   setError(`There was an error handling scan, ${error as any}`);
    // }
  };

  return (
    <Stack spacing={1}>
      {/* Location settings */}
      <Stack spacing={1}>
        <ToggleButtonGroup
          fullWidth
          color="primary"
          size="large"
          value={location}
          exclusive
          onChange={handleLocationChange}
        >
          <ToggleButton value="Hall A">Hall A</ToggleButton>
          <ToggleButton value="Hall B">Hall B</ToggleButton>
          <ToggleButton value="Hall C">Hall C</ToggleButton>
        </ToggleButtonGroup>
        <Box pl={1}>
          {!location && (
            <Typography color="error" variant="caption">
              *please select hall location below
            </Typography>
          )}
        </Box>
      </Stack>

      {/* QR Scanner Box */}
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <QrScanner handleError={handleError} handleScan={handleScan} />
      </Box>

      {/* Error Box */}
      <Stack pt={1} spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {apiError && <Alert severity="error">{apiError}</Alert>}
        <Button size="large" onClick={handleResetClick} variant="contained">
          Reset
        </Button>
      </Stack>

      {/* Dialog */}
      <Dialog onClose={clearAll} open={dialogOpen}>
        {!location || location === 'null' || location === '' ? (
          <LocationError
            clearAll={clearAll}
            handleLocationChange={handleLocationChange}
          />
        ) : error || apiError ? (
          <ScanError apiError={apiError} error={error} clearAll={clearAll} />
        ) : record ? (
          <ExistingRecordData
            admin={admin}
            location={location}
            record={record}
            closeDialog={clearAll}
          />
        ) : profile ? (
          <NewRecordData
            admin={admin}
            location={location}
            closeDialog={clearAll}
            profile={profile}
          />
        ) : (
          <></>
        )}
      </Dialog>
    </Stack>
  );
};

export default QrScannerWrapper;
