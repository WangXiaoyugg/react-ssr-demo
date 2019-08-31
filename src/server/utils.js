import React from "react";
import {StaticRouter} from 'react-router-dom'
import {renderToString} from "react-dom/server";
import Routes from "../routes";

export const render = (req) => {
    const content = renderToString((
        <StaticRouter location={req.path} context={{}}>
            {Routes}
        </StaticRouter>
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
