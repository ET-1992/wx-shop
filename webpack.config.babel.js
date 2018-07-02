import { resolve } from 'path';
import { DefinePlugin, EnvironmentPlugin, optimize, IgnorePlugin } from 'webpack';
import WXAppWebpackPlugin, { Targets } from 'wxapp-webpack-plugin';
// import StylelintPlugin from 'stylelint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const { NODE_ENV } = process.env;
const isDev = NODE_ENV !== 'production';

const relativeFileLoader = (ext = '[ext]') => [
    {
        loader: 'file-loader',
        options: {
            useRelativePath: true,
            name: `[name].${ext}`,
            context: resolve('src')
        }
    }
];

export default (env = {}) => {
    const target = 'Wechat';
    return {
        entry: {
            app: [
                `es6-promise/dist/es6-promise.auto${isDev ? '.min' : ''}.js`,
                './src/utils/bomPolyfill.js',
                './src/app.js',
            ],
        },
        output: {
            filename: '[name].js',
            publicPath: '/',
            path: resolve('dist', 'wechat'),
        },
        target: Targets[target],
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /wxParse|node_modules/,
                    loader: 'eslint-loader',
                },
                {
                    test: /\.js$/,
                    include: /src/,
                    use: [
                        'babel-loader',
                    ].filter(Boolean),
                },
                {
                    test: /\.wxs$/,
                    include: /src/,
                    use: [
                        ...relativeFileLoader(),
                        'babel-loader'
                    ].filter(Boolean),
                },
                {
                    test: /\.scss$/,
                    include: /src/,
                    use: [
                        ...relativeFileLoader('wxss'),
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [
                                    resolve('src', 'styles'),
                                    resolve('src'),
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.(json|png|jpg|gif|wxss|svg)$/,
                    include: /src/,
                    use: relativeFileLoader(),
                },
                {
                    test: /\.wxml$/,
                    include: resolve('src'),
                    use: [
                        ...relativeFileLoader('wxml'),
                        {
                            loader: 'wxml-loader',
                            options: {
                                root: resolve('src'),
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new EnvironmentPlugin({
                NODE_ENV: 'development',
            }),
            new IgnorePlugin(/vertx/),
            new DefinePlugin({
                __DEV__: isDev,
                __WECHAT__: true,
                wx: 'wx',
            }),
            new WXAppWebpackPlugin({
                clear: !isDev,
            }),
            new CopyPlugin([
                { from: 'src/icons', to: 'icons' },
                { from: 'src/images', to: 'images' },
            ]),
            new optimize.ModuleConcatenationPlugin()
        ].filter(Boolean),
        devtool: isDev ? 'source-map' : false,
        resolve: {
            modules: [resolve(__dirname, 'src'), 'node_modules'],
        },
        watchOptions: {
            ignored: /dist|manifest/,
            aggregateTimeout: 300,
        },
    };
};
