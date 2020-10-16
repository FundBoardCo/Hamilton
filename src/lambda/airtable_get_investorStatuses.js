import fetch from 'node-fetch';
import { toQueryString } from '../utils';

exports.handler = async (event, context, callback) => {
  const API_PARAMS = toQueryString(event.queryStringParameters);

  const pass = body => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  };

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
    await pass(data);
  } catch (err) {
    const error = {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
    await pass(error);
  }
};
