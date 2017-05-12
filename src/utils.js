import { sample, forEach } from 'lodash';

export {
    createGrid,
    adjacentCells,
    indexByPosition
}

function createGrid(_cols, _rows, callback) {
    const cols = _cols || 10;
    const rows = _rows || cols;
    
    let isCallback = typeof callback === 'function',
        cells = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let data = { x, y };
            if (isCallback) {
                callback(data);
            }
            cells.push(data);
        }
    }

    const grid = {
        length: cells.length,
        cells,
        cols,
        rows
    };
    
    const adjacent = adjacentCells(cells, cols, rows);
    defineMethod(grid, 'neighbors', cell => adjacent(cell.x, cell.y))
    defineMethod(grid, 'each', callback => forEach(cells, callback))
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

function defineMethod(object, name, method) {
    Object.defineProperty(object, name, {
        enumerable: false,
        writable: false,
        value: method
    });
}