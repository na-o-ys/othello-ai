module.exports = {
    entry: "./src/ui",
    output: {
        filename: "./assets/bundle.js"
    },
    resolve: {
        modules: [__dirname + "/src", "node_modules"],
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
}