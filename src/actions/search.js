import * as types from './types';

export function setSearchKeywords(keywords = []) {
  return { type: types.SEARCH_SET_KEYWORDS, keywords };
}

export function setSearchRaise(raise = 0) {
  return { type: types.SEARCH_SET_RAISE, raise };
}

export function setSearchLocation(location = '') {
  return { type: types.SEARCH_SET_LOCATION, location };
}

export function setSerchRemote(remote = false) {
  return { type: types.SEARCH_SET_REMOTE, remote };
}
