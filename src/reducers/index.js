import { combineReducers } from 'redux';
import airtable from './airtable';
import search from './search';
import user from './user';
import people from './people';
import modals from './modals';

export default combineReducers({
  airtable,
  //people,
  //modals,
  search,
  //user,
});
