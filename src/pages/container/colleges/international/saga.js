import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../../container/api';
import config from '../../../../config';
import * as actions from './slice';

function createFormData(payload) {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    if (key === 'id') return;
    const value = payload[key];
    if (Array.isArray(value)) {
      value.forEach((item, i) => formData.append(`${key}[${i}]`, item._id || item));
    } else if (key === 'image' && value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });
  return formData;
}

function* getCollegesSaga(action) {
  try {
    const query = new URLSearchParams({ ...(action.payload || {}), isDomestic: false }).toString();
    const apiUrl = `${config.configApi}/college?${query}`;
    const res = yield call(commonApi, { api: apiUrl, method: 'GET' });

    yield put(actions.getCollegesSuccess({
      colleges: res.colleges || res.data || [],
      pagination: res.pagination || {
        totalPages: res.totalPages,
        currentPage: res.currentPage,
        total: res.total,
      },
    }));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Failed to load international colleges';
    yield put(actions.getCollegesFail(msg));
    toast.error(msg);
  }
}

function* getCollegeByIdSaga(action) {
  try {
    const res = yield call(commonApi, {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'GET',
    });
    yield put(actions.getCollegeByIdSuccess(res.data || res));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Failed to get college';
    yield put(actions.getCollegeByIdFail(msg));
    toast.error(msg);
  }
}

function* addCollegeSaga(action) {
  try {
    const formData = createFormData({ ...action.payload, isDomestic: false });
    const res = yield call(commonApi, {
      api: `${config.configApi}/college`,
      method: 'POST',
      body: formData,
      authorization: 'Bearer',
    });
    yield put(actions.addCollegeSuccess(res.data || res));
    yield put(actions.getColleges({ isDomestic: false }));
    toast.success('International college added successfully');
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Add failed';
    yield put(actions.addCollegeFail(msg));
    toast.error(msg);
  }
}

function* updateCollegeSaga(action) {
  try {
    const { id, ...payload } = action.payload;
    const formData = createFormData(payload);
    const res = yield call(commonApi, {
      api: `${config.configApi}/college/${id}`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
    });
    yield put(actions.updateCollegeSuccess(res.data || res));
    yield put(actions.getColleges({ isDomestic: false }));
    toast.success('International college updated successfully');
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Update failed';
    yield put(actions.updateCollegeFail(msg));
    toast.error(msg);
  }
}

function* deleteCollegeSaga(action) {
  try {
    yield call(commonApi, {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    });
    yield put(actions.deleteCollegeSuccess(action.payload));
    yield put(actions.getColleges({ isDomestic: false }));
    toast.success('International college deleted successfully');
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Delete failed';
    yield put(actions.deleteCollegeFail(msg));
    toast.error(msg);
  }
}

function* totalCountSaga() {
  try {
    const res = yield call(commonApi, {
      api: `${config.configApi}/college/count`,
      method: 'GET',
    });
    yield put(actions.totalCountSuccess({ count: res.count || res.data?.count || 0 }));
  } catch (err) {
    const msg = err.response?.data?.error || err.message || 'Count failed';
    yield put(actions.totalCountFail(msg));
    toast.error(msg);
  }
}

export default function* InternationalCollegeWatcher() {
  yield takeEvery('internationalColleges/getColleges', getCollegesSaga);
  yield takeEvery('internationalColleges/getCollegeById', getCollegeByIdSaga);
  yield takeEvery('internationalColleges/addCollege', addCollegeSaga);
  yield takeEvery('internationalColleges/updateCollege', updateCollegeSaga);
  yield takeEvery('internationalColleges/deleteCollege', deleteCollegeSaga);
  yield takeEvery('internationalColleges/totalCount', totalCountSaga);
}
