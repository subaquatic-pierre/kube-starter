// material-ui
import { CameraOutlined, FileFilled } from '@ant-design/icons';
import { Typography, Stack, CardMedia, Box } from '@mui/material';
import Image from 'next/image';

// assets
import { DropzopType } from 'types/dropzone';
import { basePath } from 'utils/const';

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

interface Props {
  type?: string;
  title?: string;
  bgImage?: boolean;
  document?: string;
}

export default function PlaceholderContent({
  type,
  title,
  bgImage = true,
  document,
}: Props) {
  if (document) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        direction={{ xs: 'column', md: 'row' }}
        sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
      >
        <Stack direction="row" alignItems="center">
          <FileFilled
            style={{
              width: '30px',
              height: '30px',
              fontSize: '1.15rem',
              marginRight: 4,
            }}
          />
          <Typography>{document}</Typography>
        </Stack>
      </Stack>
    );
  }
  return (
    <>
      {type !== DropzopType.standard && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <Box sx={{ ml: 1 }} position="relative" height={150} width={150}>
            {bgImage && (
              <Image
                fill
                src={`${basePath}/assets/images/upload/upload.svg`}
                alt="upload palceholder"
              />
            )}
          </Box>
          {/* <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} /> */}
          <Stack sx={{ p: 3 }} spacing={1}>
            {title ? (
              <Typography variant="h5">{title}</Typography>
            ) : (
              <Typography variant="h5">Drag & Drop or Select file</Typography>
            )}

            <Typography color="secondary">
              Drop files here or click&nbsp;
              <Typography
                component="span"
                color="primary"
                sx={{ textDecoration: 'underline' }}
              >
                browse
              </Typography>
              &nbsp;through your machine
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === DropzopType.standard && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <CameraOutlined style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}
