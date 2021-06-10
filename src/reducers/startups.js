import * as types from '../actions/types';
import { processErr, convertArrayToKeyedByUUID } from '../utils';

export const startupsResets = {
  get_startupsCB_status: '',
  get_foundersCB_status: '',
};

const defaults = {
  ...startupsResets,
  startupsCB: {},
  foundersCB: {},
};

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
        ...convertArrayToKeyedByUUID(action.data),
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
    case types.FOUNDERSCB_GET_REQUESTED: return {
      ...state,
      get_foundersCB_status: 'pending',
    };
    case types.FOUNDERSCB_GET_SUCCEEDED: return {
      ...state,
      get_foundersCB_status: 'succeeded',
      foundersCB: {
        ...state.foundersCB,
        ...convertArrayToKeyedByUUID(action.data),
      },
    };
    case types.FOUNDERSCB_GET_FAILED: return {
      ...state,
      get_foundersCB_status: processErr(action.error),
    };
    case types.FOUNDERSCB_GET_DISMISSED: return {
      ...state,
      get_foundersCB_status: '',
    };
    default: return state;
  }
}
