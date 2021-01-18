import * as types from '../actions/types';
import { processErr } from '../utils';

export const peopleResets = {
  records: {},
  get_status: '',
};

const defaults = {
  ...peopleResets,
};

export default function people(state = defaults, action) {
  const { params = {} } = action;
  const {
    uuid,
    reason,
  } = params;

  switch (action.type) {
    case types.PEOPLE_GET_REQUEST:
      return {
        ...state,
        get_status: 'pending',
      };
    case types.PEOPLE_GET_SUCCEEDED:
      return {
        ...state,
        get_status: 'succeeded',
        records: {
          ...state.records,
          ...action.data,
        },
      };
    case types.PEOPLE_GET_FAILED:
      return {
        ...state,
        get_status: processErr(action.error),
      };
    case types.PEOPLE_GET_DISMISS:
      return {
        ...state,
        get_status: '',
      };
    case types.PERSON_PUT_INVALID_REQUESTED:
      return {
        ...state,
        records: {
          ...state.records,
          [uuid]: {
            ...state.records[uuid],
            invalid_reason: reason,
            invalid_status: 'pending',
          },
        },
      };
    case types.PERSON_PUT_INVALID_SUCCEEDED:
      return {
        ...state,
        records: {
          ...state.records,
          [uuid]: {
            ...state.records[uuid],
            invalid: true,
            invalid_status: 'succeeded',
          },
        },
      };
    case types.PERSON_PUT_INVALID_FAILED:
      return {
        ...state,
        records: {
          ...state.records,
          [uuid]: {
            ...state.records[uuid],
            invalid_status: processErr(action.error),
          },
        },
      };
    case types.PERSON_CLEAR_INVALID:
      return {
        ...state,
        records: {
          ...state.records,
          [uuid]: {
            ...state.records[uuid],
            invalid: false,
            invalid_reason: '',
            invalid_status: '',
          },
        },
      };
    default: return state;
  }
}
