import * as types from '../actions/types';
import { processErr } from '../utils';

const defaults = {
  get_status: '',
  post_status: '',
  founders: {},
};

export default function founders(state = defaults, action) {
  switch (action.type) {
    case types.PUBLIC_GET_FOUNDERDATA_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.PUBLIC_GET_FOUNDERDATA_SUCCEEDED: return {
      ...state,
      get_status: 'succeeded',
      founders: {
        ...state.founders,
        [action.objectId]: action.data,
      },
    };
    case types.PUBLIC_GET_FOUNDERDATA_FAILED: return {
      ...state,
      get_status: processErr(action.error),
    };
    case types.PUBLIC_GET_FOUNDERDATA_DISMISSED: return {
      ...state,
      get_status: '',
    };
    default: return state;
  }
}
