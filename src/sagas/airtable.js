import axios from 'axios';
import {
  call,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { toQueryString, trackErr } from '../utils';
import * as types from '../actions/types';

function requestAirtableGetKeywords(params) {
  return axios.get(`/.netlify/functions/airtable_get_keywords?${toQueryString(params)}`);
}

function* workAirtableGetKeywords() {
  const params = {};
  let firstRun = true;

  try {
    while (firstRun || params.offset) {
      // loop this as many times as needed to get all the results.
      const results = yield call(requestAirtableGetKeywords, params);
      firstRun = false;
      // catch airtable errors
      if (results.data.error) {
        trackErr(results.data.error);
        yield put({ type: types.AIRTABLE_GET_KEYWORDS_FAILED, error: results.data.error });
      } else {
        params.offset = results.data.offset;
        yield put({ type: types.AIRTABLE_GET_KEYWORDS_SUCCEEDED, data: results.data });
      }
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.AIRTABLE_GET_KEYWORDS_FAILED, error });
  }
}

export function* watchAirtableGetKeywords() {
  yield takeLatest(types.AIRTABLE_GET_KEYWORDS_REQUESTED, workAirtableGetKeywords);
}

function personPutInvalid(params = {}) {
  const data = {
    fields: { ...params },
  };
  return axios({
    method: 'post',
    url: '/.netlify/functions/airtable_post_report',
    data,
  });
}

function* workPersonPutInvalid(action) {
  const { params } = action;
  try {
    const results = yield call(personPutInvalid, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.PERSON_PUT_INVALID_FAILED, error: results.data.error });
    } else {
      yield put({ type: types.PERSON_PUT_INVALID_SUCCEEDED, params });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PERSON_PUT_INVALID_FAILED, params, error });
  }
}

export function* watchPersonPutInvalid() {
  yield takeEvery(types.PERSON_PUT_INVALID_REQUESTED, workPersonPutInvalid);
}

function sendFeedback(params = {}) {
  const data = {
    records: [
      {
        fields: { ...params },
      },
    ],
    typecast: true,
  };
  return axios({
    method: 'post',
    url: '/.netlify/functions/airtable_post_feedback',
    data,
  });
}

function* workSendFeedback(action) {
  const { params } = action;
  try {
    const results = yield call(sendFeedback, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.FEEDBACK_SEND_FAILED, error: results.data.error });
    } else {
      yield put({ type: types.FEEDBACK_SEND_SUCCEEDED });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.FEEDBACK_SEND_FAILED, error });
  }
}

export function* watchSendFeedback() {
  yield takeEvery(types.FEEDBACK_SEND_REQUESTED, workSendFeedback);
}
