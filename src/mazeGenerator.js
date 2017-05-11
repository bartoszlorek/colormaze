export default generate;

let cells,
    stack,
    cols,
    rows;

function generate(_cols, _rows) {
    cells = [];
    stack = [];
    cols = _cols || 10;
    rows = _rows || _cols;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            cells.push(new Cell(x, y));
        }
    }
    let current = cells[0],
        unsolved = cells.length - 1,
        next;

    while (unsolved) {
        current.solved = true;
        next = current.next();

        if (next) {
            next.solved = true;
            stack.push(current);
            removeWall(current, next);
            current = next;
            unsolved -= 1;

        } else if (stack.length > 0) {
            current = stack.pop();
        }
    }
    return {
        cells,
        cols,
        rows
    }
}

function removeWall(a, b) {
    let x = a.x - b.x,
        y = a.y - b.y;
    if (x === 1) {
        a.walls[3] = 0;
        b.walls[1] = 0;
    } else if (x === -1) {
        a.walls[1] = 0;
        b.walls[3] = 0;
    }
    if (y === 1) {
        a.walls[0] = 0;
        b.walls[2] = 0;
    } else if (y === -1) {
        a.walls[2] = 0;
        b.walls[0] = 0;
    }
}

function index(x, y) {
    if (x < 0
        || y < 0
        || x > cols - 1
        || y > rows - 1) {
        return -1;
    }
    return x + y * cols;
}

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.solved = false;
    this.walls = [1, 1, 1, 1];
}

Cell.prototype.next = function () {
    let x = this.x,
        y = this.y,
        result = [],
        table = [
            cells[index(x, y - 1)], // top
            cells[index(x + 1, y)], // right
            cells[index(x, y + 1)], // bottom
            cells[index(x - 1, y)]  // left
        ],
        length = table.length;

    for (let i = 0; i < length; i++) {
        if (table[i] && !table[i].solved) {
            result.push(table[i]);
        }
    }
    if (result.length > 0) {
        let randomIndex = Math.floor(
            Math.random() * result.length);
        return result[randomIndex];
    }
}