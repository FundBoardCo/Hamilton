import fetch from 'node-fetch';
import { getSafeVar, toQueryString } from '../utils';

exports.handler = async event => {
  // call the emailMap table to get the email.
  const MAP_PARAMS = toQueryString(event.queryStringParameters);
  const BASE_URL = 'https://api.airtable.com/v0/appGVqCRTs9ZDqcoR/';
  let STATUS_PARAMS = '';
  let MANUAL_PARAMS = '';
  const { requestoremail } = event.headers;

  try {
    const mapResponse = await fetch(`${BASE_URL}emailMap?${MAP_PARAMS}`,
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
    let publicUUID_recordID;
    if (requestoremail === email) {
      // Only return the record ID if the logged in user is requesting it
      publicUUID_recordID = getSafeVar(() => mapData.records[0].id);
    }
    const hide = getSafeVar(() => mapData.records[0].fields.hide);
    params.filterByFormula = `{userid}="${email}"`;
    STATUS_PARAMS = toQueryString(params);
    MANUAL_PARAMS = toQueryString(params);
    const data = { publicUUID_recordID, hidden: hide };
    if (!email) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicUUID_recordID, notFound: true }),
      };
    }
    if (!hide) {
      const statusResponse = await fetch(`${BASE_URL}status?${STATUS_PARAMS}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
            'Content-Type': 'application/json',
          },
        });
      const statusData = await statusResponse.json();
      if (Array.isArray(statusData.records) && requestoremail !== email) {
        // remove sensitive data
        statusData.records = statusData.records.map(r => {
          const newF = { ...r.fields } || {};
          delete newF.userid;
          delete newF.intro_email;
          return {
            ...r, // id is required to allow introers to add their intro
            fields: newF,
          };
        });
      }
      data.statusData = statusData;

      const manualResponse = await fetch(`${BASE_URL}investors?${MANUAL_PARAMS}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
            'Content-Type': 'application/json',
          },
        });
      const manualData = await manualResponse.json();
      if (Array.isArray(manualData.records) && requestoremail !== email) {
        // remove sensitive data
        manualData.records = manualData.records.map(r => {
          const newF = { ...r.fields } || {};
          delete newF.userid;
          return {
            ...r,
            fields: newF,
          };
        });
      }
      data.manualData = manualData;
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
