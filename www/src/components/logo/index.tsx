import NextLink from 'next/link';

// material-ui
import { Box, ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
import LogoMain from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_ADMIN_DEFAULT_PATH } from 'config';
import Image from 'next/image';
import { basePath } from 'utils/const';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: string;
}

const LogoSection = ({ reverse, isIcon, sx, to }: Props) => {
  return (
    <NextLink href={!to ? APP_ADMIN_DEFAULT_PATH : to} passHref legacyBehavior>
      <ButtonBase disableRipple sx={sx}>
        <Box
          position="relative"
          height={isIcon ? 30 : 80}
          width={isIcon ? 30 : 80}
        >
          <Image
            fill
            sizes="sm"
            src={`${basePath}/fsc-logo-notext.svg`}
            alt="logo"
          />
        </Box>
      </ButtonBase>
    </NextLink>
  );
};

export default LogoSection;
