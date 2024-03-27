import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import useSettings from 'hooks/useSettings';
import CallIcon from '@mui/icons-material/Call';
import { buildContactItems } from 'utils/contact';

const Fab: React.FC = () => {
  const settings = useSettings();

  if (!settings.loaded || buildContactItems(settings).length === 0) {
    return <Box sx={{ display: 'none' }} />;
  }

  return (
    <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<CallIcon />}>
      {buildContactItems(settings).map((action) => (
        <SpeedDialAction
          onClick={() => window.open(action.link, '_blank')}
          key={action.title}
          icon={action.icon}
          tooltipTitle={action.title}
        />
      ))}
    </SpeedDial>
  );
};

export default Fab;
