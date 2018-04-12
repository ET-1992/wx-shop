import { resolve } from 'path';
import { DefinePlugin, EnvironmentPlugin, optimize, IgnorePlugin } from 'webpack';
import WXAppWebpackPlugin, { Targets } from 'wxapp-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const { NODE_ENV, LINT, NO_LINT } = process.env;
const isDev = NODE_ENV !== 'production';
const shouldLint = (!isDev || (!!LINT && LINT !== 'false')) && !NO_LINT;

const relativeFileLoader = (ext = '[ext]') => [
	{
		loader: 'file-loader',
		options: {
			// publicPath: '',
			publicPath: (file) => {
				return file.replace(/^\.\.\/mediaType\//, '../../templates/mediaType/');
			},
			useRelativePath: true,
			name: `[name].${ext}`,
			emitFile: false,
			context: resolve('src'),
		},
	},
	{
		loader: 'file-loader',
		options: {
			publicPath: '',
			context: resolve('src'),
			name: `[path][name].${ext}`,
		},
	},
];

export default (env = {}) => {
	const target = env.target || 'Wechat';
	const isWechat = env.target !== 'Alipay';
	const isAlipay = !isWechat;
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
			path: resolve('dist', isWechat ? 'wechat' : 'alipay'),
		},
		target: Targets[target],
		module: {
			rules: [
				{
					test: /\.js$/,
					include: /src/,
					use: [
						'babel-loader',
						shouldLint && 'eslint-loader',
					].filter(Boolean),
				},
				{
					test: /\.wxs$/,
					include: /src/,
					use: [
						...relativeFileLoader(),
						'babel-loader',
						shouldLint && 'eslint-loader',
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
					test: /\.(json|png|jpg|gif|wxss)$/,
					include: /src/,
					use: relativeFileLoader(),
				},
				{
					test: /\.wxml$/,
					include: resolve('src'),
					use: [
						...relativeFileLoader(isWechat ? 'wxml' : 'axml'),
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
				__WECHAT__: isWechat,
				__ALIPAY__: isAlipay,
				wx: isWechat ? 'wx' : 'my',
			}),
			new WXAppWebpackPlugin({
				clear: !isDev,
			}),
			new CopyPlugin([
				{ from: 'src/icons/home.png', to: 'icons/home.png' },
				{ from: 'src/icons/cart.png', to: 'icons/cart.png' },
				{ from: 'src/icons/me.png', to: 'icons/me.png' },
				{from: 'src/icons/category.png', to: 'icons/category.png' },
				{from: 'src/icons/categorySelected.png', to: 'icons/categorySelected.png' },
				{ from: 'src/icons/homeSelected.png', to: 'icons/homeSelected.png' },
				{ from: 'src/icons/cartSelected.png', to: 'icons/cartSelected.png' },
				{ from: 'src/icons/meSelected.png', to: 'icons/meSelected.png' },
				{ from: 'src/utils/wxParse', to: 'wxParse' },
			]),
			new optimize.ModuleConcatenationPlugin(),
			shouldLint && new StylelintPlugin(),
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
