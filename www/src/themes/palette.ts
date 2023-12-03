// material-ui
import { alpha, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// third-party
import { presetDarkPalettes, presetPalettes, PalettesProps } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

// types
import { PaletteThemeProps } from 'types/theme';
import { PresetColor, ThemeMode } from 'types/config';

const defaultPalette = {
  alternate: {
    main: '#f7faff',
    dark: '#edf1f7'
  },
  cardShadow: 'rgba(23, 70, 161, .11)',
  mode: 'light' as PaletteMode,
  primary: {
    main: '#64acbc',
    light: '#64acbc',
    dark: '#64acbc',
    contrastText: '#fff'
  },
  secondary: {
    light: '#ffb74d',
    main: '#DAB885',
    dark: '#FF9800',
    contrastText: 'rgba(0, 0, 0, 0.87)'
  },
  text: {
    primary: '#1e2022',
    secondary: '#677788'
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  background: {
    paper: '#ffffff',
    default: '#ffffff',
    level2: '#f5f5f5',
    level1: '#ffffff'
  }
};

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode: ThemeMode, presetColor: PresetColor) => {
  const colors: PalettesProps = mode === ThemeMode.DARK ? presetDarkPalettes : presetPalettes;

  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  if (mode === ThemeMode.DARK) {
    greyPrimary = ['#000000', '#141414', '#1e1e1e', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#f0f0f0', '#f5f5f5', '#fafafa', '#ffffff'];
    // greyPrimary.reverse();
    greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
    greyConstant = ['#121212', '#d3d8db'];
  }
  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor: PaletteThemeProps = ThemeOption(colors, presetColor, mode);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      primary: {
        main: '#203155',
        light: '#809BB7',
        dark: '#274666',
        contrastText: '#fff'
      },
      secondary: {
        light: '#FFDFAB',
        main: '#B79F79',
        dark: '#6B593B',
        contrastText: 'rgba(0, 0, 0, 0.87)'
      },
      text: {
        primary: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.87) : paletteColor.grey[700],
        secondary: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.45) : paletteColor.grey[500],
        disabled: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.1) : paletteColor.grey[400]
      },
      action: {
        disabled: paletteColor.grey[300]
      },
      divider: mode === ThemeMode.DARK ? alpha(paletteColor.grey[900]!, 0.05) : paletteColor.grey[200],
      background: {
        paper: mode === ThemeMode.DARK ? paletteColor.grey[100] : paletteColor.grey[0],
        default: paletteColor.grey.A50
      }
    }
  });
};

export default Palette;
