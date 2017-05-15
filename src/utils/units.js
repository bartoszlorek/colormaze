import { isArray } from 'lodash';
import { Point } from 'paper';

export {
    gridToScale,
    coordsToBounds,
    coordsToPoints,
    angleToPoint
}

function gridToScale(grid) {
    const { cols, rows } = grid;
    return (width, height) => {
        width = width || 100;
        height = height || width;
        return Math.min(
            width / cols,
            height / rows
        );
    }
}

function coordsToBounds(x, y, scale) {
    scale = scale || 1;
    const left = x * scale;
    const top = y * scale;
    return {
        top,
        right: left + scale,
        bottom: top + scale,
        left
    }
}

function coordsToPoints(x, y, scale) {
    scale = scale || 1;
    const { top, right, bottom, left } =
        coordsToBounds(x, y, scale);
    return [
        new Point(left, top),
        new Point(right, top),
        new Point(right, bottom),
        new Point(left, bottom)
    ]
}

function angleToPoint(angle) {
    angle = angle * Math.PI / 180;
    return new Point(
        Math.cos(angle),
        Math.sin(angle)
    )
}