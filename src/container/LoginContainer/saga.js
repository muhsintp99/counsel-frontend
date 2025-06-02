import { takeEvery, call, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import commonApi from '../api';
import config from '../../config';
import * as actionTypes from './slice';

function* login(action) {
  try {
    const params = {
      api: `${config.configApi}/users/login`,
      method: 'POST',
      successAction: actionTypes.loginSuccess,
      failAction: actionTypes.loginFail,
      authorization: 'Basic',
      body: action.payload
    };

    const res = yield call(commonApi, params);

    console.log('Login response:', res);
    console.log('Login params:', params);

    if (res?.token) {
      yield call([localStorage, 'setItem'], 'adminUser', JSON.stringify(res));
      yield call([localStorage, 'setItem'], 'adminToken', res.token);

      yield put(actionTypes.loginSuccess(res));

      if (action.payload.navigate) {
        yield call(action.payload.navigate, '/');
      }
      yield call(toast.success, 'Login successful', { autoClose: 3000 });

    } else {
      yield put(actionTypes.loginFail(res));
      yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
    }
  } catch (error) {
    console.error('Login failed:', error);

    // Dispatch fail action with error
    yield put(actionTypes.loginFail(error));

    // Show error toast
    yield call(toast.error, 'Login failed. Please try again.', { autoClose: 3000 });
  }
}

export default function* LoginActionWatcher() {
  yield takeEvery(actionTypes.userLogin.type, login);
}
