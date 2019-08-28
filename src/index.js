const Home = require("./containers/Home");
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
       <html lang="en">
        <title>Hello world</title>
        <body>
            <h1>Hello World</h1>
        </body>
       </html>
    `)
});

app.listen(8000, () => {
    console.log("server is start at localhost:8000")
});
