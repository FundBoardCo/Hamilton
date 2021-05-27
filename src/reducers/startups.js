import * as types from '../actions/types';
import { processErr } from '../utils';

export const startupsResets = {
  get_startupsCB_status: '',
  get_foundersCB_status: '',
};

const defaults = {
  ...startupsResets,
  startupsCB: {},
};

function convertToKeyedByUUID(arr) {
  const obj = {};
  arr.forEach(a => {
    obj[a.uuid] = { ...a };
  });
  return obj;
}

export default function startups(state = defaults, action) {
  switch (action.type) {
    case types.STARTUPSCB_GET_REQUESTED: return {
      ...state,
      get_startupsCB_status: 'pending',
    };
    case types.STARTUPSCB_GET_SUCCEEDED: return {
      ...state,
      get_startupsCB_status: 'succeeded',
      startupsCB: {
        ...state.startupsCB,
        ...convertToKeyedByUUID(action.data),
      },
    };
    case types.STARTUPSCB_GET_FAILED: return {
      ...state,
      get_startupsCB_status: processErr(action.error),
    };
    case types.STARTUPSCB_GET_DISMISSED: return {
      ...state,
      get_startupsCB_status: '',
    };
    default: return state;
  }
}
