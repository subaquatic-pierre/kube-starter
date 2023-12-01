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
import { buildLogTableColumns, formatProfileLogDetail } from './utils';
import { useRouter } from 'next/router';
import { strapiReqWithAuth } from 'lib/api';
import { GET_PROFILE_LOGS } from 'lib/endpoints';

const dummyData = {
  date: new Date(),
  data: {
    confirmed: true,
    speaker: false,
  },
  admin: { username: 'Cool admin' },
  profile: { username: 'ProfileUpdatedName' },
} as any;

interface TableProps {
  columns: Column[];
  data: [];
  getHeaderProps: (column: HeaderGroup) => {};
  handleRowClick: (row: ProfileLog) => void;
}

const LogsTable: React.FC<TableProps> = ({
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
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'time',
            desc: true,
          },
        ],
        hiddenColumns: ['updatedAt'],
        pageIndex: 0,
        pageSize: 25,
      },
    },
    useSortBy,
    usePagination,
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
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                key={i}
                onClick={() => handleRowClick(row.original as ProfileLog)}
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
          <TableRow>
            <TableCell sx={{ p: 2 }} colSpan={7}>
              <TablePagination
                gotoPage={gotoPage}
                rows={rows}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollX>
  );
};

const AdminTabLogs = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const [resData, setResData] = useState<ProfileLog[]>([]);

  // use memo to reduce reload
  const columns = useMemo(buildLogTableColumns, []);

  const [selectedRow, setSelectedRow] = useState<ProfileLog | null>(null);

  const handleRowClick = (row: ProfileLog) => {
    setSelectedRow(row);
  };

  const loadData = async () => {
    if (profileId && profileId !== 'new') {
      const res = await strapiReqWithAuth({
        endpoint: GET_PROFILE_LOGS(`${profileId}`),
      });

      const data = reduceProfileLogs(res);
      setResData(data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MainCard title="Logs" content={false}>
      <LogsTable
        columns={columns as any}
        handleRowClick={handleRowClick}
        data={resData as any}
        getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
      />

      {/* Dialog Detail */}

      <Dialog onClose={() => setSelectedRow(null)} open={!!selectedRow}>
        <DialogTitle>Log Detail</DialogTitle>
        <Divider />
        <Box p={2}>
          <Stack>
            {/* Data */}
            <Box>{formatProfileLogDetail(selectedRow)}</Box>
          </Stack>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default AdminTabLogs;
