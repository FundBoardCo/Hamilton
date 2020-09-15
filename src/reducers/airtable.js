import { processErr, capitalizeFirstLetter } from '../utils';
import * as types from '../actions/types';

const defaultState = {
  keywords: { state: null, data: [] },
  feedback_status: '',
};

export default function airTable(state = { ...defaultState }, action) {
  console.log(action);
  switch (action.type) {
    case types.AIRTABLE_GET_KEYWORDS_REQUESTED: return {
      ...state,
      keywords: {
        status: 'pending',
      },
    };
    case types.AIRTABLE_GET_KEYWORDS_SUCCEEDED: return {
      ...state,
      keywords: {
        status: 'succeeded',
        data: action.data.records.map(r => capitalizeFirstLetter(r.fields.Keyword)).sort(),
      },
    };
    case types.AIRTABLE_GET_KEYWORDS_FAILED: return {
      ...state,
      keywords: {
        status: processErr(action.error),
      },
    };
    case types.FEEDBACK_SEND_REQUESTED: return {
      ...state,
      feedback_status: 'pending',
    };
    case types.FEEDBACK_SEND_SUCCEEDED: return {
      ...state,
      feedback_status: 'succeeded',
    };
    case types.FEEDBACK_SEND_FAILED: return {
      ...state,
      feedback_status: processErr(action.error),
    };
    case types.FEEDBACK_SEND_DISMISSED: return {
      ...state,
      feedback_status: '',
    };
    default: return state;
  }
}
