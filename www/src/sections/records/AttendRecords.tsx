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
import { buildTableColumns } from './utils';
import { useRouter } from 'next/router';
import { strapiReqWithAuth } from 'lib/api';
import { GET_ATTEND_RECORDS } from 'lib/endpoints';
import { Message, reduceMessages, removeAdminMessages } from 'models/message';
import { AttendRecord, reduceAttendRecords } from 'models/record';
import RecordData from './RecordData';

interface TableProps {
  columns: Column[];
  data: [];
  getHeaderProps: (column: HeaderGroup) => {};
  handleRowClick: (row: AttendRecord) => void;
}

const RecordsTable: React.FC<TableProps> = ({
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
        pageIndex: 0,
        pageSize: 100,
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
            const data = row.original as any;
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                key={i}
                onClick={() => handleRowClick(row.original as AttendRecord)}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
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

const AttendRecords = () => {
  const router = useRouter();
  const [resData, setResData] = useState<AttendRecord[]>([]);
  const [selectedRow, setSelectedRow] = useState<AttendRecord | null>(null);

  // use memo to reduce reload
  const columns = useMemo(buildTableColumns, []);

  const handleRowClick = async (row: AttendRecord) => {
    setSelectedRow(row);
  };

  const loadData = async () => {
    const res = await strapiReqWithAuth({
      endpoint: GET_ATTEND_RECORDS,
    });

    const data = reduceAttendRecords(res);

    setResData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MainCard title="Attendance Records" content={false}>
      <RecordsTable
        columns={columns as any}
        handleRowClick={handleRowClick}
        data={resData as any}
        getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
      />

      <Dialog onClose={() => setSelectedRow(null)} open={!!selectedRow}>
        {selectedRow && <RecordData record={selectedRow} />}
      </Dialog>
    </MainCard>
  );
};

export default AttendRecords;
