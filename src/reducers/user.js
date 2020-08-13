import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

const defaults = {
  email: '',
  create_status: '',
  login_status: '',
  loggedIn: false,
  update_status: '',
  delete_status: '',
  reset_status: '',
  password: '',
};

const resets = {
  create_status: '',
  login_status: '',
  update_status: '',
  delete_status: '',
  reset_status: '',
};

export default function user(state = { ...defaults }, action) {
  const rehydration = getSafeVar(() => action.payload.user, {});
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
      ...resets,
    };
    case types.USER_CREATE_REQUESTED: return {
      ...state,
      create_status: 'pending',
      loggedIn: false,
      email: action.email,
    };
    case types.USER_CREATE_SUCCEEDED: return {
      ...state,
      create_status: 'succeeded',
      loggedIn: true,
    };
    case types.USER_CREATE_FAILED: return {
      ...state,
      create_status: processErr(action.error),
    };
    case types.USER_CREATE_DISSMISSED: return {
      ...state,
      create_status: '',
    };
    case types.USER_LOGIN_REQUESTED: return {
      ...state,
      login_status: 'pending',
      loggedIn: false,
      email: action.params.email,
    };
    case types.USER_LOGIN_SUCCEEDED: return {
      ...state,
      login_status: 'succeeded',
      loggedIn: true,
    };
    case types.USER_LOGIN_FAILED: return {
      ...state,
      login_status: processErr(action.error),
    };
    case types.USER_LOGIN_DISSMISSED: return {
      ...state,
      login_status: '',
    };
    case types.USER_LOGOUT: return {
      ...state,
      ...defaults,
      // if needed, delete any cookies here
    };
    case types.USER_UPDATE_REQUESTED: return {
      ...state,
      update_status: 'pending',
    };
    case types.USER_UPDATE_SUCCEEDED: return {
      ...state,
      update_status: 'succeeded',
      email: action.email,
    };
    case types.USER_UPDATE_FAILED: return {
      ...state,
      update_status: processErr(action.error),
    };
    case types.USER_UPDATE_DISSMISSED: return {
      ...state,
      update_status: '',
    };
    case types.USER_DELETE_REQUESTED: return {
      ...state,
      delete_status: 'pending',
    };
    case types.USER_DELETE_SUCCEEDED: return {
      ...state,
      loggedIn: false,
      delete_status: 'succeeded',
    };
    case types.USER_DELETE_FAILED: return {
      ...state,
      delete_status: processErr(action.error),
    };
    case types.USER_DELETE_DISSMISSED: return {
      ...state,
      delete_status: '',
    };
    case types.USER_RESETPASSWORD_REQUESTED: return {
      ...state,
      reset_status: 'pending',
    };
    case types.USER_RESETPASSWORD_SUCCEEDED: return {
      ...state,
      reset_status: 'succeeded',
    };
    case types.USER_RESETPASSWORD_FAILED: return {
      ...state,
      reset_status: processErr(action.error),
    };
    case types.USER_RESETPASSWORD_DISSMISSED: return {
      ...state,
      reset_status: '',
    };
    default: return state;
  }
}
