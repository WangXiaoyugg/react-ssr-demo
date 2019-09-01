
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
5. renderRoutes 方法实现对多级路由的支持
6. 登陆功能开发
7. 登陆接口打通
8. 登陆状态切换
```markdown
1. 刚进入页面，处于非登陆状态
2. 用户点击登陆按钮， 进行登陆操作
    2.1 浏览器发送请求给node server
    2.2 转发api 给服务器， 进行登陆
    2.3 api 服务器生成了cookie
    2.4 浏览器存在cookie, 登陆成功
3. 当用户重新刷新页面的时候
    3.1 浏览器请求html, 携带了cookie
    3.2  node server 进行服务器渲染
    3.3 进行服务器渲染， 首先要去api服务器取数据(没有携带cookie)    
```
9. 解决cookie传递问题

## SEO 技巧融入
1. 什么是SEO， 为什么服务端渲染对SEO更加友好？
```markdown
SEO: 搜索引擎优化，排名尽量靠前, SSR渲染的页面搜索引擎可以识别html内容，不能识别CSR的js内容

为什么 写 title 和 keyword, description 不起作用？
```
2. title 和 Description的真正作用
```markdown
现在的搜索引擎支持 全文检索关键词，决定网站的排名显示
title 提升排名的标题的吸引力，转换率
description  提升排名的标题的吸引力,转化率
```
3. 如何做好SEO
```markdown
网站是由 文字，多媒体，链接组成

1. 文字加工原创
2. 链接的内容和当前页面增加相关性，内部链接增加相关性，外部链接增加数量
3. 多媒体，图片保持一定数量，增加网站丰富性
```
4. 总结
```markdown
学习的知识点
1. SSR是什么，CSR是什么，CSR和SSR的优势劣势
2. 服务端写react组件，搭建服务器，客户端的webpack配置， react能进行服务端渲染，
是建立在虚拟dom之上， 优化webpack配置的自动重启和 使用npm-run-all提升开发效率
3. 同构是什么，在浏览器上执行react代码，在服务器上执行react代码，代码优化和总结
4. SSR中渲染的路由，多页面路由跳转，使用link标签串联路由
5. 什么是中间层， 同构项目引入redux, store代码的复用，中大型redux代码结构，
异步数据的服务端渲染和路由重构，favicon和多级路由处理，数据的注水和脱水
6. 使用proxy代理做中间层，客户端和服务端处理请求的差异，axios中instance的使用
redux-thunk的 withExtraArguments的妙用，renderRoutes的多级路由支持，登陆功能开发
解决cookie传递问题，翻译列表页面开发
7. secret统一管理，借助context实现404页面，实现服务器重定向，数据请求丢失的处理
8. 支持css样式修饰，实现css样式的服务端渲染，多组件的css样式渲染，修复loadData的潜在问题，
使用高阶组件优化代码，列表样式的增加
9. 什么是seo, title和 description的作用，如何做好seo， react-helmet的使用
```
5. 项目真的要使用SSR?
```markdown
SSR 性能开销高，需要更多的服务器成本
SSR 出现BUG, 定位困难
SSR 需要更高的开发成本，需要一个前端，后端，nodejs工程师
```
### 解决预渲染解决SEO问题的新思路
1. 普通的react项目不做SSR
2. 浏览器爬虫来了，在预渲染服务器(prerender)上获取渲染好的html
3. 使用prerender依赖包
4. 使用 nginx 区分普通用户和爬虫，通过User-Agent, IP识别
5. 只是希望SEO效果好，不需要首屏加载快，
6. prerender.io 的网站，提供深入学习prerender 的知识

