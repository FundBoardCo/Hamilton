import {
  put,
  call,
  fork,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import Webflow from 'webflow-api';
import Cookies from 'js-cookie';
import {
  AIRTABLE_APIKEY,
  WEBFLOW_APIKEY,
  ZIPCODECLIENTKEY,
} from '../constants';
import {
  getSafeVar,
  processErr,
  toQueryString,
} from '../utils';
import * as types from '../actions/types';

const fakeSearchResults = {
  a581f00270e756a292132c57368f7fa9a: {
    name: 'Adam Claypool',
    permalink: 'adam-claypool',
    image_id: 'https://crunchbase-production-res.cloudinary.com/image/upload/c_lpad,h_120,w_120,f_jpg/qkp5eobyvo6nld7wmwx7',
    primary_job_title: 'Managing Principal',
    primary_organization: {
      value: 'Bridgepoint Merchant Banking',
      image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/v1470308956/fmly1xc4xcwkntryblqd.jpg',
      permalink: 'bridgepoint-merchant-banking',
      entity_def_id: 'organization',
      homepage: 'https://www.bridgepointib.com',
      linkedin: '',
      twitter: '',
    },
    isLead: true,
    isOpen: false,
    isImpact: false,
    matches: {
      keywords: ['agriculture', 'SAAS'],
      raise: true,
      location: true,
      name: false,
      org: false,
    },
  },
  a581f00270e756a292132c57368f7fa9a1: {
    name: 'Adam Claypool',
    permalink: 'adam-claypool',
    image_id: 'https://crunchbase-production-res.cloudinary.com/image/upload/c_lpad,h_120,w_120,f_jpg/qkp5eobyvo6nld7wmwx7',
    primary_job_title: 'Managing Principal',
    primary_organization: {
      value: 'Bridgepoint Merchant Banking',
      image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/v1470308956/fmly1xc4xcwkntryblqd.jpg',
      permalink: 'bridgepoint-merchant-banking',
      entity_def_id: 'organization',
      homepage: 'https://www.bridgepointib.com',
      linkedin: '',
      twitter: '',
    },
    isLead: true,
    isOpen: false,
    isImpact: false,
    matches: {
      keywords: ['agriculture', 'SAAS'],
      raise: true,
      location: true,
      name: false,
      org: false,
    },
  },
  a581f00270e756a292132c57368f7fa9a2: {
    name: 'Adam Claypool',
    permalink: 'adam-claypool',
    image_id: 'https://crunchbase-production-res.cloudinary.com/image/upload/c_lpad,h_120,w_120,f_jpg/qkp5eobyvo6nld7wmwx7',
    primary_job_title: 'Managing Principal',
    primary_organization: {
      value: 'Bridgepoint Merchant Banking',
      image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/v1470308956/fmly1xc4xcwkntryblqd.jpg',
      permalink: 'bridgepoint-merchant-banking',
      entity_def_id: 'organization',
      homepage: 'https://www.bridgepointib.com',
      linkedin: '',
      twitter: '',
    },
    isLead: true,
    isOpen: false,
    isImpact: false,
    matches: {
      keywords: ['agriculture', 'SAAS'],
      raise: true,
      location: true,
      name: false,
      org: false,
    },
  },
};

const api = 'https://api.fundboard.co/';

axios.defaults.withCredentials = true;

const webFlowAPI = new Webflow({ token: WEBFLOW_APIKEY });

function listCookies() {
  const cookies = document.cookie.split(';');
  cookies.forEach(c => {
    console.log(decodeURIComponent(c));
  });
}

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
  const { itemId, collection } = params;
  let collectionId = '5f32059a4837a2f38d6d2de3'; // tips, the default;
  if (collection === 'blog') collectionId = '5e8e265102dac128f49dd555';
  return webFlowAPI.item({
    collectionId,
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
    console.log(results)
    console.log(Cookies.get())
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
    `https://www.zipcodeapi.com/rest/${ZIPCODECLIENTKEY}/radius.json/${zipcode}/20/mile?minimal`,
  );
}

function* workGetExtraZipCodes(action) {
  const zipcode = action.location;
  try {
    if (!zipcode || typeof zipcode !== 'string' || zipcode.length !== 5) {
      yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_FAILED, error: 'Invalid Zip Code' });
    } else {
      const results = yield call(getExtraZipCodes, zipcode);
      yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_SUCCEEDED, data: results.data });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_FAILED, error });
  }
}

function* watchSearchSetZipCode() {
  yield takeLatest(types.SEARCH_SET_LOCATION, workGetExtraZipCodes);
}

function getPeopleResults(ids) {
  //return axios.get(`${api}investors?${toQueryString(ids)}`);
  return axios({
    method: 'get',
    url: `${api}investors?${toQueryString({ id: ids })}`,
    headers: {
      'Content-Type': 'application/json',
      'access-control-expose-headers': 'WWW-Authenticate,Server-Authorization',
      'Access-Control-Allow-Credentials': true,
    },
  });
}

function* workPeopleGetResults(action) {
  listCookies();
  const { ids } = action;
  try {
    const results = yield call(getPeopleResults, ids);
    yield put({ type: types.PEOPLE_GET_SUCCEEDED, data: results.data });
  } catch (error) {
    yield put({ type: types.PEOPLE_GET_FAILED, ids, error });
  }
}

function* watchPeopleGetResults() {
  yield takeEvery(types.PEOPLE_GET_REQUEST, workPeopleGetResults);
}

function requestSearchGetResults(params = {}) {
  return axios.get(`${api}search?${toQueryString(params)}`);
}

function* workSearchGetResults(action) {
  const { params } = action;
  params.limit = params.limit || 100;
  try {
    const results = yield call(requestSearchGetResults, params);
    // fake code TODO: remove
    results.data = { ...fakeSearchResults };
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
  yield fork(watchPeopleGetResults);
  yield fork(watchSearchSetZipCode);
  yield fork(watchSearchGetResults);
  yield fork(watchGetBoard);
  yield fork(watchSendFeedback);
  yield fork(watchGetInfo);
}
