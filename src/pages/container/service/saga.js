import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Services
function* getServicesSaga() {
  try {
    console.log('getServicesSaga called');
    const params = {
      api: `${config.configApi}/services/`,
      method: 'GET',
    };
    console.log('API params:', params.api);
    const response = yield call(commonApi, params);
    console.log('API response:', response);
    if (!response) throw new Error('No response received');
    yield put(actions.getServicesSuccess(response));
  } catch (error) {
    console.error('getServicesSaga error:', error);
    yield put(actions.getServicesFail(error.message));
    toast.error(error.message || 'Failed to load services');
  }
}

// GET Service by ID
function* getServiceByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/services/${action.payload}`,
      method: 'GET',
    };
    const response = yield call(commonApi, params);
    const item = response.data || response;
    yield put(actions.getServiceByIdSuccess(item));
  } catch (error) {
    yield put(actions.getServiceByIdFail(error.message));
    toast.error(error.message || 'Failed to load service');
  }
}

// ADD Service
function* addServiceSaga(action) {
  try {
    const { title, shortDesc, fullDesc, link, image, createdBy, updatedBy, points } = action.payload;
    const formData = new FormData();
    formData.append('title', title || '');
    formData.append('shortDesc', shortDesc || '');
    formData.append('fullDesc', fullDesc || '');
    formData.append('link', link || '');
    formData.append('createdBy', createdBy || 'admin');
    formData.append('updatedBy', updatedBy || 'admin');
    if (image) formData.append('image', image);
    if (points) formData.append('points', JSON.stringify(points));

    const params = {
      api: `${config.configApi}/services`,
      method: 'POST',
      body: formData,
    };
    const response = yield call(commonApi, params);
    yield put(actions.addServiceSuccess(response.data));
    toast.success('Service added successfully');
  } catch (error) {
    yield put(actions.addServiceFail(error.message));
    toast.error(error.message || 'Failed to add service');
  }
}

// UPDATE Service
function* updateServiceSaga(action) {
  try {
    const { id, data } = action.payload;
    const { title, shortDesc, fullDesc, link, updatedBy, image, points } = data;
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (shortDesc) formData.append('shortDesc', shortDesc);
    if (fullDesc) formData.append('fullDesc', fullDesc);
    if (link) formData.append('link', link);
    if (updatedBy) formData.append('updatedBy', updatedBy);
    if (image) formData.append('image', image);
    if (points) formData.append('points', JSON.stringify(points));

    const params = {
      api: `${config.configApi}/services/${id}`,
      method: 'PUT',
      body: formData,
    };
    const response = yield call(commonApi, params);
    yield put(actions.updateServiceSuccess(response.data));
    toast.success('Service updated successfully');
  } catch (error) {
    yield put(actions.updateServiceFail(error.message));
    toast.error(error.message || 'Failed to update service');
  }
}

// SOFT DELETE Service
function* deleteServiceSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/services/${action.payload}`,
      method: 'PATCH',
    };
    const response = yield call(commonApi, params);
    yield put(actions.deleteServiceSuccess(action.payload));
    toast.success('Service soft deleted successfully');
  } catch (error) {
    yield put(actions.deleteServiceFail(error.message));
    toast.error(error.message || 'Failed to soft delete service');
  }
}

// HARD DELETE Service
function* hardDeleteServiceSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/services/${action.payload}`,
      method: 'DELETE',
    };
    const response = yield call(commonApi, params);
    yield put(actions.hardDeleteServiceSuccess(action.payload));
    toast.success('Service permanently deleted successfully');
  } catch (error) {
    yield put(actions.hardDeleteServiceFail(error.message));
    toast.error(error.message || 'Failed to permanently delete service');
  }
}

// GET Total Service Count
function* totalServiceCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/services/`,
      method: 'GET',
    };
    const response = yield call(commonApi, params);
    const count = response.length || 0;
    yield put(actions.totalServiceCountSuccess({ count }));
  } catch (error) {
    yield put(actions.totalServiceCountFail(error.message));
    toast.error(error.message || 'Failed to get service count');
  }
}

// Watcher
export default function* ServiceActionWatcher() {
  yield takeEvery('service/getServices', getServicesSaga);
  yield takeEvery('service/getServiceById', getServiceByIdSaga);
  yield takeEvery('service/addService', addServiceSaga);
  yield takeEvery('service/updateService', updateServiceSaga);
  yield takeEvery('service/deleteService', deleteServiceSaga);
  yield takeEvery('service/hardDeleteService', hardDeleteServiceSaga);
  yield takeEvery('service/totalServiceCount', totalServiceCountSaga);
}