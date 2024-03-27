// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Theme, ThemeOptions } from '@mui/material/styles/createTheme';
import { CustomShadowProps } from 'types/theme';

declare module '@mui/material/styles/createTheme' {
  interface Theme {
    themeToggler: () => void;
    customShadows: CustomShadowProps;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    themeToggler?: () => void;
  }
}
