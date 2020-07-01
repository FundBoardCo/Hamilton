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

export default function* rootSaga() {
  yield fork(watchAirtableGetKeywords);
}
