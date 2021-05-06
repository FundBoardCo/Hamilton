import Parse from 'parse';
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
  /*
  const params = {};
  params.endpoint = 'appCgVbPCI4BvRLZn';
  params.table = 'founders';
  const findQueries = permalinks.map(p => `{permalink}='${p}'`).join();
  params.filterByFormula = `OR(${findQueries})`;
  return axios.get(`/.netlify/functions/airtable_get_table?${toQueryString(params)}`);
   */
  const params = { permalinks };
  return Parse.Cloud.run('getFoundersByPermalink', params);
}

function* workFoundersGet(action) {
  const { startups } = action;

  try {
    while (startups.length) {
      const startup = startups.pop();
      const { uuid } = startup;
      const permalinks = startup.founder_permalinks?.split(',') || [];
      const results = yield call(getFounders, permalinks);
      console.log(results);
      const founders = results.map(r => {
        const founder = r && typeof r.toJSON === 'function' ? r.toJSON() : {};
        return founder;
      });
      yield put({ type: types.FOUNDERS_SUCCEEDED, founders, orgUUID: uuid });
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

function getStartups(permalinks) {
  /*
  const params = {};
  params.endpoint = 'appCgVbPCI4BvRLZn';
  params.table = 'startups';
  const findQueries = uuids.map(u => `{uuid}='${u}'`).join();
  params.filterByFormula = `OR(${findQueries})`;
  return axios.get(`/.netlify/functions/airtable_get_table?${toQueryString(params)}`);
   */

  const params = { permalinks };
  return Parse.Cloud.run('getStartupsByPermalink', params);
}

function* workStartupsGet(action) {
  const { permalinks } = action;
  let startups = [];

  try {
    if (!Array.isArray(permalinks) || !permalinks.length) {
      throw new Error('An array of startups uuids is required.');
    }
    const results = yield call(getStartups, permalinks);
    console.log(results);
    startups = results.map(r => {
      const startup = r && typeof r.toJSON === 'function' ? r.toJSON() : {};
      return startup;
    });

    yield put({ type: types.STARTUPS_SUCCEEDED, startups });
    yield put({ type: types.FOUNDERS_REQUESTED, startups });
  } catch (error) {
    trackErr(error);
    yield put({ type: types.STARTUPS_FAILED, error });
  }
}

export function* watchStartupsGet() {
  yield takeLatest(types.STARTUPS_REQUESTED, workStartupsGet);
}
