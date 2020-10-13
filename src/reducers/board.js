import * as types from '../actions/types';

export default function board(state = { ids: [] }, action) {
  switch (action.type) {
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
    case types.BOARD_SHOWADVICE: return {
      ...state,
      showAdvice: action.showAdvice,
    };
    default: return state;
  }
}
