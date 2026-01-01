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

export const buildCreateDeliveryBody = (form = {}, options = {}) => {
  const { includeOptional = true } = options;
  const customer = form.customer || {};
  const address = form.address || {};
  const item = form.item || {};
  const body = {
    user_id: form.user_id ?? form.userId ?? null,
    staff: form.staff ?? '',
    type: form.type ?? form.deliveryType ?? '',
    send_message: form.send_message ?? form.sendMessage ?? false,
    cus_name: form.cus_name ?? customer.name ?? '',
    cus_phone: form.cus_phone ?? customer.phone ?? null,
    cus_phone1: form.cus_phone1 ?? customer.phone1 ?? null,
    addition: form.addition ?? address.addition ?? '',
    items: Array.isArray(form.items) ? form.items : []
  };

  if (!includeOptional) {
    return body;
  }

  return {
    ...body,
    total_price: form.total_price ?? form.totalPrice ?? null,
    city: form.city ?? address.city ?? null,
    district: form.district ?? address.district ?? null,
    committee: form.committee ?? address.committee ?? null,
    town: form.town ?? address.town ?? '',
    street: form.street ?? address.street ?? '',
    toot: form.toot ?? address.toot ?? '',
    deli_desc: form.deli_desc ?? form.deliDesc ?? item.desc ?? '',
    item_name: form.item_name ?? form.itemName ?? item.name ?? '',
    item_type: form.item_type ?? form.itemType ?? item.type ?? '',
    quantity: form.quantity ?? item.quantity ?? null,
    size: form.size ?? item.size ?? '',
    weight: form.weight ?? item.weight ?? '',
    operator: form.operator ?? null
  };
};
