// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/LoginContainer/slice';
import countryReducer from '../../pages/container/country/slice';
import statesReducer from '../../pages/container/states/slice';
import galleryReducer from '../../pages/container/gallery/slice'
import blogReducer from '../../pages/container/blog/slice';
import serviceReducer from '../../pages/container/service/slice';
import enquiriesReducer from '../../pages/container/enquries/slice';
import followUpReducer from '../../pages/container/follow-up/slice';
import contactReducer from '../../pages/container/contact/slice';
import internationalCollegesReducer from '../../pages/container/colleges/international/slice';
import domesticCollegesReducer from '../../pages/container/colleges/domestic/slice';
import coursesReducer from '../../pages/container/courses/slice';
import intakeReducer from '../../pages/container/intake/slice';
import menu from './menu';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    login: loginReducer,
    country: countryReducer,
    states: statesReducer,
    gallery: galleryReducer,
    services: serviceReducer,
    blog: blogReducer,
    enquiries: enquiriesReducer,
    followUp: followUpReducer,
    contact: contactReducer,
    internationalColleges: internationalCollegesReducer,
    domesticColleges: domesticCollegesReducer,
    courses: coursesReducer,
    intakes: intakeReducer
});

export default reducers;
