import Parse from 'parse';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { v5 as uuidv5 } from 'uuid';
import { isPlainObject, trackErr } from '../utils';
import * as types from '../actions/types';

const getUserObjectId = state => state.user.objectId;
const getEmail = state => state.user.email;

async function userInit() {
  return Parse.Cloud.run('initUser');
}

async function userCreate(params) {
  const { email, password } = params;
  if (!email) throw new Error('A valid email address is required.');
  if (!password) throw new Error('A valid password is required.');

  const User = new Parse.User();

  User.set('username', email);
  User.set('email', email);
  User.set('password', password);

  return User.signUp();
}

function* workUserCreate(action) {
  const { params } = action;

  try {
    const results = yield call(userCreate, params);
    const data = results.toJSON();
    const { email } = data;
    const init = yield call(userInit);
    data.place = init.toJSON().place;
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
    const init = yield call(userInit);
    data.place = init.toJSON().place;
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

  const User = new Parse.User();
  const query = new Parse.Query(User);
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

  const User = new Parse.User();
  const query = new Parse.Query(User);
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

async function updateFounder(params) {
  return Parse.Cloud.run('updateProfile', params);
}

function* workUserFounderDataPost(action) {
  const { params } = action;
  const email = yield select(getEmail);
  params.uuid = params.uuid || uuidv5(email, '4c0db00b-f035-4b07-884d-c9139c7a91b5');

  try {
    const results = yield call(updateFounder, params);
    const data = results.toJSON();
    yield put({
      type: types.USER_POST_FOUNDERDATA_SUCCEEDED,
      data,
    });
  } catch (error) {
    trackErr(error);
    yield put({
      type: types.USER_POST_FOUNDERDATA_FAILED,
      error,
    });
  }
}

export function* watchUserFounderDataPost() {
  yield takeLatest(types.USER_POST_FOUNDERDATA_REQUESTED, workUserFounderDataPost);
}

function workUserLogout() {
  window.heap.resetIdentity();
}

export function* watchUserLogout() {
  yield takeLatest(types.USER_LOGOUT, workUserLogout);
}
