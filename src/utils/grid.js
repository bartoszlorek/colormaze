import { forEach, create } from 'lodash';

const proto = {
    get: function(x, y) {
        const { cells } = this;
        if (y === undefined) {
            return cells[x];
        } else {
            const { cols, rows } = this;
            x = Math.floor(x);
            y = Math.floor(y);
            return cells[indexByPosition(cols, rows)(x, y)];
        }
    },
    neighbors: function (x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        const { cells, cols, rows } = this;
        return adjacent(cells, cols, rows, x, y);
    },
    each: function(callback) {
        forEach(this.cells, callback);
        return this;
    }
}

export default function (_cols, _rows, callback) {
    const withCallback = typeof callback === 'function';
    const cols = _cols || 10;
    const rows = _rows || cols;
    const cells = [];
    let idx = 0,
        data,
        x, y;

    for (y = 0; y < rows; y++) {
        for (x = 0; x < cols; x++) {
            data = {
                x,
                y
            };
            if (withCallback) {
                data = callback(data, idx) || data;
            }
            cells.push(data);
            idx += 1;
        }
    }
    const props = {
        length: cells.length,
        cells,
        cols,
        rows
    }
    return create(proto, props);
}

function adjacent(cells, cols, rows, x, y) {
    const index = indexByPosition(cols, rows);
    const result = [];
    const table = [
        cells[index(x, y - 1)], // top
        cells[index(x + 1, y)], // right
        cells[index(x, y + 1)], // bottom
        cells[index(x - 1, y)]  // left
    ];
    const length = table.length;
    let i = 0;

    while (i < length) {
        if (table[i]) {
            result.push(table[i]);
        }
        i += 1;
    }
    return result;
}

function indexByPosition(cols, rows) {
    return (x, y) => {
        if (x < 0
        ||  y < 0
        ||  x > cols - 1
        ||  y > rows - 1) {
            return -1;
        }
        return x + y * cols;
    }
}