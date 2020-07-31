import { combineReducers } from 'redux';
import airtable from './airtable';
import board from './board';
import search from './search';
import user from './user';
import modal from './modal';
import people from './people';

// TODO: update all of these to the real keys
export const resetState = {
  auth_status: null,
  logout_status: null,
  newUser_status: null,
  search_status: null,
  updateUser_status: null,
};

// These will be overwritten on rehydration.
// TODO: update all of these to the real keys
const initialState = {
  ...resetState,
  auth_status: null,
  logout_status: null,
  newUser_status: null,
  updateUser_status: null,
  auth_user: null,
  search: {
    results_status: null,
    results: [],
  },
  updateUserModal_show: false,
};

export const rootReducer = combineReducers({
  initialState,
  airtable,
  board,
  modal,
  people,
  search,
  user,
});
