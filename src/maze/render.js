import { forEach } from 'lodash';
import { Path } from 'paper';
import { coordsToPoints } from '../utils/units';

export default function (spec) {
        const { grid, scale, offset } = spec;
    return () => {
        grid.each(cell => render(cell, scale, offset));
    }
}

function render(data, scale, offset) {
    const { x, y, walls } = data;
    const points = coordsToPoints(x, y, scale);
    walls.forEach((wall, i) => {
        if (wall) {
            new Path.Line({
                from: points[i].add(offset),
                to: (points[i + 1] || points[0]).add(offset),
                strokeColor: '#2196f3',
                strokeCap: 'square',
                strokeWidth: 4
            });
        }
    });
}