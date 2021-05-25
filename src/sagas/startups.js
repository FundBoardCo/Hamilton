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
    yield put({ type: types.FOUNDERS_GET_SUCCEEDED, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.FOUNDERS_GET_FAILED, error });
  }
}

export function* watchFoundersGet() {
  yield takeLatest(types.FOUNDERS_GET_REQUEST, workFoundersGet);
}

function getStartups(permalinks) {
  if (!Array.isArray(permalinks)) throw new Error('An array of permalinks is required.');
  const params = { permalinks };
  return Parse.Cloud.run('getStartupsByPermalink', params);
}

function* workStartupsGet(action) {
  const { permalinks } = action;

  try {
    const data = yield call(getStartups, permalinks);
    yield put({ type: types.STARTUPS_GET_SUCCEEDED, data });
    // TODO trigger get founders here, success should include the startup permalink
  } catch (error) {
    trackErr(error);
    yield put({ type: types.STARTUPS_GET_FAILED, error });
  }
}

export function* watchStartupsGet() {
  yield takeLatest(types.STARTUPS_GET_REQUEST, workStartupsGet);
}
