import {
  put,
  call,
  fork,
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
  watchPublicUserGet,
  watchPublicInvestorsGet,
  watchPostIntro,
} from './founders';
import {
  watchUserGetOwnInvestors,
  watchUserPostInvestor,
  watchUserSafeAdd,
} from './investors';
import {
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
  yield fork(watchPublicInvestorsGet);
  yield fork(watchProfileDataGet);
  yield fork(watchPublicUserGet);
  yield fork(watchUserProfileDataGet);
  yield fork(watchUserProfileDataPost);
  yield fork(watchPostIntro);
  yield fork(watchUserManualInvestorPost);
  yield fork(watchUserManualInvestorsGet);
  yield fork(watchPersonPutInvalid);
  yield fork(watchSearchSetZipCode);
  yield fork(watchSendFeedback);
  yield fork(watchGetInfo);
}
