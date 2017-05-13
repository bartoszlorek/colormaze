import { forEach } from 'lodash';

export {
    createGrid,
    adjacentCells,
    indexByPosition
}

function createGrid(_cols, _rows, callback) {
    const withCallback = typeof callback === 'function';
    const cols = _cols || 10;
    const rows = _rows || cols;
    const cells = [];
    let data, x, y;

    for (y = 0; y < rows; y++) {
        for (x = 0; x < cols; x++) {
            data = {
                x,
                y
            };
            if (withCallback) {
                callback(data);
            }
            cells.push(data);
        }
    }
    const adjacent = adjacentCells(cells, cols, rows);
    const grid = Object.create({
        neighbors: cell => adjacent(cell.x, cell.y),
        each: callback => forEach(cells, callback)
    });

    Object.assign(grid, {
        length: cells.length,
        cells,
        cols,
        rows
    });
    return grid;
}

function adjacentCells(cells, cols, rows) {
    const index = indexByPosition( cols, rows);
    return (x, y) => {
        let result = [],
            table = [
                cells[index(x, y - 1)], // top
                cells[index(x + 1, y)], // right
                cells[index(x, y + 1)], // bottom
                cells[index(x - 1, y)]  // left
            ],
            length = table.length,
            i = 0;

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