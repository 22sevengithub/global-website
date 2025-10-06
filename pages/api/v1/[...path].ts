// API Proxy to forward requests to 22seven API
// This handles CORS and network accessibility issues

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-global.dev.vault22.io';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Prevent caching of any redirects or responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;

  console.log(`🔄 Proxying ${req.method} request to: ${API_BASE_URL}/${apiPath}`);

  try {
    // Forward the request to the actual API
    const response = await axios({
      method: req.method,
      url: `${API_BASE_URL}/${apiPath}`,
      data: req.body,
      params: Object.fromEntries(
        Object.entries(req.query).filter(([key]) => key !== 'path')
      ),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward auth headers from client
        ...(req.headers['x-session-token'] && {
          'X-SESSION-TOKEN': req.headers['x-session-token'] as string,
        }),
        ...(req.headers['x-request-token'] && {
          'X-REQUEST-TOKEN': req.headers['x-request-token'] as string,
        }),
      },
      timeout: 60000, // 60 seconds (increased from 30s to handle large aggregate responses)
    });

    // Forward the response back to client
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`❌ Proxy error for ${apiPath}:`, error.message);

    if (error.response) {
      // API responded with error - log the full response
      console.error(`API Response:`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      res.status(error.response.status).json(error.response.data);
    } else {
      // Network or other error
      console.error('Network error details:', error);
      res.status(500).json({
        error: 'Proxy error',
        message: error.message,
        details: 'Unable to reach 22seven API. The API may be behind a VPN or not publicly accessible.',
      });
    }
  }
}
