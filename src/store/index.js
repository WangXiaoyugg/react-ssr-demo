import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk'

const reducer = (state = {name: 'garen'}, action) => {
    return state;
};

export default function getStore() {
    return createStore(reducer, applyMiddleware(thunk));
}
