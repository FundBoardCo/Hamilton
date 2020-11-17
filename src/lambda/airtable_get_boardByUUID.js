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
    const publicUUID_recordID = getSafeVar(() => mapData.records[0].id);
    const email = getSafeVar(() => mapData.records[0].fields.email);
    const hide = getSafeVar(() => mapData.records[0].fields.hide);
    params.filterByFormula = `{userid}="${email}"`;
    STATUS_PARAMS = toQueryString(params);
    // return only this if the founder has set hide to true.
    let data = { publicUUID_recordID, hidden: true };
    if (!email) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicUUID_recordID, notFound: true }),
      };
    }
    if (!hide) {
      const statusResponse = await fetch(`${STATUS_URL}?${STATUS_PARAMS}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
            'Content-Type': 'application/json',
          },
        });
      data = await statusResponse.json();
      data.publicUUID_recordID = publicUUID_recordID;
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
