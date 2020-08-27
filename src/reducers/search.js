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
  extraLocations: [],
  firstTime: true,
};

const resetState = {
  cityZipCodes: { zipCodes: [] },
};

let parsedResults = [];

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
        extraLocations: action.data.zip_codes,
        extraZipcodes: action.data.zip_codes.map(z => z.zip_code),
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
      parsedResults = action.data.map(i => {
        const { keywords = [], raise, extraLocations } = state;
        const matches = {
          keywords: [],
          raise: raise >= i.raise_min && raise <= i.raise_max,
          location: extraLocations.filter(l => l.city === i.location_city
            && l.state === i.location_state).length > 0,
        };
        keywords.forEach(k => {
          if (i.description && i.description.includes(k.toLowerCase())) matches.keywords.push(k);
        });

        let percentageMatch;
        switch (matches.keywords.length) {
          case 5: percentageMatch = 1; break;
          case 4: percentageMatch = 0.95; break;
          case 3: percentageMatch = 0.85; break;
          case 2: percentageMatch = 0.75; break;
          case 1: percentageMatch = 0.6; break;
          default: percentageMatch = 0;
        }
        if (matches.raise) percentageMatch += 1;
        if (matches.location) percentageMatch += 1;
        percentageMatch = Math.floor((percentageMatch / 3) * 100);
        return { ...i, matches, percentageMatch };
      });
      parsedResults.sort((a, b) => b.percentageMatch - a.percentageMatch);

      return {
        ...state,
        results: [...parsedResults],
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
