import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';

export default function people(state = {}, action) {
  const records = {};
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...action.payload.people,
    };
    case types.PEOPLE_UPDATE:
      if (action.data.records) {
        action.data.records.forEach(r => {
          records[r.id] = r.fields;
        });
      }
      return {
        ...state,
        ...records,
      };
    default: return state;
  }
}
