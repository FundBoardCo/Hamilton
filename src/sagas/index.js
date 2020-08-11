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
  WEBFLOW_APIKEY,
  ZIPCODEAPI,
} from '../constants';
import {
  getSafeVar,
  processErr,
  toQueryString,
} from '../utils';
import * as types from '../actions/types';
import Webflow from 'webflow-api';

const api = 'https://api.fundboard.co/';

const webFlowAPI = new Webflow({ token: WEBFLOW_APIKEY });

const cookies = document.cookie.split(';');
cookies.forEach(c => {
  console.log(decodeURIComponent(c));
});

function trackErr(err) {
  window.heap.track('Error', { message: processErr(err) });
}

function isLoginErr(err) {
  const status = getSafeVar(() => err.response.status);
  return status === '401';
}

const loginErrProps = { type: types.MODAL_SET_OPEN, model: 'login' };

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

function getInfo(params) {
  const { itemId } = params;
  return webFlowAPI.item({
    collectionId: '5e8e265102dac128f49dd555',
    itemId,
  });
}

function* workGetInfo(action) {
  const { params } = action;
  try {
    const data = yield call(getInfo, params);
    yield put({ type: types.INFO_GET_SUCCEEDED, params, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.INFO_GET_FAILED, error });
  }
}

function* watchGetInfo() {
  yield takeEvery(types.INFO_GET_REQUESTED, workGetInfo);
}

function userLogin(data = {}) {
  return axios({
    method: 'post',
    url: `${api}login`,
    data,
  });
}

function* workUserLogin(action) {
  try {
    const { params } = action;
    const results = yield call(userLogin, params);
    yield put({ type: types.USER_LOGIN_SUCCEEDED, data: results.data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_LOGIN_FAILED, error });
  }
}

function* watchUserLogin() {
  yield takeLatest(types.USER_LOGIN_REQUESTED, workUserLogin);
}

function userCreate(data = {}) {
  return axios({
    method: 'post',
    url: `${api}create`,
    data,
  });
}

function* workUserCreate(action) {
  try {
    const { params } = action;
    const results = yield call(userCreate, params);
    yield put({ type: types.USER_CREATE_SUCCEEDED, data: results.data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_CREATE_FAILED, error });
  }
}

function* watchUserCreate() {
  yield takeLatest(types.USER_CREATE_REQUESTED, workUserCreate);
}

function userUpdate(data = {}) {
  return axios({
    method: 'post',
    url: `${api}profile`,
    data,
  });
}

function* workUserUpdate(action) {
  try {
    const { params } = action;
    const results = yield call(userUpdate, params);
    yield put({ type: types.USER_UPDATE_SUCCEEDED, data: results.data });
  } catch (error) {
    trackErr(error);
    if (isLoginErr(error)) yield put(loginErrProps);
    yield put({ type: types.USER_UPDATE_FAILED, error });
  }
}

function* watchUserUpdate() {
  yield takeEvery(types.USER_UPDATE_REQUESTED, workUserUpdate);
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
    url: 'https://api.airtable.com/v0/app7qe3RJry7GgvKw/Feedback',
    headers: { Authorization: `Bearer ${AIRTABLE_APIKEY}` },
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

function* watchSendFeedback() {
  yield takeEvery(types.FEEDBACK_SEND_REQUESTED, workSendFeedback);
}

function getBoard() {
  return axios.get(`${api}profile`);
}

function* workGetBoard() {
  try {
    const results = yield call(getBoard);
    yield put({ type: types.BOARD_GET_SUCCEEDED, data: results.data });
  } catch (error) {
    trackErr(error);
    if (isLoginErr(error)) yield put(loginErrProps);
    yield put({ type: types.BOARD_GET_FAILED, error });
  }
}

function* watchGetBoard() {
  yield takeLatest(types.BOARD_GET_REQUESTED, workGetBoard);
}

function getExtraZipCodes(zipcode) {
  return axios.get(
    `https://www.zipcodeapi.com/rest/${ZIPCODEAPI}/radius.json/${zipcode}/20/mile?minimal`,
  );
}

function* workGetExtraZipCodes(action) {
  const zipcode = action.location;
  if (!zipcode || typeof zipcode !== 'string' || zipcode.length !== 5) {
    yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_FAILED, error: 'Invalid Zip Code' });
    throw new Error('Invalid Zip Code');
  }
  try {
    const results = yield call(getExtraZipCodes, zipcode);
    yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_SUCCEEDED, data: results.data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_FAILED, error });
  }
}

function* watchSearchSetZipCode() {
  yield takeLatest(types.SEARCH_SET_LOCATION, workGetExtraZipCodes);
}

function requestSearchGetResults(params = {}) {
  return axios.get(`${api}search?${toQueryString(params)}`);
}

function* workSearchGetResults(action) {
  const { params } = action;
  params.limit = params.limit || 100;
  try {
    const results = yield call(requestSearchGetResults, params);
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
  yield fork(watchUserCreate);
  yield fork(watchUserLogin);
  yield fork(watchUserUpdate);
  yield fork(watchPersonPutInvalid);
  yield fork(watchSearchSetZipCode);
  yield fork(watchSearchGetResults);
  yield fork(watchGetBoard);
  yield fork(watchSendFeedback);
  yield fork(watchGetInfo);
}
