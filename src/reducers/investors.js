import * as types from '../actions/types';
import { parseB4AArray, processErr } from '../utils';

export const investorsResets = {
  getOwnInvestors_status: '',
  getPublicInvestors_status: '',
  postOwnInvestor_status: '',
  postSafeAddInvestors_status: '',
  editNoteParams: {},
};

const defaults = {
  ...investorsResets,
  ownInvestors: {},
  publicInvestors: {},
  loggedOutInvestorIDs: [],
};

function convertToKeyedByUUID(arr) {
  const obj = {};
  arr.forEach(a => {
    obj[a.uuid] = { ...a };
  });
  return obj;
}

export default function user(state = defaults, action) {
  switch (action.type) {
    // used when the user is not logged in only.
    case types.BOARD_ADD: return {
      ...state,
      loggedOutInvestorIDs: [...new Set([...state.loggedOutInvestorIDs, action.uuid])],
    };
    case types.BOARD_REMOVE: return {
      ...state,
      loggedOutInvestorIDs: state.loggedOutInvestorIDs.filter(i => i !== action.uuid),
    };
    case types.USER_GET_INVESTORS_REQUESTED: return {
      ...state,
      getOwnInvestors_status: 'pending',
    };
    case types.USER_GET_INVESTORS_SUCCEEDED: return {
      ...state,
      getOwnInvestors_status: 'succeeded',
      ownInvestors: convertToKeyedByUUID(parseB4AArray(action.data)),
    };
    case types.USER_GET_INVESTORS_FAILED: return {
      ...state,
      getOwnInvestors_status: processErr(action.error),
    };
    case types.USER_GET_INVESTORS_DISMISSED: return {
      ...state,
      getOwnInvestors_status: '',
    };
    case types.USER_POST_INVESTOR_REQUESTED: return {
      ...state,
      postOwnInvestor_status: 'pending',
    };
    case types.USER_POST_INVESTOR_SUCCEEDED: return {
      ...state,
      postOwnInvestor_status: 'succeeded',
      ownInvestors: {
        ...state.ownInvestors,
        [action.data.uuid]: action.data,
      },
    };
    case types.USER_POST_INVESTOR_FAILED: return {
      ...state,
      postOwnInvestor_status: processErr(action.error),
    };
    case types.USER_POST_INVESTOR_DISMISSED: return {
      ...state,
      postOwnInvestor_status: '',
    };
    case types.USER_POST_SAFEADDINVESTORS_REQUESTED: return {
      ...state,
      postSafeAddInvestors_status: 'pending',
    };
    case types.USER_POST_SAFEADDINVESTORS_SUCCEEDED: return {
      ...state,
      postSafeAddInvestors_status: 'succeeded',
      loggedOutInvestorIDs: [],
    };
    case types.USER_POST_SAFEADDINVESTORS_FAILED: return {
      ...state,
      postSafeAddInvestors_status: processErr(action.error),
    };
    case types.USER_POST_SAFEADDINVESTORS_DISMISSED: return {
      ...state,
      postSafeAddInvestors_status: '',
    };
    case types.USER_SET_EDITNOTE: return {
      ...state,
      editNoteParams: { ...action.params },
    };
    case types.USER_LOGOUT: return {
      ...defaults,
    };
    default: return state;
  }
}
