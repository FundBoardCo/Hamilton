import * as types from '../actions/types';
import { processErr } from '../utils';

export default function people(state = {}, action) {
  const records = {};
  const { params = {}, data } = action;
  const {
    uuid,
    id,
    reason,
  } = params;
  // The id param is singular for the API, but represents an array of ids.
  const ids = Array.isArray(id) ? id : [id];

  switch (action.type) {
    case types.PEOPLE_GET_REQUEST:
      if (ids) {
        ids.forEach(i => {
          records[i] = { ...state[i], getStatus: 'pending' };
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
            getStatus: 'succeeded',
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
          records[i] = { ...state[i], getStatus: err };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_DISMISS:
      if (ids) {
        ids.forEach(i => {
          records[i] = { ...state[i], getStatus: '' };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_INVESTMENTS_REQUEST:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          investmentsStatus: 'pending',
          investments: [],
        },
      };
    case types.PEOPLE_GET_INVESTMENTS_SUCCEEDED:
      // TODO: filter out different investments in the same founder/startup
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          investmentsStatus: 'succeeded',
          investments: action.data,
        },
      };
    case types.PEOPLE_GET_INVESTMENTS_FAILED:
      return {
        ...state,
        [action.id]: { ...state[action.id], investmentsStatus: processErr(action.error) },
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
