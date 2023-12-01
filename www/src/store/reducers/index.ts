// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import calendar from './calendar';
import snackbar from './snackbar';
import chat from './chat';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  calendar,
  chat,
  menu,
  snackbar
});

export default reducers;
