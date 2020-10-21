import fetch from 'node-fetch';
import { toQueryString } from '../utils';

exports.handler = async event => {
  const API_PARAMS = toQueryString(event.queryStringParameters);
  const API_URL = 'https://api.airtable.com/v0/appGVqCRTs9ZDqcoR/status';

  try {
    const response = await fetch(`${API_URL}?${API_PARAMS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          'Content-Type': 'application/json',
        },
      });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify(err.message || err),
    };
  }
};
