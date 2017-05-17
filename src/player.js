import { create } from 'lodash';
import { Path, Point, Group } from 'paper';
import { angleToPoint } from './utils/units';
import action from './action';

const proto = {
    walk: function (dir) {
        let vector = angleToPoint(this.rotation).multiply(dir),
            currX = this.position.x,
            currY = this.position.y,
            nextX = currX + this.speed * vector.x,
            nextY = currY + this.speed * vector.y,
            cell = this.spec.grid.get(currX, currY),
            walls = cell.walls;

        let distX = axisDistance(cell.x, nextX),
            distY = axisDistance(cell.y, nextY),
            radius = .5;

        if (distX > radius && walls[1] || distX < -radius && walls[3]) {
            nextX = currX;
        }
        if (distY > radius && walls[2] || distY < -radius && walls[0]) {
            nextY = currY;
        }
        this.position.set(nextX, nextY);
        this.render();
    },
    turn: function (dir) {
        const angle = dir * this.rotationSpeed;
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
    proto.spec = spec;
    const instance = create(proto, {
        position: new Point(.5, .5),
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
    return instance;
}

function addShape(spec) {
    const radius = spec.scale * .4;
    const body = new Path.Circle({
        fillColor: '#88c242',
        center: [0, 0],
        radius
    });
    const eye = new Path.Circle({
        fillColor: '#5c8628',
        radius: radius * .3,
        center: [radius * .3, 0]
    })
    return new Group({
        children: [body, eye]
    });
}

function axisDistance(coord, pos) {
    return pos - (coord + .5);
}