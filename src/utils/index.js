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
