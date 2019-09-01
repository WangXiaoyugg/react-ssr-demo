import React from "react";
import {StaticRouter, Route} from 'react-router-dom'
import {renderToString} from "react-dom/server";
import {renderRoutes} from 'react-router-config'
import {Provider} from 'react-redux';

export const render = (routes, store, req, context) => {

    const content = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.path} context={context}>
                <div>
                    {renderRoutes(routes)}
                </div>
            </StaticRouter>
        </Provider>
    ));

    const cssStr = context.css ? context.css : "";

    return (
        `<html lang="zh-cn">
                <head>
                    <title>ssr</title>
                    <style>${cssStr}</style>
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
