import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { processErr, getSafeVar } from '../utils';

export default function search(state = {}, action) {
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.search,
    };
    case types.SEARCH_SET_KEYWORDS: return {
      ...state,
      keywords: Array.isArray(action.keywords) ? action.keywords : [],
    };
    case types.SEARCH_SET_RAISE: return {
      ...state,
      raise: (typeof action.raise === 'number') ? action.raise : 0,
    };
    case types.SEARCH_SET_LOCATION: return {
      ...state,
      location: action.location,
    };
    case types.SEARCH_SET_REMOTE: return {
      ...state,
      remote: action.remote,
    };
    case types.SEARCH_GET_RESULTS_REQUESTED: return {
      ...state,
      results_state: 'pending',
    };
    case types.SEARCH_GET_RESULTS_SUCCEEDED: return {
      ...state,
      results: getSafeVar(() => action.data.records, []),
      results_state: 'succeeded',
    };
    case types.SEARCH_GET_RESULTS_FAILED: return {
      ...state,
      results_state: processErr(action.error),
    };
    default: return state;
  }
}
