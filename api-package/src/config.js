let baseUrl = '';
let token = '';

export const setBaseUrl = (url) => {
  baseUrl = (url || '').replace(/\/+$/, '');
};

export const getBaseUrl = () => baseUrl;

export const setToken = (value) => {
  token = value || '';
};

export const getToken = () => token;

export const getAuthHeaders = () => (token ? { Authorization: token } : {});

export const buildUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
