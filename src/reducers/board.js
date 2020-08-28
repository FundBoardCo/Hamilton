import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar } from '../utils';

export default function board(state = { ids: [] }, action) {
  let rehydratedIds = getSafeVar(() => action.payload.board.ids, []);
  // remove any bad ids. TODO: make sure no bad ids get in.
  rehydratedIds = rehydratedIds.filter(i => i && typeof i === 'string');
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ids: [...state.ids, ...rehydratedIds],
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
      ids: [...new Set([...state.ids, ...action.ids])],
    };
    default: return state;
  }
}
