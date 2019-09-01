import express from 'express';
import {matchRoutes} from "react-router-config";
import proxy from 'express-http-proxy';
import {render} from './utils'
import {getStore} from "../store";

import Routes from "../routes";
const app = express();



app.use(express.static('public'));

app.use('/api',proxy('http://47.95.113.63', {
    proxyReqPathResolver: function (req) {
        return '/ssr/api' + req.url;
    }
}));

app.get('*', (req, res) => {
    console.log("req. path:", req.path);

    const store = getStore(req);
    // 让matchRoutes 所有组件的loadData执行一次，改变store;
    const matchedRoutes = matchRoutes(Routes, req.path);
    const promises = [];
    matchedRoutes.forEach(item => {
        if (item.route.loadData) {
            let promise = new Promise((resolve, reject) => {
                item.route.loadData(store).then(resolve).catch(resolve);
            });
            promises.push(promise);
        }
    });


    // 一个页面要加载A,B,C,D 四个组件，
    Promise.all(promises).then(() => {
       const context = {css: []};
       const html = render(Routes,store, req, context);

       if(context.action === 'REPLACE') {
           res.redirect(301, context.url)
       }

       if (context.NOT_FOUND) {
           res.status(404);
           res.send(html)
       } else {
           res.send(html);
       }
       res.send(html);
    }).catch(err => {
        console.log("error", err);
    })
});

app.listen(8000, () => {
    console.log("server is start at localhost:8000")
});
