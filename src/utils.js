const glob = require('glob');
const utils = {};

utils.normalizeTarget = match => {
    if (!glob.hasMagic(match)) {
        match = `**/${match}/**`
    }
    return match;
}

module.exports = utils;