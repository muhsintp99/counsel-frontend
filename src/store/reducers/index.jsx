// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/LoginContainer/slice';
import countryReducer from '../../pages/container/country/slice';
import galleryReducer from '../../pages/container/gallery/slice'
import blogReducer from '../../pages/container/blog/slice';
import serviceReducer from '../../pages/container/service/slice';
import menu from './menu';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    login: loginReducer,
    country: countryReducer,
    gallery: galleryReducer,
    services: serviceReducer,
    blog: blogReducer,
});

export default reducers;
