import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';

export default function modal(state = { openModal: null }, action) {
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.modal,
    };
    case types.MODAL_SET_OPEN: return {
      ...state,
      openModal: action.modal,
    };
    default: return state;
  }
}
