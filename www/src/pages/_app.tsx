import { ReactElement, ReactNode } from 'react';

// scroll bar
import 'simplebar/dist/simplebar.css';

// next
import { NextPage } from 'next';
import type { AppProps } from 'next/app';

// third party
import { Provider as ReduxProvider } from 'react-redux';

// project import
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import 'regenerator-runtime/runtime';
import Notistack from 'components/third-party/Notistack';
import { ConfigProvider } from 'contexts/ConfigContext';

import { store } from 'store';
import ThemeCustomization from 'themes';
import { AuthContextProvider } from 'contexts/AuthContext';

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps & Props) {
  return (
    <ReduxProvider store={store}>
      <ConfigProvider>
        <ThemeCustomization>
          <RTLLayout>
            <Locales>
              <ScrollTop>
                <AuthContextProvider>
                  <Notistack>
                    <Snackbar />
                    <Component {...pageProps} />
                  </Notistack>
                </AuthContextProvider>
              </ScrollTop>
            </Locales>
          </RTLLayout>
        </ThemeCustomization>
      </ConfigProvider>
    </ReduxProvider>
  );
}
