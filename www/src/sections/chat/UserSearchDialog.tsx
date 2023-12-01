import { Fragment, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Divider,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';

// third-party
import { Chance } from 'chance';

// project imports
import UserAvatar from './UserAvatar';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { addUser } from 'store/reducers/chat';
import { dispatch } from 'store';

// assets
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { GET_USERS } from 'lib/endpoints';

// types
import { KeyedObject } from 'types/root';
import { UserProfile, reduceProfile } from 'models/auth';
import { chatContactUser } from 'utils/blankData';
import { strapiReqWithAuth } from 'lib/api';

interface UserListProps {
  setUser: (u: UserProfile) => void;
  open: boolean;
  setOpen: (val) => void;
  closeDrawer: () => void;
}

function UserSearchDialog({
  setUser,
  open,
  setOpen,
  closeDrawer,
}: UserListProps) {
  const theme = useTheme();

  const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
  const [orgData, setOrgData] = useState<UserProfile[]>([]);
  const [data, setData] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');

  const handleSearch = async (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | undefined,
  ) => {
    const newString = event?.target.value;
    setSearch(newString);
  };

  const handleUserClick = async (user: UserProfile) => {
    // dispatch add user to chat state
    await dispatch(addUser(user));

    // set active user
    setUser(user);

    // close dialog
    setOpen(false);

    if (matchDownSM) {
      closeDrawer();
    }
  };

  const handleFetchUsers = async () => {
    try {
      const res = await strapiReqWithAuth<{ data: [] }>({
        endpoint: GET_USERS,
        method: 'GET',
      });

      const profiles: UserProfile[] = [];
      for (const data of res.data.data) {
        const profile = reduceProfile(data);
        if (profile) {
          profiles.push(profile);
        }
      }
      setData(profiles);
      setOrgData(profiles);
    } catch (e) {
      console.log('There was en error fetching users');
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  useEffect(() => {
    if (search) {
      const results = data.filter((row: KeyedObject) => {
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
      setData(orgData);
    }
    // eslint-disable-next-line
  }, [search]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Select User</DialogTitle>
      <DialogContent
        sx={{ height: { md: 1000, xs: 600 }, width: { xs: 300, md: 500 } }}
      >
        <List component="nav">
          {/* Search input */}
          <OutlinedInput
            fullWidth
            id="input-search-header"
            placeholder="Search"
            value={search}
            onChange={handleSearch}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: '10.5px 0px 12px',
                color: 'darkgray',
              },
              mb: 2,
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlined style={{ fontSize: 'small' }} />
              </InputAdornment>
            }
          />
          {data.map((user) => (
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
                      <Typography
                        component="span"
                        color="textSecondary"
                        variant="caption"
                      >
                        {/* {user.lastMessage} */}
                      </Typography>
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
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
            </Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default UserSearchDialog;
