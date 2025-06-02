import { all, call } from 'redux-saga/effects';

import LoginActionWatcher from '../container/LoginContainer/saga';
import CountrySagaWatcher from '../pages/container/country/saga';
import GalleryActionWatcher from '../pages/container/gallery/saga';
import BlogActionWatcher from '../pages/container/blog/saga';
import ServiceActionWatcher from '../pages/container/service/saga';

function* rootSaga() {
  yield all([
    call(LoginActionWatcher),call(CountrySagaWatcher),call(GalleryActionWatcher),call(BlogActionWatcher),call(ServiceActionWatcher)
  ]);
}

export default rootSaga;
