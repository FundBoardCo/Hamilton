import axios from 'axios';
import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';
import { toQueryString, trackErr } from '../utils';
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

function postInvestorStatus(params) {
  const data = {
    fields: { ...params },
  };
  return axios({
    method: 'post',
    url: '/.netlify/functions/airtable_post_investorStatus',
    data,
  });
}

function* workInvestorStatusPost(action) {
  const { params } = action;
  try {
    const results = yield call(postInvestorStatus, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_POST_INVESTORSTATUS_FAILED, error: results.data.error });
    } else {
      yield put({ type: types.USER_POST_INVESTORSTATUS_SUCCEEDED, data: results.data });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_POST_INVESTORSTATUS_FAILED, error });
  }
}

export function* watchInvestorStatusPost() {
  yield takeEvery(types.USER_POST_INVESTORSTATUS_REQUESTED, workInvestorStatusPost);
}
