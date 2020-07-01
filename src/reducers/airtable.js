import { processErr } from '../utils';
import * as types from '../actions/types';
import { capitalizeFirstLetter } from '../utils';

export default function airTable(state = {}, action) {
  console.log(action)
  switch (action.type) {
    case types.AIRTABLE_GET_KEYWORDS_REQUESTED: return {
      ...state,
      keywords: {
        state: 'pending',
      },
    };
    case types.AIRTABLE_GET_KEYWORDS_SUCCEEDED: return {
      ...state,
      keywords: {
        state: 'succeeded',
        data: action.data.records.map(r => capitalizeFirstLetter(r.fields.Keyword)).sort(),
      },

    };
    case types.AIRTABLE_GET_KEYWORDS_FAILED: return {
      ...state,
      keywords: {
        state: processErr(action.error),
      },
    };
    default: return state;
  }
}
