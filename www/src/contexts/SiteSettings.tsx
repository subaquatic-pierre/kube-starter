import { createContext, ReactNode, useEffect, useState } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, FontFamily, I18n, MenuOrientation, PresetColor, ThemeDirection, ThemeMode } from 'types/config';
import { SiteSettings } from 'models/settings';
import { defaultSiteSettings } from 'models/settings';

// initial state
const initialState: SiteSettings = defaultSiteSettings;

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const SiteSettingsContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
  settings: SiteSettings;
};

const SiteSettingsProvider: React.FC<ConfigProviderProps> = ({ children, settings }) => {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
};

export { SiteSettingsProvider, SiteSettingsContext };
