var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/config.js
var baseUrl = "";
var token = "";
var setBaseUrl = (url) => {
  baseUrl = (url || "").replace(/\/+$/, "");
};
var getBaseUrl = () => baseUrl;
var setToken = (value) => {
  token = value || "";
};
var getToken = () => token;
var getAuthHeaders = () => token ? { Authorization: token } : {};
var buildUrl = (path) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// src/http.js
var defaultHeaders = {
  Accept: "application/json, text/plain, */*"
};
async function httpRequest({ path, method = "GET", query, body, headers = {} }) {
  const url = new URL(buildUrl(path));
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== void 0 && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }
  const finalHeaders = { ...defaultHeaders, ...getAuthHeaders(), ...headers };
  const options = { method, headers: finalHeaders };
  if (body !== void 0 && body !== null && method !== "GET" && method !== "HEAD") {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url.toString(), options);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

// src/helpers/index.js
var helpers_exports = {};
__export(helpers_exports, {
  branchApprove: () => branchApprove,
  branchById: () => branchById,
  branchCreate: () => branchCreate,
  branchEdit: () => branchEdit,
  branchIdUserId: () => branchIdUserId,
  branchList: () => branchList,
  changeDans: () => changeDans,
  changePassword: () => changePassword,
  comicCreate: () => comicCreate,
  comicList: () => comicList,
  commentCreate: () => commentCreate,
  commentList: () => commentList,
  deleteAny: () => deleteAny,
  deleteBranch: () => deleteBranch,
  deleteDelivery: () => deleteDelivery,
  deleteItem: () => deleteItem,
  deleteOrder: () => deleteOrder,
  deleteUser: () => deleteUser,
  deleteWare: () => deleteWare,
  deliveryChangeStatusQR: () => deliveryChangeStatusQR,
  deliveryChart: () => deliveryChart,
  deliveryCheck: () => deliveryCheck,
  deliveryCreate: () => deliveryCreate,
  deliveryCreateChat: () => deliveryCreateChat,
  deliveryCustomer: () => deliveryCustomer,
  deliveryEdit: () => deliveryEdit,
  deliveryEditDesc: () => deliveryEditDesc,
  deliveryEditReceivedMoney: () => deliveryEditReceivedMoney,
  deliveryGetChat: () => deliveryGetChat,
  deliveryItems: () => deliveryItems,
  deliveryItemsById: () => deliveryItemsById,
  deliveryList: () => deliveryList,
  deliveryTotal: () => deliveryTotal,
  deliveryUploadExcel: () => deliveryUploadExcel,
  deliveryVerify: () => deliveryVerify,
  deliveryWithArchive: () => deliveryWithArchive,
  driverCreate: () => driverCreate,
  driverList: () => driverList,
  getDeliveryList: () => getDeliveryList,
  globalSearch: () => globalSearch,
  itemCreate: () => itemCreate,
  itemCustomer: () => itemCustomer,
  itemsById: () => itemsById,
  itemsByWareId: () => itemsByWareId,
  khorooCreate: () => khorooCreate,
  khorooList: () => khorooList,
  login: () => login,
  logout: () => logout,
  notificationList: () => notificationList,
  orderArchive: () => orderArchive,
  orderChangeRegion: () => orderChangeRegion,
  orderChangeRegionOrder: () => orderChangeRegionOrder,
  orderChangeStatus: () => orderChangeStatus,
  orderChangeStatus2: () => orderChangeStatus2,
  orderChangeStatusQR: () => orderChangeStatusQR,
  orderCreate: () => orderCreate,
  orderCustomer: () => orderCustomer,
  orderEdit: () => orderEdit,
  orderFinished: () => orderFinished,
  orderGetById: () => orderGetById,
  orderList: () => orderList,
  orderReceivedDriver: () => orderReceivedDriver,
  orderReport: () => orderReport,
  printGetById: () => printGetById,
  printGetByIdDelivery: () => printGetByIdDelivery,
  printReportDriverGeneral: () => printReportDriverGeneral,
  regionCreate: () => regionCreate,
  regionList: () => regionList,
  reportCustomerByUser: () => reportCustomerByUser,
  reportCustomerExcel: () => reportCustomerExcel,
  reportDashboard: () => reportDashboard,
  reportDriverExcel: () => reportDriverExcel,
  reportGeneralCustomerByUser: () => reportGeneralCustomerByUser,
  reportWareByUser: () => reportWareByUser,
  reportWareSelect: () => reportWareSelect,
  resetPassword: () => resetPassword,
  resetPasswordAlt: () => resetPasswordAlt,
  roleCreate: () => roleCreate,
  rolesList: () => rolesList,
  uploadImage: () => uploadImage,
  userApprove: () => userApprove,
  userById: () => userById,
  userCreate: () => userCreate,
  userEdit: () => userEdit,
  userList: () => userList,
  wareByUserId: () => wareByUserId,
  wareCustomer: () => wareCustomer
});

// src/helpers/from-captures.js
async function getDeliveryList(options = {}) {
  const results = [];
  const authHeaders = getAuthHeaders();
  {
    const headers = {
      "Accept": "application/json, text/plain, */*"
    };
    const query = { ...{
      "startLimit": "0",
      "endLimit": "100",
      "order": "",
      "sort": "asc",
      "search": "",
      "value": "",
      "status": "100",
      "id": "2015",
      "action": "0"
    }, ...options.query || {} };
    const res = await httpRequest({ path: "getDeliveryCustomer", method: "GET", query, headers: { ...headers, ...authHeaders, ...options.headers || {} }, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  return results.length === 1 ? results[0] : results;
}
async function login(options = {}) {
  const results = [];
  {
    const headers = {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json"
    };
    const body = { ...{
      "email": "",
      "password": "",
      "device_token": ""
    }, ...options.body || {} };
    const res = await httpRequest({ path: "login", method: "POST", headers: { ...headers, ...options.headers || {} }, body, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  return results.length === 1 ? results[0] : results;
}
async function logout(options = {}) {
  const results = [];
  {
    const headers = {
      "Accept": "application/json, text/plain, */*"
    };
    const res = await httpRequest({ path: "getComment", method: "GET", headers: { ...headers, ...options.headers || {} }, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  {
    const headers = {
      "Accept": "application/json, text/plain, */*"
    };
    const res = await httpRequest({ path: "getComic", method: "GET", headers: { ...headers, ...options.headers || {} }, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  return results.length === 1 ? results[0] : results;
}

// src/helpers/inferred.js
async function orderList(options = {}) {
  const res = await httpRequest({ path: "order", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderArchive(options = {}) {
  const res = await httpRequest({ path: "orderArchive", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderCreate(options = {}) {
  const res = await httpRequest({ path: "createOrder", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderReceivedDriver(options = {}) {
  const res = await httpRequest({ path: "receivedDriver", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderFinished(options = {}) {
  const res = await httpRequest({ path: "finishedOrder", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderReport(options = {}) {
  const res = await httpRequest({ path: "reportOrder", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderChangeStatus2(options = {}) {
  const res = await httpRequest({ path: "changeStatus2", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderChangeStatus(options = {}) {
  const res = await httpRequest({ path: "changeStatus", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderChangeRegion(options = {}) {
  const res = await httpRequest({ path: "changeRegion", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderChangeRegionOrder(options = {}) {
  const res = await httpRequest({ path: "changeRegionOrder", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderEdit(options = {}) {
  const res = await httpRequest({ path: "editOrder", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderGetById(options = {}) {
  const res = await httpRequest({ path: "getById", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderCustomer(options = {}) {
  const res = await httpRequest({ path: "getOrderCustomer", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function orderChangeStatusQR(options = {}) {
  const res = await httpRequest({ path: "changeStatusQR", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryList(options = {}) {
  const res = await httpRequest({ path: "delivery", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryWithArchive(options = {}) {
  const res = await httpRequest({ path: "deliveryWithArchive", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryItemsById(options = {}) {
  const res = await httpRequest({ path: "getDelivery_items_by_id", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryItems(options = {}) {
  const res = await httpRequest({ path: "getDelivery_items", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryCreate(options = {}) {
  const res = await httpRequest({ path: "createDelivery", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryEdit(options = {}) {
  const res = await httpRequest({ path: "editDelivery", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryEditReceivedMoney(options = {}) {
  const res = await httpRequest({ path: "editReceivedMoney", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryEditDesc(options = {}) {
  const res = await httpRequest({ path: "editDesc", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryVerify(options = {}) {
  const res = await httpRequest({ path: "verify", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryCustomer(options = {}) {
  const res = await httpRequest({ path: "getDeliveryCustomer", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryUploadExcel(options = {}) {
  const res = await httpRequest({ path: "uploadExcelFile", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryChangeStatusQR(options = {}) {
  const res = await httpRequest({ path: "changeStatusQR", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryCheck(options = {}) {
  const res = await httpRequest({ path: "checkDelivery", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryGetChat(options = {}) {
  const res = await httpRequest({ path: "getChat", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryCreateChat(options = {}) {
  const res = await httpRequest({ path: "createChat", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteAny(options = {}) {
  const res = await httpRequest({ path: "delete", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteOrder(options = {}) {
  const res = await httpRequest({ path: "deleteOrder", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteItem(options = {}) {
  const res = await httpRequest({ path: "deleteItem", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteDelivery(options = {}) {
  const res = await httpRequest({ path: "deleteDelivery", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteBranch(options = {}) {
  const res = await httpRequest({ path: "deleteBranch", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteUser(options = {}) {
  const res = await httpRequest({ path: "deleteUser", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deleteWare(options = {}) {
  const res = await httpRequest({ path: "deleteWare", method: "DELETE", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function userList(options = {}) {
  const res = await httpRequest({ path: "users", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function userById(options = {}) {
  const res = await httpRequest({ path: "userById", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function driverList(options = {}) {
  const res = await httpRequest({ path: "driver", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function branchList(options = {}) {
  const res = await httpRequest({ path: "getBranch", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function branchById(options = {}) {
  const res = await httpRequest({ path: "branchById", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function branchIdUserId(options = {}) {
  const res = await httpRequest({ path: "branchIdUserId", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function userCreate(options = {}) {
  const res = await httpRequest({ path: "createUser", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function branchCreate(options = {}) {
  const res = await httpRequest({ path: "createBranch", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function driverCreate(options = {}) {
  const res = await httpRequest({ path: "createDriver", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function userEdit(options = {}) {
  const res = await httpRequest({ path: "editUser", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function branchEdit(options = {}) {
  const res = await httpRequest({ path: "editBranch", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function userApprove(options = {}) {
  const res = await httpRequest({ path: "approve", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function branchApprove(options = {}) {
  const res = await httpRequest({ path: "approveBranch", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function changePassword(options = {}) {
  const res = await httpRequest({ path: "changePassword", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function resetPassword(options = {}) {
  const res = await httpRequest({ path: "resetPassword", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function resetPasswordAlt(options = {}) {
  const res = await httpRequest({ path: "reset-password", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function changeDans(options = {}) {
  const res = await httpRequest({ path: "changeDans", method: "PATCH", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function globalSearch(options = {}) {
  const res = await httpRequest({ path: "globalSearch", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function rolesList(options = {}) {
  const res = await httpRequest({ path: "roles", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function roleCreate(options = {}) {
  const res = await httpRequest({ path: "createRole", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function regionList(options = {}) {
  const res = await httpRequest({ path: "region", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function regionCreate(options = {}) {
  const res = await httpRequest({ path: "createRegion", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function khorooList(options = {}) {
  const res = await httpRequest({ path: "khoroo", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function khorooCreate(options = {}) {
  const res = await httpRequest({ path: "createKhoroo", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function notificationList(options = {}) {
  const res = await httpRequest({ path: "getNotification", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function comicList(options = {}) {
  const res = await httpRequest({ path: "getComic", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function commentList(options = {}) {
  const res = await httpRequest({ path: "getComment", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function comicCreate(options = {}) {
  const res = await httpRequest({ path: "createComic", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function commentCreate(options = {}) {
  const res = await httpRequest({ path: "createComment", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function uploadImage(options = {}) {
  const res = await httpRequest({ path: "upload-image", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function printGetById(options = {}) {
  const res = await httpRequest({ path: "getByIdForPrint", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function printGetByIdDelivery(options = {}) {
  const res = await httpRequest({ path: "getByIdForPrintDelivery", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function printReportDriverGeneral(options = {}) {
  const res = await httpRequest({ path: "getPrintReportGeneralDriver", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportDriverExcel(options = {}) {
  const res = await httpRequest({ path: "getReportDriverExcel", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportCustomerExcel(options = {}) {
  const res = await httpRequest({ path: "getReportCustomerExcel", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportWareSelect(options = {}) {
  const res = await httpRequest({ path: "getReportWareSelect", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportDashboard(options = {}) {
  const res = await httpRequest({ path: "getReportDashboard", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryChart(options = {}) {
  const res = await httpRequest({ path: "getDeliveryChart", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function deliveryTotal(options = {}) {
  const res = await httpRequest({ path: "getDeliveryTotal", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function wareCustomer(options = {}) {
  const res = await httpRequest({ path: "getWareCustomer", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function itemCustomer(options = {}) {
  const res = await httpRequest({ path: "getItemCustomer", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function wareByUserId(options = {}) {
  const res = await httpRequest({ path: "wareByUserId", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function itemCreate(options = {}) {
  const res = await httpRequest({ path: "createItem", method: "POST", baseUrl: options.baseUrl, body: options.body, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportWareByUser(options = {}) {
  const res = await httpRequest({ path: "getReportWareByUser", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportGeneralCustomerByUser(options = {}) {
  const res = await httpRequest({ path: "getReportGeneralCustomerByUser", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function reportCustomerByUser(options = {}) {
  const res = await httpRequest({ path: "reportCustomerByUser", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function itemsById(options = {}) {
  const res = await httpRequest({ path: "itemsById", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}
async function itemsByWareId(options = {}) {
  const res = await httpRequest({ path: "itemsByWareId", method: "GET", baseUrl: options.baseUrl, query: options.query, headers: { ...options.headers || {}, ...options.useAuth === false ? {} : getAuthHeaders() } });
  return res;
}

// src/convenience.js
var prefixOf = (name) => {
  const m = name.match(/^([a-z]+)/);
  return m ? m[1] : name;
};
var helpersByDomain = Object.entries(helpers_exports).reduce((acc, [name, fn]) => {
  const prefix = prefixOf(name);
  acc[prefix] = acc[prefix] || {};
  acc[prefix][name] = fn;
  return acc;
}, {});
var configure = ({ baseUrl: baseUrl2, token: token2 } = {}) => {
  if (baseUrl2) setBaseUrl(baseUrl2);
  if (token2) setToken(token2);
  return { baseUrl: baseUrl2 || null, token: getToken() || null };
};
var loginAndSetToken = async (options = {}) => {
  const login2 = login;
  if (!login2) {
    throw new Error("login helper not found");
  }
  const res = await login2(options);
  const token2 = res?.data?.token || res?.data?.data?.token;
  if (token2) setToken(token2);
  return res;
};
export {
  branchApprove,
  branchById,
  branchCreate,
  branchEdit,
  branchIdUserId,
  branchList,
  changeDans,
  changePassword,
  comicCreate,
  comicList,
  commentCreate,
  commentList,
  configure,
  deleteAny,
  deleteBranch,
  deleteDelivery,
  deleteItem,
  deleteOrder,
  deleteUser,
  deleteWare,
  deliveryChangeStatusQR,
  deliveryChart,
  deliveryCheck,
  deliveryCreate,
  deliveryCreateChat,
  deliveryCustomer,
  deliveryEdit,
  deliveryEditDesc,
  deliveryEditReceivedMoney,
  deliveryGetChat,
  deliveryItems,
  deliveryItemsById,
  deliveryList,
  deliveryTotal,
  deliveryUploadExcel,
  deliveryVerify,
  deliveryWithArchive,
  driverCreate,
  driverList,
  getAuthHeaders,
  getBaseUrl,
  getDeliveryList,
  getToken,
  globalSearch,
  helpersByDomain,
  httpRequest,
  itemCreate,
  itemCustomer,
  itemsById,
  itemsByWareId,
  khorooCreate,
  khorooList,
  login,
  loginAndSetToken,
  logout,
  notificationList,
  orderArchive,
  orderChangeRegion,
  orderChangeRegionOrder,
  orderChangeStatus,
  orderChangeStatus2,
  orderChangeStatusQR,
  orderCreate,
  orderCustomer,
  orderEdit,
  orderFinished,
  orderGetById,
  orderList,
  orderReceivedDriver,
  orderReport,
  printGetById,
  printGetByIdDelivery,
  printReportDriverGeneral,
  regionCreate,
  regionList,
  reportCustomerByUser,
  reportCustomerExcel,
  reportDashboard,
  reportDriverExcel,
  reportGeneralCustomerByUser,
  reportWareByUser,
  reportWareSelect,
  resetPassword,
  resetPasswordAlt,
  roleCreate,
  rolesList,
  setBaseUrl,
  setToken,
  uploadImage,
  userApprove,
  userById,
  userCreate,
  userEdit,
  userList,
  wareByUserId,
  wareCustomer
};
