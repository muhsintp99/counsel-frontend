// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/LoginContainer/slice';
import countryReducer from '../../pages/container/country/slice';
import menu from './menu';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ 
    menu,
    login: loginReducer,
    country:countryReducer,
 });

export default reducers;
