import { sample } from 'lodash';
import createGrid from '../utils/grid';

export default function (cols, rows) {
    const stack = [];
    const grid = createGrid(cols, rows, (data) => {
        data.solved = false;
        data.walls = [1, 1, 1, 1];
    });
    let current = grid.cells[0],
        unsolved = grid.length - 1,
        next;

    const getNext = () => {
        let result = grid
            .neighbors(current)
            .filter(cell => !cell.solved);
        if (result.length > 0) {
            return sample(result);
        }
    }

    while (unsolved) {
        current.solved = true;
        next = getNext();

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
    return grid;
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