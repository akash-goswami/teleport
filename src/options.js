const toStr = str => str.toString();
const options = {
    to: [
        ['w', 'cwd', 'Working dir', toStr, ''],
        ['u', 'upstream', 'find file in upstream until the file is found'],
        ['i', 'index', 'find path from tree or history index']
    ],
    tree: [
        ['w', 'cwd', 'Working dir', toStr, '']
    ],
    history: [
        ['w', 'cwd', 'Working dir', toStr, ''],
        ['n', 'limit', 'Decide how many enties from history it should pick up', parseInt, 10]
    ],
    parse: opts => opts.map(op => {
        const resp = [];
        let short = `-${op[0]}`,
            long = `--${op[1]}`,
            desc = op[2],
            fn = op[3],
            def = op[4];

        if (fn) {
            long = `${long} [type]`
        }

        resp.push(`${short} ${long}`);
        resp.push(desc);
        if (fn) {
            resp.push(fn);
            resp.push(def);
        }
        return resp;
    }),
    merge: (defaults, opts, prog) => {
        const resObj = Object.assign({}, defaults);
        opts.forEach(op => {
            resObj[op[1]] = prog[op[1]] === undefined ? false : prog[op[1]];
        });
        return resObj;
    }
};

module.exports = options;
