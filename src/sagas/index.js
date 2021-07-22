import {
  all,
  call,
  fork,
  put,
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
import {
  watchPeopleGet,
} from './people';
import {
  watchStartupsGet,
  watchFoundersGet,
} from './startups';

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
  const { key, payload = {} } = action;
  const { token, email } = payload;
  if (key === 'user' && token && email) {
    window.heap.identify(email);
    window.heap.addUserProperties({
      email,
    });
  }
}

export default function* rootSaga() {
  // prevent all other sagas until rehydration is complete
  yield takeLatest(REHYDRATE, workRehydrate);
  yield all([
    fork(watchAirtableGetKeywords),
    fork(watchUserCreate),
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchUserUpdate),
    fork(watchUserDelete),
    fork(watchUserReset),
    fork(watchUserGetOwnInvestors),
    fork(watchUserPostInvestor),
    fork(watchUserSafeAdd),
    fork(watchPublicInvestorsGet),
    fork(watchProfileDataGet),
    fork(watchPublicUserGet),
    fork(watchUserProfileDataGet),
    fork(watchUserProfileDataPost),
    fork(watchPostIntro),
    fork(watchUserManualInvestorPost),
    fork(watchUserManualInvestorsGet),
    fork(watchPersonPutInvalid),
    fork(watchSearchSetZipCode),
    fork(watchSendFeedback),
    fork(watchGetInfo),
    fork(watchPeopleGet),
    fork(watchFoundersGet),
    fork(watchStartupsGet),
  ]);
}
