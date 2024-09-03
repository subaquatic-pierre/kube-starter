import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';

interface Props {
  title: string;
  id: string;
  items?: Array<PageItem>;
  colorInvert?: boolean;
  path?: string;
}

const NavItem = ({ title, id, items = [], colorInvert = false, path }: Props): JSX.Element => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openedPopoverId, setOpenedPopoverId] = useState(null);
  const router = useRouter();

  const handleClick = (event, popoverId) => {
    setAnchorEl(event.target);
    setOpenedPopoverId(popoverId);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    setOpenedPopoverId(null);
  };

  const [activeLink, setActiveLink] = useState('');
  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  const hasActiveLink = (router: NextRouter) => {
    const isInItems = items.findIndex((el: PageItem) => router.asPath === el.href);
    const pathSame = !!path && router.asPath === path;
    const childPathSame = isInItems > -1;

    return pathSame || childPathSame;
  };
  const linkColor = colorInvert ? 'common.white' : 'text.primary';

  return (
    <Box>
      {items.length === 0 ? (
        <Box display={'flex'} alignItems={'center'} aria-describedby={id} sx={{ cursor: 'pointer' }}>
          <Link href={path}>
            <Typography fontWeight={hasActiveLink(router) ? 700 : 400} color={linkColor}>
              {title}
            </Typography>
          </Link>
        </Box>
      ) : (
        <Box onClick={(e) => handleClick(e, id)} display={'flex'} alignItems={'center'} aria-describedby={id} sx={{ cursor: 'pointer' }}>
          <Typography fontWeight={hasActiveLink(router) ? 700 : 400} color={linkColor}>
            {title}
          </Typography>
          <ExpandMoreIcon
            sx={{
              marginLeft: theme.spacing(1 / 4),
              width: 16,
              height: 16,
              transform: openedPopoverId === id ? 'rotate(180deg)' : 'none',
              color: linkColor
            }}
          />
        </Box>
      )}
      <Popover
        elevation={3}
        id={id}
        open={openedPopoverId === id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        sx={{
          '.MuiPaper-root': {
            maxWidth: items.length > 12 ? 350 : 250,
            padding: 2,
            marginTop: 2,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderTop: `3px solid ${theme.palette.primary.main}`
          }
        }}
      >
        <Grid container spacing={0.5}>
          {items.map((p, i) => (
            <Grid item key={i} xs={items.length > 12 ? 6 : 12}>
              <Button
                component={Link}
                href={p.href}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  color: activeLink === p.href ? theme.palette.primary.main : theme.palette.text.primary,
                  backgroundColor: activeLink === p.href ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  fontWeight: activeLink === p.href ? 600 : 400
                }}
              >
                {p.title}
                {p.isNew && (
                  <Box padding={0.5} display={'inline-flex'} borderRadius={1} bgcolor={'primary.main'} marginLeft={2}>
                    <Typography variant={'caption'} sx={{ color: 'common.white', lineHeight: 1 }}>
                      new
                    </Typography>
                  </Box>
                )}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Box>
  );
};

export default NavItem;
