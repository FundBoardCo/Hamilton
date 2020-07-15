import { combineReducers } from 'redux';
import airtable from './airtable';
import board from './board';
import search from './search';
import user from './user';
import people from './people';

// TODO: update all of these to the real keys
export const resetState = {
  auth_state: null,
  logout_state: null,
  newUser_state: null,
  search_state: null,
  updateUser_state: null,
};

// These will be overwritten on rehydration.
// TODO: update all of these to the real keys
const initialState = {
  ...resetState,
  auth_state: null,
  logout_state: null,
  newUser_state: null,
  updateUser_state: null,
  auth_user: null,
  search: {
    results_state: null,
    results: [],
  },
  updateUserModal_show: false,
};

export const rootReducer = combineReducers({
  initialState,
  airtable,
  board,
  people,
  search,
  //user,
});
