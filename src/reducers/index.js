import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import airtable from './airtable';
import board from './board';
import info from './info';
import search from './search';
import user from './user';
import modal from './modal';
import people from './people';

export const rootReducer = combineReducers({
  initialState,
  airtable,
  board,
  info,
  modal,
  people,
  search,
  user,
});
