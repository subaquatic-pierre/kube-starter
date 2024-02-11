import { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';

// next
import Image from 'next/legacy/image';

// material-ui
import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactQuillEditor from 'components/ReactQuillEditor';

import MainCard from 'components/MainCard';

// assets
import { ThemeDirection, ThemeMode } from 'types/config';

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const DraftTextEditor: React.FC<Props> = ({ content, setContent }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        '& .quill': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50',
          borderRadius: '4px',
          '& .ql-toolbar': {
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.light' : 'grey.100',
            borderColor: theme.palette.divider,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          },
          '& .ql-container': {
            borderColor: `${theme.palette.divider} !important`,
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            '& .ql-editor': {
              minHeight: 200
            }
          },
          ...(theme.direction === ThemeDirection.RTL && {
            '& .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg': {
              right: '0%',
              left: 'inherit'
            }
          })
        }
      }}
    >
      <ReactQuillEditor content={content} setContent={setContent} />
    </Box>
  );
};

export default DraftTextEditor;
