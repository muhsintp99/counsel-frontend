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
  // console.log('getDomesticCollegesSaga triggered');
  try {
    const queryParams = action.payload ? new URLSearchParams({ ...action.payload, domestic: true }).toString() : 'domestic=true';
    const apiUrl = `${config.configApi}/college?${queryParams}`;
    const params = {
      api: apiUrl,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    // console.log('GET Domestic Colleges Response:', response);
    const colleges = response.colleges || response.data || response || [];
    const pagination = response.colleges ? {
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      total: response.total
    } : null;
    yield put(actions.getCollegesSuccess({ colleges, pagination }));
  } catch (error) {
    console.error('GET Domestic Colleges Error:', error.response || error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load domestic colleges';
    yield put(actions.getCollegesFail(errorMessage));
    toast.error(errorMessage);
  }
}


function* getAllCollegesSaga() {
  try {
    const params = {
      api: `${config.configApi}/college`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    // console.log('GET College Response:', response);
    const colleges = response.colleges || response || [];
    // console.log('GET All College Response:', colleges);
    yield put(actions.getAllCollegesSuccess(colleges));
  } catch (error) {
    console.error('GET College Error:', error);
    yield put(actions.getAllCollegesFail(error.message));
    toast.error(error.message || 'Failed to load colleges');
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
    console.error('GET Domestic College By ID Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get domestic college';
    yield put(actions.getCollegeByIdFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* addCollegeSaga(action) {
  try {
    // console.log('Add Domestic College Payload:', action.payload);
    const formData = createCollegeFormData(action.payload);
    // console.log('FormData contents:');
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
    yield put(actions.getColleges({ domestic: true }));
    toast.success('Domestic college added successfully');
  } catch (error) {
    console.error('Add Domestic College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add domestic college';
    yield put(actions.addCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* updateCollegeSaga(action) {
  try {
    // console.log('Update Domestic College Payload:', action.payload);
    const { id, ...updateData } = action.payload;
    const formData = createCollegeFormData(updateData);
    // console.log('FormData contents:');
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
    yield put(actions.getColleges({ domestic: true }));
    toast.success('Domestic college updated successfully');
  } catch (error) {
    console.error('Update Domestic College Error:', error);
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
    yield put(actions.getColleges({ domestic: true }));
    toast.success('Domestic college soft deleted successfully');
  } catch (error) {
    console.error('Soft Delete Domestic College Error:', error);
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
    yield put(actions.getColleges({ domestic: true }));
    toast.success('Domestic college deleted successfully');
  } catch (error) {
    console.error('Delete Domestic College Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Delete failed';
    yield put(actions.deleteCollegeFail(errorMessage));
    toast.error(errorMessage);
  }
}

function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/college/count?domestic=true`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const count = response.count || response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    console.error('Get Domestic College Count Error:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Failed to get domestic college count';
    yield put(actions.totalCountFail(errorMessage));
    toast.error(errorMessage);
  }
}

export default function* DomesticCollegeActionWatcher() {
  yield takeEvery('domesticColleges/getColleges', getCollegesSaga);
  yield takeEvery('domesticColleges/getAllColleges', getAllCollegesSaga);
  yield takeEvery('domesticColleges/totalCount', totalCountSaga);
  yield takeEvery('domesticColleges/addCollege', addCollegeSaga);
  yield takeEvery('domesticColleges/getCollegeById', getCollegeByIdSaga);
  yield takeEvery('domesticColleges/updateCollege', updateCollegeSaga);
  yield takeEvery('domesticColleges/softDeleteCollege', softDeleteCollegeSaga);
  yield takeEvery('domesticColleges/deleteCollege', deleteCollegeSaga);
}