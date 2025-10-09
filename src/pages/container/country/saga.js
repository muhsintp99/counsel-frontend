import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET All Countries
function* getCountrySaga() {
  try {
    const params = {
      api: `${config.configApi}/countries`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const countries = response.data || response || [];
    yield put(actions.getCountrySuccess(countries));
  } catch (error) {
    console.error('GET Country Error:', error);
    yield put(actions.getCountryFail(error.message));
    toast.error(error.message || 'Failed to load countries');
  }
}

// GET Country By ID
function* getCountryByIdSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/countries/${action.payload}`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const country = response.data || response;
    yield put(actions.getCountryByIdSuccess(country));
  } catch (error) {
    yield put(actions.getCountryByIdFail(error.message));
    toast.error(error.message || 'Failed to get country');
  }
}

// ADD Country
function* addCountrySaga(action) {
  try {
    const { name, code, image } = action.payload;
    const formData = new FormData();
    formData.append('name', name || '');
    formData.append('code', code || '');
    if (image) {
      formData.append('image', image);
    }

    const params = {
      api: `${config.configApi}/countries`,
      method: 'POST',
      authorization: 'Bearer',
      body: formData,
    };

    yield call(commonApi, params);
    yield put(actions.getCountry()); // refresh list
    toast.success('Country added successfully');
  } catch (error) {
    console.error('Add Country Error:', error);
    yield put(actions.addCountryFail(error.message));
    toast.error(error.message || 'Failed to add country');
  }
}

// UPDATE Country
function* updateCountrySaga(action) {
  try {
    const { id, data } = action.payload;
    const { name, code, image } = data;

    const formData = new FormData();
    if (name) formData.append('name', name);
    if (code) formData.append('code', code);
    if (image) formData.append('image', image);

    const params = {
      api: `${config.configApi}/countries/${id}`,
      method: 'PUT',
      body: formData,
      authorization: 'Bearer',
    };

    yield call(commonApi, params);
    yield put(actions.getCountry());
    toast.success('Country updated successfully');
  } catch (error) {
    console.error('Update Country Error:', error);
    yield put(actions.updateCountryFail(error.message));
    toast.error(error.message || 'Update failed');
  }
}

// DELETE Country
function* deleteCountrySaga(action) {
  try {
    const id = action.payload;
    const params = {
      api: `${config.configApi}/countries/${id}`,
      method: 'DELETE',
      authorization: 'Bearer',
    };

    yield call(commonApi, params);
    yield put(actions.deleteCountrySuccess(action.payload));
    yield put(actions.getCountry());
    toast.success('Country deleted successfully');
  } catch (error) {
    console.error('Delete Country Error:', error);
    yield put(actions.deleteCountryFail(error.message));
    toast.error(error.message || 'Failed to delete country');
  }
}

// GET Country Count
function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/countries/count`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const count = response.count || response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    yield put(actions.totalCountFail(error.message));
    toast.error(error.message || 'Failed to get count');
  }
}

export default function* CountryActionWatcher() {
  yield takeEvery('country/getCountry', getCountrySaga);
  yield takeEvery('country/totalCount', totalCountSaga);
  yield takeEvery('country/addCountry', addCountrySaga);
  yield takeEvery('country/getCountryById', getCountryByIdSaga);
  yield takeEvery('country/updateCountry', updateCountrySaga);
  yield takeEvery('country/deleteCountry', deleteCountrySaga);
}