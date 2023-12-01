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
import { buildMessageTableColumns } from './utils';
import { useRouter } from 'next/router';
import { strapiReqWithAuth } from 'lib/api';
import {
  GET_MESSAGES,
  GET_NOTIFICATIONS,
  UPDATE_MESSAGE,
  UPDATE_NOTIFICATION,
} from 'lib/endpoints';
import { Message, reduceMessages, removeAdminMessages } from 'models/message';

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
  handleRowClick: (row: Message) => void;
}

const MessagesTable: React.FC<TableProps> = ({
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
                onClick={() => handleRowClick(row.original as Message)}
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

const DashMessages = () => {
  const router = useRouter();
  const [resData, setResData] = useState<Message[]>([]);

  // use memo to reduce reload
  const columns = useMemo(buildMessageTableColumns, []);

  const handleMarkAsRead = async (id: number) => {
    const res = await strapiReqWithAuth({
      endpoint: UPDATE_MESSAGE(`${id}`),
      data: { data: { toUserRead: true, fromUserRead: true } },
      method: 'PUT',
    });
  };

  const handleRowClick = async (row: Message) => {
    await handleMarkAsRead(row.id);
    router.push({
      pathname: '/admin/messages',
      query: { userId: row.fromUser.id },
    });
    await loadData();
  };

  const loadData = async () => {
    const res = await strapiReqWithAuth({
      endpoint: GET_MESSAGES,
    });

    const data = reduceMessages(res);
    const msgs = removeAdminMessages(data);

    // const filtered = data.filter((el) => el.fromUser.id !== 10);

    setResData(msgs);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <MainCard title="Messages" content={false}>
      <MessagesTable
        columns={columns as any}
        handleRowClick={handleRowClick}
        data={resData as any}
        getHeaderProps={(column: HeaderGroup) => column.getSortByToggleProps()}
      />
    </MainCard>
  );
};

export default DashMessages;
