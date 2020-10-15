import axios from 'axios';
import {
  call,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { trackErr } from '../utils';
import * as types from '../actions/types';

function requestAirtableGetKeywords() {
  return axios.get('/.netlify/functions/airtable_get_keywords');
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

export function* watchAirtableGetKeywords() {
  yield takeLatest('AIRTABLE_GET_KEYWORDS_REQUESTED', workAirtableGetKeywords);
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
    yield call(personPutInvalid, params);
    yield put({ type: 'PERSON_PUT_INVALID_SUCCEEDED', params });
  } catch (error) {
    trackErr(error);
    yield put({ type: 'PERSON_PUT_INVALID_FAILED', params, error });
  }
}

export function* watchPersonPutInvalid() {
  yield takeEvery('PERSON_PUT_INVALID_REQUESTED', workPersonPutInvalid);
}

function sendFeedback(params = {}) {
  const { email, date } = params;
  if (!email || !date) throw new Error('Must include email and date.');

  const data = {
    records: [
      {
        fields: {
          key: `${email}-${new Date().getTime()}`,
          ...params,
        },
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
    yield call(sendFeedback, params);
    yield put({ type: types.FEEDBACK_SEND_SUCCEEDED });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.FEEDBACK_SEND_FAILED, error });
  }
}

export function* watchSendFeedback() {
  yield takeEvery(types.FEEDBACK_SEND_REQUESTED, workSendFeedback);
}
