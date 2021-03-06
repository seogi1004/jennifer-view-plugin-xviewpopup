const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const clientPath = path.resolve(__dirname, 'src/main/client')
const staticPath = path.resolve(__dirname, 'src/main/resources/static')

module.exports = {
    mode: 'development',
    entry: {
        vendors: [ 'jquery' ],
        app: clientPath + '/index.js'
    },
    output: {
        path: staticPath,
        filename: '[name].js',
    },
    optimization: {
        namedModules: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {modules: false}]
                    ]
                }
            }]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                }]
            })
        }, {
            test: /\.scss/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: 'postcss.config.js',
                        },
                    },
                }]
            })
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024 * 1024
                }
            }]
        }]
    },
    devServer: {
        hot: false,
        inline: true,
        contentBase: staticPath,
        historyApiFallback: true,
        compress: true,
        publicPath: '/',
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '**': 'http://localhost:8080'
        }
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ]
}