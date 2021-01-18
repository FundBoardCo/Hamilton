import * as types from '../actions/types';
import { processErr, isPlainObject, getSafeVar } from '../utils';

const defaults = {
  records: {},
  public_records: {},
  manual_records: {},
  get_status: '',
  post_status: '',
  publicPost_status: '',
  postBoard_status: '',
  deleteBoard_status: '',
  getPublic_status: '',
  getBoardUUID_status: '',
  getFounderData_status: '',
  manualInvestorGet_status: '',
  manualInvestorPost_status: '',
  founderData: {},
  publicUUID: '',
  publicUUID_recordID: '',
  editNoteParams: {},
  hidden: false,
  notFound: false,
};
/*
let parsedRecord = {};

function parseOneRecord(action) {
  return Array.isArray(action.data.records)
  && action.data.records[0]
  && isPlainObject(action.data.records[0].fields)
    ? {
      id: action.data.records[0].id,
      ...action.data.records[0].fields,
    } : {};
}
 */

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
      newRecs[r.fields.uuid] = { ...newRec };
    }
  });
  return { ...newRecs };
}

export default function manageRaise(state = defaults, action) {
  // let newRecords = {};
  const { data } = action;

  switch (action.type) {
    case types.PUBLIC_GET_PROFILE_REQUESTED: return {
      ...state,
      getFounderData_status: 'pending',
    };
    case types.PUBLIC_GET_PROFILE_SUCCEEDED: return {
      ...state,
      getFounderData_status: 'succeeded',
      founderData: {
        ...state.founderData,
        [action.uuid]: Array.isArray(action.data.records)
          && action.data.records[0]
          && isPlainObject(action.data.records[0].fields)
          ? {
            recordID: getSafeVar(() => action.data.records[0].id),
            ...action.data.records[0].fields,
          }
          : {},
      },
    };
    case types.PUBLIC_GET_PROFILE_FAILED: return {
      ...state,
      getFounderData_status: processErr(action.error),
    };
    case types.PUBLIC_GET_PROFILE_DISMISSED: return {
      ...state,
      getFounderData_status: '',
    };
    default: return state;
  }
}
