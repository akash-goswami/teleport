const glob = require('glob');

const service = {};

service.search = payload => {
    if (payload.upstream) {
        // Search for the target towards the up direction from the current location. This
        // traversing is singular path traversing. Traverse path can be represented as a straingt line.
        return new Promise ((res, rej) => {
            
        })
    } else {
        // Search for the target towards the up direction from the current location. This
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

service.execute = async (serviceInst, payload) => {
    return serviceInst(payload);
}

module.exports = service;