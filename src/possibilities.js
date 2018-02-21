const service = require('./service');

module.exports = async payload => {
	if (!payload.cwd) {
	    // If current working dir not found, raise an error
	    throw new Error('Script not called correctly. Current working directory not found.');
	}
	
	const res = await service.execute(service.search, payload);
	const resWithStat = await service.execute(service.stats, Object.assign({ name: res }, payload));
	return resWithStat
	    .filter(fileStat => fileStat.isDir)
	    .map(fileStat => fileStat.name);
}