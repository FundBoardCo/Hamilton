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

function* workFounderDataGet(action) {
  const { uuid } = action;
  const params = {
    filterByFormula: `{uuid}="${uuid}"`,
    endpoint: 'founders',
  };
  try {
    if (!uuid) throw new Error('UUID required to get founder data.');
    const results = yield call(getStatusData, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.PUBLIC_GET_FOUNDERDATA_FAILED, uuid, error: results.data.error });
    } else {
      yield put({ type: types.PUBLIC_GET_FOUNDERDATA_SUCCEEDED, uuid, data: results.data });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_FOUNDERDATA_FAILED, uuid, error });
  }
}

export function* watchFounderDataGet() {
  yield takeEvery(types.PUBLIC_GET_FOUNDERDATA_REQUESTED, workFounderDataGet);
}

function requestPublicBoard(params) {
  const getParams = params;
  const { requestoremail } = params;
  delete getParams.requestoremail;

  return axios({
    method: 'get',
    url: `/.netlify/functions/airtable_get_boardByUUID?${toQueryString(getParams)}`,
    headers: {
      requestoremail,
    },
  });
}

function* workPublicBoardGet(action) {
  const { uuid } = action;
  const requestoremail = yield select(getEmail);
  const params = {
    requestoremail,
    filterByFormula: `{uuid}="${uuid}"`,
  };
  try {
    if (!uuid) throw new Error('UUID required to get public board.');
    const results = yield call(requestPublicBoard, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.PUBLIC_GET_BOARD_FAILED, error: results.data.error });
    } else {
      yield put({ type: types.PUBLIC_GET_BOARD_SUCCEEDED, data: results.data });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_GET_BOARD_FAILED, error });
  }
}

export function* watchPublicBoardGet() {
  yield takeLatest(types.PUBLIC_GET_BOARD_REQUESTED, workPublicBoardGet);
}

function* workBoardUUIDGet() {
  const requestoremail = yield select(getEmail);
  const params = {
    filterByFormula: `{email}="${requestoremail}"`,
    endpoint: 'emailMap',
  };
  try {
    const results = yield call(getStatusData, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.USER_GET_BOARDUUID_FAILED, error: results.data.error });
    } else {
      yield put({ type: types.USER_GET_BOARDUUID_SUCCEEDED, data: results.data });
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_GET_BOARDUUID_FAILED, error });
  }
}

export function* watchBoardUUIDGet() {
  yield takeLatest(types.USER_GET_BOARDUUID_REQUESTED, workBoardUUIDGet);
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
    params.userid = yield select(getEmail);
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
        type: types.USER_POST_FOUNDERDATA_FAILED,
        uuid,
        error: results.data.error,
      });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({
        type: types.USER_POST_FOUNDERDATA_FAILED,
        uuid,
        error: results.data.body,
      });
    } else {
      yield put({
        type: types.USER_POST_FOUNDERDATA_SUCCEEDED,
        uuid,
        data: results.data,
      });
    }
  } catch (error) {
    trackErr(error);
    yield put({
      type: types.USER_POST_FOUNDERDATA_FAILED,
      uuid,
      error,
    });
  }
}

export function* watchUserFounderDataPost() {
  yield takeLatest(types.USER_POST_FOUNDERDATA_REQUESTED, workUserFounderDataPost);
}

function postBulkInvestors(params) {
  const data = { records: [] };
  params.investors.forEach(i => {
    data.records.push({
      fields: {
        userid: params.email,
        stage: params.stage || 'added',
        published: params.published,
        uuid: i.uuid,
      },
    });
  });
  return axios({
    method: 'post',
    url: '/.netlify/functions/airtable_p_investorStatus',
    data,
    headers: {
      endpoint: 'status',
    },
  });
}

function* workUserPublicBoardPost(action) {
  const { params } = action;
  let postParams = params;
  const { addInvestors } = params;
  delete postParams.addInvestors;
  const { investorParams } = params;
  delete postParams.investorParams;

  try {
    const email = yield select(getEmail);
    const uuid = params.uuid || uuidv5(email, '4c0db00b-f035-4b07-884d-c9139c7a91b5');
    postParams = {
      email,
      uuid, // pass in as param if this already exists
      endpoint: 'emailMap',
      ...params,
    };
    const results = yield call(postStatusData, postParams);
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
        data: {
          uuid,
          ...params,
          ...results.data,
        },
      });
    }
    if (Array.isArray(addInvestors) && addInvestors.length) {
      const invParams = {
        investors: [...addInvestors],
        email,
        id: params.id || getSafeVar(() => results.data.records[0].id),
        ...investorParams,
      };
      yield call(postBulkInvestors, invParams);
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.USER_POST_PUBLICBOARD_FAILED, error });
  }
}

export function* watchUserPublicBoardPost() {
  yield takeLatest(types.USER_POST_PUBLICBOARD_REQUESTED, workUserPublicBoardPost);
}

function* workUserManualInvestorPost(action) {
  const { params } = action;
  params.endpoint = 'investors';

  try {
    const email = yield select(getEmail);
    params.userid = email;
    if (!params.uuid) params.uuid = uuidv5(email, 'c1b6b2fe-5a45-45dd-ab2f-f2ce0a743645');
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
      if (openModal === 'addInvestor') {
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
  params.endpoint = 'investors';

  try {
    const email = yield select(getEmail);
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

function* workPublicInvestorStatusUpdate(action) {
  const { params } = action;
  params.endpoint = 'status';
  try {
    const results = yield call(postStatusData, params);
    // catch airtable errors
    if (results.data.error) {
      trackErr(results.data.error);
      yield put({ type: types.PUBLIC_POST_INVESTORSTATUS_FAILED, error: results.data.error });
    } else if (results.data.statusCode && results.data.statusCode === 500) {
      trackErr(results.data.body);
      yield put({ type: types.PUBLIC_POST_INVESTORSTATUS_FAILED, error: results.data.body });
    } else {
      yield put({
        type: types.PUBLIC_POST_INVESTORSTATUS_SUCCEEDED,
        data: results.data,
      });
      /* there is a chance of a race condition here, if someone manually closes the modal while it
         is being submitted then opens it again. That's probably fine.
       */
      const openModal = yield select(getModalOpen);
      if (openModal === 'makeIntro') {
        yield put({
          type: types.MODAL_SET_OPEN,
          modal: null,
        });
      }
    }
  } catch (error) {
    trackErr(error);
    yield put({ type: types.PUBLIC_POST_INVESTORSTATUS_FAILED, error });
  }
}

export function* watchPublicInvestorStatusUpdate() {
  yield takeLatest(types.PUBLIC_POST_INVESTORSTATUS_REQUESTED, workPublicInvestorStatusUpdate);
}
