// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project imports
import ColorPalette from './ColorPalette';
import IconButton from 'components/@extended/IconButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from 'store/reducers/calendar';

// assets
import { CalendarOutlined, DeleteFilled } from '@ant-design/icons';

// types
import { DateRange } from 'types/calendar';
import { sleep } from 'utils/sleep';
import { useEffect, useState } from 'react';
import { buildBgColor, buildTextColor } from './utils';
import { getProfiles, strapiReqWithAuth } from 'lib/api';
import { PROFILE, PROFILES } from 'lib/endpoints';
import SpeakerSelectAutoComplete from './SpeakerSelectAutoComplete';
import DraftTextEditor from 'components/DraftTextEditor';
import { AgendaEvent } from 'models/event';

// constant
const getInitialValues = (
  event: FormikValues | null,
  range: DateRange | null,
) => {
  const newEvent: AgendaEvent = {
    title: '',
    description: '',
    color: '#1890ff',
    textColor: '#fff',
    category: '',
    allDay: false,
    hall: '',
    speaker: null,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
  };

  if (event || range) {
    return _.merge({}, newEvent, event);
  }

  return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

export interface AddEventFormProps {
  event?: FormikValues | null;
  range: DateRange | null;
  onCancel: () => void;
}

const AddEventFrom = ({ event, range, onCancel }: AddEventFormProps) => {
  const [category, setCategory] = useState(
    event && event.category ? event.category : '',
  );
  const [description, setDescription] = useState(
    event && event.description ? event.description : '',
  );
  const [hall, setHall] = useState(event && event.hall ? event.hall : '');

  const handleCategorySelectChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  const theme = useTheme();
  const isCreating = !event;

  const backgroundColor = buildBgColor(theme);

  const textColor = buildTextColor(theme);

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
    end: Yup.date().when(
      'start',
      (start, schema) =>
        start && schema.min(start, 'End date must be later than start date'),
    ),
    start: Yup.date(),
    color: Yup.string().max(255),
    textColor: Yup.string().max(255),
  });

  const deleteHandler = () => {
    dispatch(deleteEvent(event?.id));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Event deleted successfully.',
        variant: 'alert',
        alert: {
          color: 'success',
        },
        close: false,
      }),
    );
  };

  const handleUpdateEvent = async (event: any) => {
    dispatch(updateEvent(event.id, event));

    await sleep(0.1);

    dispatch(getEvents());
  };

  const formik = useFormik({
    initialValues: getInitialValues(event!, range),
    validationSchema: EventSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        const newEvent: AgendaEvent = {
          title: values.title,
          description: description,
          color: values.color,
          textColor: values.textColor,
          allDay: values.allDay,
          start: values.start,
          end: values.end,
          hall: hall,
          category: category,
          speaker: eventSpeakerId,
        };

        if (event) {
          newEvent['id'] = event.id;

          handleUpdateEvent(newEvent);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Event updated successfully.',
              variant: 'alert',
              alert: {
                color: 'success',
              },
              close: false,
            }),
          );
        } else {
          dispatch(createEvent(newEvent));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Event added successfully.',
              variant: 'alert',
              alert: {
                color: 'success',
              },
              close: false,
            }),
          );
        }

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;

  const [eventSpeakerId, setSpeakerId] = useState<number | null>(
    event && event.speaker && event.speaker.data ? event.speaker.data.id : null,
  );

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-title">Title</InputLabel>
                  <TextField
                    fullWidth
                    id="cal-title"
                    placeholder="Title"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-speaker">Speaker</InputLabel>
                  <SpeakerSelectAutoComplete
                    setSpeakerId={setSpeakerId}
                    speakerId={eventSpeakerId}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel
                    htmlFor="cal-category"
                    id="cal-category-input-label"
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="cal-category-label"
                    id="cal-category"
                    placeholder="Category Selection"
                    value={category}
                    onChange={handleCategorySelectChange}
                  >
                    <MenuItem value={'Workshop'}>Workshop</MenuItem>
                    <MenuItem value={'Talk'}>Talk</MenuItem>
                  </Select>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel
                    htmlFor="cal-category"
                    id="cal-category-input-label"
                  >
                    Hall
                  </InputLabel>
                  <Select
                    labelId="cal-hall-label"
                    placeholder="Hall Location"
                    id="cal-hall"
                    value={hall}
                    onChange={(e) => setHall(e.target.value)}
                  >
                    <MenuItem value={'Hall A'}>Hall A</MenuItem>
                    <MenuItem value={'Hall B'}>Hall B</MenuItem>
                    <MenuItem value={'Hall C'}>Hall C</MenuItem>
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-description">Description</InputLabel>
                  <DraftTextEditor
                    content={description}
                    setContent={setDescription}
                  />
                  {/* <TextField
                    fullWidth
                    id="cal-description"
                    multiline
                    rows={10}
                    placeholder="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  /> */}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.allDay}
                      {...getFieldProps('allDay')}
                    />
                  }
                  label="All day"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-start-date">Start Date</InputLabel>
                  <MobileDateTimePicker
                    value={new Date(values.start)}
                    format="dd/MM/yyyy hh:mm a"
                    onChange={(date) => setFieldValue('start', date)}
                    slotProps={{
                      textField: {
                        InputProps: {
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{ cursor: 'pointer' }}
                            >
                              <CalendarOutlined />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                  {touched.start && errors.start && (
                    <FormHelperText error={true}>
                      {errors.start as string}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <InputLabel htmlFor="cal-end-date">End Date</InputLabel>
                  <MobileDateTimePicker
                    value={new Date(values.end)}
                    format="dd/MM/yyyy hh:mm a"
                    onChange={(date) => setFieldValue('end', date)}
                    slotProps={{
                      textField: {
                        InputProps: {
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{ cursor: 'pointer' }}
                            >
                              <CalendarOutlined />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                  {touched.end && errors.end && (
                    <FormHelperText error={true}>
                      {errors.end as string}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Background Color
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-label="color"
                        {...getFieldProps('color')}
                        onChange={(e) => setFieldValue('color', e.target.value)}
                        name="color-radio-buttons-group"
                        sx={{ '& .MuiFormControlLabel-root': { mr: 2 } }}
                      >
                        {backgroundColor.map((item, index) => (
                          <ColorPalette
                            key={index}
                            value={item.value}
                            color={item.color}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Text Color</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="textColor"
                        {...getFieldProps('textColor')}
                        onChange={(e) =>
                          setFieldValue('textColor', e.target.value)
                        }
                        name="text-color-radio-buttons-group"
                        sx={{ '& .MuiFormControlLabel-root': { mr: 2 } }}
                      >
                        {textColor.map((item, index) => (
                          <ColorPalette
                            key={index}
                            value={item.value}
                            color={item.color}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {!isCreating && (
                  <Tooltip title="Delete Event" placement="top">
                    <IconButton
                      onClick={deleteHandler}
                      size="large"
                      color="error"
                    >
                      <DeleteFilled />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {event ? 'Edit' : 'Add'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default AddEventFrom;
