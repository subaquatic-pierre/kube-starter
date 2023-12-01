import axios from 'axios';
import { UPLOAD } from './endpoints';
import { DashboardApiResponse } from 'types/api';
import { CustomFile, DropzoneFileUpload, FormFiles } from 'types/dropzone';
import { FileUpload } from 'models/file';

export const uploadFile = async (
  filename: string,
  profileId: string,
  file: File,
) => {
  if (file.size === 0) {
    return { error: { message: 'File size must be larger than 0 bytes' } };
  }

  try {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    formData.append('userId', profileId);

    const res = await axios.request<any, DashboardApiResponse>({
      method: 'POST',
      url: UPLOAD,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (e: any) {
    return {
      error: { message: `${e}` },
    };
  }
};

export const uploadFormFiles = async (
  files: FormFiles,
  profileId: string,
  firstName: string,
  lastName: string,
): Promise<{ [key: string]: { filename: string; url: string } }> => {
  const res = {};

  for (const field in files) {
    if (files[field] && files[field].files && files[field].files.length > 0) {
      const file = files[field].files[0];

      const ext = file.name.split('.')[1];

      let url = file.url;

      if (file.size > 0) {
        const uploadRes = await uploadFile(file.name, profileId, file);

        if (uploadRes.error) {
          throw new Error(uploadRes.error.message);
        }

        url = uploadRes.data.url;
      }

      res[field] = {
        filename: file.name,
        url: url,
      };
    }
  }
  return res;
};
export const uploadMultipleFiles = async (
  files: CustomFile[],
  profileId: string,
): Promise<FileUpload[]> => {
  const res: FileUpload[] = [];

  if (files) {
    for (const file of files) {
      if (file.size > 0) {
        const uploadRes = await uploadFile(file.name, profileId, file);

        file.url = uploadRes.data.url;

        if (uploadRes.error) {
          throw new Error(uploadRes.error.message);
        }
      }

      res.push({
        filename: file.name,
        url: file.url,
      });
    }
  }
  return res;
};
