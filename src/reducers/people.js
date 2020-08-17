import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

export default function people(state = {}, action) {
  const records = {};
  const { params = {}, data } = action;
  const {
    uuid,
    ids,
    reason,
  } = params;
  const rehydration = getSafeVar(() => action.payload.people, {});

  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
    };
    case types.PEOPLE_GET_REQUEST:
      if (ids) {
        ids.forEach(i => {
          records[i] = { ...state[i], status: 'pending' };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_SUCCEEDED:
      if (ids && data && Array.isArray(data)) {
        ids.forEach(i => {
          records[i] = {
            ...state[i],
            status: 'succeeded',
          };
        });
        data.forEach(r => {
          records[r.uuid] = {
            ...records[r.uuid],
            ...r,
          };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_FAILED:
      if (ids) {
        const err = processErr(action.error);
        ids.forEach(i => {
          records[i] = { ...state[i], status: err };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_DISMISS:
      if (ids) {
        ids.forEach(i => {
          records[i] = { ...state[i], status: '' };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_UPDATE:
      // used with search for partial data
      return {
        ...state,
        records: { ...state.records, ...action.data },
      };
    case types.PERSON_PUT_INVALID_REQUESTED:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid_reason: reason,
          invalid_status: 'pending',
        },
      };
    case types.PERSON_PUT_INVALID_SUCCEEDED:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid: true,
          invalid_status: 'succeeded',
        },
      };
    case types.PERSON_PUT_INVALID_FAILED:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid_status: processErr(action.error),
        },
      };
    case types.PERSON_CLEAR_INVALID:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid: false,
          invalid_reason: '',
          invalid_status: '',
        },
      };
    default: return state;
  }
}
