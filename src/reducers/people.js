import * as types from '../actions/types';
import { processErr } from '../utils';
import investors from '../data/investors.json';

function extractRecords(ids) {
  const results = {};
  if (Array.isArray(ids)) {
    ids.forEach(i => {
      results[i] = investors[i];
    });
  }
  return results;
}

export const peopleResets = {
};

const defaults = {
  ...peopleResets,
  records: {},
};

export default function people(state = defaults, action) {
  const { params = {} } = action;
  const {
    uuid,
    id,
    reason,
  } = params;

  switch (action.type) {
    case types.PEOPLE_GET_REQUEST:
      return {
        ...state,
        records: {
          ...state.records,
          ...extractRecords(action.ids),
        },
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
