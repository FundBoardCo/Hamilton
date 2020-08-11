import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar } from '../utils';

export default function modal(state = { openModal: null }, action) {
  const rehydration = getSafeVar(() => action.payload.modals, {});
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
    };
    case types.MODAL_SET_OPEN: return {
      ...state,
      openModal: action.modal,
    };
    case types.USER_CREATE_SUCCEEDED: return {
      ...state,
      openModal: state.openModal === 'login' ? null : state.openModal,
    };
    case types.USER_LOGIN_SUCCEEDED: return {
      ...state,
      openModal: state.openModal === 'login' ? null : state.openModal,
    };
    default: return state;
  }
}
