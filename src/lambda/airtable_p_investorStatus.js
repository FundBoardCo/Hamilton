import fetch from 'node-fetch';

exports.handler = async event => {
  try {
    const method = event.httpMethod;
    const { endpoint } = event.headers;

    const response = await fetch(`https://api.airtable.com/v0/appGVqCRTs9ZDqcoR/${endpoint}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          'Content-Type': 'application/json',
        },
        body: event.body,
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
