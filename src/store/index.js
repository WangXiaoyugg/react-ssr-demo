import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk'
import {reducer as homeReducer} from '../containers/Home/store';
import serverAxios from '../server/request'
import clientAxios from '../client/request'


const reducer = combineReducers({
    home: homeReducer,
});


export const getStore = () => {
    // 改变服务端的 store 用 serverAxios
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));
};

export const getClientStore = () => {
    // 改变客户端的 store 用 clientAxios
    const defaultState = window.context.state;
    return createStore(reducer,defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)))
};

