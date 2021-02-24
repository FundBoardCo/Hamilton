import moment from 'moment';

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

export function capitalizeFirstLetters(str) {
  if (typeof str !== 'string') return '';
  const words = str.split(' ');
  let phrase = '';
  words.forEach(w => {
    phrase = `${phrase} ${capitalizeFirstLetter(w)}`;
  });
  return phrase;
}

export function convertInvestedLocations(arr) {
  if (!Array.isArray(arr)) return '';
  const newArr = [];
  arr.forEach(l => {
    const splitL = l.split('_');
    let city = '';
    let state = '';
    if (splitL.length > 1) {
      city = splitL[0].split(' ').map(w => capitalizeFirstLetter(w)).join(' ');
      state = splitL[1].toUpperCase();
    } else if (splitL[0].length > 2) {
      city = capitalizeFirstLetter(splitL[0]);
    } else {
      state = splitL[0].toUpperCase();
    }
    let cityState = city;
    if (cityState) {
      cityState = state ? `${cityState}, ${state}` : cityState;
    } else {
      cityState = state;
    }
    newArr.push(cityState);
  });

  if (newArr.length > 1) {
    const lastL = newArr.pop();
    const firstL = newArr.join(', ');
    return `${firstL}, and ${lastL}`;
  }
  return newArr[0];
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
  if (!zipCode) return false;
  if (!Array.isArray(locations)) return false;

  let searchedCity = locations.filter(l => l.zip_code === zipCode)[0];
  if (searchedCity && searchedCity.city && searchedCity.state) {
    searchedCity = [`${searchedCity.city},${searchedCity.state}`];
  } else {
    return false;
  }

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

export function trackErr(err) {
  window.heap.track('Error', { message: processErr(err) });
}

export function isLoginErr(err) {
  const status = getSafeVar(() => err.response.status);
  return status === '401';
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function aFormDate(d) {
  return moment(d, [moment.ISO_8601, 'MMM DD, YYYY hh:mma'])
    .format('MMMM DD, YYYY h:mma');
}

export function formatCur(val, currency = 'USD') {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
  }).format(val)
    // remove decimals and trailing international currency symbols
    .replace(/\D00(?=\D*$)/, '');
}

export function calcMatch(opts) {
  const {
    searchedText = '',
    raise,
    searchedCityState = '',
    searchedLocationPairs = [],
    investor = {},
    keywords = [],
    remote = false,
  } = opts;

  const {
    name = '',
    investorLocation = '',
    invested_locations,
    raise_min = 0,
    raise_max = 0,
    raise_median = 0,
    description,
    startupDescsBlob,
    num_partner_investments = 0,
    startups = [],
    primary_organization_name = '',
    primary_organization = {},
  } = investor;

  const iKeywords = Array.isArray(investor.keywords)
    ? investor.keywords.map(ik => ik.trim().toLowerCase()) : [];
  const sKeywords = keywords.map(sk => sk.trim().toLowerCase());

  const matchedLocation = searchedCityState === investorLocation;
  const matchedExtraLocations = !!Array.isArray(invested_locations)
  && !!invested_locations.length
  && !!invested_locations.find(il => searchedLocationPairs.includes(il));

  const matches = {
    keywords: iKeywords.filter(k => sKeywords.includes(k)),
    raise: raise >= raise_min && raise <= raise_max,
    location: matchedLocation || matchedExtraLocations,
  };

  sKeywords.forEach(k => {
    if (description) {
      const lDesc = description.toLowerCase();
      if (lDesc.includes(k)) matches.keywords.push(k);
    }
    if (startupDescsBlob && startupDescsBlob.includes(k)) matches.keywords.push(k);
  });

  matches.keywords = [...new Set([...matches.keywords])];

  let percentageMatch = matches.keywords.length / keywords.length;

  if (matches.raise) {
    let raiseDiff = raise - raise_median;
    if (raiseDiff < 0) raiseDiff *= -1;
    let raiseAdd = 0;
    if (raiseDiff <= 5000000) raiseAdd = 0.1;
    if (raiseDiff <= 4000000) raiseAdd = 0.224;
    if (raiseDiff <= 3500000) raiseAdd = 0.336;
    if (raiseDiff <= 3000000) raiseAdd = 0.418;
    if (raiseDiff <= 2500000) raiseAdd = 0.527;
    if (raiseDiff <= 2000000) raiseAdd = 0.626;
    if (raiseDiff <= 1500000) raiseAdd = 0.719;
    if (raiseDiff <= 1250000) raiseAdd = 0.826;
    if (raiseDiff <= 1000000) raiseAdd = 0.876;
    if (raiseDiff <= 750000) raiseAdd = 0.921;
    if (raiseDiff <= 500000) raiseAdd = 1;
    matches.raiseAdd = raiseAdd;
    percentageMatch += raiseAdd;
  }

  let locationBonus = 0;
  if (matches.location) {
    locationBonus = 0.6;
    if (investorLocation === searchedCityState) {
      locationBonus = 1;
    }
  }

  // if remote, give all results 50% location bonus
  if (remote) locationBonus = (locationBonus + 1) / 2;
  // count location as 0.25, so it's 1/1/0.25/0.75 keywords, raise, location, investments
  percentageMatch += (locationBonus / 4);

  // weight startups and investments
  let invAdd = 0;
  if (num_partner_investments > 2) invAdd = 0.1;
  if (num_partner_investments > 5) invAdd = 0.5;
  if (num_partner_investments > 10) invAdd = 0.8;
  if (num_partner_investments > 20) invAdd = 1;

  let startAdd = 0;
  if (startups.length > 2) startAdd = 0.1;
  if (startups.length > 3) startAdd = 0.5;
  if (startups.length > 4) startAdd = 0.8;
  if (startups.length > 10) startAdd = 1;

  percentageMatch += (invAdd + startAdd) * 0.375;

  if (searchedCityState) {
    percentageMatch = Math.floor((percentageMatch / 3) * 100);
  } else if (remote) {
    percentageMatch = Math.floor((percentageMatch / 2.875) * 100);
  } else {
    percentageMatch = Math.floor((percentageMatch / 2.75) * 100);
  }

  if (searchedText) {
    const searchFor = searchedText.toLowerCase();
    let orgName = primary_organization_name
      || primary_organization.name
      || primary_organization.value
      || '';
    orgName = orgName.toLowerCase();
    const invName = name.toLowerCase();

    if (!invName.includes(searchFor) && !orgName.includes(searchFor)) {
      percentageMatch = 0;
    } else {
      percentageMatch = Math.floor((percentageMatch + 50) / 1.5);
    }
  }

  matches.percentage_match = percentageMatch;

  return { matches };
}

export function parseB4AObject(result) {
  return result && typeof result.toJSON === 'function' ? result.toJSON() : {};
}

export function parseB4AArray(arr) {
  return arr.map(a => parseB4AObject(a));
}

export function formatUSD(amount = 0) {
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
  return usdFormatter.format(amount);
}
