import {
  put,
  call,
  fork,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import axios from 'axios';
import {
  ZIPCODECLIENTKEY,
} from '../constants';
import {
  getSafeVar,
  trackErr,
  isLoginErr,
  toQueryString,
} from '../utils';
import * as types from '../actions/types';
import {
  watchSendFeedback,
  watchPersonPutInvalid,
  watchAirtableGetKeywords,
} from './airtable';
import {
  watchInvestorStatusesGet,
  watchPublicBoardGet,
  watchInvestorStatusPost,
  watchUserPublicBoardPost,
  watchPublicInvestorStatusUpdate,
  watchFounderDataGet,
  watchUserFounderDataPost,
} from './manageRaise';

const api = `https://${process.env.REACT_APP_ENV === 'DEV' ? 'staging-' : ''}api.fundboard.co/`;

const getToken = state => state.user.token;
const getBoard = state => state.board.ids;
const getInvestors = state => state.user.investors;

const loginErrProps = { type: types.MODAL_SET_OPEN, model: 'login' };

function getInfo(params) {
  return axios.get(`/.netlify/functions/webflow_get_blog?${toQueryString(params)}`);
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
    const { email } = params;
    const results = yield call(userLogin, params);
    yield put({ type: types.USER_LOGIN_SUCCEEDED, data: results.data });
    window.heap.identify(email);
    window.heap.addUserProperties({ email });
    yield put({ type: types.USER_GET_PROFILE_REQUESTED });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_LOGIN_FAILED, error });
  }
}

function* watchUserLogin() {
  yield takeLatest(types.USER_LOGIN_REQUESTED, workUserLogin);
}

function workUserLogout() {
  window.heap.resetIdentity();
}

function* watchUserLogout() {
  yield takeLatest(types.USER_LOGOUT, workUserLogout);
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
    const { email } = params;
    const results = yield call(userCreate, params);
    yield put({ type: types.USER_CREATE_SUCCEEDED, data: results.data });
    window.heap.identity(email);
    window.heap.addUserProperties({
      email,
    });
    yield put({ type: types.USER_GET_PROFILE_REQUESTED });
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
    if (Array.isArray(params.investors)) {
      params.following = params.investors;
      delete params.investors;
      window.heap.addUserProperties({
        investorCount: params.following.length,
      });
    }
    params.token = yield select(getToken);
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

function* workUserGetProfileSucceeded() {
  // any time the profile is received, if unmerged investors are on the board update the profile
  const ids = yield select(getInvestors) || [];
  const unmergedBoard = yield select(getBoard) || [];
  if (ids.length && unmergedBoard.filter(b => !ids.includes(b)).length) {
    yield put({ type: types.BOARD_MERGE, ids });
    const board = yield select(getBoard) || [];
    const params = {
      investors: [...board],
    };
    yield put({ type: types.USER_UPDATE_REQUESTED, params });
  }
}

function* watchUserGetProfileSucceeded() {
  yield takeLatest(types.USER_GET_PROFILE_SUCCEEDED, workUserGetProfileSucceeded);
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
    const ids = getSafeVar(() => results.data.following, []);
    const investorCount = Array.isArray(ids) && ids.length;
    yield put({ type: types.USER_GET_PROFILE_SUCCEEDED, data: results.data });
    window.heap.addUserProperties({
      investorCount,
    });
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

function* workBoardRemove(action) {
  const token = yield select(getToken);
  const board = yield select(getBoard);
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
  yield takeLatest(types.BOARD_REMOVE, workBoardRemove);
}

function* workBoardAdd(action) {
  const token = yield select(getToken);
  const board = yield select(getBoard);
  const { id, data } = action;
  const params = {
    investors: [...new Set([...board, id])],
  };
  try {
    if (token) {
      yield put({ type: types.USER_UPDATE_REQUESTED, params });
    }
    yield put({ type: 'PEOPLE_UPDATE', data: [data] });
  } catch (error) {
    trackErr(error);
  }
}

function* watchBoardAdd() {
  yield takeLatest(types.BOARD_ADD, workBoardAdd);
}

function getExtraZipCodes(params) {
  const { zipcode, miles } = params;
  return axios.get(
    `https://www.zipcodeapi.com/rest/${ZIPCODECLIENTKEY}/radius.json/${zipcode}/${miles}/mile`,
    // `/.netlify/functions/zipcodeapi_get_codes?${toQueryString(params)}`,
  );
}

function* workGetExtraZipCodes(action) {
  const zipcode = action.location;
  const params = {
    zipcode,
    miles: 10,
  };
  try {
    if (!zipcode || typeof zipcode !== 'string' || zipcode.length !== 5) {
      yield put({ type: types.SEARCH_GET_EXTRAZIPCODES_FAILED, error: 'Invalid Zip Code' });
    } else {
      const results = yield call(getExtraZipCodes, params);
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

function getPeopleResults(params) {
  const { id, token } = params;
  return axios({
    method: 'get',
    url: `${api}investors?${toQueryString({ id })}`,
    headers: {
      Authorization: token,
    },
  });
}

function* workPeopleGetResults(action) {
  const params = { id: action.id };
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
  params.limit = params.limit || 3000;
  try {
    const results = yield call(requestSearchGetResults, params);
    yield put({ type: 'SEARCH_GET_RESULTS_SUCCEEDED', data: results.data });
  } catch (error) {
    trackErr(error);
    yield put({ type: 'SEARCH_GET_RESULTS_FAILED', error });
  }
}

function* watchSearchGetResults() {
  yield takeLatest('SEARCH_GET_RESULTS_REQUESTED', workSearchGetResults);
}

function workRehydrate(action) {
  const { key, payload } = action;
  const { token, email, investors } = payload;
  const investorCount = Array.isArray(investors) && investors.length;
  if (key === 'user' && token && email) {
    window.heap.identify(email);
    window.heap.addUserProperties({
      email,
      investorCount,
    });
  }
}

function* watchRehydrate() {
  yield takeLatest(REHYDRATE, workRehydrate);
}

export default function* rootSaga() {
  yield fork(watchRehydrate);
  yield fork(watchAirtableGetKeywords);
  yield fork(watchBoardAdd);
  yield fork(watchBoardRemove);
  yield fork(watchUserCreate);
  yield fork(watchUserLogin);
  yield fork(watchUserLogout);
  yield fork(watchUserUpdate);
  yield fork(watchUserDelete);
  yield fork(watchUserReset);
  yield fork(watchUserGetProfile);
  yield fork(watchUserGetProfileSucceeded);
  yield fork(watchInvestorStatusesGet);
  yield fork(watchPublicBoardGet);
  yield fork(watchFounderDataGet);
  yield fork(watchUserFounderDataPost);
  yield fork(watchPublicInvestorStatusUpdate);
  yield fork(watchInvestorStatusPost);
  yield fork(watchUserPublicBoardPost);
  yield fork(watchPersonPutInvalid);
  yield fork(watchPeopleGetResults);
  yield fork(watchPeopleGetInvestments);
  yield fork(watchSearchSetZipCode);
  yield fork(watchSearchGetResults);
  yield fork(watchSendFeedback);
  yield fork(watchGetInfo);
}
