import { forEach, create } from 'lodash';

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
    const adjacent = adjacentCells(cells, cols, rows);
    const index = indexByPosition(cols, rows);
    const proto = {
        each: callback => forEach(cells, callback),
        neighbors: (x, y) => adjacent(x, y),
        get: (x, y) => {
            if (y === undefined) {
                return cells[x];
            } else {
                return cells[index(
                    Math.floor(x),
                    Math.floor(y)
                )];
            }
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

function adjacentCells(cells, cols, rows) {
    const index = indexByPosition(cols, rows);
    return (x, y) => {
        const table = [
            cells[index(x, y - 1)], // top
            cells[index(x + 1, y)], // right
            cells[index(x, y + 1)], // bottom
            cells[index(x - 1, y)]  // left
        ];
        const result = [];
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