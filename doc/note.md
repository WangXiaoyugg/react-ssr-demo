
# react 服务端渲染原理解析与实践 笔记

1. 什么是服务端渲染？
```markdown
服务器生成html内容,并发送给浏览器，浏览器渲染html，页面上的内容是服务器生成的
```
2. 什么是客户端渲染？
```markdown
页面内容是有js文件渲染的，js文件又是运行在浏览器客户端内，常见的SPA 单页应用是客户端渲染
```
3. 知乎网站页面内容的是客户端渲染还是服务端渲染？
```markdown
服务端渲染， 禁用网站js后，页面可以正常渲染
```
4. 客户端渲染的优势和弊端
```markdown
客户端渲染流程 CSR
server -> html文件 -> 浏览器下载html文件 -> 浏览器下载js文件 -> 浏览器运行react/vue代码 -> 渲染页面

服务端渲染 SSR
server  -> html文件 -> 浏览器渲染

CSR 的弊端
- 首屏加载慢
- SEO差

CSR 的优势
- 前后端分离，大大提升了开发效率

SSR 的优势
- 首屏快，用户体验好
- SEO效果好
```

## react 中的服务器渲染
1. 在服务端编写react组件
```markdown
CSR 中的react渲染
浏览器发送请求 -> 服务器返回HTML -> 浏览器发送bundle.js请求 -> 服务器返回bundle.js -> 浏览器执行bundle.js中的代码

SSR 中的react渲染
浏览器发送请求 -> 服务器运行react代码生成的页面 -> 服务器返回页面

```
2. 服务器端的webpack配置支持react组件
```markdown
安装的依赖包
npm install webpack webpack-cli -D
npm install babel-loader babel-core -D
npm install babel-preset-react babel-preset-stage-0 babel-preset-env
npm install webpack-node-externals

配置文件
module.exports = { 
    mode: 'development', // 打包模式
    target: 'node', // 打包目标是服务端文件
    externals: [nodeExternals()], // 排除打包服务端的node_modules中引用的文件
    entry: "./src/index.js",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react', 'stage-0', [
                        'env', {
                            targets: {
                                browsers: ['last 2 versions']
                            }
                        }
                    ]]
                }
            }
        ]
    }
};

// 打包命令
webpack --config webpack.server.js

// 修改npm start的启动命令
node ./src/bundle.js
```
3. 实现服务端组件渲染
```markdown
1. 更改src/containers/Home/index.js
import React from 'react'

const Home = () => {
    return (<div>Home</div>)
};

export default Home;

2. 更改 src/index.js
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

```
4. 建立在虚拟dom的服务器渲染
```markdown
csr 渲染
React代码在浏览器执行，消耗是用户浏览器的性能

ssr 渲染
react代码在服务器执行，消耗的是服务端的性能

package.json的依赖包版本变化遇到问题，锁死版本，去stackoverflow找答案

```
5. webpack 的自动打包和服务器自动重启
```markdown
1. 安装依赖包
yarn add nodemon npm-run-all -D
2. 更改package.json 的scripts 字段

"scripts": {
    "dev": "npm-run-all --parallel dev:**",
    "dev:start": "nodemon --watch ./build --exec node ./build/bundle.js",
    "dev:build": "webpack --config webpack.server.js --watch"
 },
```

## 同构的概念和梳理
1. 什么是同构
```markdown
一套代码，在服务端执行一次，再浏览器端在执行一次
```
2. 在浏览器上执行一段js代码
```markdown
1. 更改src/index.js
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(
        `<html>
            <head>
                <title>ssr</title>
            </head>
            <body>
                ${content}
                <script src="/index.js"></script>
            </body>
        </html>
        `
    )
});
2. 根目录新增 public 文件夹以及 public/index.js 文件
```
3. react代码在浏览器上运行
```markdown
1. 新建 src/client/index.js

import React from 'react'
import ReactDOM from 'react-dom'
import Home from "../containers/Home"

ReactDOM.hydrate(<Home/>, document.getElementById('root'));

2. 修改 src/index.js
app.get('/', (req, res) => {
    res.send(
        `<html>
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
});

3. 项目根路径新增 webpack.client.js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: "./src/client/index.js",
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react', 'stage-0', [
                        'env', {
                            targets: {
                                browsers: ['last 2 versions']
                            }
                        }
                    ]]
                }
            }
        ]
    }
};

4. 修改 package.json的 scripts 字段
"scripts": {
    "dev": "npm-run-all --parallel dev:**",
    "dev:start": "nodemon --watch ./build --exec node ./build/bundle.js",
    "dev:build:server": "webpack --config webpack.server.js --watch",
    "dev:build:client": "webpack --config webpack.client.js --watch"
  },
```

4. 代码优化和整理
```markdown
1. 安装依赖包 
npm install webpack-merge - D

2. 新建 webpack.base.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react', 'stage-0', [
                        'env', {
                            targets: {
                                browsers: ['last 2 versions']
                            }
                        }
                    ]]
                }
            }
        ]
    }
};


3. 修改 webpack.client.js

const path = require('path');
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");

const clientConfig = {
    mode: 'development',
    entry: "./src/client/index.js",
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    },
};
module.exports = merge(baseConfig, clientConfig);
4. 修改 webpack.server.js

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base");

const serverConfig = {
    mode: 'development',
    target: 'node', // 打包目标是服务端文件
    externals: [nodeExternals()],
    entry: "./src/server/index.js",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    }
};


module.exports = merge(baseConfig, serverConfig);

5. 移动src/index.js 到 src/server/index.js, 删除 src/index.js

import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';

import Home from '../containers/Home'
const app = express();
const content = renderToString(<Home />);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(
        `<html>
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
});

app.listen(8000, () => {
    console.log("server is start at localhost:8000")
});
```

5. 小结
```markdown
1. react 服务器端运行react代码渲染出HTML
2. 发送HTML给浏览器
3. 浏览器接受HTML,并显示内容
4. 浏览器加载js文件
5. JS中的react代码在浏览器中重新执行
6. js中的react代码接管页面
```

## SSR 中引入路由机制
1. 什么是服务器渲染中的路由
```markdown
1. react 服务器端运行react代码渲染出HTML
2. 发送HTML给浏览器
3. 浏览器接受HTML,并显示内容
4. 浏览器加载js文件
5. JS中的react代码在浏览器中重新执行
6. js中的react代码接管页面操作
7. js代码拿到浏览器中的页面地址
8. js代码根据返回的地址返回不同的路由内容
```
2. 多页面路由跳转
```

```
3. 使用Link标签串联器整个路由流程
```markdown
服务器端渲染只会在第一次加载页面时候的执行，后面的都是客户端路由控制页面跳转
```

## ssr 框架和Redux结合
1. 什么是中间层？
```markdown
浏览器  -> node server(中间层) -> java server
视图层      获取数据拼装数据           底层计算和服务 

添加中间层，系统变得更加复杂，前端还要维护 node server 的稳定性
```
2. 同构项目中引用redux
3. 复用store代码
4. 构建redux项目结构
5. 流程复习和问题分析
```markdown
- 服务器接受到请求，此时store 是空的
- 服务器不会执行componentDidMount, 不会获取列表数据
- 客户端代码运行，store依然是空的
- 客户端执行 componentDidMount, 列表数据被获取
- store的列表数据被更新
- 客户端渲染出 store 的列表数据对应的列表
```
6. 异步数据服务器渲染
7. favicon 和多级路由的问题
8. 服务器渲染获取数据
9. 数据的注水和脱水

## node 作为数据中间层
1. 使用代理，让node中间层获取数据
2. 服务端请求和客户端请求的不同处理
3. axios 的 instance 使用
4. redux-thunk 的 withExtraArgument
