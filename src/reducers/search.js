import * as types from '../actions/types';
import { calcMatch, processErr } from '../utils';
import investors from '../data/investors.json';

export const searchResets = {
  results_status: '',
  random_status: '',
  extraZipcodes_status: '',
};

const defaults = {
  ...searchResets,
  results: [],
  random: [],
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

function subsetInvestorData(i = {}) {
  // only return data required for the search page so we can persist it without going over the
  // browser memory limits.
  // adapted from https://medium.com/@captaindaylight/get-a-subset-of-an-object-9896148b9c72
  return (({
    uuid,
    name,
    image_id,
    image_url,
    primary_job_title,
    primary_organization,
    status,
  }) => ({
    uuid,
    name,
    image_id,
    image_url,
    primary_job_title,
    primary_organization,
    status,
  }))(i);
}

function extractRandomItemFromArray(arr) {
  // remember the arr is a reference, so this removes the item from it.
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
}

function getRandom(count) {
  const toExtract = [...Object.values(investors)
    .filter(v => v.status !== 'INACTIVE' && v.uuid)];
  const outreach = toExtract.filter(o => o['accepts-direct_outreach']);
  const diverse = toExtract.filter(d => d.diverse_investors_list);
  const outArr = [];
  const divArr = [];
  const genArr = [];
  while (outArr.length + divArr.length + genArr.length < count) {
    if (!outArr.length) {
      outArr.push(extractRandomItemFromArray(outreach));
    } else if (divArr.length < 3) {
      divArr.push(extractRandomItemFromArray(diverse));
    } else {
      genArr.push(extractRandomItemFromArray(toExtract));
    }
  }
  return [...outArr, ...divArr, ...genArr];
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
      raise: (typeof action.raise === 'number') ? action.raise : 100000,
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
      extraZipcodes: [],
      extraLocations: [],
      searchedCityState: '',
      searchedLocationPairs: [],
      extraZipcodes_status: processErr(action.error),
    };
    case types.SEARCH_GET_RESULTS_REQUESTED:
      parsedResults = validInvestors.map(i => {
        const calcedMatch = calcMatch({ investor: i, ...state });
        return {
          ...subsetInvestorData(i),
          ...calcedMatch,
        };
      })
        .filter(f => f.matches.percentage_match > (state.searchedText ? 0 : 24))
        .sort((a, b) => b.matches.percentage_match - a.matches.percentage_match);

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
    case types.SEARCH_GET_RANDOM_REQUESTED:
      return {
        ...state,
        random_status: 'succeeded',
        random: [...getRandom(action.count)],
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
