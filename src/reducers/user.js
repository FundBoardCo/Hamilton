import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { processErr } from '../utils';

const defaults = {
  email: '',
  create_state: '',
  login_state: '',
  update_state: '',
  delete_state: '',
  token: '',
  password: '',
};

export default function user(state = { ...defaults }, action) {
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.user,
    };
    case types.USER_CREATE_REQUESTED: return {
      ...state,
      create_state: 'pending',
      email: action.email,
    };
    case types.USER_CREATE_SUCCEEDED: return {
      ...state,
      create_state: 'succeeded',
      token: action.data.token,
    };
    case types.USER_CREATE_FAILED: return {
      ...state,
      create_state: processErr(action.error),
    };
    case types.USER_LOGIN_REQUESTED: return {
      ...state,
      login_state: 'pending',
      email: action.params.email,
    };
    case types.USER_LOGIN_SUCCEEDED: return {
      ...state,
      login_state: 'succeeded',
      token: action.data.token,
    };
    case types.USER_LOGIN_FAILED: return {
      ...state,
      login_state: processErr(action.error),
    };
    case types.USER_LOGOUT: return {
      ...state,
      ...defaults,
      // if needed, delete any cookies here
    };
    case types.USER_UPDATE_REQUESTED: return {
      ...state,
      update_state: 'pending',
    };
    case types.USER_UPDATE_SUCCEEDED: return {
      ...state,
      update_state: 'succeeded',
      email: action.email,
    };
    case types.USER_UPDATE_FAILED: return {
      ...state,
      update_state: processErr(action.error),
    };
    case types.USER_DELETE_REQUESTED: return {
      ...state,
      delete_state: 'pending',
    };
    case types.USER_DELETE_SUCCEEDED: return {
      ...state,
      delete_state: 'succeeded',
    };
    case types.USER_DELETE_FAILED: return {
      ...state,
      delete_state: processErr(action.error),
    };
    default: return state;
  }
}
