import * as types from '../actions/types';
import { getSafeVar } from '../utils';

const defaults = {
  ids: [],
};

export default function board(state = defaults, action) {
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
    case types.USER_LOGIN_SUCCEEDED: return {
      ...state,
      ids: [...new Set([
        ...state.ids,
        ...(getSafeVar(() => action.data.following, [])),
      ])],
    };
    case types.USER_LOGOUT: return {
      ...defaults,
    };
    default: return state;
  }
}
