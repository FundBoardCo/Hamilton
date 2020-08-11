import * as types from '../actions/types';
import { processErr } from '../utils';

export default function info(state = {}, action) {
  switch (action.type) {
    case types.INFO_GET_REQUESTED: return {
      ...state,
      [action.params.itemId]: {
        ...[action.params.itemId],
        status: 'pending',
      },
    };
    case types.INFO_GET_SUCCEEDED: return {
      ...state,
      [action.params.itemId]: {
        status: 'succeeded',
        data: action.data,
      },
    };
    case types.INFO_GET_FAILED: return {
      ...state,
      [action.params.itemId]: { ...[action.params.itemId], status: processErr(action.error) },
    };
    case types.INFO_GET_DISMISSED: return {
      ...state,
      [action.params.itemId]: { ...[action.params.itemId], status: '' },
    };
    default: return state;
  }
}
