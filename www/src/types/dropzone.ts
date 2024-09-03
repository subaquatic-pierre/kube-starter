// material-ui
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material';

//third-party
import { DropzoneOptions } from 'react-dropzone';

// ==============================|| TYPES - DROPZONE  ||============================== //

export enum DropzopType {
  default = 'DEFAULT',
  standard = 'STANDARD'
}

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
  url?: string;
}

export interface UploadProps extends DropzoneOptions {
  title?: string;
  id?: string;
  document?: boolean;
  fileType?: string;
  fileTypes?: { [key: string]: string[] };
  maxSize?: number | undefined;
  error?: boolean;
  file: CustomFile[] | null;
  setFieldValue: (field: string, value: any) => void;
  sx?: SxProps<Theme>;
  noRemove?: boolean;
}

export interface UploadMultiFileProps extends DropzoneOptions {
  files?: CustomFile[] | null;
  error?: boolean;
  showList?: boolean;
  type?: DropzopType;
  sx?: SxProps<Theme>;
  onUpload?: VoidFunction;
  onRemove?: (file: File | string) => void;
  onRemoveAll?: VoidFunction;
  setFieldValue: (field: string, value: any) => void;
}

export interface FilePreviewProps {
  showList?: boolean;
  type?: DropzopType;
  files: (CustomFile | string)[];
  onRemove?: (file: File | string) => void;
}

export interface DropzoneFileUpload {
  files: CustomFile[];
  error: string;
}

export interface FormFiles {
  [key: string]: DropzoneFileUpload;
}
