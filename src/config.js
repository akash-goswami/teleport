const path = require('path');
const fs = require('fs');
const LIB_NAME = 'teleport';
const USER_DATA = 
    process.env.APPDATA ||
    (process.platform == 'darwin' ? path.join(process.env.HOME, 'Library/Preferences') : '/var/local');

const readFile = filePath => new Promise((res, rej) => {
	fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
		if (err) {
			return rej(err);
		}
		return res(data);
	})
})

// If config file is not create create it under teleport folder
// Two files are created tp.json and tp.hist
const CONFIG_PATH = {
    EXEC: path.join(USER_DATA, LIB_NAME, 'tp.json'),
    HIST: path.join(USER_DATA, LIB_NAME, 'tp.hist')
};

const parseConfig = async () => {
	try {
		let res = await readFile(CONFIG_PATH.EXEC);
		res = JSON.parse(res);
		return res;
	} catch (e) {
		throw new Error('Error: Can\'t read config file.');
	}
}

module.exports = {
	CONFIG_PATH,
	parseConfig
}