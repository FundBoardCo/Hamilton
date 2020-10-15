import fetch from 'node-fetch';

exports.handler = async (event, context, callback) => {
  const pass = body => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    });
  };

  try {
    const response = await fetch('https://api.airtable.com/v0/appZTL6daVhkCbRGG/reports',
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
};
