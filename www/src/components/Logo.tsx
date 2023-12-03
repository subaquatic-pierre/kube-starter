import NextLink from 'next/link';

// material-ui
import { Box, ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
import { APP_ADMIN_DEFAULT_PATH } from 'config';
import Image from 'next/image';
import { basePath } from 'utils/const';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: string;
  transparent?: boolean;
}

const LogoSection = ({ reverse, isIcon, sx, to, transparent = false }: Props) => {
  return (
    <NextLink href={'/'}>
      <ButtonBase disableRipple sx={sx}>
        <Box position="relative" height={isIcon ? 30 : 80} width={isIcon ? 30 : 80}>
          {transparent ? (
            <Image fill sizes="sm" src={`${basePath}/logo-trans.png`} alt="logo" />
          ) : (
            <Image fill sizes="sm" src={`${basePath}/logo.png`} alt="logo" />
          )}
        </Box>
      </ButtonBase>
    </NextLink>
  );
};

export default LogoSection;
