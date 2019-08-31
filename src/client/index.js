import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import Routes from '../routes'
import {Provider} from 'react-redux';
import Home from "../containers/Home"
import getStore from '../store'

const App = () => {
    return (
        <Provider store={getStore()}>
            <BrowserRouter>
                {Routes}
            </BrowserRouter>
        </Provider>

    )
};

ReactDOM.hydrate(
    <App/>,
    document.getElementById('root')
);
