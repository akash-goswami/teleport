const service = require('./service');
const config = require('./config');
const utils = require('./utils');

module.exports = async payload => {
    if (!payload.cwd) {
        // If current working dir not found, raise an error
        throw new Error('Script not called correctly. Current working directory not found.');
    }
    
    if (payload.tree) {
        const data = await config.parseHist(config.type.LINTREE_HIST);
        return [data[payload.rawTarget]];
    } else {
        const res = await service.execute(service.search, payload);
        const resWithStat = await service.execute(service.stats, Object.assign({ name: res }, payload));
        return resWithStat
            .filter(fileStat => fileStat.isDir)
            .map(fileStat => utils.normalizePathEnd(fileStat.name));
    }
}