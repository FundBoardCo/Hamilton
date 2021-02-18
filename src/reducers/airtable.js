import { processErr, capitalizeFirstLetters } from '../utils';
import * as types from '../actions/types';

function dedupe(records) {
  const keywords = records.map(r => r.fields.Keyword);
  const lower = [];
  const capped = [];
  keywords.forEach(k => {
    if (!lower.includes(k.toLowerCase())) {
      lower.push(k.toLowerCase());
      capped.push(capitalizeFirstLetters(k));
    }
  });
  return capped;
}

const defaultState = {
  keywords: { state: null, data: [] },
  feedback_status: '',
};

export default function airTable(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case types.AIRTABLE_GET_KEYWORDS_REQUESTED: return {
      ...state,
      keywords: {
        ...state.keywords,
        data: [],
        status: 'pending',
      },
    };
    case types.AIRTABLE_GET_KEYWORDS_SUCCEEDED: return {
      // This will fire multiple times if it is paginating.
      ...state,
      keywords: {
        ...state.keywords,
        status: 'succeeded',
        data: [...new Set([
          ...state.keywords.data,
          ...dedupe(action.data.records),
        ])].sort(),
      },
    };
    case types.AIRTABLE_GET_KEYWORDS_FAILED: return {
      ...state,
      keywords: {
        ...state.keywords,
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
