import * as types from '../actions/types';
import { calcMatch, processErr } from '../utils';
import investors from '../data/investors.json';

const defaults = {
  results_status: '',
  extraZipcodes_status: '',
  results: [],
  keywords: [],
  raise: 100000,
  location: '',
  extraZipcodes: [],
  extraLocations: [],
  searchedCityState: '',
  searchedLocationPairs: [],
  searchedText: '',
  firstTime: true,
};

let parsedResults = [];
const validInvestors = Object.values(investors).filter(i => i.status !== 'INACTIVE');

function extractLocations(state, action) {
  const { data = {} } = action;
  const extraLocations = data.zip_codes || [];
  const extraZipcodes = extraLocations.map(z => z.zip_code);
  const searchLocation = extraLocations.filter(l => l.zip_code === state.location)[0];
  const searchedCityState = `${
    searchLocation.city.toLowerCase()
  }_${
    searchLocation.state.toLowerCase()
  }`;
  let searchedLocationPairs = [
    ...extraLocations.map(l => `${l.city.toLowerCase()}_${l.state.toLowerCase()}`),
  ];
  searchedLocationPairs = [...new Set([...searchedLocationPairs])];

  return {
    extraLocations,
    extraZipcodes,
    searchedCityState,
    searchedLocationPairs,
  };
}

export default function search(state = defaults, action) {
  switch (action.type) {
    case types.SEARCH_SET_KEYWORDS: return {
      ...state,
      keywords: Array.isArray(action.keywords)
        ? action.keywords.map(k => k.toLowerCase())
        : [],
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
    case types.SEARCH_SET_SEARCHTEXT: return {
      ...state,
      searchedText: action.text,
    };
    case types.SEARCH_GET_EXTRAZIPCODES_REQUESTED: return {
      ...state,
      extraZipcodes_status: 'pending',
    };
    case types.SEARCH_GET_EXTRAZIPCODES_SUCCEEDED:
      return {
        ...state,
        ...extractLocations(state, action),
        extraZipcodes_status: 'succeeded',
      };
    case types.SEARCH_GET_EXTRAZIPCODES_FAILED: return {
      ...state,
      extraZipcodes_status: processErr(action.error),
    };
    case types.SEARCH_GET_RESULTS_REQUESTED:
      parsedResults = validInvestors.map(i => {
        const calcedMatch = calcMatch({ investor: i, ...state });
        return { ...i, ...calcedMatch };
      })
        .filter(f => f.matches.percentage_match > 0);
      parsedResults.sort((a, b) => b.matches.percentage_match - a.matches.percentage_match);

      return {
        ...state,
        results_status: 'succeeded',
        firstTime: false,
        results: [...parsedResults],
      };
    case types.SEARCH_GET_RESULTS_SUCCEEDED:
      return {
        ...state,
        results: action.data.reduce((acc, r) => ({ ...acc, [r.uuid]: r }), {}),
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
    case types.USER_LOGOUT: return {
      ...defaults,
    };
    default: return state;
  }
}
