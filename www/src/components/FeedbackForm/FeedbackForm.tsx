import {
  Box,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  FormControl,
  Button,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { strapiReq } from 'lib/api';
import { NEW_FEEDBACK_FORM } from 'lib/endpoints';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import useConfig from 'hooks/useConfig';
import { getFormTranslation } from './locale';

interface FormValues {
  name: string;
  nationality: string;
  sex: string;
  age: string;
  maritalStatus: string;
  education: string;
  infoSatisfied: string;
  overallSatisfied: string;
  objectiveSatisfied: string;
  preparationSatisfied: string;
  periodSatisfied: string;
  scientificSatisfied: string;
  keynoteSatisfied: string;
  hallSatisfied: string;
  discussionSatisfied: string;
  interpretSatisfied: string;
  knowledgeSatisfied: string;
  workshopParticipate: string;
  suggestions: string;
}

const defaultValues = {
  name: '',
  nationality: '',
  sex: '',
  age: '',
  maritalStatus: '',
  education: '',
  infoSatisfied: '',
  overallSatisfied: '',
  objectiveSatisfied: '',
  preparationSatisfied: '',
  periodSatisfied: '',
  scientificSatisfied: '',
  keynoteSatisfied: '',
  hallSatisfied: '',
  discussionSatisfied: '',
  interpretSatisfied: '',
  knowledgeSatisfied: '',
  workshopParticipate: '',
  suggestions: '',
};

const nationOptions = ['Emirati', 'Arab', 'Asian', 'Westerner', 'African'];

interface Props {
  setFormCompleted: () => void;
}

const validateForm = (
  values: FormValues,
  transDict: any,
): [boolean, errors: FormValues] => {
  const errors: FormValues = { ...defaultValues };
  let valid = true;
  for (const key of Object.keys(values)) {
    if (values[key] === '' && key !== 'suggestions') {
      errors[key] = transDict.required;
      valid = false;
    }
  }
  return [valid, errors];
};

const FeedbackForm: React.FC<Props> = ({ setFormCompleted }) => {
  const { i18n } = useConfig();
  const transDict = getFormTranslation(i18n);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  const { profile, role } = useAuth();

  const [radioValue, setRadioValue] = useState('yes');
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<FormValues>(defaultValues);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setErrors((old) => ({
      ...old,
      [event.target.name]: '',
    }));
    setValues((old) => ({
      ...old,
      [event.target.name]: event.target.value,
    }));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((old) => ({
      ...old,
      [event.target.name]: '',
    }));

    setValues((old) => ({
      ...old,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmitClick = async () => {
    values['profile'] = profile.id;
    values['speakerAllow'] = radioValue === 'yes' ? true : false;

    const [isValid, errors] = validateForm(values, transDict);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    try {
      const res = await strapiReq({
        endpoint: NEW_FEEDBACK_FORM,
        data: { data: values },
        method: 'POST',
      });

      console.log(res);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Form submit successful, thank you for your feedback.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );

      localStorage.setItem('feedbackFormCompleted', 'true');
      setFormCompleted();
    } catch (e) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Unable to submit form',
          variant: 'alert',
          alert: {
            color: 'error',
          },
          close: false,
        }),
      );
    }
  };

  useEffect(() => {
    if (profile) {
      setValues((old) => ({
        ...old,
        name: `${profile.nameOnCert}`,
      }));
    }
  }, [profile]);

  return (
    <Box
      p={2}
      sx={{
        '& .MuiFormLabel-root': {
          wordWrap: 'normal',
          whiteSpace: 'unset',
          overflow: 'visible',
          textOverflow: 'unset',
        },
      }}
    >
      <Typography mb={4} variant="h4" color="secondary.main" textAlign="center">
        {transDict.heading}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="name">{transDict.name}*:</InputLabel>
            <TextField
              fullWidth
              id="name"
              value={values.name}
              name="name"
              onChange={handleTextChange}
              placeholder="Enter Name"
            />
            {errors.name && (
              <FormHelperText error id="name-helper">
                {errors.name as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="nationality">
              {transDict.nationality}*:
            </InputLabel>
            <Select
              labelId="nationality"
              id="nationality"
              name="nationality"
              fullWidth
              label="Select Nationality"
              value={values.nationality}
              onChange={handleSelectChange}
            >
              {nationOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.nationality && (
              <FormHelperText error id="nationality-helper">
                {errors.nationality as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="sex">{transDict.sex}*:</InputLabel>

            <Select
              labelId="sex"
              id="sex"
              name="sex"
              fullWidth
              placeholder="Select sex"
              value={values.sex}
              onChange={handleSelectChange}
            >
              {transDict.sexOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.sex && (
              <FormHelperText error id="sex-helper">
                {errors.sex as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="age">{transDict.age}*:</InputLabel>

            <Select
              labelId="age"
              id="age"
              name="age"
              fullWidth
              placeholder="Select age"
              value={values.age}
              onChange={handleSelectChange}
            >
              {transDict.ageOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.age && (
              <FormHelperText error id="age-helper">
                {errors.age as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="maritalStatus">
              {transDict.maritalStatus}*:
            </InputLabel>

            <Select
              labelId="maritalStatus"
              id="maritalStatus"
              name="maritalStatus"
              fullWidth
              placeholder="Select maritalStatus"
              value={values.maritalStatus}
              onChange={handleSelectChange}
            >
              {transDict.maritalOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.maritalStatus && (
              <FormHelperText error id="maritalStatus-helper">
                {errors.maritalStatus as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="education">{transDict.education}*:</InputLabel>

            <Select
              labelId="education"
              id="education"
              name="education"
              fullWidth
              placeholder="Select education"
              value={values.education}
              onChange={handleSelectChange}
            >
              {transDict.educationOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.education && (
              <FormHelperText error id="education-helper">
                {errors.education as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="infoSatisfied">
              {transDict.question1}*
            </InputLabel>

            <Select
              labelId="infoSatisfied"
              id="infoSatisfied"
              name="infoSatisfied"
              fullWidth
              placeholder="Select infoSatisfied"
              value={values.infoSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.infoSatisfied && (
              <FormHelperText error id="infoSatisfied-helper">
                {errors.infoSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={{ xs: 1.25 }}>
            <InputLabel htmlFor="overallSatisfied">
              {transDict.question2}*
            </InputLabel>

            <Select
              labelId="overallSatisfied"
              id="overallSatisfied"
              name="overallSatisfied"
              fullWidth
              placeholder="Select overallSatisfied"
              value={values.overallSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.overallSatisfied && (
              <FormHelperText error id="overallSatisfied-helper">
                {errors.overallSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="objectiveSatisfied">
              {transDict.question3}*
            </InputLabel>

            <Select
              labelId="objectiveSatisfied-label"
              id="objectiveSatisfied"
              name="objectiveSatisfied"
              fullWidth
              value={values.objectiveSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.objectiveSatisfied && (
              <FormHelperText error id="objectiveSatisfied-helper">
                {errors.objectiveSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="preparationSatisfied">
              {transDict.question4}*
            </InputLabel>

            <Select
              labelId="preparationSatisfied-label"
              id="preparationSatisfied"
              name="preparationSatisfied"
              fullWidth
              value={values.preparationSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.preparationSatisfied && (
              <FormHelperText error id="preparationSatisfied-helper">
                {errors.preparationSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="periodSatisfied">
              {transDict.question5}*
            </InputLabel>

            <Select
              labelId="periodSatisfied-label"
              id="periodSatisfied"
              name="periodSatisfied"
              fullWidth
              value={values.periodSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.periodSatisfied && (
              <FormHelperText error id="periodSatisfied-helper">
                {errors.periodSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="scientificSatisfied">
              {transDict.question6}*
            </InputLabel>

            <Select
              labelId="scientificSatisfied-label"
              id="scientificSatisfied"
              name="scientificSatisfied"
              fullWidth
              value={values.scientificSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.scientificSatisfied && (
              <FormHelperText error id="scientificSatisfied-helper">
                {errors.scientificSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="keynoteSatisfied">
              {transDict.question7}*
            </InputLabel>

            <Select
              labelId="keynoteSatisfied-label"
              id="keynoteSatisfied"
              name="keynoteSatisfied"
              fullWidth
              value={values.keynoteSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.keynoteSatisfied && (
              <FormHelperText error id="keynoteSatisfied-helper">
                {errors.keynoteSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={{ xs: 1.25, md: 3.7 }}>
            <InputLabel htmlFor="hallSatisfied">
              {transDict.question8}*
            </InputLabel>

            <Select
              labelId="hallSatisfied-label"
              id="hallSatisfied"
              name="hallSatisfied"
              fullWidth
              value={values.hallSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.hallSatisfied && (
              <FormHelperText error id="hallSatisfied-helper">
                {errors.hallSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="discussionSatisfied">
              {transDict.question9}*
            </InputLabel>

            <Select
              labelId="discussionSatisfied-label"
              id="discussionSatisfied"
              name="discussionSatisfied"
              fullWidth
              value={values.discussionSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.discussionSatisfied && (
              <FormHelperText error id="discussionSatisfied-helper">
                {errors.discussionSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="interpretSatisfied">
              {transDict.question10}*
            </InputLabel>

            <Select
              labelId="interpretSatisfied-label"
              id="interpretSatisfied"
              name="interpretSatisfied"
              fullWidth
              value={values.interpretSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.interpretSatisfied && (
              <FormHelperText error id="interpretSatisfied-helper">
                {errors.interpretSatisfied as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="knowledgeSatisfied">
              {transDict.question11}*
            </InputLabel>

            <Select
              labelId="knowledgeSatisfied-label"
              id="knowledgeSatisfied"
              name="knowledgeSatisfied"
              fullWidth
              value={values.knowledgeSatisfied}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          {errors.knowledgeSatisfied && (
            <FormHelperText error id="knowledgeSatisfied-helper">
              {errors.knowledgeSatisfied as string}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="workshopParticipate">
              {transDict.question12}*
            </InputLabel>

            <Select
              labelId="workshopParticipate-label"
              id="workshopParticipate"
              name="workshopParticipate"
              fullWidth
              value={values.workshopParticipate}
              onChange={handleSelectChange}
            >
              {transDict.satisfiedOptions.map((item, i) => (
                <MenuItem value={item} key={i}>
                  {item}
                </MenuItem>
              ))}
            </Select>
            {errors.workshopParticipate && (
              <FormHelperText error id="workshopParticipate-helper">
                {errors.workshopParticipate as string}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        {role === 'speaker' && (
          <Grid item xs={12} md={12}>
            <Stack spacing={1.25}>
              <FormControl>
                <FormLabel id="id-radioAllow-label">
                  <b>{transDict.questionSpeaker}* </b>
                </FormLabel>
                <RadioGroup
                  aria-labelledby="radioAllow-label"
                  row
                  name="speakerAllow"
                  value={radioValue}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label={transDict.yes}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label={transDict.no}
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} md={12}>
          <Stack spacing={1.25}>
            <InputLabel htmlFor="suggestions">
              {transDict.suggestions}
            </InputLabel>
            <TextField
              fullWidth
              multiline
              rows={5}
              id="suggestions"
              value={values.suggestions}
              name="suggestions"
              onChange={handleTextChange}
              placeholder="Enter suggestions"
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <Stack mt={2} direction="row" justifyContent="flex-end">
            <Box>
              <Button variant="contained" onClick={handleSubmitClick}>
                {transDict.submit}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedbackForm;
