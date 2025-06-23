import { all, call } from 'redux-saga/effects';

import LoginActionWatcher from '../container/LoginContainer/saga';
import CountrySagaWatcher from '../pages/container/country/saga';
import GalleryActionWatcher from '../pages/container/gallery/saga';
import BlogActionWatcher from '../pages/container/blog/saga';
import serviceWatcherSaga from '../pages/container/service/saga';
import EnquiryWatcher from '../pages/container/enquries/saga';
import followUpWatcher from '../pages/container/follow-up/saga';
import ContactActionWatcher from '../pages/container/contact/saga';
import CourseActionWatcher from '../pages/container/courses/saga';
import IntakeActionWatcher from '../pages/container/intake/saga';
import InternationalCollegeActionWatcher from '../pages/container/colleges/international/saga';
import DomesticCollegeActionWatcher from '../pages/container/colleges/domestic/saga';
import StateActionWatcher from '../pages/container/states/saga';

function* rootSaga() {
  yield all([
    call(LoginActionWatcher),
    call(CountrySagaWatcher),
    call(StateActionWatcher),
    call(GalleryActionWatcher),
    call(BlogActionWatcher),
    call(serviceWatcherSaga),
    call(EnquiryWatcher),
    call(followUpWatcher),
    call(ContactActionWatcher),
    call(InternationalCollegeActionWatcher),
    call(DomesticCollegeActionWatcher),
    call(CourseActionWatcher),
    call(IntakeActionWatcher),
  ]);
}

export default rootSaga;
