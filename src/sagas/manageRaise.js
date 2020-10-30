import axios from 'axios';
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { v5 as uuidv5 } from 'uuid';
import { getSafeVar, toQueryString, trackErr } from '../utils';
import * as types from '../actions/types';

const getEmail = state => state.user.email;
const getPubRecID = state => state.user.publicUUID_recordID;

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
    method: 'patch',
    url: '/.netlify/functions/airtable_p_investorStatus',
    data,
    headers: {
      endpoint: 'status',
    },
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
    url: '/.netlify/functions/airtable_p_investorStatus',
    data,
    headers: {
      endpoint: 'status',
    },
  });
}

function* workInvestorStatusPost(action) {
  try {
    const { params } = action;
    const email = yield select(getEmail);
    params.key = `${email}-${params.uuid}`;
    params.userid = email;
    // process notes into airtable format
    const { notes } = params;
    if (notes) {
      // extract the first next note, if any. There should be only one for Airtable.
      const next = Object.values(notes).filter(v => v.next);
      let parsedNotes = Object.values(notes).filter(v => !v.next);
      const [firstNext] = next;
      params.next = getSafeVar(() => firstNext.text, '');
      params.next_date = getSafeVar(() => firstNext.date);
      params.waiting = getSafeVar(() => firstNext.waiting, false);
      parsedNotes = parsedNotes.map(n => `${n.text}${n.date ? `%%%${n.date}` : ''}`).join('^^^');
      params.notes = parsedNotes;
    }

    let results;

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

// TODO: make this a universal call for all the investorStatus tables
function updatePublicBoard(params) {
  const postParams = { ...params };
  const idParams = {};
  if (params.id) idParams.id = params.id;
  delete postParams.id;

  const data = {
    records: [{
      ...idParams,
      fields: { ...postParams },
    }],
  };
  return axios({
    method: params.id ? 'patch' : 'post',
    url: '/.netlify/functions/airtable_p_investorStatus',
    data,
    headers: {
      endpoint: 'emailMap',
    },
  });
}

function* workUserPublicBoardCreate() {
  try {
    const id = yield select(getPubRecID);
    const email = yield select(getEmail);
    const uuid = uuidv5(email, '4c0db00b-f035-4b07-884d-c9139c7a91b5');
    const params = {
      id,
      email,
      uuid,
    };
    const results = yield call(updatePublicBoard, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_POST_PUBLICBOARD_FAILED, error: results.data.error });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({ type: types.USER_POST_PUBLICBOARD_FAILED, error: results.data.body });
    } else {
      yield put({
        type: types.USER_POST_PUBLICBOARD_SUCCEEDED,
        params,
      });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_POST_INVESTORSTATUS_FAILED, error });
  }
}

export function* watchUserPublicBoardCreate() {
  yield takeLatest(types.USER_POST_PUBLICBOARD_REQUESTED, workUserPublicBoardCreate);
}
