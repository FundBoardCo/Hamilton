import Parse from 'parse';
import {
  call,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import * as types from '../actions/types';
import { isPlainObject, trackErr } from '../utils';

function getPublicBoard(params) {
  if (!params.uuid) throw new Error('A UUID is required.');
  return Parse.Cloud.run('getPublicInvestors', params);
}

function* workPublicInvestorsGet(action) {
  const { uuid } = action;
  const params = { uuid };

  try {
    const data = yield call(getPublicBoard, params);
    yield put({ type: types.PUBLIC_GET_INVESTORS_SUCCEEDED, uuid, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_INVESTORS_FAILED, error });
  }
}

export function* watchPublicInvestorsGet() {
  yield takeLatest(types.PUBLIC_GET_INVESTORS_REQUESTED, workPublicInvestorsGet);
}

function getPublicProfile(params) {
  if (!params.uuid) throw new Error('A UUID is required.');
  return Parse.Cloud.run('getPublicProfile', params);
}

function* workGetProfile(action) {
  const { uuid } = action;
  const params = { uuid };

  try {
    const results = yield call(getPublicProfile, params);
    const data = results && results.toJSON ? results.toJSON() : {};
    yield put({ type: types.PUBLIC_GET_PROFILE_SUCCEEDED, uuid, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_PROFILE_FAILED, uuid, error });
  }
}

export function* watchProfileDataGet() {
  yield takeEvery(types.PUBLIC_GET_PROFILE_REQUESTED, workGetProfile);
}

function getPublicUser(params) {
  if (!params.uuid) throw new Error('A UUID is required.');
  return Parse.Cloud.run('getPublicUser', params);
}

function* workGetUser(action) {
  const { uuid } = action;
  const params = { uuid };

  try {
    const results = yield call(getPublicUser, params);
    const data = results && results.toJSON ? results.toJSON() : {};
    yield put({ type: types.PUBLIC_GET_USER_SUCCEEDED, uuid, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_USER_FAILED, uuid, error });
  }
}

export function* watchPublicUserGet() {
  yield takeEvery(types.PUBLIC_GET_USER_REQUESTED, workGetUser);
}

function postIntro(params) {
  if (!params.uuid) throw new Error('A UUID is required.');
  if (!params.intro || !isPlainObject(params.intro)) throw new Error('An intro object is required.');
  return Parse.Cloud.run('claimIntro', params);
}

function* workPostIntro(action) {
  const { params } = action;
  const { uuid } = params;

  try {
    const results = yield call(postIntro, params);
    const data = results.toJSON();
    yield put({ type: types.PUBLIC_POST_INTRO_SUCCEEDED, uuid, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_POST_INTRO_FAILED, uuid, error });
  }
}

export function* watchPostIntro() {
  yield takeEvery(types.PUBLIC_POST_INTRO_REQUESTED, workPostIntro);
}
