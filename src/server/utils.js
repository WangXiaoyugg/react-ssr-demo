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

    const cssStr = context.css.length ? context.css.join("\n") : "";

    return (
        `<html lang="zh-cn">
                <head>
                    <title>react-ssr-demo</title>
                    <meta name="description" content="this is a easy react-ssr-demo, you can learn react ssr by it"/>
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
