import { forEach } from 'lodash';

export default renderer;

function renderer(p, maze) {
    const { cols, rows } = maze;
    const scene = [];

    const proto = {
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
            if (this.cell.solved) {
                let { left, top } = this.bounds;
                p.noStroke()
                    .fill('#222')
                    .rect(left, top, size, size);
            }
            p.stroke('#fff');
            this.cell.walls.forEach((wall, i) => {
                if (wall) {
                    p.line.apply(p, this.points[i]);
                }
            });
        }
    }

    maze.each(cell => {
        let obj = Object.create(proto);
        Object.assign(obj, { cell });
        scene.push(obj);
    });

    let size;
    return (width, height) => {
        let x = (width || 100) / cols,
            y = (height || 100) / rows;

        size = Math.min(x, y);
        scene.forEach(point => point.render());
    }
}