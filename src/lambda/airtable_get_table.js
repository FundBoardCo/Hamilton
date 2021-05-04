import fetch from 'node-fetch';
import { toQueryString } from '../utils';

exports.handler = async event => {
  const query = { ...event.queryStringParameters };
  const { endpoint, table } = query;
  delete query.endpoint;
  delete query.table;
  const PARAMS = toQueryString(query);
  console.log(query);
  console.log(PARAMS);
  console.log(`https://api.airtable.com/v0/${table}/${endpoint}?${PARAMS}`);

  try {
    const response = await fetch(`https://api.airtable.com/v0/${endpoint}/${table}?${PARAMS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          'Content-Type': 'application/json',
        },
      });
    console.log(response);
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
