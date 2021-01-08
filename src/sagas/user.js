import Parse from 'parse';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { isPlainObject, trackErr } from '../utils';
import * as types from '../actions/types';

const getUserObjectId = state => state.user.objectId;

async function userCreate(params) {
  const { email, password } = params;
  if (!email) throw new Error('A valid email address is required.');
  if (!password) throw new Error('A valid password is required.');

  const user = new Parse.User();

  user.set('username', email);
  user.set('email', email);
  user.set('password', password);

  return user.signUp();
}

function* workUserCreate(action) {
  const { params } = action;

  try {
    const results = yield call(userCreate, params);
    const data = results.toJSON();
    const { email } = data;
    yield put({ type: types.USER_CREATE_SUCCEEDED, data });
    window.heap.identify(email);
    window.heap.addUserProperties({ email });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_CREATE_FAILED, error });
  }
}

export function* watchUserCreate() {
  yield takeLatest(types.USER_CREATE_REQUESTED, workUserCreate);
}

async function userLogin(params) {
  const { username, password } = params;
  if (!username) throw new Error('A valid username is required.');
  if (!password) throw new Error('A valid password is required.');

  return Parse.User.logIn(username, password);
}

function* workUserLogin(action) {
  const { params } = action;

  try {
    const results = yield call(userLogin, params);
    const data = results.toJSON();
    const { email } = data;
    yield put({ type: types.USER_LOGIN_SUCCEEDED, data });
    window.heap.identify(email);
    window.heap.addUserProperties({ email });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_LOGIN_FAILED, error });
  }
}

export function* watchUserLogin() {
  yield takeLatest(types.USER_LOGIN_REQUESTED, workUserLogin);
}

async function resetPassword(email) {
  if (!email) throw new Error('A valid email address is required.');

  return Parse.User.requestPasswordReset(email);
}

function* workUserReset(action) {
  const { params } = action;
  const { email } = params;

  try {
    yield call(resetPassword, email);
    yield put({ type: types.USER_RESETPASSWORD_SUCCEEDED });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_RESETPASSWORD_FAILED, error });
  }
}

export function* watchUserReset() {
  yield takeLatest(types.USER_RESETPASSWORD_REQUESTED, workUserReset);
}

async function userDelete(params) {
  const { objectId } = params;
  if (!objectId) throw new Error('User object ID was not found.');

  const user = new Parse.User();
  const query = new Parse.Query(user);
  return query.get(objectId)
    .then(u => u.destroy(),
      err => {
        throw new Error(err);
      });
}

function* workUserDelete() {
  const objectId = yield select(getUserObjectId);
  const params = { objectId };

  try {
    yield call(userDelete, params);
    yield put({ type: types.USER_DELETE_SUCCEEDED });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_DELETE_FAILED, error });
  }
}

export function* watchUserDelete() {
  yield takeLatest(types.USER_DELETE_REQUESTED, workUserDelete);
}

async function userUpdate(params) {
  const { objectId, updates } = params;
  if (!objectId) throw new Error('User object ID was not found.');
  if (!isPlainObject(updates)) throw new Error('Updates must be a plain object.');

  const user = new Parse.User();
  const query = new Parse.Query(user);
  return query.get(objectId)
    .then(u => {
      Object.keys(updates).forEach(k => (u.set(k, updates[k])));
      return u.save();
    }, err => {
      throw new Error(err);
    });
}

function* workUserUpdate(action) {
  const params = {
    updates: { ...action.params },
  };

  params.objectId = yield select(getUserObjectId);

  try {
    const results = yield call(userUpdate, params);
    const data = results.toJSON();
    yield put({ type: types.USER_UPDATE_SUCCEEDED, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_UPDATE_FAILED, error });
  }
}

export function* watchUserUpdate() {
  yield takeLatest(types.USER_UPDATE_REQUESTED, workUserUpdate);
}

function workUserLogout() {
  window.heap.resetIdentity();
}

export function* watchUserLogout() {
  yield takeLatest(types.USER_LOGOUT, workUserLogout);
}
