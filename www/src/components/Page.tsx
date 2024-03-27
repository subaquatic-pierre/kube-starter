import { forwardRef, ReactNode, Ref } from 'react';

// next
import Head from 'next/head';
import Seo from 'components/Seo';

// material-ui
import { Box, BoxProps } from '@mui/material';
import { SiteSettings } from 'models/settings';
import { SiteSettingsContext, SiteSettingsProvider } from 'contexts/SiteSettings';

// ==============================|| Page - SET TITLE & META TAGS ||============================== //

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
  settings?: SiteSettings;
}

const Page = forwardRef<HTMLDivElement, Props>(({ children, settings, title = '', meta, ...other }: Props, ref: Ref<HTMLDivElement>) => (
  <>
    <Seo settings={settings} />
    <SiteSettingsProvider settings={settings}>
      <Box ref={ref} {...other}>
        {children}
      </Box>
    </SiteSettingsProvider>
  </>
));

export default Page;
