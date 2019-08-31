import React from "react";
import {StaticRouter, Route} from 'react-router-dom'
import {renderToString} from "react-dom/server";
import {renderRoutes} from 'react-router-config'
import {Provider} from 'react-redux';

export const render = (routes, store, req) => {

        const content = renderToString((
            <Provider store={store}>
                <StaticRouter location={req.path} context={{}}>
                    <div>
                        {renderRoutes(routes)}
                    </div>
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
                <script>
                    window.context = {
                        state: ${JSON.stringify(store.getState())}
                    }
                </script>
                <script src="/index.js"></script>
                </body>
            </html>
            `
        )
};
