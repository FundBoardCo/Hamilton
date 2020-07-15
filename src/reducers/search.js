import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { processErr } from '../utils';

export default function search(state = {}, action) {
  const results = {};
  // TODO: remove this when we have real data
  const fakeSearchData = {
    isLead: true,
    isOpen: true,
    isImpact: true,
    matches: {
      keywords: ['B2B', 'AI', 'Automation', 'AR'],
      raise: true,
      location: true,
      name: true,
      org: true,
    },
  };
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
    case types.SEARCH_GET_RESULTS_SUCCEEDED:
      if (action.data.records) {
        action.data.records.forEach(r => {
          results[r.id] = { ...fakeSearchData, ...r.fields };
        });
      }
      return {
        ...state,
        results,
        results_state: 'succeeded',
      };
    case types.SEARCH_GET_RESULTS_FAILED: return {
      ...state,
      results_state: processErr(action.error),
    };
    default: return state;
  }
}
