import { REHYDRATE } from 'redux-persist';
import { processErr } from '../utils';
import * as types from '../actions/types';

export default function user(state = {}, action) {
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.user,
    };
    default: return state;
  }
}
