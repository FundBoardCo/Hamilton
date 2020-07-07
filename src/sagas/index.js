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
import { getSafeVar } from '../utils';

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
  const formulas = Object.keys(params).reduce((acc, key) => {
    if (!params[key]) return acc;
    const stringToFind = params[key];
    const whereToSearch = key;
    return `${acc}${acc ? ', ' : ''}FIND("${stringToFind}", {${whereToSearch}}) > 0`;
  }, '');
  const airParams = formulas ? { filterByFormula: `OR(${formulas})` } : {};
  return axios.get('https://api.airtable.com/v0/appDqWxN1pcWrdjsn/Investors',
    { params: airParams });
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
