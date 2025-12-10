import { setBaseUrl, setToken, getToken } from './config.js';
import * as helpers from './helpers/index.js';

const prefixOf = (name) => {
  const m = name.match(/^([a-z]+)/);
  return m ? m[1] : name;
};

export const helpersByDomain = Object.entries(helpers).reduce((acc, [name, fn]) => {
  const prefix = prefixOf(name);
  acc[prefix] = acc[prefix] || {};
  acc[prefix][name] = fn;
  return acc;
}, {});

export const configure = ({ baseUrl, token } = {}) => {
  if (baseUrl) setBaseUrl(baseUrl);
  if (token) setToken(token);
  return { baseUrl: baseUrl || null, token: getToken() || null };
};

export const loginAndSetToken = async (options = {}) => {
  const login = helpers.login;
  if (!login) {
    throw new Error('login helper not found');
  }
  const res = await login(options);
  const token = res?.data?.token || res?.data?.data?.token;
  if (token) setToken(token);
  return res;
};
