import fetch from 'node-fetch';
import { toQueryString } from '../utils';

exports.handler = async event => {
  const PARAMS = toQueryString(event.queryStringParameters);

  try {
    const response = await fetch(`https://api.airtable.com/v0/app5hJojHQxyJ7ElS/keywords_new?${PARAMS}`,
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
