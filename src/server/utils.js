import React from "react";
import {StaticRouter} from 'react-router-dom'
import {renderToString} from "react-dom/server";
import Routes from "../routes";
import {createStore, applyMiddleware} from "redux";
import {Provider} from 'react-redux';
import thunk from 'redux-thunk'


export const render = (req) => {
    const reducer = (state = {name: 'garen wang'}, action)  => {
        return state;
    };
    const store = createStore(reducer, applyMiddleware(thunk));
    const content = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.path} context={{}}>
                {Routes}
            </StaticRouter>
        </Provider>
    ));

    return (
        `<html lang="zh-cn">
            <head>
                <title>ssr</title>
            </head>
            <body>
            <div id="root">${content}</div>
            <script src="/index.js"></script>
            </body>
        </html>
        `
    )
};