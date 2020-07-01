import * as types from './types';

export function getAirtableKeywords() {
  return { type: types.AIRTABLE_GET_KEYWORDS_REQUESTED };
}
