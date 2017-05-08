const path = require('path')
const settings = require('./settings')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const postcssConfig = {
    plugins: [
        require('autoprefixer')({
            browsers: settings.browsers
        })
    ]
}


const config = {
    entry: {
        app: ['./src/js/app.js', './src/sass/app.scss']
    },
    output: {
        filename: 'dist/javascript/bundle.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, './src'),
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader!postcss-loader!sass-loader!import-glob-loader",
                }),
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    query: {
                        limit: 0
                    }
                }],

            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: postcssConfig
            }
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/images',
                to: 'dist/images'
            },
            {
                from: 'src/fonts',
                to: 'dist/fonts'
            }
        ]),
        new ExtractTextPlugin({
            filename: 'dist/css/main.css',

        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })

    ],
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*" },
        port: 7000,
        open: true,
        publicPath: '/',
        disableHostCheck: true,
        watchContentBase: true,
        contentBase: path.resolve(__dirname, './'),
    },
}

if(process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new UglifyJSPlugin(),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                safe: true,
            },
        })
    )

} else {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config