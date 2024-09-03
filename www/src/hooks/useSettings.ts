import { useContext } from 'react';
import { SiteSettingsContext } from 'contexts/SiteSettings';

// ==============================|| Auth - HOOKS  ||============================== //

const useSettings = () => useContext(SiteSettingsContext);

export default useSettings;
