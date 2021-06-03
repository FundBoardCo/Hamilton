import Parse from 'parse';
import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import * as types from '../actions/types';
import { trackErr } from '../utils';

function getFounders(permalinks) {
  if (!Array.isArray(permalinks)) throw new Error('An array of permalinks is required.');
  const params = { permalinks };
  return Parse.Cloud.run('getFoundersByPermalink', params);
}

function* workFoundersGet(action) {
  const { permalinks } = action;

  try {
    const data = yield call(getFounders, permalinks);
    yield put({ type: types.FOUNDERSCB_GET_SUCCEEDED, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.FOUNDERSCB_GET_FAILED, error });
  }
}

export function* watchFoundersGet() {
  yield takeLatest(types.FOUNDERSCB_GET_REQUESTED, workFoundersGet);
}

function getStartups(params) {
  return Parse.Cloud.run('getStartups', params);
}

function* workStartupsGet(action) {
  const { permalinks, uuids } = action;
  const params = { permalinks, uuids, includeFounders: true };

  try {
    const data = yield call(getStartups, params);
    yield put({ type: types.STARTUPSCB_GET_SUCCEEDED, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.STARTUPSCB_GET_FAILED, error });
  }
}

export function* watchStartupsGet() {
  yield takeLatest(types.STARTUPSCB_GET_REQUESTED, workStartupsGet);
}
