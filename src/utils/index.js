export function processErr(err) {
  if (!err) return false;
  if (err.response && err.response.data) {
    if (err.response.data.error) {
      if (typeof err.response.data.error === 'object') {
        return JSON.stringify(err.response.data.error);
      }
      return err.response.data.error;
    }
    if (err.response.data.error_msg) {
      return err.response.data.error_msg;
    }
    return err.response.data;
  }
  if (err.message) return err.message;
  if (typeof err === 'object') return JSON.stringify(err);
  // TODO: detect 401 errors and inject a login link here if the user is logged out
  return err;
}

export function statusIsError(state) {
  return !!state && !['pending', 'succeeded'].includes(state);
}

export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string') return '';
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

// from https://stackoverflow.com/a/43105324
// This is needed to get array values into the right format.
// It should also cover any future nested object values.
const format = (k, v) => (v ? `${k}=${encodeURIComponent(v)}` : '');

// eslint-disable-next-line max-len
export const toQueryString = obj => [].concat(...Object.entries(obj).map(([k, v]) => (Array.isArray(v) ? v.map(arr => toQueryString({ [k]: arr })) : format(k, v))))
  .filter(x => x)
  .join('&');

// Adapted from here https://github.com/pawelt/safethen/blob/master/index.js
export function getSafeVar(fn, defaultVal) {
  try {
    const value = fn();
    // eslint-disable-next-line no-void
    return value !== void 0 ? value : defaultVal;
  } catch (e) {
    return defaultVal; // will be undefined if not passed in, which is intentional.
  }
}

export function getSearchLocations(zipCode, locations) {
  if (!zipCode) throw new Error('Must provid zip code');
  if (!Array.isArray(locations)) throw new Error('Must provide locations object');

  let searchedCity = locations.filter(l => l.zip_code === zipCode)[0];
  console.log(locations)
  console.log(searchedCity)
  searchedCity = [`${searchedCity.city},${searchedCity.state}`];
  let searchedSecondaryCities = locations.filter(l => l.zip_code !== zipCode)
    .map(cs => `${cs.city},${cs.state}`);
  searchedSecondaryCities = [...new Set(searchedSecondaryCities)];
  return { searchedCity, searchedSecondaryCities };
}

export function convertKeyTags(text) {
  if (typeof text !== 'string') throw new Error('A string must be submitted.');
  let newText = text.replace(/\[fbkw]/g, '<i>');
  newText = newText.replace(/\[\/fbkw]/g, '</i>');
  return newText;
}

export function getMatchedKeywords(text, keywords) {
  if (typeof text !== 'string') throw new Error('A string must be submitted.');
  if (!Array.isArray(keywords)) throw new Error('An array of keywords must be submitted');
  const k = text.toLowerCase().match(/\[fbkw](.*?)\[\/fbkw]/g).map(
    v => v.replace(/\[\/?fbkw]/g, ''),
  );
  return [...new Set(k)];
}

export function calcMatch(opts) {
  const {
    keywords = [],
    keywords_matched = 0,
    raise,
    location,
    extraLocations,
    raise_min = 0,
    raise_max = 0,
    location_city,
    location_state,
    description,
    median_distance,
    keywords_rank,
  } = opts;
  const searchedCity = extraLocations.filter(l => l.zip_code === location)[0];
  const matches = {
    keywords: [],
    raise: raise >= raise_min && raise <= raise_max,
    location: extraLocations.filter(l => l.city === location_city
      && l.state === location_state).length > 0,
  };
  if (Array.isArray(keywords)) {
    keywords.forEach(k => {
      if (description && description.includes(k.toLowerCase())) matches.keywords.push(k);
    });
  }

  let percentageMatch = (keywords.length + keywords_rank) / 6;

  const raiseDiff = 10000000 - median_distance;

  if (raiseDiff > 0) percentageMatch += (raiseDiff / 10000000);

  // count location as 0.5, so it's 40/40/20 on keywords/raise/location
  if (matches.location) {
    percentageMatch += 0.33;
    if (searchedCity.city.toLowerCase() === location_city.toLowerCase()) {
      percentageMatch += 0.17;
    }
  }
  percentageMatch = Math.floor((percentageMatch / 2.5) * 100);
  return { matches, percentageMatch };
}
