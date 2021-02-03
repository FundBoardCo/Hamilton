import Webflow from 'webflow-api';

exports.handler = async event => {
  const { itemId, collection } = event.queryStringParameters;
  const token = process.env.WEBFLOW_APIKEY;

  const webFlowAPI = new Webflow({ token });

  let collectionId = '5f32059a4837a2f38d6d2de3'; // tips, the default;
  if (collection === 'blog') collectionId = '5e8e265102dac128f49dd555';

  try {
    const data = await webFlowAPI.item({
      collectionId,
      itemId,
    });
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
