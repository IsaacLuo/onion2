/**
 * Created by luoyi on 2/6/2016.
 */
const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 35',
	'Firefox >= 31',
	'Explorer >= 9',
	'iOS >= 7',
	'Opera >= 12',
	'Safari >= 7.1',
];

const config = {
	postcss: function plugins(bundler) {
		return [
			require('postcss-import')({ addDependencyTo: bundler }),
			require('postcss-nested')(),
			require('postcss-cssnext')({ autoprefixer: AUTOPREFIXER_BROWSERS }),
		];
	},
};

module.exports = config;