import * as types from '../actions/types';
import { processErr } from '../utils';

const defaults = {
  records: {},
  get_status: '',
  post_status: '',
  createBoard_status: '',
  publicUUID: '',
  publicUUID_recordID: '',
  editNoteParams: {},
};

function convertRecords(recs) {
  const newRecs = {};
  recs.forEach(r => {
    if (r.fields && r.fields.uuid) {
      // convert from airtable format
      const newRec = { ...r.fields };
      newRec.id = r.id;
      newRec.notes = r.fields.notes ? r.fields.notes.split('^^^') : [];
      const notesObj = {};
      let lastID;
      newRec.notes.forEach((n, i) => {
        const splitOnDate = n.split('%%%');
        // replace with id as the key when using real database
        notesObj[i] = {
          text: splitOnDate[0],
          date: splitOnDate[1],
          next: false,
        };
        lastID = i;
      });
      if (r.fields.next) {
        notesObj[lastID + 1] = {
          text: r.fields.next || '',
          date: r.fields.next_date || '',
          next: true,
          waiting: r.fields.waiting,
        };
      }
      newRec.notes = { ...notesObj };
      newRec.intro = {
        name: r.intro_name || '',
        email: r.intro_email || '',
        date: r.intro_date || '',
      };
      newRecs[r.fields.uuid] = { ...newRec };
    }
  });
  return { ...newRecs };
}

export default function manageRaise(state = { ...defaults }, action) {
  let newRecords = {};
  const { data } = action;

  switch (action.type) {
    case types.USER_GET_INVESTORSTATUSES_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.USER_GET_INVESTORSTATUSES_SUCCEEDED:
      if (Array.isArray(data.records)) {
        newRecords = convertRecords(data.records);
      }
      return {
        ...state,
        get_status: 'succeeded',
        records: { ...newRecords },
      };
    case types.USER_GET_INVESTORSTATUSES_FAILED: return {
      ...state,
      get_status: processErr(action.error),
    };
    case types.USER_GET_INVESTORSTATUSES_DISMISSED: return {
      ...state,
      get_status: '',
    };
    case types.USER_POST_INVESTORSTATUS_REQUESTED: return {
      ...state,
      post_status: 'pending',
    };
    case types.USER_POST_INVESTORSTATUS_SUCCEEDED:
      if (Array.isArray(data.records)) {
        newRecords = convertRecords(data.records);
      }
      return {
        ...state,
        post_status: 'succeeded',
        records: {
          ...state.records,
          ...newRecords,
        },
      };
    case types.USER_POST_INVESTORSTATUS_FAILED: return {
      ...state,
      post_status: processErr(action.error),
    };
    case types.USER_POST_INVESTORSTATUS_DISMISSED: return {
      ...state,
      post_status: '',
    };
    case types.USER_SET_EDITNOTE: return {
      ...state,
      editNoteParams: { ...action.params },
    };
    case types.USER_POST_PUBLICBOARD_REQUESTED: return {
      ...state,
      createBoard_status: 'pending',
    };
    case types.USER_POST_PUBLICBOARD_SUCCEEDED: return {
      ...state,
      createBoard_status: 'succeeded',
      publicUUID: action.params.uuid,
    };
    case types.USER_POST_PUBLICBOARD_FAILED: return {
      ...state,
      createBoard_status: processErr(action.error),
    };
    case types.USER_POST_PUBLICBOARD_DISMISSED: return {
      ...state,
      createBoard_status: '',
    };
    default: return state;
  }
}
