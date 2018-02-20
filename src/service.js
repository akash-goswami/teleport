const glob = require('glob');
const minimatch = require('minimatch');
const fs = require('fs');
const path = require('path');
const service = {};

service.search = payload => {
    if (payload.upstream) {
        // Search for the target towards the up direction from the current location. This
        // traversing is singular path traversing. Traverse path can be represented as a straingt line.
        return new Promise ((res, rej) => {
            const cwd = payload.cwd;
            const pathArr = cwd.split(path.sep);
            const optns = { matchBase: true };
            const matches = [];
            let i;
            for (i = pathArr.length - 1; i >= 0; i--) {
                if (minimatch(path.join(...pathArr.slice(i)) + path.sep, payload.target, optns)) {
                    break;
                }
            }
            return res([
                Array.from({length: pathArr.length - i - 1}).map(() => '..').join(path.sep) + path.sep
            ]);
        })
    } else {
        // Search for the target towards the down direction from the current location. This
        // traversing forms a tree. All the path along the tree is searched
        return new Promise((res, rej) => {
            glob(payload.target, {
                cwd: payload.cwd,
                ignore: payload.exclude
            }, (err, files) => {
                if (err) {
                    return rej(err)
                }
                return res(files);
            })
        });
    }
}

service.stats = payload => {
    if (payload.upstream) {
        return Promise.all(payload.files.map(file => new Promise((res, rej) => {
            // Upstream will always be dir
            return res({file: file, isDir: true});
        })));
    } else {
        return Promise.all(payload.files.map(file => new Promise((res, rej) => {
            fs.lstat(file, (err, stat) => {
                if (err) {
                    return res(null);
                }
                return res({ file: file, isDir: stat.isDirectory() });
            })
        })));
    }
}

service.execute = async (serviceInst, payload) => {
    return serviceInst(payload);
}

module.exports = service;