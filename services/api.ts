import ky from 'ky';

// Base API configuration
export const api = ky.create({
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add any global headers or authentication here
        console.log(`Making request to: ${request.url}`);
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (!response.ok) {
          console.error(`Request failed with status: ${response.status}`);
        }
        return response;
      },
    ],
  },
});

// Weather API specific instance
export const weatherApi = ky.create({
  prefixUrl: 'https://api.openweathermap.org/data/2.5',
  timeout: 8000,
  retry: {
    limit: 3,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        console.log(`Weather API request: ${request.url}`);
      },
    ],
  },
});

// OpenRouter AI API instance
export const aiApi = ky.create({
  prefixUrl: 'https://openrouter.ai/api/v1',
  timeout: 30000,
  retry: {
    limit: 1,
    methods: ['post'],
    statusCodes: [429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // Add OpenRouter API key when available
        const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
        if (apiKey) {
          request.headers.set('Authorization', `Bearer ${apiKey}`);
        }
        request.headers.set('Content-Type', 'application/json');
        console.log(`AI API request: ${request.url}`);
      },
    ],
  },
});