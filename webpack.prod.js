const webpack = require("webpack")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
    plugins: [
        // TODO: minify
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
})