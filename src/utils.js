const glob = require('glob');
const path = require('path');
const utils = {};

utils.normalizeTarget = match => {
    if (!glob.hasMagic(match)) {
        match = `**/${match}/**`
    }
    return match;
};

utils.normalizePathEnd = filePath => {
	if (filePath[filePath.length - 1] === path.sep) {
		return filePath;
	}
	return filePath + path.sep;
};

module.exports = utils;