// Holds runtime configuration for the client SDK (base URL, token, headers).

const DEFAULT_BASE_URL = 'https://api.ebuuhia.mn/api/v1';

let baseUrl = DEFAULT_BASE_URL;
let token = '';

export const getBaseUrl = () => baseUrl;

export const setBaseUrl = (nextBaseUrl) => {
  baseUrl = (nextBaseUrl || '').replace(/\/$/, '') || DEFAULT_BASE_URL;
  return baseUrl;
};

export const getToken = () => token;

export const setToken = (nextToken) => {
  token = nextToken || '';
  return token;
};

export const getDefaultHeaders = () => ({
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
});

export const getAuthHeaders = () => {
  if (!token) return {};
  // Captured requests show raw token in Authorization (no Bearer prefix).
  return { Authorization: token };
};

export const resetConfig = () => {
  baseUrl = DEFAULT_BASE_URL;
  token = '';
};

export const defaults = {
  DEFAULT_BASE_URL
};
