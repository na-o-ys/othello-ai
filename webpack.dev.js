const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
    output: {
        filename: "./bundle.js"
    },
    devServer: {
        contentBase: __dirname + "/assets",
        hot: true,
        inline: true,
        port: 3000,
        host: "localhost",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})