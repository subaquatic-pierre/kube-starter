import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import useAuth from 'hooks/useAuth';
import { AttendanceType, UserProfile } from 'models/auth';
import { useEffect, useState } from 'react';

interface Props {
  setAttendanceValues: React.Dispatch<React.SetStateAction<AttendanceType>>;
  profileProp?: Partial<UserProfile>;
  attendanceError?: string;
}

const defaultValues = { day1: '', day2: '', day3: '' };

const AttendanceRadios: React.FC<Props> = ({
  setAttendanceValues,
  profileProp,
  attendanceError,
}) => {
  const { profile } = useAuth();
  const [values, setValues] = useState(
    profileProp && profileProp.attendanceType
      ? profileProp.attendanceType
      : defaultValues,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // set attendance values of parent controller
    setAttendanceValues((old) => ({
      ...old,
      [event.target.name]: (event.target as HTMLInputElement).value,
    }));

    setValues((old) => ({
      ...old,
      [event.target.name]: (event.target as HTMLInputElement).value,
    }));
  };

  useEffect(() => {
    const newValues = defaultValues;

    if (!profileProp && profile.attendanceType) {
      for (const key in profile.attendanceType) {
        newValues[key] = profile.attendanceType[key] ?? '';
      }
      setValues(newValues);
      setAttendanceValues(profile.attendanceType);
    }
  }, [profile]);

  useEffect(() => {
    const newValues = defaultValues;

    if (profileProp && profileProp.attendanceType) {
      for (const key in profileProp.attendanceType) {
        newValues[key] = profileProp.attendanceType[key] ?? '';
      }
      setValues(newValues);
      setAttendanceValues(profileProp.attendanceType);
    }
  }, [profileProp]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography>Please select attendance type *</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormLabel id="demo-controlled-radio-buttons-group">Day 1</FormLabel>
        <RadioGroup name="day1" value={values.day1} onChange={handleChange}>
          <FormControlLabel
            value="attendOnline"
            control={<Radio />}
            label="Online"
            disabled={false}
          />
          <FormControlLabel
            value="attendInPerson"
            control={<Radio />}
            label="In Person"
            disabled={false}          
          />
          <FormControlLabel
            value="notAttending"
            control={<Radio />}
            label="Not Attending"
            // checked={true}
            disabled={false}
          />
        </RadioGroup>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormLabel id="demo-controlled-radio-buttons-group">Day 2</FormLabel>
        <RadioGroup name="day2" value={values.day2} onChange={handleChange}>
          <FormControlLabel
            value="attendOnline"
            control={<Radio />}
            label="Online"
          />
          <FormControlLabel
            value="attendInPerson"
            control={<Radio />}
            label="In Person"
          />
          <FormControlLabel
            value="notAttending"
            control={<Radio />}
            label="Not Attending"
          />
        </RadioGroup>
      </Grid>
      <Grid item xs={12} md={4}>
        <FormLabel id="demo-controlled-radio-buttons-group">Day 3</FormLabel>
        <RadioGroup name="day3" value={values.day3} onChange={handleChange}>
          <FormControlLabel
            value="attendOnline"
            control={<Radio />}
            label="Online"
          />
          <FormControlLabel
            value="attendInPerson"
            control={<Radio />}
            label="In Person"
          />
          <FormControlLabel
            value="notAttending"
            control={<Radio />}
            label="Not Attending"
          />
        </RadioGroup>
      </Grid>
      <Grid item xs={12}>
        {attendanceError && (
          <FormHelperText error id="personal-first-name-helper">
            {attendanceError}
          </FormHelperText>
        )}
      </Grid>
    </Grid>
  );
};

export default AttendanceRadios;
