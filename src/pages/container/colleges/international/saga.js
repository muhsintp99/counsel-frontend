import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../../container/api';
import config from '../../../../config';
import * as actions from './slice';

function createCollegeFormData(payload) {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    if (key === 'id') return;
    const value = payload[key];
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'courses' && Array.isArray(value)) {
        value.forEach((course, index) => {
          const courseId = typeof course === 'object' ? course._id : course;
          if (courseId) {
            formData.append(`courses[${index}]`, courseId);
          }
        });
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
}

function* getCollegesSaga(action) {
  try {
    const queryParams = action.payload ? new URLSearchParams({ ...action.payload, domestic: false }).toString() : 'domestic=false';
    const apiUrl = `${config.configApi}/college?${queryParams}`;
    const params = {
      api: apiUrl,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const colleges = response.colleges || response.data || response || [];
    const pagination = response.colleges ? {
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      total: response.total
    } : null;
    yield put(actions.getCollegesSuccess({ colleges, pagination }));
  } catch (error) {
    console.error('GET International Colleges Error:', error.response || error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load international colleges';
    yield put(actions.getCollegesFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* getCollegeByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const college = response.data || response;
    yield put(actions.getCollegeByIdSuccess(college));
  } catch (error) {
    console.error('GET International College By ID Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get international college';
    yield put(actions.getCollegeByIdFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* addCollegeSaga(action) {
  try {
    const formData = createCollegeFormData(action.payload);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const params = {
      api: `${config.configApi}/college`,
      method: 'POST',
      authorization: 'Bearer',
      body: formData,
    };
    const response = yield call(commonApi, params);
    yield put(actions.addCollegeSuccess(response.data || response));
    yield put(actions.getColleges({ domestic: false }));
    toast.success('International college added successfully');
  } catch (error) {
    console.error('Add International College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add international college';
    yield put(actions.addCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* updateCollegeSaga(action) {
  try {
    const { id, ...updateData } = action.payload;
    const formData = createCollegeFormData(updateData);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const params = {
      api: `${config.configApi}/college/${id}`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
    };
    const response = yield call(commonApi, params);
    yield put(actions.updateCollegeSuccess(response.data || response));
    yield put(actions.getColleges({ domestic: false }));
    toast.success('International college updated successfully');
  } catch (error) {
    console.error('Update International College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Update failed';
    yield put(actions.updateCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* softDeleteCollegeSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'PATCH',
      authorization: 'Bearer',
      body: { updatedBy: 'admin' }
    };
    const response = yield call(commonApi, params);
    yield put(actions.softDeleteCollegeSuccess(response.data || response));
    yield put(actions.getColleges({ domestic: false }));
    toast.success('International college soft deleted successfully');
  } catch (error) {
    console.error('Soft Delete International College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Soft delete failed';
    yield put(actions.softDeleteCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* deleteCollegeSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/college/${action.payload}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };
    yield call(commonApi, params);
    yield put(actions.deleteCollegeSuccess(action.payload));
    yield put(actions.getColleges({ domestic: false }));
    toast.success('International college deleted successfully');
  } catch (error) {
    console.error('Delete International College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Delete failed';
    yield put(actions.deleteCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/college/count?domestic=false`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const count = response.count || response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    console.error('Get International College Count Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get international college count';
    yield put(actions.totalCountFail(errorMessage));
    toast.error(errorMessage);
  }
}

export default function* InternationalCollegeActionWatcher() {
  yield takeEvery('internationalColleges/getColleges', getCollegesSaga);
  yield takeEvery('internationalColleges/totalCount', totalCountSaga);
  yield takeEvery('internationalColleges/addCollege', addCollegeSaga);
  yield takeEvery('internationalColleges/getCollegeById', getCollegeByIdSaga);
  yield takeEvery('internationalColleges/updateCollege', updateCollegeSaga);
  yield takeEvery('internationalColleges/softDeleteCollege', softDeleteCollegeSaga);
  yield takeEvery('internationalColleges/deleteCollege', deleteCollegeSaga);
}