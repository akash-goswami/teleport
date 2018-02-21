const minimatch = require('minimatch');
const path = require('path');
const chalk = require('chalk');
chalk.enabled = true;
chalk.level = 3;

function getBranches(node) {
    const branches = [];
    let parent,
        i;
    while (!node.config.pivot) {
        parent = node.parent;
        i = parent.which(node);
        if (i === parent.children.length - 1) {
            branches.unshift('    ');
        } else {
            branches.unshift('\u2502   ');
        }
        node = parent;
    }
    return branches.join('');
}

function printTree (node, l = 0, isLast, hist = []) {
    console.log(
        chalk.dim.gray(l > 0 ? getBranches(node.parent) : '')
        // Array.from({ length: l - 1}).map((d, i) => chalk.gray(chalk`{dim a } `)).join('')
        + Array.from({ length: l ? 1 : 0}).map((d, i) => chalk.dim.gray(`${isLast ? '\u2514' : '\u251c'}\u2500\u2500\u2500`)).join('') 
        + chalk.bold.gray(node.name), 
        chalk.dim.yellow(`(${node.lid.join('.')})`)
    );
    l++;
    hist.push(node.name);
    node.children.forEach((cn, i, arr) => printTree(cn, l, i === arr.length - 1, hist));
}

class Node {
    constructor (name) {
        this.name = name;
        this.children = [];
        this.config = {};
        this.hid = null; // Hierarchical ID
        this.lid = null; // Level ID
        this.parent = null;
    }

    _getNextHierarchicalID () {
        return `${this.hid}.${this.children.length}`;
    }

    addChildren (node) {
        this.children.push(node);
        node.parent = this;
        node.hid = this._getNextHierarchicalID();
        return this;
    }

    which (node) {
        return this.children.indexOf(node);
    }

    pivot () {
        this.config.pivot = true;
        this.hid = 0;
        this.lid = [0,0];
        return this;
    }

    updateConfig (conf) {
        for (let item in conf) {
            this.config[item] = conf[item];
        }
        return this;
    }
}

const treemaker = pivot => {
    const pivotNode = new Node(pivot.tPath).pivot();
    const map = {
        [pivot]: pivotNode
    };
    const levelIdCount = { };

    return {
        add: pathArr => {
            const q = [];
            const purePathArr = pathArr.map(pa => pa.tPath);
            let node,
                cumPath,
                parent,
                mount,
                i = 0;

            if ((node = purePathArr.join(path.sep)) in map) {
                return node;
            }

            for (; i < purePathArr.length; i++) {
                if ((cumPath = purePathArr.slice(0, i + 1).join(path.sep)) in map) {
                    continue;
                } else {
                    map[cumPath] = ((node = new Node(purePathArr[i])).updateConfig(pathArr[i]));
                    // Calculate level id
                    levelIdCount[i + 1] = levelIdCount[i + 1] === undefined ? 1 : levelIdCount[i + 1] + 1;
                    node.lid = [i + 1, levelIdCount[i + 1]];

                    parent = purePathArr.slice(0, i);
                    if (!parent.length) {
                        mount = pivotNode;
                    } else {
                        mount = map[parent.join(path.sep)];
                    }
                    mount.addChildren(node);
                }
            }
        },
        getTree: () => pivotNode
    }
}

module.exports = {
    make: (up, down, payload) => {
        const searchTerm = payload.target;

        down = down
            .map(unitDown => unitDown.split(path.sep)
            .filter(unitDown => !!unitDown.trim())
            .map(tPath => ({ tPath: tPath })));

        const upArr = up.split(path.sep);
        const maker = treemaker({ tPath: upArr[upArr.length - 1] });

        down.forEach(pathArr => {
            maker.add(pathArr);
        });

        const tree = maker.getTree();
        return tree;
    },
    draw: printTree
}