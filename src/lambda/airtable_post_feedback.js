import fetch from 'node-fetch';
import axios from 'axios';

exports.handler = async (event, context, callback) => {
  const pass = body => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  };

  axios({
    method: 'post',
    url: 'https://api.airtable.com/v0/app7qe3RJry7GgvKw/Feedback',
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
    },
    data: event.body,
  })
    .then(response => {
      console.log(response.data);
      pass(response.data);
    })
    .catch(err => pass(err));
/*
  try {
    const response = await fetch('https://api.airtable.com/v0/app7qe3RJry7GgvKw/Feedback',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_APIKEY}`,
          'Content-Type': 'application/json',
        },
        body: event.body,
      });
    const data = await response.json();
    if (data.error) {
      const error = {
        statusCode: 500,
        body: JSON.stringify({ error: data.error }),
      };
      await pass(error);
    }
    await pass(data);
  } catch (err) {
    const error = {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
    await pass(error);
  }
 */
};
