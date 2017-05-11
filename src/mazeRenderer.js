export default render;

let engine,
    size;

function render(_engine, _maze) {
    engine = _engine || null;

    if (engine === null) {
        throw 'renderer needs engine';
    }
    let { cells, cols, rows } = _maze,
        length = cells.length,
        scene = [];

    for (let i = 0; i < length; i++) {
        scene.push(new RenderableCell(cells[i]));
    }
    return (width, height) => {
        let x = (width || 100) / cols,
            y = (height || 100) / rows;

        size = Math.min(x, y);
        for (let i = 0; i < length; i++) {
            scene[i].render();
        }
    }
}

function RenderableCell(cell) {
    this.cell = cell;
}

RenderableCell.prototype = {
    get bounds() {
        let left = this.cell.x * size,
            top = this.cell.y * size;
        return {
            top,
            right: left + size,
            bottom: top + size,
            left
        }
    },

    get points() {
        let { top, right, bottom, left } = this.bounds;
        return [
            [left, top, right, top],
            [right, top, right, bottom],
            [right, bottom, left, bottom],
            [left, bottom, left, top]
        ]
    },

    render: function () {
        let cell = this.cell,
            length = cell.walls.length,
            points;

        if (cell.visited) {
            let { left, top } = this.bounds;
            engine.noStroke()
                .fill('#222')
                .rect(left, top, size, size);
        }
        engine.stroke('#fff');
        for (var i = 0; i < length; i++) {
            if (cell.walls[i]) {
                points = this.points[i];
                engine.line.apply(engine, points);
            }
        }
    }
}