import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

// ==============================|| Auth - HOOKS  ||============================== //

const useAuth = () => useContext(AuthContext);

export default useAuth;
