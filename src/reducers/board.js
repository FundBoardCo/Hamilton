import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { processErr } from '../utils';

export default function board(state = { ids: [] }, action) {
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.board,
    };
    case types.BOARD_ADD: return {
      ...state,
      ids: [action.id, ...state.ids],
    };
    case types.BOARD_REMOVE: return {
      ...state,
      ids: state.ids.filter(i => i !== action.id),
    };
    case types.BOARD_CHANGE_REQUESTED: return {
      ...state,
      board_status: 'pending',
    };
    case types.BOARD_CHANGE_SUCCEEDED: return {
      ...state,
      board_status: 'succeeded',
      ids: action.data.ids,
    };
    case types.BOARD_CHANGE_FAILED: return {
      ...state,
      board_status: processErr(action.error),
    };
    case types.BOARD_GET_REQUESTED: return {
      ...state,
      board_status: 'pending',
    };
    case types.BOARD_GET_SUCCEEDED: return {
      ...state,
      board_status: 'succeeded',
      ids: action.data.ids,
    };
    case types.BOARD_GET_FAILED: return {
      ...state,
      board_status: processErr(action.error),
    };
    default: return state;
  }
}
