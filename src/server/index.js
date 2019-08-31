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

    const store = getStore();
    // 让matchRoutes 所有组件的loadData执行一次，改变store;
    const matchedRoutes = matchRoutes(Routes, req.path);
    const promises = [];
    matchedRoutes.forEach(item => {
        if (item.route.loadData) {
            promises.push(item.route.loadData(store));
        }
    });

    Promise.all(promises).then(() => {
       res.send(render(Routes,store, req));
    });
});

app.listen(8000, () => {
    console.log("server is start at localhost:8000")
});
