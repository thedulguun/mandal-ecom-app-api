// AUTO-GENERATED from scripts/inferred-endpoints.json
// Do not edit manually.

import { httpRequest } from '../shared/http.js';
import { getAuthHeaders } from '../shared/config.js';


export async function orderList(options = {}) {
  const res = await httpRequest({ path: 'order', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderArchive(options = {}) {
  const res = await httpRequest({ path: 'orderArchive', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderCreate(options = {}) {
  const res = await httpRequest({ path: 'createOrder', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderReceivedDriver(options = {}) {
  const res = await httpRequest({ path: 'receivedDriver', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderFinished(options = {}) {
  const res = await httpRequest({ path: 'finishedOrder', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderReport(options = {}) {
  const res = await httpRequest({ path: 'reportOrder', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderChangeStatus2(options = {}) {
  const res = await httpRequest({ path: 'changeStatus2', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderChangeStatus(options = {}) {
  const res = await httpRequest({ path: 'changeStatus', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderChangeRegion(options = {}) {
  const res = await httpRequest({ path: 'changeRegion', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderChangeRegionOrder(options = {}) {
  const res = await httpRequest({ path: 'changeRegionOrder', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderEdit(options = {}) {
  const res = await httpRequest({ path: 'editOrder', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderGetById(options = {}) {
  const res = await httpRequest({ path: 'getById', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderCustomer(options = {}) {
  const res = await httpRequest({ path: 'getOrderCustomer', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function orderChangeStatusQR(options = {}) {
  const res = await httpRequest({ path: 'changeStatusQR', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryList(options = {}) {
  const res = await httpRequest({ path: 'delivery', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryWithArchive(options = {}) {
  const res = await httpRequest({ path: 'deliveryWithArchive', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryItemsById(options = {}) {
  const res = await httpRequest({ path: 'getDelivery_items_by_id', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryItems(options = {}) {
  const res = await httpRequest({ path: 'getDelivery_items', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryCreate(options = {}) {
  const res = await httpRequest({ path: 'createDelivery', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryEdit(options = {}) {
  const res = await httpRequest({ path: 'editDelivery', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryEditReceivedMoney(options = {}) {
  const res = await httpRequest({ path: 'editReceivedMoney', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryEditDesc(options = {}) {
  const res = await httpRequest({ path: 'editDesc', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryVerify(options = {}) {
  const res = await httpRequest({ path: 'verify', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryCustomer(options = {}) {
  const res = await httpRequest({ path: 'getDeliveryCustomer', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryUploadExcel(options = {}) {
  const res = await httpRequest({ path: 'uploadExcelFile', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryChangeStatusQR(options = {}) {
  const res = await httpRequest({ path: 'changeStatusQR', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryCheck(options = {}) {
  const res = await httpRequest({ path: 'checkDelivery', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryGetChat(options = {}) {
  const res = await httpRequest({ path: 'getChat', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryCreateChat(options = {}) {
  const res = await httpRequest({ path: 'createChat', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteAny(options = {}) {
  const res = await httpRequest({ path: 'delete', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteOrder(options = {}) {
  const res = await httpRequest({ path: 'deleteOrder', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteItem(options = {}) {
  const res = await httpRequest({ path: 'deleteItem', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteDelivery(options = {}) {
  const res = await httpRequest({ path: 'deleteDelivery', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteBranch(options = {}) {
  const res = await httpRequest({ path: 'deleteBranch', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteUser(options = {}) {
  const res = await httpRequest({ path: 'deleteUser', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deleteWare(options = {}) {
  const res = await httpRequest({ path: 'deleteWare', method: 'DELETE', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function userList(options = {}) {
  const res = await httpRequest({ path: 'users', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function userById(options = {}) {
  const res = await httpRequest({ path: 'userById', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function driverList(options = {}) {
  const res = await httpRequest({ path: 'driver', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function branchList(options = {}) {
  const res = await httpRequest({ path: 'getBranch', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function branchById(options = {}) {
  const res = await httpRequest({ path: 'branchById', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function branchIdUserId(options = {}) {
  const res = await httpRequest({ path: 'branchIdUserId', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function userCreate(options = {}) {
  const res = await httpRequest({ path: 'createUser', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function branchCreate(options = {}) {
  const res = await httpRequest({ path: 'createBranch', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function driverCreate(options = {}) {
  const res = await httpRequest({ path: 'createDriver', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function userEdit(options = {}) {
  const res = await httpRequest({ path: 'editUser', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function branchEdit(options = {}) {
  const res = await httpRequest({ path: 'editBranch', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function userApprove(options = {}) {
  const res = await httpRequest({ path: 'approve', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function branchApprove(options = {}) {
  const res = await httpRequest({ path: 'approveBranch', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function changePassword(options = {}) {
  const res = await httpRequest({ path: 'changePassword', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function resetPassword(options = {}) {
  const res = await httpRequest({ path: 'resetPassword', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function resetPasswordAlt(options = {}) {
  const res = await httpRequest({ path: 'reset-password', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function changeDans(options = {}) {
  const res = await httpRequest({ path: 'changeDans', method: 'PATCH', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function globalSearch(options = {}) {
  const res = await httpRequest({ path: 'globalSearch', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function rolesList(options = {}) {
  const res = await httpRequest({ path: 'roles', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function roleCreate(options = {}) {
  const res = await httpRequest({ path: 'createRole', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function regionList(options = {}) {
  const res = await httpRequest({ path: 'region', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function regionCreate(options = {}) {
  const res = await httpRequest({ path: 'createRegion', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function khorooList(options = {}) {
  const res = await httpRequest({ path: 'khoroo', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function khorooCreate(options = {}) {
  const res = await httpRequest({ path: 'createKhoroo', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function notificationList(options = {}) {
  const res = await httpRequest({ path: 'getNotification', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function comicList(options = {}) {
  const res = await httpRequest({ path: 'getComic', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function commentList(options = {}) {
  const res = await httpRequest({ path: 'getComment', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function comicCreate(options = {}) {
  const res = await httpRequest({ path: 'createComic', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function commentCreate(options = {}) {
  const res = await httpRequest({ path: 'createComment', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function uploadImage(options = {}) {
  const res = await httpRequest({ path: 'upload-image', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function printGetById(options = {}) {
  const res = await httpRequest({ path: 'getByIdForPrint', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function printGetByIdDelivery(options = {}) {
  const res = await httpRequest({ path: 'getByIdForPrintDelivery', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function printReportDriverGeneral(options = {}) {
  const res = await httpRequest({ path: 'getPrintReportGeneralDriver', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportDriverExcel(options = {}) {
  const res = await httpRequest({ path: 'getReportDriverExcel', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportCustomerExcel(options = {}) {
  const res = await httpRequest({ path: 'getReportCustomerExcel', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportWareSelect(options = {}) {
  const res = await httpRequest({ path: 'getReportWareSelect', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportDashboard(options = {}) {
  const res = await httpRequest({ path: 'getReportDashboard', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryChart(options = {}) {
  const res = await httpRequest({ path: 'getDeliveryChart', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function deliveryTotal(options = {}) {
  const res = await httpRequest({ path: 'getDeliveryTotal', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function wareCustomer(options = {}) {
  const res = await httpRequest({ path: 'getWareCustomer', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function itemCustomer(options = {}) {
  const res = await httpRequest({ path: 'getItemCustomer', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function wareByUserId(options = {}) {
  const res = await httpRequest({ path: 'wareByUserId', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function itemCreate(options = {}) {
  const res = await httpRequest({ path: 'createItem', method: 'POST', baseUrl: options.baseUrl, body: options.body, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportWareByUser(options = {}) {
  const res = await httpRequest({ path: 'getReportWareByUser', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportGeneralCustomerByUser(options = {}) {
  const res = await httpRequest({ path: 'getReportGeneralCustomerByUser', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function reportCustomerByUser(options = {}) {
  const res = await httpRequest({ path: 'reportCustomerByUser', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function itemsById(options = {}) {
  const res = await httpRequest({ path: 'itemsById', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}


export async function itemsByWareId(options = {}) {
  const res = await httpRequest({ path: 'itemsByWareId', method: 'GET', baseUrl: options.baseUrl, query: options.query, headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) } });
  return res;
}

