import * as types from '../actions/types';
import { parseB4AArray, processErr } from '../utils';

export const founderResets = {
  get_profile_status: '',
  get_user_status: '',
  get_investors_status: '',
  post_status: '',
  post_intro_status: '',
};

const defaults = {
  ...founderResets,
  publicFounders: {},
  publicInvestors: {},
};

function convertToKeyedByUUID(arr) {
  const obj = {};
  arr.forEach(a => {
    obj[a.uuid] = { ...a };
  });
  return obj;
}

export default function founders(state = defaults, action) {
  switch (action.type) {
    case types.PUBLIC_GET_PROFILE_REQUESTED: return {
      ...state,
      get_profile_status: 'pending',
    };
    case types.PUBLIC_GET_PROFILE_SUCCEEDED: return {
      ...state,
      get_profile_status: 'succeeded',
      publicFounders: {
        ...state.publicFounders,
        [action.uuid]: {
          ...state.publicFounders[action.uuid],
          ...action.data,
        },
      },
    };
    case types.PUBLIC_GET_PROFILE_FAILED: return {
      ...state,
      get_profile_status: processErr(action.error),
    };
    case types.PUBLIC_GET_PROFILE_DISMISSED: return {
      ...state,
      get_profile_status: '',
    };
    case types.PUBLIC_GET_USER_REQUESTED: return {
      ...state,
      get_user_status: 'pending',
    };
    case types.PUBLIC_GET_USER_SUCCEEDED: return {
      ...state,
      get_user_status: 'succeeded',
      publicFounders: {
        ...state.publicFounders,
        [action.uuid]: {
          ...state.publicFounders[action.uuid],
          ...action.data,
        },
      },
    };
    case types.PUBLIC_GET_USER_FAILED: return {
      ...state,
      get_user_status: processErr(action.error),
    };
    case types.PUBLIC_GET_USER_DISMISSED: return {
      ...state,
      get_user_status: '',
    };
    case types.PUBLIC_GET_INVESTORS_REQUESTED: return {
      ...state,
      get_investors_status: 'pending',
    };
    case types.PUBLIC_GET_INVESTORS_SUCCEEDED: return {
      ...state,
      get_investors_status: 'succeeded',
      publicInvestors: convertToKeyedByUUID(parseB4AArray(action.data)),
    };
    case types.PUBLIC_GET_INVESTORS_FAILED: return {
      ...state,
      get_investors_status: processErr(action.error),
    };
    case types.PUBLIC_GET_INVESTORS_DISMISSED: return {
      ...state,
      get_investors_status: '',
    };
    case types.PUBLIC_POST_INTRO_REQUESTED: return {
      ...state,
      post_intro_status: 'pending',
    };
    case types.PUBLIC_POST_INTRO_SUCCEEDED: return {
      ...state,
      post_intro_status: 'succeeded',
      publicInvestors: {
        ...state.publicInvestors,
        [action.uuid]: action.data,
      },
    };
    case types.PUBLIC_POST_INTRO_FAILED: return {
      ...state,
      post_intro_status: processErr(action.error),
    };
    case types.PUBLIC_POST_INTRO_DISMISSED: return {
      ...state,
      post_intro_status: '',
    };
    case types.USER_LOGOUT: return {
      ...defaults,
    };
    default: return state;
  }
}
