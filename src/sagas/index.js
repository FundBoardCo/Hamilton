import {
  put,
  call,
  fork,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import Webflow from 'webflow-api';
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

const api = 'https://api.fundboard.co/';

const webFlowAPI = new Webflow({ token: WEBFLOW_APIKEY });

const getToken = state => state.user.token;
const getEmail = state => state.user.email;
const getInvestors = state => state.user.investors;
const getBoard = state => state.board.ids;

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
    yield put({ type: types.USER_LOGIN_SUCCEEDED, data: results.data });
    yield put({ type: types.USER_GET_PROFILE_REQUESTED });
    const investors = yield select(getInvestors);
    yield put({ type: types.BOARD_MERGE, ids: [...investors] });
    const board = yield select(getBoard);
    if (Array.isArray(board) && board.length) {
      const uParams = { investors: [...board] };
      yield put({ type: types.USER_UPDATE_REQUESTED, params: uParams });
    }
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

function userUpdate(params) {
  const { token } = params;
  const data = { ...params };
  delete data.token;
  return axios({
    method: 'post',
    url: `${api}profile`,
    data,
    headers: {
      Authorization: token,
    },
  });
}

function* workUserUpdate(action) {
  try {
    const { params } = action;
    params.token = yield select(getToken);
    // if email is not being changed, send current email so API doesn't error
    const email = yield select(getEmail);
    params.email = params.email || email;
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

function getUserProfile(token) {
  return axios({
    method: 'get',
    url: `${api}profile`,
    headers: {
      Authorization: token,
    },
  });
}

function* workUserGetProfile() {
  try {
    const token = yield select(getToken);
    const results = yield call(getUserProfile, token);
    const ids = getSafeVar(() => results.data.investors, []);
    yield put({ type: types.USER_GET_PROFILE_SUCCEEDED, data: results.data });
    yield put({ type: types.BOARD_MERGE, ids });
  } catch (error) {
    trackErr(error);
    if (isLoginErr(error)) yield put(loginErrProps);
    yield put({ type: types.USER_GET_PROFILE_FAILED, error });
  }
}

function* watchUserGetProfile() {
  yield takeLatest(types.USER_GET_PROFILE_REQUESTED, workUserGetProfile);
}

function userDelete(token) {
  return axios({
    method: 'post',
    url: `${api}profile/delete`,
    headers: {
      Authorization: token,
    },
  });
}

function* workUserDelete() {
  try {
    const token = yield select(getToken);
    yield call(userDelete, token);
    yield put({ type: types.USER_DELETE_SUCCEEDED });
  } catch (error) {
    trackErr(error);
    if (isLoginErr(error)) yield put(loginErrProps);
    yield put({ type: types.USER_DELETE_FAILED, error });
  }
}

function* watchUserDelete() {
  yield takeEvery(types.USER_DELETE_REQUESTED, workUserDelete);
}

function userReset(email) {
  return axios({
    method: 'post',
    url: `${api}recover`,
    data: { email },
  });
}

function* workUserReset(action) {
  try {
    const { email } = action;
    yield call(userReset, email);
    yield put({ type: types.USER_RESETPASSWORD_SUCCEEDED });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_RESETPASSWORD_FAILED, error });
  }
}

function* watchUserReset() {
  yield takeEvery(types.USER_RESETPASSWORD_REQUESTED, workUserReset);
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

function* workBoardRemove(action) {
  const token = yield select(getToken);
  const board = yield select(getBoard)
  const { id } = action;
  const params = {
    investors: board.filter(i => i !== id),
  };
  try {
    if (token) {
      yield put({ type: types.USER_UPDATE_REQUESTED, params });
    }
  } catch (error) {
    trackErr(error);
  }
}

function* watchBoardRemove() {
  yield takeLatest(types.BOARD_ADD, workBoardRemove);
}

function* workBoardAdd(action) {
  const token = yield select(getToken);
  const board = yield select(getBoard)
  const { id } = action;
  const params = {
    investors: [...new Set([...board, id])],
  };
  try {
    if (token) {
      yield put({ type: types.USER_UPDATE_REQUESTED, params });
    }
  } catch (error) {
    trackErr(error);
  }
}

function* watchBoardAdd() {
  yield takeLatest(types.BOARD_ADD, workBoardAdd);
}

function getExtraZipCodes(zipcode) {
  return axios.get(
    `https://www.zipcodeapi.com/rest/${ZIPCODECLIENTKEY}/radius.json/${zipcode}/10/mile?minimal`,
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

function getCityZipCodes(params) {
  let { city, state } = params;
  city = city.toLowerCase();
  state = state.toLowerCase();
  return axios.get(
    `https://www.zipcodeapi.com/rest/${ZIPCODECLIENTKEY}/city-zips.json/${city}/${state}`,
  );
}

function* workGetCityZipCodes(action) {
  const { params } = action;
  try {
    if (!params.city || !params.state) throw new Error('Missing city or state.');
    const results = yield call(getCityZipCodes, params);
    yield put({ type: types.SEARCH_GET_CITYZIPCODES_SUCCEEDED, data: results.data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.SEARCH_GET_CITYZIPCODES_FAILED, error });
  }
}

function* watchSearchGetCityZipCodes() {
  yield takeLatest(types.SEARCH_GET_CITYZIPCODES_REQUESTED, workGetCityZipCodes);
}

function getPeopleResults(params) {
  const { ids, token } = params;
  return axios({
    method: 'get',
    url: `${api}investors?${toQueryString({ ids })}`,
    headers: {
      Authorization: token,
    },
  });
}

function* workPeopleGetResults(action) {
  const params = { ids: action.ids };
  try {
    params.token = yield select(getToken);
    const results = yield call(getPeopleResults, params);
    yield put({ type: types.PEOPLE_GET_SUCCEEDED, params, data: results.data });
  } catch (error) {
    yield put({ type: types.PEOPLE_GET_FAILED, params, error });
  }
}

function* watchPeopleGetResults() {
  yield takeEvery(types.PEOPLE_GET_REQUEST, workPeopleGetResults);
}

function getPeopleInvestments(params) {
  const { id, token } = params;
  return axios({
    method: 'get',
    url: `${api}investments?${toQueryString({ id })}`,
    headers: {
      Authorization: token,
    },
  });
}

function* workPeopleGetInvestments(action) {
  const { id } = action;
  const params = { id };
  try {
    params.token = yield select(getToken);
    const results = yield call(getPeopleInvestments, params);
    yield put({
      type: types.PEOPLE_GET_INVESTMENTS_SUCCEEDED,
      params,
      id,
      data: results.data,
    });
  } catch (error) {
    yield put({
      type: types.PEOPLE_GET_INVESTMENTS_FAILED,
      id,
      params,
      error,
    });
  }
}

function* watchPeopleGetInvestments() {
  yield takeEvery(types.PEOPLE_GET_INVESTMENTS_REQUEST, workPeopleGetInvestments);
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
  yield fork(watchBoardAdd);
  yield fork(watchBoardRemove);
  yield fork(watchUserCreate);
  yield fork(watchUserLogin);
  yield fork(watchUserUpdate);
  yield fork(watchUserDelete);
  yield fork(watchUserReset);
  yield fork(watchUserGetProfile);
  yield fork(watchPersonPutInvalid);
  yield fork(watchPeopleGetResults);
  yield fork(watchPeopleGetInvestments);
  yield fork(watchSearchSetZipCode);
  yield fork(watchSearchGetCityZipCodes);
  yield fork(watchSearchGetResults);
  yield fork(watchSendFeedback);
  yield fork(watchGetInfo);
}
