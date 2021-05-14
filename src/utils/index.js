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
  return words.map(word => capitalizeFirstLetter(word)).join(' ');
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
    onlyLeads = false,
    onlyDiverse = false,
    onlyOpen = false,
    location = '', // the zip code
    onlyLocal, // require location matches
    searchedCityState = '',
    searchedLocationPairs = [],
    investor = {},
    keywords = [],
    remote = false,
  } = opts;

  const {
    name = '',
    investorLocation = '',
    invested_locations = [],
    is_lead_investor,
    diverse_investors_list,
    accepts_direct_outreach,
    raise_min = 0,
    raise_max = 0,
    raise_median = 0,
    description,
    cur_investments_led = 0,
    investor_type,
    // startups = [],
    primary_job_title,
    primary_organization = {},
  } = investor;

  let { primary_organization_name } = investor;

  primary_organization_name = primary_organization_name
    || primary_organization?.name
    || primary_organization?.value;

  const iKeywords = Array.isArray(investor.keywords)
    ? investor.keywords.map(ik => ik.trim().toLowerCase()) : [];
  const sKeywords = keywords.map(sk => sk.trim().toLowerCase());

  let matchedLocation = false;
  let matchedExtraLocations = false;

  // ignore old location state if the current zip is blank
  // TODO: this is pretty klunky, reset everything on search if there is no zip code instead
  if (location) {
    matchedLocation = searchedCityState.toLowerCase() === investorLocation.toLowerCase();
    matchedExtraLocations = Array.isArray(invested_locations)
      && invested_locations.length
      && !!invested_locations.find(il => searchedLocationPairs.includes(il.toLowerCase()));
  }

  const matches = {
    keywords: iKeywords.filter(k => sKeywords.includes(k)),
    raise: !!raise && raise >= raise_min && raise <= raise_max,
    location: matchedLocation || !!matchedExtraLocations,
  };

  sKeywords.forEach(k => {
    if (description) {
      const lDesc = description.toLowerCase();
      if (lDesc.includes(k)) matches.keywords.push(k);
    }
  });

  matches.keywords = [...new Set([...matches.keywords])];

  let percentageMatch = keywords.length ? matches.keywords.length / keywords.length : 0;
  let matchDivisor = keywords.length ? 1 : 0;

  if (raise) {
    let raiseDiff = raise - raise_median;
    if (raiseDiff < 0) raiseDiff *= -1;
    let raiseAdd = 0;

    // use a different scale if the raise is below 1 million
    if (raise < 1000000) {
      if (raiseDiff <= 300000) raiseAdd = 0.05;
      if (raiseDiff <= 200000) raiseAdd = 0.10;
      if (raiseDiff <= 150000) raiseAdd = 0.20;
      if (raiseDiff <= 100000) raiseAdd = 0.31;
      if (raiseDiff <= 750000) raiseAdd = 0.42;
      if (raiseDiff <= 500000) raiseAdd = 0.53;
      if (raiseDiff <= 400000) raiseAdd = 0.64;
      if (raiseDiff <= 300000) raiseAdd = 0.75;
      if (raiseDiff <= 200000) raiseAdd = 0.86;
      if (raiseDiff <= 100000) raiseAdd = 0.97;
      if (raiseDiff <= 50000) raiseAdd = 1;
    } else {
      if (raiseDiff <= 5000000) raiseAdd = 0.05;
      if (raiseDiff <= 4500000) raiseAdd = 0.10;
      if (raiseDiff <= 4000000) raiseAdd = 0.20;
      if (raiseDiff <= 3500000) raiseAdd = 0.31;
      if (raiseDiff <= 3000000) raiseAdd = 0.42;
      if (raiseDiff <= 2500000) raiseAdd = 0.53;
      if (raiseDiff <= 2000000) raiseAdd = 0.64;
      if (raiseDiff <= 1500000) raiseAdd = 0.75;
      if (raiseDiff <= 1000000) raiseAdd = 0.86;
      if (raiseDiff <= 750000) raiseAdd = 0.97;
      if (raiseDiff <= 500000) raiseAdd = 1;
    }

    percentageMatch += raiseAdd;
    matchDivisor += 1; // add divisor for raise;
    // fudge the raise.match so near misses are counted
    if (raiseAdd > 0.8) matches.raise = true;
  }

  if (location && searchedCityState) {
    let locationBonus = 0;
    if (matches.location) {
      locationBonus = 0.6;
      if (investorLocation === searchedCityState) {
        locationBonus = 1;
      }
    }

    // if remote, reduce bonus by half
    if (remote && !onlyLocal) {
      percentageMatch += (locationBonus / 8);
      matchDivisor += 0.125;
    } else if (onlyLocal) {
      percentageMatch += (locationBonus);
      matchDivisor += 1;
    } else {
      percentageMatch += (locationBonus / 4);
      matchDivisor += 0.25;
    }
  }

  /*
  -- remove from now, since it's not clear what is happening to the user when this affects results
  let startAdd = 0;
  if (startups.length > 1) startAdd = 0.1;
  if (startups.length > 3) startAdd = 0.5;
  if (startups.length > 5) startAdd = 0.8;
  if (startups.length > 8) startAdd = 1;
  percentageMatch += startAdd / 4;
  matchDivisor += 0.25; // add divisor for invested startups;
   */

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
      percentageMatch += 1;
      matchDivisor += 1; // add divisor for text search;
    }
  }

  // Note that a search match can still be removed by the following boolean searches

  if (onlyDiverse && diverse_investors_list) {
    // add a match % so investors that would be zero otherwise show up
    percentageMatch += 0.2;
    matchDivisor += 0.2;
  }

  if (onlyOpen && accepts_direct_outreach) {
    // add a match % so investors that would be zero otherwise show up
    percentageMatch += 0.2;
    matchDivisor += 0.2;
  }

  // weight startups and investments
  if (onlyLeads && is_lead_investor) {
    let invAdd = 0;
    if (cur_investments_led > 1) invAdd = 0.8;
    if (cur_investments_led > 2) invAdd = 0.9;
    if (cur_investments_led > 3) invAdd = 1;

    percentageMatch += invAdd / 4;
    matchDivisor += 0.25; // add divisor for current investments;
  }

  if (onlyOpen && !accepts_direct_outreach) percentageMatch = 0;
  if (onlyDiverse && !diverse_investors_list) percentageMatch = 0;
  if (onlyLeads && !is_lead_investor) percentageMatch = 0;
  if (onlyLocal && !matches.location) percentageMatch = 0;

  // Exclude results with minimal data unless it's a text search
  if (!searchedText
    && (
      !raise_median
      || (!Array.isArray(investor_type) || !investor_type.length)
      || !primary_job_title
      || !primary_organization_name
    )) percentageMatch = 0;

  if (matchDivisor) {
    percentageMatch = Math.floor((percentageMatch / matchDivisor) * 100);
  } else {
    percentageMatch = 0;
  }

  matches.percentage_match = percentageMatch;
  matches.matchDivisor = matchDivisor;

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

export function isEmptyish(val) {
  let emptyish = !val;
  if (Array.isArray(val)) {
    emptyish = !val.length;
  } else if (typeof val === 'object') {
    emptyish = !Object.keys(val).length;
  }
  return emptyish;
}
