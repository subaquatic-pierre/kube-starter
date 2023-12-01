import { useState, ChangeEvent, SyntheticEvent, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// next
import Image from 'next/legacy/image';

// material-ui
import {
  Box,
  Button,
  CardHeader,
  Divider,
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
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import DraftTextEditor from 'components/DraftTextEditor';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import MainCard from 'components/MainCard';

// assets
import { ThemeDirection, ThemeMode } from 'types/config';
import {
  dummyEditorContent,
  abstractKeywordOptions,
  getInitialFile,
} from './utils';
import { UserProfile } from 'models/auth';
import { CustomFile, DropzoneFileUpload, FormFiles } from 'types/dropzone';
import { Abstract } from 'models/abstract';
import SingleFileUpload from 'components/Dropzone/SingleFile';
import { strapiReqWithAuth } from 'lib/api';
import {
  CREATE_ABSTRACT,
  UPDATE_ABSTRACT,
  UPDATE_PROFILE,
} from 'lib/endpoints';
import { useRouter } from 'next/router';
import { uploadFormFiles, uploadMultipleFiles } from 'lib/upload';
import Loader from 'components/Loader';
import MultiFileUpload from 'components/Dropzone/MultiFile';
// types

// ==============================|| TAB - PAYMENT ||============================== //

interface FormData {
  [name: string]: {
    value: string | string[];
    touched: boolean;
    error: string;
  };
}

const blankData: FormData = {
  title: {
    value: '',
    touched: false,
    error: '',
  },
  keywords: {
    value: '',
    touched: false,
    error: '',
  },
};

const emptyFiles: FormFiles = {
  video: {
    files: [],
    error: '',
  },
  document: {
    files: [],
    error: '',
  },
};

const emptyMultiFiles: CustomFile[] = [];

interface Props {
  profile: Partial<UserProfile>;
}

const AdminTabAbstract: React.FC<Props> = ({ profile }) => {
  const [multiFiles, setMultiFiles] = useState<CustomFile[]>(emptyMultiFiles);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { visitorSpeaker, profileId } = router.query;
  const isNewUser = profileId === 'new' || profileId === undefined;

  const [data, setData] = useState(blankData);
  const [files, setFiles] = useState<FormFiles>(emptyFiles);
  const theme = useTheme();
  const [content, setContent] = useState(dummyEditorContent);

  const handleInputChange = (e: any) => {
    const key = e.target.name;

    const fieldErrorName =
      e.target.name[0].toUpperCase() + e.target.name.slice(1);

    if (e.target.value === '') {
      setData((old) => ({
        ...old,
        [key]: {
          value: e.target.value,
          error: `${fieldErrorName} is required`,
          touched: true,
        },
      }));
      return;
    }

    setData((old) => ({
      ...old,
      [key]: {
        value: e.target.value,
      },
    }));
  };

  const loadInitialFiles = async (profile: Partial<UserProfile>) => {
    const files = { ...emptyFiles };

    if (profile.abstract && !isNewUser) {
      if (profile.abstract.video) {
        files.video = await getInitialFile(
          profile.abstract.video.filename,
          profile.abstract.video.url,
        );
      }

      if (profile.abstract.document) {
        files.document = await getInitialFile(
          profile.abstract.document.filename,
          profile.abstract.document.url,
        );
      }

      if (profile.abstract.documents) {
        const files = [];
        for (const doc of profile.abstract.documents) {
          const file = await getInitialFile(doc.filename, doc.url);
          if (file.files.length === 1) {
            files.push(file.files[0]);
          }
        }

        setMultiFiles(files);
      }

      setFiles(files);
    }
  };

  const handleFileUpload = (field: string, value: any) => {
    setFiles((old) => ({ ...old, [field]: { files: value, error: '' } }));
  };

  const handleMultipleFileUploads = (field: string, files: CustomFile[]) => {
    setMultiFiles(files);
  };

  const handleSubmit = async () => {
    // check if abstract exists
    const { abstract } = profile;
    setLoading(true);

    // update abstract
    try {
      const res = await uploadFormFiles(
        files,
        profileId as string,
        profile.firstName,
        profile.lastName,
      );

      const multiDocsRes = await uploadMultipleFiles(
        multiFiles,
        `${profile.id}`,
      );

      const abstractData = {
        profile: profileId,
        title: data.title.value,
        keywords: data.keywords.value,
        content: content,
        video: res.video ?? null,
        document: res.document ?? null,
        documents: multiDocsRes,
      };

      await strapiReqWithAuth({
        endpoint: abstract
          ? UPDATE_ABSTRACT(`${abstract.id}`)
          : CREATE_ABSTRACT,
        method: abstract ? 'PUT' : 'POST',
        data: { data: abstractData },
      });

      dispatch(
        openSnackbar({
          open: true,
          message: 'Abstract updated successfully.',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        }),
      );
    } catch (e: any) {
      console.log(e);

      dispatch(
        openSnackbar({
          open: true,
          message: `There was an error updating abstract, please check errors`,
          variant: 'alert',
          alert: {
            color: 'error',
          },
          close: false,
        }),
      );
    } finally {
      router.push(`/admin/${visitorSpeaker}/${profileId}/abstract`);

      setLoading(false);
    }
  };

  const loadInitialData = (profile: Partial<UserProfile>) => {
    loadInitialFiles(profile);
    if (profile.abstract) {
      setData((old) => ({
        title: {
          ...old.title,
          value: profile.abstract.title,
        },
        keywords: {
          ...old.keywords,
          value: profile.abstract.keywords,
        },
      }));
      setContent(profile.abstract.content);
    }
  };

  useEffect(() => {
    loadInitialData(profile);
  }, [profile]);

  if (loading) return <Loader />;

  return (
    <MainCard title="Abstract" content={false}>
      {/* Inputs */}
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="abstract-title">Title</InputLabel>
              <TextField
                fullWidth
                disabled={isNewUser}
                id="abstract-title"
                value={data.title.value}
                name="title"
                onBlur={handleInputChange}
                onChange={handleInputChange}
                placeholder="Title"
              />
              {data.title.touched && data.title.error && (
                <FormHelperText error id="personal-institution-helper">
                  {data.title.error}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="abstract-keywords">Keywords</InputLabel>
              <TextField
                fullWidth
                disabled={isNewUser}
                id="abstract-keywords"
                value={data.keywords.value}
                name="keywords"
                onBlur={handleInputChange}
                onChange={handleInputChange}
                placeholder="Keywords"
              />
              {data.keywords.touched && data.keywords.error && (
                <FormHelperText error id="personal-keywords-helper">
                  {data.keywords.error}
                </FormHelperText>
              )}
              {/* <Autocomplete
                disabled={isNewUser}
                multiple
                fullWidth
                value={keywords}
                onChange={(event: any, newValue: any | null) => {
                  setKeywords(newValue.map((option) => option));
                }}
                isOptionEqualToValue={(option, value) => {
                  return option === value;
                }}
                getOptionLabel={(option) => {
                  return option;
                }}
                id="abstract-keywords"
                options={abstractKeywordOptions}
                renderInput={(params) => (
                  <TextField placeholder="Keywords" {...params} />
                )}
              /> */}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Content */}
      <CardHeader title="Content" />
      <Divider />
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          {/* User Id Input */}
          <Grid item md={12}>
            <DraftTextEditor content={content} setContent={setContent} />
          </Grid>
        </Grid>
      </Box>

      {/* Attachments */}
      <CardHeader title="Attachments" />
      <Divider />
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={3}>
          {/* Video Upload upload */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="video-doc">Main Abstract Video</InputLabel>
              <SingleFileUpload
                id="video"
                setFieldValue={handleFileUpload}
                title="Upload Video"
                file={files.video.files}
                fileType="video"
                document
                error={!!files.video.error}
              />
              {files.video && files.video.error && (
                <FormHelperText error id="video-helper-text">
                  {files.video.error as string}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Document Upload */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="abstract-document">
                Main Abstract Document
              </InputLabel>
              <SingleFileUpload
                id="document"
                setFieldValue={handleFileUpload}
                title="Upload Document"
                file={files.document.files}
                // fileType="image"
                document
                fileTypes={{
                  'text/*': ['.txt'],
                  'application/msword': [
                    '.doc',
                    '.docx',
                    '.pdf',
                    '.ppt',
                    '.pptx',
                  ],
                }}
                error={!!files.document.error}
              />
              {files.document && files.document.error && (
                <FormHelperText error id="abstract-document-helper-text">
                  {files.document.error as string}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Multiple File upload */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1.25}>
              <InputLabel htmlFor="video-doc">Additional Documents</InputLabel>
              <MultiFileUpload
                setFieldValue={handleMultipleFileUploads}
                files={multiFiles}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Submit Buttons */}
      <Box sx={{ p: 2.5 }}>
        {isNewUser && (
          <Box>
            <Typography textAlign="end" color="text.disabled">
              *User needs to be created before editing abstract.
            </Typography>
          </Box>
        )}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2.5 }}
        >
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isNewUser}
            type="submit"
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
};

export default AdminTabAbstract;
