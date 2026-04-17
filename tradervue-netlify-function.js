// Netlify serverless function — proxies Tradervue API calls
// Keeps credentials server-side so they're never exposed to the browser
// Deploy this file to: /netlify/functions/tradervue.js in your repo

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://traderoompro.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const params = event.queryStringParameters || {};
    const { endpoint, userId } = params;

    // Credentials live in Netlify env vars — never in code
    const TV_USER = process.env.TV_USERNAME;
    const TV_PASS = process.env.TV_PASSWORD;
    const TV_BASE = process.env.TV_BASE_URL || 'https://app.tradervue.com/api/v1';

    if (!TV_USER || !TV_PASS) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'TV_USERNAME and TV_PASSWORD not set in Netlify environment variables.'
        }),
      };
    }

    const basicAuth = Buffer.from(`${TV_USER}:${TV_PASS}`).toString('base64');
    const reqHeaders = {
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      'User-Agent': 'TradeRoom PRO (traderoompro.com)',
    };

    if (userId) reqHeaders['Tradervue-UserId'] = userId;

    // Only allow safe read endpoints
    const allowed = ['/users', '/trades'];
    if (!allowed.some(a => (endpoint || '').startsWith(a))) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Endpoint not allowed.' })
      };
    }

    // Forward query params (date filters etc), excluding internal params
    const qs = Object.entries(params)
      .filter(([k]) => !['endpoint', 'userId'].includes(k))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const url = `${TV_BASE}${endpoint}${qs ? '?' + qs : ''}`;
    const response = await fetch(url, { headers: reqHeaders });
    const body = await response.text();

    return { statusCode: response.status, headers: corsHeaders, body };

  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
