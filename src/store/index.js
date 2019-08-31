import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk'
import {reducer as homeReducer} from '../containers/Home/store';
import {reducer as headReducer} from '../components/Header/store'
import {reducer as translationReducer} from '../containers/Translation/store'

import serverAxios from '../server/request'
import clientAxios from '../client/request'


const reducer = combineReducers({
    home: homeReducer,
    head: headReducer,
    translation: translationReducer,
});


export const getStore = (req) => {
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios(req))));
};

export const getClientStore = () => {
    const defaultState = window.context.state;
    return createStore(reducer,defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)))
};

