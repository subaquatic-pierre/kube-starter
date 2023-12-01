// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, CardMedia, Stack } from '@mui/material';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import RejectionFiles from './RejectionFiles';
import PlaceholderContent from './PlaceholderContent';

// types
import { CustomFile, UploadProps } from 'types/dropzone';
import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import { basePath } from 'utils/const';
import Image from 'next/image';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

const SingleFileUpload = ({
  error,
  file,
  setFieldValue,
  sx,
  title,
  fileType = 'image',
  fileTypes = {},
  maxSize = 209715200,
  document = false,
  noRemove = false,
  id,
  ...other
}: UploadProps) => {
  const theme = useTheme();
  const _fileType = `${fileType}/*`;

  const getPreviewUrl = (file: CustomFile) => {
    try {
      return URL.createObjectURL(file);
    } catch (e) {
      console.log('There was an error getting preview URL for file');
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: {
      [_fileType]: [],
      ...fileTypes,
    },
    maxSize: maxSize,
    multiple: false,
    onDrop: (acceptedFiles: CustomFile[]) => {
      setFieldValue(
        id ?? 'files',
        acceptedFiles.map((file: CustomFile) =>
          Object.assign(file, {
            preview: getPreviewUrl(file),
          }),
        ),
      );
    },
  });

  const thumbs = () => {
    // TODO: fix thumbnail to only show filename if not image

    const imageThumb =
      file &&
      file.map((item: CustomFile, i) => {
        return (
          <Box
            position="relative"
            key={i}
            sx={{
              top: 8,
              left: 8,
              borderRadius: 2,
              position: 'absolute',
              width: 'calc(100% - 16px)',
              height: 'calc(100% - 16px)',
              objectFit: 'contain',
              background: theme.palette.background.paper,
            }}
          >
            <Image
              sizes={'md'}
              fill
              alt="image"
              // component="img"
              src={item.url ?? item.preview}
              style={{ objectFit: 'contain' }}
              onLoad={() => {
                URL.revokeObjectURL(item.preview!);
              }}
            />
          </Box>
        );
      });

    if (file && Object.keys(fileTypes).length > 0 && file.length > 0) {
      return file.map((item: CustomFile, i) => (
        <CardMedia
          key={i}
          component="img"
          src={`${basePath}/images/avatar-group.png`}
          sx={{
            top: 8,
            left: 8,
            borderRadius: 2,
            position: 'absolute',
            width: 'calc(100% - 16px)',
            height: 'calc(100% - 16px)',
            background: theme.palette.background.paper,
          }}
          onLoad={() => {
            URL.revokeObjectURL(item.preview!);
          }}
        />
      ));
    }

    if (_fileType === 'image/*') {
      return imageThumb;
    }
  };

  const onRemove = () => {
    setFieldValue(id ?? 'files', null);
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(file && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />
        <PlaceholderContent
          bgImage={file && file.length > 0 ? false : true}
          title={title}
          document={
            document && file && file.length > 0 ? file[0].name : undefined
          }
        />
        {!document && thumbs()}
      </DropzoneWrapper>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {file && file.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          {/* {file[0] && file[0].preview && (
            <Button
              variant="contained"
              color="info"
              sx={{ mr: 2 }}
              target="_blank"
              // onClick={handleViewClick}
              href={file[0] && file[0].preview ? file[0].preview : ''}
            >
              View
            </Button>
          )} */}
          {file[0] && file[0].url && (
            <Button
              variant="contained"
              download
              size="small"
              color="primary"
              sx={{ mr: 2 }}
              href={file[0] && file[0].url ? file[0].url : ''}
            >
              Download
            </Button>
          )}

          {!noRemove && (
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={onRemove}
            >
              Remove
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default SingleFileUpload;
