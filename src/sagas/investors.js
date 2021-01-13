import Parse from 'parse';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { v5 as uuidv5 } from 'uuid';
import {
  isPlainObject,
  trackErr,
  parseB4AObject,
} from '../utils';
import * as types from '../actions/types';

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
