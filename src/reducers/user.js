import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

const defaults = {
  name: '',
  email: '',
  investors: [],
  create_status: '',
  login_status: '',
  sessionToken: null,
  objectId: '',
  init_status: '',
  update_status: '',
  delete_status: '',
  reset_status: '',
  update_founderData_status: '',
  showAdvice: true,
  primary_job_title: '',
  primary_organization_name: '',
  primary_organization_homepage: '',
  primary_organization_logo: '',
  description: '',
  linkedin: '',
  twitter: '',
  permalink: '',
  links: [],
  raise: 0,
  remote: false,
  location_city: '',
  location_state: '',
  team_size: 0,
  board_public: true,
};

export const userResets = {
  create_status: '',
  login_status: '',
  update_status: '',
  delete_status: '',
  reset_status: '',
};

function mergeIDs(state, action) {
  return [...new Set([
    ...state.investors,
    // add passes an id, the backend passes a following array.
    ...(getSafeVar(() => action.id, [])),
    ...(getSafeVar(() => action.data.following, [])),
  ])];
}

export default function user(state = defaults, action) {
  switch (action.type) {
    // used when the user is not logged in only.
    case types.BOARD_ADD_COMPLETE: return {
      ...state,
      investors: action.params.investors || [],
    };
    case types.BOARD_REMOVE_COMPLETE: return {
      ...state,
      investors: action.params.investors || [],
    };
    case types.BOARD_SHOWADVICE: return {
      ...state,
      showAdvice: action.showAdvice,
    };
    case types.USER_CREATE_REQUESTED: return {
      ...state,
      create_status: 'pending',
      sessionToken: null,
    };
    case types.USER_CREATE_SUCCEEDED: return {
      ...state,
      create_status: 'succeeded',
      email: action.data.email,
      sessionToken: action.data.sessionToken,
      objectId: action.data.objectId,
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
    };
    case types.USER_LOGIN_SUCCEEDED: return {
      ...state,
      login_status: 'succeeded',
      investors: mergeIDs(state, action),
      ...action.data,
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
    case types.USER_UPDATE_REQUESTED: return {
      ...state,
      update_status: 'pending',
    };
    case types.USER_UPDATE_SUCCEEDED: return {
      ...state,
      update_status: 'succeeded',
      ...action.data,
    };
    case types.USER_UPDATE_FAILED: return {
      ...state,
      update_status: processErr(action.error),
    };
    case types.USER_UPDATE_DISSMISSED: return {
      ...state,
      update_status: '',
    };
    case types.USER_POST_FOUNDERDATA_REQUESTED: return {
      ...state,
      update_founderData_status: 'pending',
    };
    case types.USER_POST_FOUNDERDATA_SUCCEEDED: return {
      ...state,
      update_founderData_status: 'succeeded',
      ...action.data,
    };
    case types.USER_POST_FOUNDERDATA_FAILED: return {
      ...state,
      update_founderData_status: processErr(action.error),
    };
    case types.USER_POST_FOUNDERDATA_DISMISSED: return {
      ...state,
      update_founderData_status: '',
    };
    case types.USER_DELETE_REQUESTED: return {
      ...state,
      delete_status: 'pending',
    };
    case types.USER_DELETE_SUCCEEDED: return {
      ...defaults,
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
