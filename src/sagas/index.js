import {
  put,
  call,
  fork,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  AIRTABLE_APIKEY,
} from '../constants';
import { capitalizeFirstLetter, processErr } from '../utils';

function trackErr(err) {
  window.heap.track('Error', { message: processErr(err) });
}

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
    trackErr(error);
    yield put({ type: 'AIRTABLE_GET_KEYWORDS_FAILED', error });
  }
}

function* watchAirtableGetKeywords() {
  yield takeLatest('AIRTABLE_GET_KEYWORDS_REQUESTED', workAirtableGetKeywords);
}

function personPutInvalid(params = {}) {
  const data = {
    fields: { ...params },
  };
  return axios({
    method: 'post',
    url: 'https://api.airtable.com/v0/apps8kfzmvaJV4oV6/reports',
    headers: { Authorization: `Bearer ${AIRTABLE_APIKEY}` },
    data,
  });
}

function* workPersonPutInvalid(action) {
  const { params } = action;
  try {
    yield call(personPutInvalid, params);
    yield put({ type: 'PERSON_PUT_INVALID_SUCCEEDED', params });
  } catch (error) {
    trackErr(error);
    yield put({ type: 'PERSON_PUT_INVALID_FAILED', params, error });
  }
}

function* watchPersonPutInvalid() {
  yield takeEvery('PERSON_PUT_INVALID_REQUESTED', workPersonPutInvalid);
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
    yield put({ type: 'PEOPLE_UPDATE', data: results.data });
  } catch (error) {
    trackErr(error);
    yield put({ type: 'SEARCH_GET_RESULTS_FAILED', error });
  }
}

function* watchSearchGetResults() {
  yield takeLatest('SEARCH_GET_RESULTS_REQUESTED', workSearchGetResults);
}

export default function* rootSaga() {
  yield fork(watchAirtableGetKeywords);
  yield fork(watchPersonPutInvalid);
  yield fork(watchSearchGetResults);
}
