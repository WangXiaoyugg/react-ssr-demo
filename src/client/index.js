import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from "react-router-dom";
import Routes from '../routes'
import {Provider} from 'react-redux';
import Home from "../containers/Home"
import {getClientStore} from '../store'
import {renderRoutes} from "react-router-config";

const App = () => {
    return (
        <Provider store={getClientStore()}>
            <BrowserRouter>
                <div>
                    {renderRoutes(Routes)}
                </div>
            </BrowserRouter>
        </Provider>

    )
};

ReactDOM.hydrate(
    <App/>,
    document.getElementById('root')
);
