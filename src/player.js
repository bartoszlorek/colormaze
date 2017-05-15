import { create } from 'lodash';
import { Path, Point, Group } from 'paper';
import { angleToPoint } from './utils/units';
import action from './action';

const proto = {
    walk: function (dir) {
        const vector = angleToPoint(this.rotation).multiply(dir);
        const current = this.position;
        const next = new Point(
            current.x + this.speed * vector.x,
            current.y + this.speed * vector.y
        );
        const cell = this.spec.grid.get(current.x, current.y);
        const isEdgeX = Math.floor(current.x) !== Math.floor(next.x);
        const isEdgeY = Math.floor(current.y) !== Math.floor(next.y);
        const walls = cell.walls;

        if (isEdgeX) {
            let xDiff = next.x > current.x;
            if (xDiff && walls[1] || !xDiff && walls[3]) {
                next.x = current.x;
            }
        }
        if (isEdgeY) {
            let yDiff = next.y > current.y;
            if (yDiff && walls[2] || !yDiff && walls[0]) {
                next.y = current.y;
            }
        }
        this.position = next;
        this.render();
    },
    turn: function (dir) {
        const angle = dir * this.rotationSpeed;
        this.rotation += angle;
        this.shape.rotate(angle);
    },
    render: function () {
        const { grid, scale, offset } = this.spec;
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
        speed: 1/20,
        radius: 10,
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