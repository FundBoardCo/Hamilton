import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { processErr } from '../utils';

const defaults = {
  email: '',
  create_state: '',
  login_state: '',
  token: '',
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
      email: action.email,
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
    };
    default: return state;
  }
}
