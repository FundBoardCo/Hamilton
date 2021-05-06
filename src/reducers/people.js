import * as types from '../actions/types';
import { processErr } from '../utils';

function processStartups(action, state) {
  const newStartups = { ...state.startups };
  const { startups } = action;

  startups.forEach(r => {
    newStartups[r.uuid] = { ...r };
  });
  return newStartups;
}

function processFounders(action, state) {
  const startups = { ...state.startups };
  const { founders, orgUUID } = action;
  startups[orgUUID].founders = founders;
  return startups;
}

export const peopleResets = {
  records: {},
  get_status: '',
  get_startups_status: '',
  startups: {},
  get_founders_status: '',
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
    case types.STARTUPS_REQUESTED:
      return {
        ...state,
        get_startups_status: 'pending',
      };
    case types.STARTUPS_SUCCEEDED:
      return {
        ...state,
        get_startups_status: 'succeeded',
        startups: processStartups(action, state),
      };
    case types.STARTUPS_FAILED:
      return {
        ...state,
        get_startups_status: processErr(action.error),
      };
    case types.STARTUPS_DISMISSED:
      return {
        ...state,
        get_startups_status: '',
      };
    case types.FOUNDERS_REQUESTED:
      return {
        ...state,
        get_founders_status: 'pending',
      };
    case types.FOUNDERS_SUCCEEDED:
      return {
        ...state,
        startups: processFounders(action, state),
      };
    case types.FOUNDERS_FAILED:
      return {
        ...state,
        get_founders_status: processErr(action.error),
      };
    case types.FOUNDERS_COMPLETED:
      return {
        ...state,
        get_founders_status: 'succeeded',
      };
    case types.FOUNDERS_DISMISSED:
      return {
        ...state,
        get_founders_status: '',
      };
    default: return state;
  }
}
