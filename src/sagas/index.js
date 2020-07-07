import {
  all,
  put,
  call,
  fork,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  CRUNCHBASE_APIKEY,
  AIRTABLE_APIKEY,
  CBURL,
} from '../constants.js';
import { getSafeVar, capitalizeFirstLetter } from '../utils';

function requestAirtableGetKeywords() {
  return axios.get('https://api.airtable.com/v0/app5hJojHQxyJ7ElS/Keywords', {
    headers: { Authorization: `Bearer ${AIRTABLE_APIKEY}` },
  });
}

function* workAirtableGetKeywords() {
  try {
    const results = yield call(requestAirtableGetKeywords);
    yield put({ type: 'AIRTABLE_GET_KEYWORDS_SUCCEEDED', data: results.data });
  } catch (error) {
    yield put({ type: 'AIRTABLE_GET_KEYWORDS_FAILED', error });
  }
}

function* watchAirtableGetKeywords() {
  yield takeLatest('AIRTABLE_GET_KEYWORDS_REQUESTED', workAirtableGetKeywords)
}

function requestSearchGetResults(params = {}) {
  // Temporary Airtable code.
  // TODO: replace with real API code.
  // params should be an object with field: term key:value pairs.
  let { keywords } = params;
  const { raise, location } = params;

  // change each keyword into a FIND formula
  const formulas = [];
  keywords = keywords.reduce((a, key) => {
    const lKey = key.toLowerCase();
    const uKey = capitalizeFirstLetter(key);
    const lower = `${a}${a ? ', ' : ''}FIND("${lKey}", {description})>0`;
    const upper = `${a}${a ? ', ' : ''}FIND("${uKey}", {description})>0`;
    return `${lower}, ${upper}`;
  }, '');
  if (keywords && keywords.length) formulas.push(keywords);
  if (raise) {
    formulas.push(`AND({raise_min}<=${raise},{raise_max}>=${raise})`);
  }
  if (location) formulas.push(`FIND("${location}", {location_zipcode})>0`);

  console.log(formulas)
  return axios.get('https://api.airtable.com/v0/appDqWxN1pcWrdjsn/Investors',
    {
      params: {
        maxRecords: 100,
        view: 'Grid view',
        filterByFormula: `OR(${formulas.join(',')})`,
      },
      headers: { Authorization: `Bearer ${AIRTABLE_APIKEY}` },
    });
}

function* workSearchGetResults(action) {
  try {
    const results = yield call(requestSearchGetResults, action.params);
    yield put({ type: 'SEARCH_GET_RESULTS_SUCCEEDED', data: results.data });
  } catch (error) {
    yield put({ type: 'SEARCH_GET_RESULTS_FAILED', error });
  }
}

function* watchSearchGetResults() {
  yield takeLatest('SEARCH_GET_RESULTS_REQUESTED', workSearchGetResults)
}

export default function* rootSaga() {
  yield fork(watchAirtableGetKeywords);
  yield fork(watchSearchGetResults);
}
