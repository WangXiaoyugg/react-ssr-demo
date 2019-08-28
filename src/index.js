import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';

import Home from './containers/Home'
const app = express();
const content = renderToString(<Home />)


app.get('/', (req, res) => {
    res.send(
        `<html>
            <head>
                <title>ssr</title>
            </head>
            <body>
                ${content}
            </body>
        </html>
        `
    )
});

app.listen(8000, () => {
    console.log("server is start at localhost:8000")
});
