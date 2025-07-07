import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../../../container/api';
import config from '../../../config';
import * as actions from './slice';

// GET all states
function* getStateSaga() {
  try {
    const params = {
      api: `${config.configApi}/states`,
      method: 'GET',
      authorization: false,
    };

    const response = yield call(commonApi, params);

    // ✅ response.data is already the array
    const states = response.data || [];

    // console.log("✅ Extracted states:", states); // should now log 3 states

    yield put(actions.getStateSuccess(states));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to load states';
    yield put(actions.getStateFail(message));
    toast.error(message);
  }
}


// ADD a state
function* addStateSaga(action) {
  try {
    const params = {
      api: `${config.configApi}/states`,
      method: 'POST',
      body: action.payload,
      authorization: false,
    };
    const response = yield call(commonApi, params);
    yield put(actions.addStateSuccess());
    yield put(actions.getState());
    toast.success('State added successfully');
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to add state';
    yield put(actions.addStateFail(message));
    toast.error(message);
  }
}

// UPDATE a state
function* updateStateSaga(action) {
  try {
    const { id, data } = action.payload;
    const params = {
      api: `${config.configApi}/states/${id}`,
      method: 'PUT',
      body: data,
      authorization: false,
    };
    const response = yield call(commonApi, params);
    yield put(actions.updateStateSuccess());
    yield put(actions.getState());
    toast.success('State updated successfully');
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update state';
    yield put(actions.updateStateFail(message));
    toast.error(message);
  }
}

// DELETE (soft) a state
function* deleteStateSaga(action) {
  try {
    const { id } = action.payload;
    const params = {
      api: `${config.configApi}/states/${id}`,
      method: 'DELETE',
      authorization: false,
    };
    yield call(commonApi, params);
    yield put(actions.deleteStateSuccess());
    yield put(actions.getState());
    toast.success('State deleted successfully');
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to delete state';
    yield put(actions.deleteStateFail(message));
    toast.error(message);
  }
}

// GET state count
function* totalCountSaga() {
  try {
    const params = {
      api: `${config.configApi}/states/count`,
      method: 'GET',
      authorization: false,
    };
    const response = yield call(commonApi, params);
    const count = response.data?.count || 0;
    yield put(actions.totalCountSuccess({ count }));
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to get count';
    yield put(actions.totalCountFail(message));
    toast.error(message);
  }
}

export default function* StateActionWatcher() {
  yield takeEvery('states/getState', getStateSaga);
  yield takeEvery('states/totalCount', totalCountSaga);
  yield takeEvery('states/addState', addStateSaga);
  yield takeEvery('states/updateState', updateStateSaga);
  yield takeEvery('states/deleteState', deleteStateSaga);
}
