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
  ZIPDISTANCE,
} from '../constants';
import {
  trackErr,
  toQueryString,
} from '../utils';
import * as types from '../actions/types';
import {
  watchSendFeedback,
  watchPersonPutInvalid,
  watchAirtableGetKeywords,
} from './airtable';
import {
  watchProfileDataGet,
  watchPublicBoardGet,
  watchPostIntro,
} from './founders';
import {
  watchUserGetOwnInvestors,
  watchUserPostInvestor,
  watchUserSafeAdd,
} from './investors';
import {
  watchBoardUUIDGet,
  watchUserPublicBoardPost,
  watchUserManualInvestorPost,
  watchUserManualInvestorsGet,
} from './manageRaise';
import {
  watchUserCreate,
  watchUserLogin,
  watchUserReset,
  watchUserLogout,
  watchUserDelete,
  watchUserUpdate,
  watchUserProfileDataGet,
  watchUserProfileDataPost,
} from './user';

const api = `https://${process.env.REACT_APP_ENV === 'DEV' ? 'staging-' : ''}api.fundboard.co/`;

const getToken = state => state.user.sessionToken;

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

/*
function* workBoardRemove(action) {
  const token = yield select(getToken);
  const board = yield select(getBoard);
  const { id } = action;
  const params = {
    investors: board.filter(i => i !== id),
  };
  const boardParams = { ...params };
  try {
    if (token) {
      yield put({ type: types.USER_UPDATE_REQUESTED, params });
    }
    yield put({ type: types.BOARD_REMOVE_COMPLETE, params: boardParams });
  } catch (error) {
    trackErr(error);
  }
}

function* watchBoardRemove() {
  yield takeLatest(types.BOARD_REMOVE, workBoardRemove);
}
 */

/*
function* workBoardAdd(action) {
  const token = yield select(getToken);
  const board = yield select(getBoard);
  const { id } = action;
  const params = {
    investors: [...new Set([...board, id])],
  };
  const boardParams = { ...params };
  try {
    if (token) {
      yield put({ type: types.USER_UPDATE_REQUESTED, params });
    }
    yield put({ type: types.BOARD_ADD_COMPLETE, params: boardParams });
  } catch (error) {
    trackErr(error);
  }
}

function* watchBoardAdd() {
  yield takeLatest(types.BOARD_ADD, workBoardAdd);
}
 */

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
    miles: ZIPDISTANCE,
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
  yield fork(watchUserCreate);
  yield fork(watchUserLogin);
  yield fork(watchUserLogout);
  yield fork(watchUserUpdate);
  yield fork(watchUserDelete);
  yield fork(watchUserReset);
  yield fork(watchUserGetOwnInvestors);
  yield fork(watchUserPostInvestor);
  yield fork(watchUserSafeAdd);
  yield fork(watchPublicBoardGet);
  yield fork(watchBoardUUIDGet);
  yield fork(watchProfileDataGet);
  yield fork(watchUserProfileDataGet);
  yield fork(watchUserProfileDataPost);
  yield fork(watchPostIntro);
  yield fork(watchUserManualInvestorPost);
  yield fork(watchUserManualInvestorsGet);
  yield fork(watchUserPublicBoardPost);
  yield fork(watchPersonPutInvalid);
  // yield fork(watchPeopleGetResults);
  yield fork(watchPeopleGetInvestments);
  yield fork(watchSearchSetZipCode);
  // yield fork(watchSearchGetResults);
  yield fork(watchSendFeedback);
  yield fork(watchGetInfo);
}
