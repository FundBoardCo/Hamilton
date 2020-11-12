import fetch from 'node-fetch';
import { getSafeVar, toQueryString } from '../utils';

exports.handler = async event => {
  // call the emailMap table to get the email.
  const MAP_PARAMS = toQueryString(event.queryStringParameters);
  const MAP_URL = 'https://api.airtable.com/v0/appGVqCRTs9ZDqcoR/emailMap';
  let STATUS_PARAMS = '';
  const STATUS_URL = 'https://api.airtable.com/v0/appGVqCRTs9ZDqcoR/status';

  try {
    const mapResponse = await fetch(`${MAP_URL}?${MAP_PARAMS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          'Content-Type': 'application/json',
        },
      });
    const mapData = await mapResponse.json();
    const params = {};
    const email = getSafeVar(() => mapData.records[0].fields.email);
    params.filterByFormula = `{userid}="${email}"`;
    STATUS_PARAMS = toQueryString(params);
    const statusResponse = await fetch(`${STATUS_URL}?${STATUS_PARAMS}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          'Content-Type': 'application/json',
        },
      });
    const data = await statusResponse.json();
    if (Array.isArray(data.records)) {
      // remove sensitive data
      data.records = data.records.map(r => {
        const newF = { ...r.fields } || {};
        delete newF.userid;
        delete newF.key;
        delete newF.intro_email;
        return {
          ...r,
          fields: newF,
        };
      });
    }
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
