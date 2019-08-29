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
