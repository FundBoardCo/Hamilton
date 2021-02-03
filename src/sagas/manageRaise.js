import axios from 'axios';
import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { getSafeVar, toQueryString, trackErr } from '../utils';
import * as types from '../actions/types';

const getEmail = state => state.user.email;
const getModalOpen = state => state.modal.openModal;

// TODO: make this a universal call for all the investorStatus GET calls
function getStatusData(params) {
  const getParams = { ...params };
  const { endpoint } = params;
  delete getParams.endpoint;
  // any filters should be provided in the format of params.filterByFormula = `{field}="${val}"`;

  return axios({
    method: 'get',
    url: `/.netlify/functions/airtable_g_investorStatus?${toQueryString(getParams)}`,
    headers: {
      endpoint,
    },
  });
}

// TODO: make this a universal call for all the investorStatus tables
function postStatusData(params) {
  const postParams = { ...params };
  const { endpoint } = params;
  delete postParams.endpoint;
  const idParams = {};
  if (params.id) idParams.id = params.id;
  delete postParams.id;
  let method = params.id ? 'patch' : 'post';
  if (params.method) {
    method = params.method;
    delete postParams.method;
  }

  const data = {
    records: [{
      ...idParams,
      fields: {
        timestamp: Date.now(),
        ...postParams,
      },
    }],
  };
  return axios({
    method,
    url: '/.netlify/functions/airtable_p_investorStatus',
    data,
    headers: {
      endpoint,
    },
  });
}

/*
function* workUserFounderDataPost(action) {
  const { params } = action;
  const { uuid } = params;
  params.endpoint = 'founders';

  try {
    if (!uuid) throw new Error('UUID required to post founder data.');
    const results = yield call(postStatusData, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({
        type: types.USER_POST_PROFILE_FAILED,
        uuid,
        error: results.data.error,
      });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({
        type: types.USER_POST_PROFILE_FAILED,
        uuid,
        error: results.data.body,
      });
    } else {
      yield put({
        type: types.USER_POST_PROFILE_SUCCEEDED,
        uuid,
        data: results.data,
      });
    }
  } catch (error) {
    trackErr(error);
    yield put({
      type: types.USER_POST_PROFILE_FAILED,
      uuid,
      error,
    });
  }
}

export function* watchUserFounderDataPost() {
  yield takeLatest(types.USER_POST_PROFILE_REQUESTED, workUserFounderDataPost);
}
 */

function* workUserManualInvestorPost(action) {
  const { params } = action;
  params.endpoint = 'investors';

  try {
    params.userid = yield select(getEmail);
    if (!params.uuid) params.uuid = uuidv4();
    const results = yield call(postStatusData, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_POST_MANUALINVESTOR_FAILED, error: results.data.error });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({ type: types.USER_POST_MANUALINVESTOR_FAILED, error: results.data.body });
    } else {
      yield put({
        type: types.USER_POST_MANUALINVESTOR_SUCCEEDED,
        data: results.data,
      });
      /* there is a chance of a race condition here, if someone manually closes the modal while it
         is being submitted then opens it again. That's probably fine.
       */
      const openModal = yield select(getModalOpen);
      if (openModal === 'editInvestor') {
        yield put({
          type: types.MODAL_SET_OPEN,
          modal: null,
        });
      }
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_POST_MANUALINVESTOR_FAILED, error });
  }
}

export function* watchUserManualInvestorPost() {
  yield takeLatest(types.USER_POST_MANUALINVESTOR_REQUESTED, workUserManualInvestorPost);
}

function* workUserManualInvestorsGet(action) {
  const { params = {} } = action;
  let { email } = params;
  params.endpoint = 'investors';

  try {
    if (!email) email = yield select(getEmail);
    params.filterByFormula = `{userid}="${email}"`;
    const results = yield call(getStatusData, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_GET_MANUALINVESTORS_FAILED, error: results.data.error });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({ type: types.USER_GET_MANUALINVESTORS_FAILED, error: results.data.body });
    } else {
      yield put({
        type: types.USER_GET_MANUALINVESTORS_SUCCEEDED,
        data: results.data,
      });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_GET_MANUALINVESTORS_FAILED, error });
  }
}

export function* watchUserManualInvestorsGet() {
  yield takeLatest(types.USER_GET_MANUALINVESTORS_REQUESTED, workUserManualInvestorsGet);
}

