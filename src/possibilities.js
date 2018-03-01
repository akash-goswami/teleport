const service = require('./service');
const config = require('./config');
const utils = require('./utils');

module.exports = async payload => {
    let index,
        res;
    if (!payload.cwd) {
        // If current working dir not found, raise an error
        throw new Error('Script not called correctly. Current working directory not found.');
    }
    
    if (payload.rawTarget.search(/^\.{3,9999}$/) > -1) {
        // show last history
        const data = await config.parseHist(config.type.CMD_HIST);
        res = data['1'];
    } else if (payload.index) {
        index = payload.rawTarget.split('.');
        if (index.length === 1) {
            // comment history
            const data = await config.parseHist(config.type.CMD_HIST);
            res = data[payload.rawTarget]; 
        } else {
            // tree history
            const data = await config.parseHist(config.type.LINTREE_HIST);
            res = [data[payload.rawTarget]];
        }
        
    } else {
        const serviceRes = await service.execute(service.search, payload);
        const resWithStat = await service.execute(service.stats, Object.assign({ name: serviceRes }, payload));
        res = resWithStat
            .filter(fileStat => fileStat.isDir)
            .map(fileStat => fileStat.name)
        
    }

    return res.map(res => utils.normalizePathEnd(res));
}