import fetch from 'node-fetch';

exports.handler = async event => {
  const { zipcode, miles } = event.queryStringParameters;
  const key = process.env.ZIPCODECLIENTKEY;
  const url = `https://www.zipcodeapi.com/rest/${key}/radius.json/${zipcode}/${miles}/mile`;

  try {
    const response = await fetch(url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    if (!response.ok) { // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
