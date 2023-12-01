import React from 'react';

import { Box, Stack, Typography, Button } from '@mui/material';

// third party
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FormattedMessage } from 'react-intl';
import useConfig from 'hooks/useConfig';
import getDictionary from 'locales';

// ============================|| AWS CONNITO - LOGIN ||============================ //

interface Props {
  handleChange: (value: any) => void;
  value: string;
}

const AuthVisitorSpeaker: React.FC<Props> = ({ handleChange, value }) => {

  const { i18n } = useConfig();
  const dict = getDictionary(i18n);

  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        '& .MuiToggleButton-root': {
          fontSize: { md: '2.4rem', xs: '2rem' },
          p: { md: 3, xs: 2 },
        },
        '& button': {
          p: 2,
          fontSize: '1.2rem',
          textTransform: 'none',
        },
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h4" textAlign="center">
          {dict.selectRegistrationType}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            size="large"
            variant="contained"
            color="info"
            onClick={() => handleChange('visitor')}
          >
            {dict.registerVisitor}
          </Button>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => handleChange('speaker')}
          >
            {dict.registerSpeaker}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AuthVisitorSpeaker;
