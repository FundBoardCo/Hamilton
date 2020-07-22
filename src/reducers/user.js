import { REHYDRATE } from 'redux-persist';

export default function user(state = {}, action) {
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.user,
    };
    default: return state;
  }
}
