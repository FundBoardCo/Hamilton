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
    /*
    case types.USER_GET_INVESTORSTATUSES_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.USER_GET_INVESTORSTATUSES_SUCCEEDED:
      return {
        ...state,
        get_status: 'succeeded',
        records: Array.isArray(data.records) ? convertRecords(data.records) : {},
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
      newRecords = Array.isArray(data.records) ? convertRecords(data.records) : {};
      return {
        ...state,
        post_status: 'succeeded',
        records: {
          ...state.records,
          ...newRecords,
        },
        // kind of a trashy way to make sure the public board updates if the founder changes it.
        public_records: {
          ...state.public_records,
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
      postBoard_status: 'pending',
    };
    case types.USER_POST_PUBLICBOARD_SUCCEEDED: return {
      ...state,
      postBoard_status: 'succeeded',
      // TODO: refactor hidden to be in an object of props per uuid key
      hidden: action.data.hide,
      publicUUID: action.data.uuid,
      publicUUID_recordID: action.data.id,
    };
    case types.USER_POST_PUBLICBOARD_FAILED: return {
      ...state,
      postBoard_status: processErr(action.error),
    };
    case types.USER_POST_PUBLICBOARD_DISMISSED: return {
      ...state,
      postBoard_status: '',
    };
     */
      /*
    case types.PUBLIC_GET_INVESTORS_REQUESTED: return {
      ...state,
      getPublic_status: 'pending',
    };
    case types.PUBLIC_GET_INVESTORS_SUCCEEDED: return {
      ...state,
      getPublic_status: 'succeeded',
      hidden: data.hidden,
      notFound: data.notFound,
      publicUUID_recordID: data.publicUUID_recordID,
      public_records: Array.isArray(data.statusData.records)
        ? convertRecords(data.statusData.records) : {},
      manual_records: Array.isArray(data.manualData.records)
        ? convertRecords(data.manualData.records) : {},
    };
    case types.PUBLIC_GET_INVESTORS_FAILED: return {
      ...state,
      getPublic_status: processErr(action.error),
    };
    case types.PUBLIC_GET_INVESTORS_DISMISSED: return {
      ...state,
      getPublic_status: '',
    };
    */
    /*
    case types.USER_GET_BOARDUUID_REQUESTED: return {
      ...state,
      getBoardUUID_status: 'pending',
    };
    case types.USER_GET_BOARDUUID_SUCCEEDED:
      parsedRecord = parseOneRecord(action);
      return {
        ...state,
        getBoardUUID_status: 'succeeded',
        publicUUID: parsedRecord.uuid,
        publicUUID_recordID: parsedRecord.id,
      };
    case types.USER_GET_BOARDUUID_FAILED: return {
      ...state,
      getBoardUUID_status: processErr(action.error),
    };
    case types.USER_GET_BOARDUUID_DISMISSED: return {
      ...state,
      getBoardUUID_status: '',
    };
     */
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
    /*
    case types.PUBLIC_POST_INVESTOR_REQUESTED: return {
      ...state,
      publicPost_status: 'pending',
    };
    case types.PUBLIC_POST_INVESTOR_SUCCEEDED:
      newRecords = Array.isArray(data.records) ? convertRecords(data.records) : {};
      return {
        ...state,
        publicPost_status: 'succeeded',
        public_records: {
          ...state.public_records,
          ...newRecords,
        },
      };
    case types.PUBLIC_POST_INVESTOR_FAILED: return {
      ...state,
      publicPost_status: processErr(action.error),
    };
    case types.PUBLIC_POST_INVESTOR_DISMISSED: return {
      ...state,
      publicPost_status: '',
    };
    case types.USER_GET_MANUALINVESTORS_REQUESTED: return {
      ...state,
      manualInvestorGet_status: 'pending',
    };
    case types.USER_GET_MANUALINVESTORS_SUCCEEDED:
      newRecords = Array.isArray(data.records) ? convertRecords(data.records) : {};
      return {
        ...state,
        manualInvestorGet_status: 'succeeded',
        manual_records: {
          // replace all the records here. any old ones are obsolete
          ...newRecords,
        },
      };
    case types.USER_GET_MANUALINVESTORS_FAILED: return {
      ...state,
      manualInvestorGet_status: processErr(action.error),
    };
    case types.USER_GET_MANUALINVESTORS_DISMISSED: return {
      ...state,
      manualInvestorGet_status: '',
    };
    case types.USER_POST_MANUALINVESTOR_REQUESTED: return {
      ...state,
      manualInvestorPost_status: 'pending',
    };
    case types.USER_POST_MANUALINVESTOR_SUCCEEDED:
      newRecords = Array.isArray(data.records)
        ? convertRecords(data.records, action.data.investorUUIDs)
        : {};
      return {
        ...state,
        manualInvestorPost_status: 'succeeded',
        manual_records: {
          ...state.manual_records,
          ...newRecords,
        },
      };
    case types.USER_POST_MANUALINVESTOR_FAILED: return {
      ...state,
      manualInvestorPost_status: processErr(action.error),
    };
    case types.USER_POST_MANUALINVESTOR_DISMISSED: return {
      ...state,
      manualInvestorPost_status: '',
    };
    case types.USER_POST_PROFILE_REQUESTED: return {
      ...state,
      founderData: {
        ...state.founderData,
        [action.uuid]: {
          ...state.founderData[action.uuid],
          post_status: 'pending',
        },
      },
    };
    case types.USER_POST_PROFILE_SUCCEEDED: return {
      ...state,
      founderData: {
        ...state.founderData,
        [action.uuid]: {
          ...state.founderData[action.uuid],
          post_status: 'succeeded',
          recordID: getSafeVar(() => action.data.records[0].id),
          ...getSafeVar(() => action.data.records[0].fields, {}),
        },
      },
    };
    case types.USER_POST_PROFILE_FAILED: return {
      ...state,
      founderData: {
        ...state.founderData,
        [action.uuid]: {
          ...state.founderData[action.uuid],
          post_status: processErr(action.error),
          recordID: getSafeVar(() => action.data.records[0].id),
          ...getSafeVar(() => action.data.records[0].fields, {}),
        },
      },
    };
    case types.USER_POST_PROFILE_DISMISSED: return {
      ...state,
      founderData: {
        ...state.founderData,
        [action.params.uuid]: {
          ...state.founderData[action.params.uuid],
          post_status: '',
        },
      },
    };
     */
    case types.USER_LOGOUT: return {
      ...defaults,
    };
    default: return state;
  }
}
