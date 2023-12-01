import { createContext, ReactNode, useEffect, useState } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, FontFamily, I18n, MenuOrientation, PresetColor, ThemeDirection, ThemeMode } from 'types/config';

// initial state
const initialState: CustomizationProps = {
  ...defaultConfig,
  onChangeContainer: () => {},
  onChangeLocalization: (lang: I18n) => {},
  onChangeMode: (mode: ThemeMode) => {},
  onChangePresetColor: (theme: PresetColor) => {},
  onChangeDirection: (direction: ThemeDirection) => {},
  onChangeMiniDrawer: (miniDrawer: boolean) => {},
  onChangeMenuOrientation: (menuOrientation: MenuOrientation) => {},
  onChangeFontFamily: (fontFamily: FontFamily) => {},
  onChangeLang: (lang: I18n, direction: ThemeDirection) => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  // const [config, setConfig] = useState(initialState);
  const [config, setConfig] = useLocalStorage('raktda-dashboard-config', initialState);

  const onChangeContainer = () => {
    setConfig({
      ...config,
      container: !config.container
    });
  };

  const onChangeLocalization = (lang: I18n) => {
    // localStorage.setItem('lang', lang);
    // setConfig({
    //   ...config,
    //   i18n: lang,
    // });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...config,
      mode
    });
  };

  const onChangePresetColor = (theme: PresetColor) => {
    setConfig({
      ...config,
      presetColor: theme
    });
  };

  const onChangeDirection = (direction: ThemeDirection) => {
    setConfig({
      ...config,
      themeDirection: direction
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...config,
      miniDrawer
    });
  };

  const onChangeMenuOrientation = (layout: MenuOrientation) => {
    setConfig({
      ...config,
      menuOrientation: layout
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...config,
      fontFamily
    });
  };

  const onChangeLang = (lang: I18n, direction: ThemeDirection) => {
    localStorage.setItem('lang', lang);

    setConfig({
      ...config,
      i18n: lang,
      themeDirection: direction
    });
  };

  useEffect(() => {
    if (window) {
      const lang = localStorage.getItem('lang');

      if (lang) {
        setConfig((old) => ({
          ...old,
          i18n: lang as I18n,
          themeDirection: lang === 'ar' ? ThemeDirection.RTL : ThemeDirection.LTR
        }));
      }
    }
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeDirection,
        onChangeMiniDrawer,
        onChangeMenuOrientation,
        onChangeFontFamily,
        onChangeLang
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };
