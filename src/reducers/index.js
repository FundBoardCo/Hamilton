import { combineReducers } from 'redux';
import search from './search';
import user from './user';
import people from './people';
import modals from './modals';

export default combineReducers({
  results,
  airTable,
  people,
  modals,
  entities,
});
