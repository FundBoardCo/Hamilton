import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

const defaultState = {
  results_status: '',
  extraZipcodes_status: '',
  cityZipCodes: { zipCodes: [] },
  results: [],
  keywords: [],
  raise: 100000,
  location: '',
  extraZipcodes: [],
  firstTime: true,
};

const resetState = {
  cityZipCodes: { zipCodes: [] },
  keywords: [],
  raise: 100000,
  location: '',
};

export default function search(state = { ...defaultState }, action) {
  const rehydration = getSafeVar(() => action.payload.search, {});
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
      ...resetState,
    };
    case types.SEARCH_SET_KEYWORDS: return {
      ...state,
      keywords: Array.isArray(action.keywords) ? action.keywords : [],
    };
    case types.SEARCH_SET_RAISE: return {
      ...state,
      raise: (typeof action.raise === 'number') ? action.raise : 1000000,
    };
    case types.SEARCH_SET_LOCATION: return {
      ...state,
      location: action.location,
    };
    case types.SEARCH_SET_REMOTE: return {
      ...state,
      remote: action.remote,
    };
    case types.SEARCH_GET_EXTRAZIPCODES_REQUESTED: return {
      ...state,
      extraZipcodes_status: 'pending',
    };
    case types.SEARCH_GET_EXTRAZIPCODES_SUCCEEDED:
      return {
        ...state,
        extraZipcodes: action.data.zip_codes,
        extraZipcodes_status: 'succeeded',
      };
    case types.SEARCH_GET_EXTRAZIPCODES_FAILED: return {
      ...state,
      extraZipcodes_status: processErr(action.error),
    };
    case types.SEARCH_GET_CITYZIPCODES_REQUESTED: return {
      ...state,
      cityZipCodes: {
        status: 'pending',
        city: action.params && action.params.city,
        state: action.params && action.params.state,
        zipCodes: [],
      },
    };
    case types.SEARCH_GET_CITYZIPCODES_SUCCEEDED:
      return {
        ...state,
        cityZipCodes: {
          ...state.cityZipCodes,
          status: 'succeeded',
          zipCodes: [...action.data.zip_codes],
        },
      };
    case types.SEARCH_GET_CITYZIPCODES_FAILED: return {
      ...state,
      cityZipCodes: {
        ...state.cityZipCodes,
        status: processErr(action.error),
      },
    };
    case types.SEARCH_GET_RESULTS_REQUESTED: return {
      ...state,
      results_status: 'pending',
      results: [],
      firstTime: false,
    };
    case types.SEARCH_GET_RESULTS_SUCCEEDED:
      return {
        ...state,
        results: action.data,
        results_status: 'succeeded',
      };
    case types.SEARCH_GET_RESULTS_FAILED: return {
      ...state,
      results_status: processErr(action.error),
    };
    case types.SEARCH_GET_RESULTS_DISMISSED: return {
      ...state,
      results_status: '',
    };
    case types.SEARCH_CLEAR_RESULTS: return {
      ...state,
      results_status: '',
      results: [],
    };
    default: return state;
  }
}
