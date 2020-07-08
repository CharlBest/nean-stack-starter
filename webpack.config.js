// const webpack = require('webpack');
const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// const DashboardPlugin = require('webpack-dashboard/plugin');
const isProduction = process.env.NODE_ENV === 'production'

const config = {
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    context: path.resolve('./src/server'),
    entry: {
        api: './main.api.ts',
        worker: './main.worker.ts',
        // vendor: './vendor.ts'
    },
    target: 'node',
    // Uncomment if you want to exclude node_modules and commonjs libs
    // externals: [nodeExternals()],
    output: {
        path: path.resolve('./dist/server'),
        filename: '[name]/[name].bundle.js',
        sourceMapFilename: '[name]/[name].bundle.map'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.app.json'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    // This is to minify the index.html
                    loader: 'html-loader'
                }],
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
        extensions: ['.ts', '.js'],
        // Needed for the @shared path in tsconfig to resolve
        plugins: [new TsConfigPathsPlugin(
            { configFile: './src/server/tsconfig.app.json' }
        )]
    },
    plugins: [
        // new webpack.DefinePlugin({
        //   'process.env': {
        //     NODE_ENV: JSON.stringify(nodeEnv)
        //   }
        // })

        // new webpack.optimize.CommonsChunkPlugin({
        //   name: 'vendor',
        //   minChunks: Infinity,
        //   filename: 'vendor.bundle.js'
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
    //     contentBase: path.join(__dirname, 'dist/'),
    //     compress: true,
    //     port: 3000,
    //     hot: true
    //   }
}

module.exports = config;