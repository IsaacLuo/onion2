var path = require('path');
var webpack = require('webpack');
var webpackBase = require('./webpack.config.base');

module.exports = Object.assign({}, webpackBase, {
	    entry  : [
		    './mainYeastfab.js'
	],
	    output : {
		    filename  : './build/onionYF.js',
	},
	    plugins: [
		    new webpack.DefinePlugin({
			    'process.env': {
				    'NODE_ENV': JSON.stringify('dev')
			}
		})
	],
	    module : {
		    loaders: [
			    {
				        test   : /\.js$/,
				        loader: 'babel-loader',
				        exclude: /node_modules/
			    },
			    {
				        test: /\.css$/,
				        loader: 'style-loader!css-loader!postcss-loader'
			    },
			    {
				        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				        loader: 'url-loader?limit=100000'
			    }
		]
	}
});
