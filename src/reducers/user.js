import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

const defaults = {
  email: '',
  create_status: '',
  login_status: '',
  token: null,
  update_status: '',
  delete_status: '',
  reset_status: '',
  password: '',
  investors: [],
};

export const userResets = {
  create_status: '',
  login_status: '',
  update_status: '',
  delete_status: '',
  reset_status: '',
};

export default function user(state = defaults, action) {
  switch (action.type) {
    case types.USER_CREATE_REQUESTED: return {
      ...state,
      create_status: 'pending',
      token: null,
      email: action.email,
    };
    case types.USER_CREATE_SUCCEEDED: return {
      ...state,
      create_status: 'succeeded',
      token: action.data.token,
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
      email: action.params.email,
    };
    case types.USER_LOGIN_SUCCEEDED: return {
      ...state,
      login_status: 'succeeded',
      token: action.data.token,
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
      ...defaults,
    };
    case types.USER_GET_PROFILE_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.USER_GET_PROFILE_SUCCEEDED: return {
      ...state,
      get_status: 'succeeded',
      email: getSafeVar(() => action.data.profile.email, ''),
      investors: getSafeVar(() => action.data.following, []),
    };
    case types.USER_GET_PROFILE_FAILED: return {
      ...state,
      get_status: processErr(action.error),
    };
    case types.USER_GET_PROFILE_DISMISSED: return {
      ...state,
      get_status: '',
    };
    case types.USER_UPDATE_REQUESTED: return {
      ...state,
      update_status: 'pending',
    };
    case types.USER_UPDATE_SUCCEEDED: return {
      ...state,
      update_status: 'succeeded',
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
      token: null,
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
