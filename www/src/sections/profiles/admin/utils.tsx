import { Chip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { UserProfile } from 'models/auth';
import { FileUpload } from 'models/file';
import { ProfileLog } from 'models/profileLog';
import { Cell, Row } from 'react-table';
import { DropzoneFileUpload } from 'types/dropzone';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDate } from 'utils/date';
import axios from 'axios';

const getLogProfileUpdateFields = (log: ProfileLog): any[] => {
  const fields = [];

  if (log.data) {
    for (const field in log.data) {
      const oldVal =
        typeof log.data[field].old !== 'string'
          ? JSON.stringify(log.data[field].old)
          : log.data[field].old;

      const newVal =
        typeof log.data[field].new !== 'string'
          ? JSON.stringify(log.data[field].new)
          : log.data[field].new;

      const row = {
        field: field,
        old: oldVal,
        new: newVal,
      };
      fields.push(row);
    }
  }

  return fields;
};

export const formatProfileLogDetail = (log: ProfileLog): React.ReactElement => {
  if (log && log.data) {
    return (
      <Box minWidth={{ md: 600, xs: 300 }}>
        <Typography paragraph>
          <b>Admin :</b> {`${log.admin.firstName} ${log.admin.lastName}`}
        </Typography>
        <Typography paragraph>
          <b>Date: </b> {formatDate(log.time, 'DD-MM-YYYY')}
        </Typography>
        <Typography paragraph>
          <b>Time: </b> {formatDate(log.time, 'h:mm A')}
        </Typography>
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Updated Field</TableCell>
                <TableCell>Old Value</TableCell>
                <TableCell>New Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getLogProfileUpdateFields(log).map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.field}</TableCell>
                  <TableCell>{row.old}</TableCell>
                  <TableCell>{row.new}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    );
  } else {
  }
  return <Box></Box>;
};

export const buildLogTableColumns = () => [
  {
    Header: 'Time',
    accessor: 'time',
    Cell: ({ row }: Cell<UserProfile>) => {
      const time = row.values.time;
      return <Box>{formatDate(time, 'DD-MM-YYYY h:mm A')}</Box>;
    },
  },

  {
    Header: 'Admin',
    accessor: 'admin',
    Cell: ({ row }: Cell<UserProfile>) => {
      const admin = row.values.admin;
      const name = `${admin.firstName} ${admin.lastName}`;
      return <Box>{name}</Box>;
    },
  },
  {
    Header: 'Last Update',
    accessor: 'updatedAt',
  },
  {
    Header: 'Type',
    accessor: 'type',
    Cell: ({ value }: { value: string }) => {
      switch (value) {
        case 'update':
          return (
            <Chip color="info" label="Update" size="small" variant="light" />
          );
        case 'confirmation':
          return (
            <Chip
              color="success"
              label="Confirmation"
              size="small"
              variant="light"
            />
          );
        case 'update':
        default:
          return (
            <Chip color="info" label="Update" size="small" variant="light" />
          );
      }
    },
  },
];

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const getInitialFile = async (
  filename: string,
  url: string,
): Promise<DropzoneFileUpload> => {
  const blob = await fetch(url, { mode: 'no-cors' }).then((r) => r.blob());
  const file = new File([blob], filename);

  Object.assign(file, {
    preview: URL.createObjectURL(file),
    url: url,
  });

  return { files: [file], error: '' };
};

export const dummyEditorContent = '';

export const abstractKeywordOptions = [
  'Forensic Science',
  'Crime Scene Investigation',
  'Digital Forensics',
  'Forensic Pathology',
  'DNA Analysis',
  'Forensic Psychology',
  'Cybersecurity Forensics',
  'Forensic Anthropology',
  'Forensic Technology',
  'Evidence Collection',
  'Criminalistics',
  'Crime Scene Reconstruction',
  'Forensic Data Analysis',
  'Forensic Genetics',
  'Forensic Accounting',
  'Forensic Entomology',
  'Forensic Photography',
  'Trace Evidence Analysis',
  'Ballistics and Firearms Analysis',
  'Expert Witness Testimony',
  'Legal Aspects of Forensics',
  'Cold Case Investigations',
  'Forensic Laboratory Techniques',
  'Forensic Odontology',
  'Forensic Serology',
  'Forensic Anthropometry',
  'Forensic DNA Profiling',
  'Forensic Digital Imaging',
  'Forensic Ballistics',
  'Forensic Document Examination',
  'Forensic Engineering',
  'Forensic Linguistics',
  'Forensic Podiatry',
  'Forensic Psychiatry',
  'Forensic Radiology',
  'Forensic Nursing',
  'Forensic Medicine',
  'Forensic Toxicology',
  'Forensic Video Analysis',
  'Forensic Art',
];
