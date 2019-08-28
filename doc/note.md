
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

