import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

interface Props {
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  termsError: string;
  setTermsError: React.Dispatch<React.SetStateAction<string>>;
}

const TermCheckbox: React.FC<Props> = ({
  values,
  setValues,
  termsError,
  setTermsError,
}) => {
  const handleCheckClick = (value: string) => {
    setTermsError('');
    const currentIndex = values.indexOf(value);
    const newChecked = [...values];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setValues(newChecked);
  };

  return (
    <Stack spacing={2} maxWidth={800}>
      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.indexOf('confirmTrueTerm') !== -1}
              onChange={() => handleCheckClick('confirmTrueTerm')}
              name="checked"
              color="primary"
              size="small"
            />
          }
          label={
            <Typography variant="h6">
              Confirm the information provided is true{' '}
            </Typography>
          }
        />
        <Typography variant="caption" color="text.disabled">
          By checking this box, I hereby certify that all information provided
          is accurate and complete to the best of my knowledge, and I understand
          that providing false information may result in penalties or
          disqualification. I guarantee the veracity of the data submitted in
          this registration form.
        </Typography>
      </Stack>
      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.indexOf('allowSocialMediaTerm') !== -1}
              onChange={() => handleCheckClick('allowSocialMediaTerm')}
              name="checked"
              color="primary"
              size="small"
            />
          }
          label={
            <Typography variant="h6">
              Allow use of video in the social media an advertising
            </Typography>
          }
        />
        <Typography variant="caption" color="text.disabled">
          By checking this box, I agree and understand that the video I provided
          can be used on social media and other platforms to promote the event.
          I grant permission for its unrestricted use for publicity,
          advertising, or any other lawful purpose.
        </Typography>
      </Stack>
      {termsError && (
        <FormHelperText error id="terms-error">
          {termsError}
        </FormHelperText>
      )}
    </Stack>
  );
};

export default TermCheckbox;
