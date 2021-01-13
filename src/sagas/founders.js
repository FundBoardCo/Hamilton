import Parse from 'parse';
import {
  call,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import * as types from '../actions/types';
import { trackErr } from '../utils';

function getPublicBoard(objectId) {
  if (!objectId) throw new Error('A user ID is required.');
  // call cloud function here
}

function* workPublicBoardGet(action) {
  const { uuid } = action;

  try {
    const results = yield call(getPublicBoard, uuid);
    const data = results.toJSON();
    yield put({ type: types.PUBLIC_GET_BOARD_SUCCEEDED, uuid, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_BOARD_FAILED, error });
  }
}

export function* watchPublicBoardGet() {
  yield takeLatest(types.PUBLIC_GET_BOARD_REQUESTED, workPublicBoardGet);
}

function getUser(objectId) {
  if (!objectId) throw new Error('A user ID is required.');

  const User = new Parse.User();
  const query = new Parse.Query(User);

  return query.get(objectId);
}

function* workGetProfile(action) {
  const { uuid } = action;

  try {
    const results = yield call(getUser, uuid);
    const data = results.toJSON();
    yield put({ type: types.PUBLIC_GET_PROFILE_SUCCEEDED, uuid, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_PROFILE_FAILED, uuid, error });
  }
}

export function* watchProfileDataGet() {
  yield takeEvery(types.PUBLIC_GET_PROFILE_REQUESTED, workGetProfile);
}
