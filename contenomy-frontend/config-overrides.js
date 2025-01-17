const resolve = require('path').resolve;

function resolvePath(path) {
	var p =  resolve(__dirname, path);
	console.log(p);
	return p;
}

module.exports = function override(config) {
	config.resolve = {
		...config.resolve, //remove if not needed
		alias: {
			...config.alias, //remove if not needed
			"@components": resolvePath("src/components/"),
			"@environment": resolvePath("src/environment/"),
			"@service": resolvePath("src/services/"),
			"@context": resolvePath("src/context/"),
			"@model": resolvePath("src/model"),
			"@pages": resolvePath("src/pages"),
			"@init": resolvePath("src/init"),
			"@hooks": resolvePath("src/hooks"),
		},
	};
	return config;
};
