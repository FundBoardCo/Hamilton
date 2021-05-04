import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import * as types from '../actions/types';
import { toQueryString, trackErr } from '../utils';
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

export function* watchPeopleGet() {
  yield takeLatest(types.PEOPLE_GET_REQUEST, workPeopleGet);
}

function getFounders(permalinks) {
  const params = {};
  params.endpoint = 'appCgVbPCI4BvRLZn';
  params.table = 'founders';
  const findQueries = permalinks.map(p => `{permalink}='${p}'`).join();
  params.filterByFormula = `OR(${findQueries})`;
  return axios.get(`/.netlify/functions/airtable_get_table?${toQueryString(params)}`);
}

function* workFoundersGet(action) {
  const { startups } = action;

  try {
    while (startups.length) {
      const startup = startups.pop();
      const { uuid } = startup;
      const permalinks = startup.founder_permalinks?.split(',') || [];
      const result = yield call(getFounders, permalinks);
      const { data } = result;
      // catch airtable errors
      if (data.error) {
        trackErr(data.error);
        yield put({ type: types.FOUNDERS_FAILED, error: data.error });
      } else {
        yield put({ type: types.FOUNDERS_SUCCEEDED, data, orgUUID: uuid });
      }
    }
    yield put({ type: types.FOUNDERS_COMPLETED });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.FOUNDERS_FAILED, error });
  }
}

export function* watchFoundersGet() {
  yield takeLatest(types.FOUNDERS_REQUESTED, workFoundersGet);
}

function getStartups(uuids) {
  const params = {};
  params.endpoint = 'appCgVbPCI4BvRLZn';
  params.table = 'startups';
  const findQueries = uuids.map(u => `{uuid}='${u}'`).join();
  params.filterByFormula = `OR(${findQueries})`;
  return axios.get(`/.netlify/functions/airtable_get_table?${toQueryString(params)}`);
}

function* workStartupsGet(action) {
  const { uuids } = action;

  try {
    if (!Array.isArray(uuids) || !uuids.length) {
      throw new Error('An array of startups uuids is required.');
    }
    const result = yield call(getStartups, uuids);
    const { data } = result;
    // catch airtable errors
    if (data.error) {
      trackErr(data.error);
      yield put({ type: types.STARTUPS_FAILED, error: data.error });
    } else {
      yield put({ type: types.STARTUPS_SUCCEEDED, data });
      const startups = data.records.map(r => r.fields);
      yield put({ type: types.FOUNDERS_REQUESTED, startups });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.STARTUPS_FAILED, error });
  }
}

export function* watchStartupsGet() {
  yield takeLatest(types.STARTUPS_REQUESTED, workStartupsGet);
}
