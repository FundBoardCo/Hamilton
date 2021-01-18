import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import * as types from '../actions/types';
import { trackErr } from '../utils';
import investors from '../data/investors.json';

function getPeople(ids) {
  if (!Array.isArray(ids)) throw new Error('An array of IDs is required.');
  const data = {};
  ids.forEach(i => {
    data[i] = investors[i];
  });
  return data;
}

function* workPeopleGet(action) {
  const { ids } = action;

  try {
    const data = yield call(getPeople, ids);
    yield put({ type: types.PEOPLE_GET_SUCCEEDED, data });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PEOPLE_GET_FAILED, error });
  }
}

// eslint-disable-next-line import/prefer-default-export
export function* watchPeopleGet() {
  yield takeLatest(types.PEOPLE_GET_REQUEST, workPeopleGet);
}
