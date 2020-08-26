import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar } from '../utils';

export default function board(state = { ids: [] }, action) {
  const rehydration = getSafeVar(() => action.payload.board, {});
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
      ids: [...state.ids, ...rehydration.ids],
    };
    case types.BOARD_ADD: return {
      ...state,
      ids: [...state.ids, action.id],
    };
    case types.BOARD_REMOVE: return {
      ...state,
      ids: state.ids.filter(i => i !== action.id),
    };
    case types.BOARD_MERGE: return {
      ...state,
      ids: [...new Set([...state.ids, action.ids])],
    };
    default: return state;
  }
}
