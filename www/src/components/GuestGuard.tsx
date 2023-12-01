import { useState } from 'react';

interface Props extends React.PropsWithChildren {}

const GuestGuard: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState(false);

  return <>{children}</>;
};

export default GuestGuard;
