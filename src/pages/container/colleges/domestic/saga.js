import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../../container/api';
import config from '../../../../config';
import * as actions from './slice';

function createCollegeFormData(payload) {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    const value = payload[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item, i) => formData.append(`${key}[${i}]`, item));
      } else if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
}

// 📦 Get All Domestic Colleges
export function* getAllCollegesSaga() {
  try {
    const params = {
      api: `${config.configApi}/college?isDomestic=true`,
      method: 'GET',
    };
    const res = yield call(commonApi, params);
    const colleges = res.colleges || res.data || [];
    const pagination = res.pagination || {
      totalPages: res.totalPages,
      currentPage: res.currentPage,
      total: res.total,
    };
    yield put(actions.getAllCollegesSuccess({ colleges, pagination }));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Failed to load domestic colleges';
    yield put(actions.getAllCollegesFail(msg));
    toast.error(msg);
  }
}

// 🔍 Get Domestic Colleges (Filtered or Paginated)
function* getCollegesSaga(action) {
  try {
    const query = new URLSearchParams({ ...action.payload, isDomestic: true }).toString();
    const params = { api: `${config.configApi}/college?${query}`, method: 'GET' };
    const res = yield call(commonApi, params);
    const colleges = res.colleges || res.data || [];
    const pagination = res.pagination || {
      totalPages: res.totalPages,
      currentPage: res.currentPage,
      total: res.total,
    };
    yield put(actions.getCollegesSuccess({ colleges, pagination }));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Failed to load domestic colleges';
    yield put(actions.getCollegesFail(msg));
    toast.error(msg);
  }
}

// 🏫 Get One College
function* getCollegeByIdSaga(action) {
  try {
    const params = { api: `${config.configApi}/college/${action.payload}`, method: 'GET' };
    const res = yield call(commonApi, params);
    yield put(actions.getCollegeByIdSuccess(res.data || res));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Failed to get domestic college';
    yield put(actions.getCollegeByIdFail(msg));
    toast.error(msg);
  }
}

// ➕ Add College
function* addCollegeSaga(action) {
  try {
    const formData = createCollegeFormData({ ...action.payload, isDomestic: true });
    const params = { api: `${config.configApi}/college`, method: 'POST', body: formData, authorization: 'Bearer' };
    const res = yield call(commonApi, params);
    yield put(actions.addCollegeSuccess(res.data || res));
    yield put(actions.getColleges({ isDomestic: true }));
    toast.success('Domestic college added successfully');
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Add failed';
    yield put(actions.addCollegeFail(msg));
    toast.error(msg);
  }
}

// ✏️ Update College
function* updateCollegeSaga(action) {
  try {
    const { id, ...data } = action.payload;
    const formData = createCollegeFormData({ ...data, isDomestic: true });
    const params = { api: `${config.configApi}/college/${id}`, method: 'PUT', body: formData, authorization: 'Bearer' };
    const res = yield call(commonApi, params);
    yield put(actions.updateCollegeSuccess(res.data || res));
    yield put(actions.getColleges({ isDomestic: true }));
    toast.success('Domestic college updated successfully');
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Update failed';
    yield put(actions.updateCollegeFail(msg));
    toast.error(msg);
  }
}

// ❌ Delete College
function* deleteCollegeSaga(action) {
  try {
    const params = { api: `${config.configApi}/college/${action.payload}`, method: 'DELETE', authorization: 'Bearer' };
    yield call(commonApi, params);
    yield put(actions.deleteCollegeSuccess(action.payload));
    yield put(actions.getColleges({ isDomestic: true }));
    toast.success('Domestic college deleted successfully');
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Delete failed';
    yield put(actions.deleteCollegeFail(msg));
    toast.error(msg);
  }
}

// 🔢 Count Domestic Colleges
function* totalCountSaga() {
  try {
    const params = { api: `${config.configApi}/college/count?isDomestic=true`, method: 'GET' };
    const res = yield call(commonApi, params);
    yield put(actions.totalCountSuccess({ count: res.count || res.data?.count || 0 }));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Count failed';
    yield put(actions.totalCountFail(msg));
  }
}

export default function* DomesticCollegeSaga() {
  yield takeEvery('domesticColleges/getAllColleges', getAllCollegesSaga);
  yield takeEvery('domesticColleges/getColleges', getCollegesSaga);
  yield takeEvery('domesticColleges/getCollegeById', getCollegeByIdSaga);
  yield takeEvery('domesticColleges/addCollege', addCollegeSaga);
  yield takeEvery('domesticColleges/updateCollege', updateCollegeSaga);
  yield takeEvery('domesticColleges/deleteCollege', deleteCollegeSaga);
  yield takeEvery('domesticColleges/totalCount', totalCountSaga);
}
