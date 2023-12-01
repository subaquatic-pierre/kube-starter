import { Fragment, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useRadioGroup,
} from '@mui/material';

// third-party
import { Chance } from 'chance';

// project imports
import UserAvatar from './UserAvatar';
import Dot from 'components/@extended/Dot';
import { useDispatch, useSelector } from 'store';
import { getUsers } from 'store/reducers/chat';

// assets
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';

// types
import { KeyedObject } from 'types/root';
import { UserProfile } from 'models/auth';
import { chatContactUser } from 'utils/blankData';
import dayjs from 'dayjs';
import { Box } from '@mui/system';
import Link from 'next/link';

const chance = new Chance();

interface UserListProps {
  setUser: (u: UserProfile) => void;
  search?: string;
  fetchUsers: boolean;
  closeDrawer: () => void;
}

function UserList({ setUser, search, fetchUsers, closeDrawer }: UserListProps) {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  const dispatch = useDispatch();
  const [data, setData] = useState<UserProfile[]>([]);
  const { users } = useSelector((state) => state.chat);
  // const users = [];

  const handleFetchUsers = async () => {
    if (fetchUsers) {
      await dispatch(getUsers());
    }
  };

  useEffect(() => {
    handleFetchUsers();

    // TODO: set interval
    // const id = setInterval(() => {
    //   handleFetchUsers();
    // }, 5000);

    // return () => {
    //   clearInterval(id);
    // };
  }, []);

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    if (search) {
      const results = users.filter((row: KeyedObject) => {
        let matches = true;

        const properties: string[] = ['firstName', 'email', 'lastName'];
        let containsQuery = false;

        properties.forEach((property) => {
          if (
            row[property] &&
            row[property]
              .toString()
              .toLowerCase()
              .includes(search.toString().toLowerCase())
          ) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
        return matches;
      });

      setData(results);
    } else {
      setData(users);
    }
    // eslint-disable-next-line
  }, [search]);

  const handleUserClick = (user: UserProfile) => {
    setUser(user);
    if (matchDownLG) {
      closeDrawer();
    }
  };

  return (
    <List component="nav">
      {[...data]
        .sort((a, b) =>
          b.lastMessageTime
            ? b.lastMessageTime?.getTime() - a.lastMessageTime?.getTime()
            : 0,
        )
        .map((user) => (
          <Fragment key={user.id}>
            <ListItemButton
              sx={{ pl: 1 }}
              onClick={() => {
                handleUserClick(user);
              }}
            >
              <ListItemAvatar>
                <UserAvatar user={user} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack
                    component="span"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography
                      variant="h5"
                      color="inherit"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Box
                      component="span"
                      color="textSecondary"
                      // variant="caption"
                      sx={{
                        '& a': {
                          all: 'unset',
                        },
                      }}
                    >
                      {user.id !== 0 && (
                        <Link
                          href={`/admin/${
                            user.user.role.type === 'visitor'
                              ? 'visitors'
                              : 'speakers'
                          }/${user.id}/personal`}
                        >
                          <EyeOutlined />
                        </Link>
                      )}
                    </Box>
                  </Stack>
                }
                secondary={
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {user.email}
                    <br />
                    {user.lastMessageTime &&
                      dayjs(user.lastMessageTime).format('DD-MM-YYYY h:mm A')}
                  </Typography>
                }
              />
            </ListItemButton>
            <Divider />
          </Fragment>
        ))}
    </List>
  );
}

export default UserList;
