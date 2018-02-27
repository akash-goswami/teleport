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
    });
});

const writer = {
    CMD_HIST: data => new Promise((res, rej) => {    
        readFile(CONFIG_PATH.CMD_HIST)
            .then(existingData => {
                existingData = parser.CMD_HIST(existingData.split('\n'));
                existingData = existingData
                    .slice(0, 49)
                    .filter(item => item !== data);
                existingData.unshift(data); // @todo take from config. By default 50.
                fs.writeFile(CONFIG_PATH.CMD_HIST, existingData.join('\n'), err => {
                    if (err) {
                        return rej(err);
                    }
                    return res();
                });        
            })
            .catch(e => {
                rej(e);
            });
    }),
    LINTREE_HIST: data => new Promise((res, rej) => {
        fs.writeFile(CONFIG_PATH.LINTREE_HIST, data.map(li => li.join(' ')).join('\n'), err => {
            if (err) {
                return rej(err);
            }
            return res();
        });
    })
};

const parser = {
    CMD_HIST: data => data,
    LINTREE_HIST: data => {
        const obj = {};
        data.forEach(unit => obj[unit[0]] = unit[3]);
        return obj;
    }
};

// If config file is not created,  create it under teleport folder
// Three files are created tp.json, tp.hist, lintree.hist
const CONFIG_PATH = {
    EXEC: path.join(USER_DATA, LIB_NAME, 'tp.json'),
    CMD_HIST: path.join(USER_DATA, LIB_NAME, 'tp.hist'),
    LINTREE_HIST: path.join(USER_DATA, LIB_NAME, 'lintree.hist')
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

const parseHist = async type => {
    try {
        let res = await readFile(CONFIG_PATH[type]);
        res = res.split('\n').filter(line => !!line.trim()).map(line => line.split(' '));
        return parser[type](res);
    } catch (e) {
        throw new Error('Error: Can\'t read config file.');
    }
}

const writeHist = async (type, data) => {
    try {
        await writer[type](data);
    } catch (e) {
        throw new Error('Error: Can\'t write to config file.');
    }
}

module.exports = {
    type: {
        CMD_HIST: 'CMD_HIST',
        LINTREE_HIST: 'LINTREE_HIST'
    },
    CONFIG_PATH,
    parseConfig,
    parseHist,
    writeHist
}