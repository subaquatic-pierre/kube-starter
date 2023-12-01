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
import { buildNotificationTableColumns, getNotificationChip } from './utils';
import { useRouter } from 'next/router';
import { strapiReqWithAuth } from 'lib/api';
import { GET_NOTIFICATIONS, UPDATE_NOTIFICATION } from 'lib/endpoints';
import { Notification, reduceNotifications } from 'models/notification';
import Link from 'next/link';

interface NotificationDetailProps {
  item: Notification;
}
export const NotificationDetail: React.FC<NotificationDetailProps> = ({
  item,
}): React.ReactElement => {
  if (item && item.data) {
    return (
      <Box minWidth={{ md: 600, xs: 300 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {item.fromUser && (
                  <>
                    {item.fromUser.firstName} {item.fromUser.lastName}
                  </>
                )}
              </TableCell>
              <TableCell>{getNotificationChip(item.type)}</TableCell>
              <TableCell>
                {item.fromUser.user.role && (
                  <Link
                    href={`/admin/${
                      item.fromUser.user.role.type === 'visitor'
                        ? 'visitors'
                        : 'speakers'
                    }/${item.fromUser.id}/personal`}
                  >
                    <Button variant="contained" color="primary">
                      View Profile
                    </Button>
                  </Link>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  } else {
  }
  return <Box></Box>;
};

interface TableProps {
  columns: Column[];
  data: [];
  getHeaderProps: (column: HeaderGroup) => {};
  handleRowClick: (row: Notification) => void;
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
            const data = row.original as any;
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                key={i}
                onClick={() => handleRowClick(row.original as Notification)}
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
                    sx={{
                      fontWeight: data.toUserRead ? 400 : 700,
                    }}
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

const DashNotifications = () => {
  const router = useRouter();
  const [resData, setResData] = useState<Notification[]>([]);

  // use memo to reduce reload
  const columns = useMemo(buildNotificationTableColumns, []);

  const [selectedRow, setSelectedRow] = useState<Notification | null>(null);

  const handleMarkAsRead = async (id: number) => {
    const res = await strapiReqWithAuth({
      endpoint: UPDATE_NOTIFICATION(`${id}`),
      data: { data: { toUserRead: true, fromUserRead: true } },
      method: 'PUT',
    });
  };

  const handleRowClick = async (row: Notification) => {
    await handleMarkAsRead(row.id);
    setSelectedRow(row);
    await loadData();
  };

  const loadData = async () => {
    const res = await strapiReqWithAuth({
      endpoint: GET_NOTIFICATIONS,
    });

    const data = reduceNotifications(res);

    setResData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MainCard title="Notifications" content={false}>
      <LogsTable
        columns={columns as any}
        handleRowClick={handleRowClick}
        data={resData as any}
        getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
      />

      {/* Dialog Detail */}

      <Dialog onClose={() => setSelectedRow(null)} open={!!selectedRow}>
        <DialogTitle>Notification Detail</DialogTitle>
        <Divider />
        <NotificationDetail item={selectedRow} />
      </Dialog>
    </MainCard>
  );
};

export default DashNotifications;
