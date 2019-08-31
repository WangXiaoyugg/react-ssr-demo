import React from "react";
import {StaticRouter, Route, matchPath} from 'react-router-dom'
import {matchRoutes} from 'react-router-config'
import {renderToString} from "react-dom/server";
import {Provider} from 'react-redux';
import Routes from "../routes";
import getStore from '../store'


export const render = (req) => {
    const store = getStore();
    // 获取异步数据，填充到store
    // store填充数据是什么，结合用户请求的路由
    // 访问login 返回login 的数据， 访问home 返回home 数据
    // 根据路由的路径往store加数据
    const matchedRoutes =matchRoutes(Routes, req.path);


    // 让matchRoutes 所有组件的loadData执行一次，改变store;

    const content = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.path} context={{}}>
               <div>
                {Routes.map(route => {
                    return <Route {...route} key={route.key}/>
                })}
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
            <script src="/index.js"></script>
            </body>
        </html>
        `
    )
};
