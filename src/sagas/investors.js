import Parse from 'parse';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import {
  isPlainObject,
  trackErr,
  parseB4AObject,
} from '../utils';
import * as types from '../actions/types';

const getLoggedOutInvestorIDs = state => state.investors.loggedOutInvestorIDs;
const getUserUUID = state => state.user.uuid;

async function getOwnInvestors() {
  return Parse.Cloud.run('getOwnInvestors');
}

function* workUserGetOwnInvestors() {
  try {
    const data = yield call(getOwnInvestors);
    yield put({
      type: types.USER_GET_INVESTORS_SUCCEEDED,
      data,
    });
  } catch (error) {
    trackErr(error);
    yield put({
      type: types.USER_GET_INVESTORS_FAILED,
      error,
    });
  }
}

export function* watchUserGetOwnInvestors() {
  yield takeLatest(types.USER_GET_INVESTORS_REQUESTED, workUserGetOwnInvestors);
}

async function postInvestor(params) {
  return Parse.Cloud.run('updateInvestor', params);
}

function* workUserPostInvestor(action) {
  const { params } = action;
  if (!params.uuid && !params.objectId) params.uuid = uuidv4();

  try {
    if (!params || !isPlainObject(params) || !Object.keys(params).length) {
      throw new Error('Params are required to save the investor.');
    }
    const result = yield call(postInvestor, params);
    const data = parseB4AObject(result);
    yield put({
      type: types.USER_POST_INVESTOR_SUCCEEDED,
      data,
    });
    // close the edit component by setting the edited note to null
    yield put({ type: types.USER_SET_EDITNOTE, params: { noteID: null } });
  } catch (error) {
    trackErr(error);
    yield put({
      type: types.USER_POST_INVESTOR_FAILED,
      error,
    });
  }
}

export function* watchUserPostInvestor() {
  yield takeLatest(types.USER_POST_INVESTOR_REQUESTED, workUserPostInvestor);
}

async function safeAdd(params) {
  return Parse.Cloud.run('bulkAddInvestors', params);
}

function* workUserSafeAdd() {
  const profileUUID = yield select(getUserUUID);
  const uuids = yield select(getLoggedOutInvestorIDs);
  const investors = uuids.map(u => ({
    uuid: u,
    stage: 'added',
    profileUUID,
  }));
  const params = { investors };

  try {
    const data = yield call(safeAdd, params);
    yield put({
      type: types.USER_POST_SAFEADDINVESTORS_SUCCEEDED,
      data,
    });
    yield put({ type: types.USER_GET_INVESTORS_REQUESTED });
  } catch (error) {
    trackErr(error);
    yield put({
      type: types.USER_POST_SAFEADDINVESTORS_FAILED,
      error,
    });
  }
}

export function* watchUserSafeAdd() {
  yield takeLatest(types.USER_POST_SAFEADDINVESTORS_REQUESTED, workUserSafeAdd);
}
