import { create } from 'lodash';
import { Path, Point, CompoundPath } from 'paper';
import { angleToPoint, nonAbsDistance, roundToPath, midCell } from './utils/utils';
import action from './action';

const proto = {
    walk: function (dir) {
        let vector = angleToPoint(this.rotation).multiply(dir),
            currX = this.position.x,
            currY = this.position.y,
            nextX = currX + this.speed * vector.x,
            nextY = currY + this.speed * vector.y,
            cell  = this.spec.grid.get(currX, currY),
            cellX = midCell(cell.x),
            cellY = midCell(cell.y),
            distX = nonAbsDistance(nextX, cellX),
            distY = nonAbsDistance(nextY, cellY),
            walls = cell.walls;
        this.position.set(
            cellX + roundToPath(distX, walls[3], walls[1]),
            cellY + roundToPath(distY, walls[0], walls[2]));
        this.render();
    },
    turn: function (dir) {
        this.rotate(this.rotationSpeed * dir);
    },
    rotate: function (angle) {
        this.rotation += angle;
        this.shape.rotate(angle);
    },
    render: function () {
        const { scale, offset } = this.spec;
        this.shape.bringToFront();
        this.shape.position = this.position
            .multiply(scale)
            .add(offset);
    }
}

export default function (spec) {
    const { cols, rows, walls } = spec.grid;
    const initX = Math.round(cols/2) - 1;
    const initY = rows - 1;
    const initCell = spec.grid.get(initX, initY);

    proto.spec = spec;
    const instance = create(proto, {
        position: new Point(midCell(initX, initY)),
        rotation: 0,
        rotationSpeed: 5,
        speed: 1 / 20,
        radius: 1 / 2,
        shape: addShape(spec)
    });
    action(['up', 'w'], () => instance.walk(1));
    action(['down', 's'], () => instance.walk(-1));
    action(['left', 'a'], () => instance.turn(-1));
    action(['right', 'd'], () => instance.turn(1));
    instance.rotate(rotateToGo(initCell));
    return instance;
}

function addShape(spec) {
    const radius = spec.scale * .4;
    const body = new Path.Circle({
        center: [0, 0],
        radius
    });
    const inner = radius - 4;
    const marker = new Path.Arc({
        from: [0, -inner],
        through: [-inner, 0],
        to: [0, inner],
        closed: true
    });
    return new CompoundPath({
        children: [body, marker],
        fillRule: 'evenodd',
        fillColor: '#fff',
    });
}

function rotateToGo(cell) {
    const walls = cell.walls;
    const length = walls.length;
    for (let i = 0; i < length; i++) {
        if (walls[i] === 0) {
            return i * 90 - 90;
        }
    }
    return 0;
}