import { all, call } from 'redux-saga/effects';

import LoginActionWatcher from '../container/LoginContainer/saga';
import CountrySagaWatcher from '../pages/container/country/saga';

function* rootSaga() {
  yield all([
    call(LoginActionWatcher),call(CountrySagaWatcher)
  ]);
}

export default rootSaga;
