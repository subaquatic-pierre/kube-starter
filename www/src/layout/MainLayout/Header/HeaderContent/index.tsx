import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';

// type
import { MenuOrientation } from 'types/config';
import LanguageSelect from 'components/LanguageSelect';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      <Box width="100%" />
      {/* {!downLG && <Search />} */}

      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <Notification /> */}
      {!downLG && (
        <>
          {/* <LanguageSelect /> */}
          <Profile />
        </>
      )}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;
