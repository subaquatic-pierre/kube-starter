import { useCallback, useEffect, useRef, useState } from 'react';

// material-ui
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Theme,
  Typography,
} from '@mui/material';

// project imports
import UserAvatar from './UserAvatar';
import ChatMessageAction from './ChatMessageAction';
import IconButton from 'components/@extended/IconButton';

// assets
import { EditOutlined } from '@ant-design/icons';

// types
import { ThemeMode } from 'types/config';
import { UserProfile } from 'models/auth';
import { ChatHistory as IChatHistory } from 'types/chat';
import useAuth from 'hooks/useAuth';
import { generateRejectTemplate } from 'utils/blankData';
import Loader from 'components/Loader';

// ==============================|| CHAT MESSAGE HISTORY ||============================== //

interface ChatHistoryProps {
  data: IChatHistory[];
  theme: Theme;
  user: UserProfile;
}

const ChatHistory = ({ data, theme, user }: ChatHistoryProps) => {
  const { profile: admin } = useAuth();
  // scroll to bottom when new message is sent or received
  const wrapper = useRef(document.createElement('div'));
  const el = wrapper.current;
  const scrollToBottom = useCallback(() => {
    el.scrollIntoView(false);
  }, [el]);

  useEffect(() => {
    scrollToBottom();
  }, [data.length, scrollToBottom]);

  return (
    <Grid container spacing={2.5} ref={wrapper}>
      {data.map((history, index) => (
        <Grid item xs={12} key={index}>
          {history.toId !== user.id ? (
            <Stack spacing={1.25} direction="row">
              <Grid container spacing={1} justifyContent="flex-end">
                <Grid item xs={2} md={3} xl={4} />

                <Grid item xs={10} md={9} xl={8}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                  >
                    {/* <ChatMessageAction index={index} /> */}
                    {/* <IconButton size="small" color="secondary">
                      <EditOutlined />
                    </IconButton> */}
                    <Card
                      sx={{
                        display: 'inline-block',
                        float: 'right',
                        bgcolor: theme.palette.primary.main,
                        boxShadow: 'none',
                        ml: 1,
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 1,
                          pb: '8px !important',
                          width: 'fit-content',
                          ml: 'auto',
                        }}
                      >
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              color={theme.palette.grey[0]}
                              sx={{ overflowWrap: 'anywhere' }}
                            >
                              {history.text}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    align="right"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {/* {history.from} */}
                  </Typography>
                  <Typography
                    align="right"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {history.time}
                  </Typography>
                </Grid>
              </Grid>
              <UserAvatar user={user} />
            </Stack>
          ) : (
            <Stack direction="row" spacing={1.25} alignItems="flext-start">
              <UserAvatar user={admin} />

              <Grid container>
                <Grid item xs={12} sm={7}>
                  <Card
                    sx={{
                      display: 'inline-block',
                      float: 'left',
                      bgcolor:
                        theme.palette.mode === ThemeMode.DARK
                          ? 'background.background'
                          : 'grey.0',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 1, pb: '8px !important' }}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {typeof history.text === 'string' ? (
                            <Typography
                              variant="h6"
                              color="textPrimary"
                              sx={{ overflowWrap: 'anywhere' }}
                            >
                              {history.text}
                            </Typography>
                          ) : (
                            <>{history.text}</>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography
                    align="left"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {/* {history.from} */}
                  </Typography>
                  <Typography
                    align="left"
                    variant="subtitle2"
                    color="textSecondary"
                  >
                    {history.time}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatHistory;
