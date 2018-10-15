const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

// const DashboardPlugin = require("webpack-dashboard/plugin");
const isProduction = process.env.NODE_ENV === "production"

const config = {
    devtool: isProduction ? "source-map" : "cheap-module-eval-source-map",
    context: path.resolve("./src/server"),
    entry: {
        app: "./main.ts",
        worker: "./main.worker.ts",
        // vendor: "./vendor.ts"
    },
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.resolve("./dist/server"),
        filename: "[name].bundle.js",
        sourceMapFilename: "[name].bundle.map"
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: 'ts-loader?configFile=src/server/tsconfig.app.json'
            }
        ]
    },
    node: {
        console: true,
        net: 'empty',
        dns: 'empty',
        readline: 'empty',
        tls: 'empty'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        // new webpack.DefinePlugin({
        //   "process.env": {
        //     NODE_ENV: JSON.stringify(nodeEnv)
        //   }
        // })

        // new webpack.optimize.CommonsChunkPlugin({
        //   name: "vendor",
        //   minChunks: Infinity,
        //   filename: "vendor.bundle.js"
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: { warnings: false },
        //   output: { comments: false },
        //   sourceMap: true
        // }),
        // new DashboardPlugin(),
        // new webpack.LoaderOptionsPlugin({
        //   options: {
        //     tslint: {
        //       emitErrors: true,
        //       failOnHint: true
        //     }
        //   }
        // })
    ],
    //   devServer: {
    //     contentBase: path.join(__dirname, "dist/"),
    //     compress: true,
    //     port: 3000,
    //     hot: true
    //   }
}

module.exports = config;