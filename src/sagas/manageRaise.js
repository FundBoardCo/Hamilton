import axios from 'axios';
import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { getSafeVar, toQueryString, trackErr } from '../utils';
import * as types from '../actions/types';

const getEmail = state => state.user.email;

function requestInvestorStatuses(params) {
  return axios.get(`/.netlify/functions/airtable_get_investorStatuses?${toQueryString(params)}`);
}

function* workInvestorStatusesGet() {
  const params = {};
  const email = yield select(getEmail);
  params.filterByFormula = `{userid}="${email}"`;
  try {
    const results = yield call(requestInvestorStatuses, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_GET_INVESTORSTATUSES_FAILED, error: results.data.error });
    } else {
      yield put({ type: types.USER_GET_INVESTORSTATUSES_SUCCEEDED, data: results.data });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_GET_INVESTORSTATUSES_FAILED, error });
  }
}

export function* watchInvestorStatusesGet() {
  yield takeEvery(types.USER_GET_INVESTORSTATUSES_REQUESTED, workInvestorStatusesGet);
}

function updateInvestorStatus(params) {
  const postParams = { ...params };
  const { id } = params;
  delete postParams.id;

  const data = {
    records: [{
      id,
      fields: { ...postParams },
    }],
  };
  return axios({
    method: 'post',
    url: '/.netlify/functions/airtable_patch_investorStatus',
    data,
  });
}

function createInvestorStatus(params) {
  const postParams = { ...params };
  delete postParams.id;

  const data = {
    records: [{
      fields: { ...postParams },
    }],
  };
  return axios({
    method: 'post',
    url: '/.netlify/functions/airtable_post_investorStatus',
    data,
  });
}

function* workInvestorStatusPost(action) {
  const { params } = action;
  const email = yield select(getEmail);
  params.key = `${email}-${params.uuid}`;
  params.userid = email;
  // process notes into airtable format
  const { notes } = params;
  // extract the first next note, if any. There should be only one for Airtable.
  const next = [];
  let parsedNotes = [];
  Object.keys(notes).forEach(k => {
    const n = notes[k];
    if (n.next) {
      next.push(n);
    } else {
      parsedNotes.push(n);
    }
  });
  const [firstNext] = next;
  params.next = getSafeVar(() => firstNext.text, '');
  params.next_date = getSafeVar(() => firstNext.date);
  params.waiting = getSafeVar(() => firstNext.waiting, false);
  parsedNotes = parsedNotes.map(n => `${n.text}${n.date ? `%%%${n.date}` : ''}`).join('^^^');
  params.notes = parsedNotes;

  let results;

  try {
    if (params.id) {
      results = yield call(updateInvestorStatus, params);
    } else {
      results = yield call(createInvestorStatus, params);
    }
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_POST_INVESTORSTATUS_FAILED, error: results.data.error });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({ type: types.USER_POST_INVESTORSTATUS_FAILED, error: results.data.body });
    } else {
      yield put({
        type: types.USER_POST_INVESTORSTATUS_SUCCEEDED,
        params,
        data: results.data,
      });
      // close the edit component by setting the edited note to null
      yield put({ type: types.USER_SET_EDITNOTE, params: { noteID: null } });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_POST_INVESTORSTATUS_FAILED, error });
  }
}

export function* watchInvestorStatusPost() {
  yield takeEvery(types.USER_POST_INVESTORSTATUS_REQUESTED, workInvestorStatusPost);
}
