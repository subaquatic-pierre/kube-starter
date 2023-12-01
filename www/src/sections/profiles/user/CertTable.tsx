import { useEffect, useMemo, useState } from 'react';
import MainCard from 'components/MainCard';

// material-ui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';

import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  Row,
  HeaderGroup,
  Cell,
} from 'react-table';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// project import
import makeData from 'data/react-table';
import ScrollX from 'components/ScrollX';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import {
  // CSVExport,
  HeaderSort,
  TablePagination,
} from 'components/third-party/ReactTable';
import { ProfileLog, reduceProfileLogs } from 'models/profileLog';
import { buildCertTableCols } from 'utils/certificate';
import { useRouter } from 'next/router';
import { strapiReqWithAuth } from 'lib/api';
import { GET_PROFILE_LOGS } from 'lib/endpoints';
import { CertGenData } from 'lib/certificate';
import { AttendRecord } from 'models/record';
import useAuth from 'hooks/useAuth';

interface ProfileCert {
  type: string;
  url: string;
}

interface DialogProps {
  certData: ProfileCert;
}

const CertDialog: React.FC<DialogProps> = ({ certData }) => {
  return (
    <Box p={2}>
      <Stack>
        {/* Data */}
        <Box>{JSON.stringify(certData)}</Box>
      </Stack>
    </Box>
  );
};

interface TableProps {
  columns: Column[];
  data: [];
  getHeaderProps: (column: HeaderGroup) => {};
  handleRowClick: (row: any) => void;
}

const CertTable: React.FC<TableProps> = ({
  columns,
  data,
  getHeaderProps,
  handleRowClick,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // page,
    prepareRow,
    // gotoPage,
    // setPageSize,
    // state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        // sortBy: [
        //   {
        //     id: 'time',
        //     desc: true,
        //   },
        // ],
        hiddenColumns: ['updatedAt'],
        // pageIndex: 0,
        // pageSize: 25,
      },
    },
    useSortBy,
    // usePagination,
  );

  const sortingRow = rows.slice(0, 9);
  let sortedData = sortingRow.map((d: Row) => d.original);
  Object.keys(sortedData).forEach(
    (key: string) =>
      sortedData[Number(key)] === undefined && delete sortedData[Number(key)],
  );

  return (
    <ScrollX>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, index) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column: HeaderGroup, i: number) => (
                <TableCell
                  {...column.getHeaderProps([
                    { className: column.className },
                    getHeaderProps(column),
                  ])}
                  key={i}
                >
                  <HeaderSort column={column} sort />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                key={i}
                onClick={() => handleRowClick(row.original)}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                {row.cells.map((cell: Cell, index) => (
                  <TableCell
                    {...cell.getCellProps([
                      { className: cell.column.className },
                    ])}
                    key={index}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {/* <TableRow>
            <TableCell sx={{ p: 2 }} colSpan={7}>
              <TablePagination
                gotoPage={gotoPage}
                rows={rows}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
            </TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </ScrollX>
  );
};

export default CertTable;
