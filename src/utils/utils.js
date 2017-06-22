import { isArray } from 'lodash';
import { Point } from 'paper';

export {
    gridToScale,
    coordsToBounds,
    coordsToPoints,
    angleToPoint,
    nonAbsDistance,
    roundToPath,
    midCell,
    normalizeDegrees,
    mapRange
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
    angle = (360 - angle) * Math.PI / 180;
    return new Point(
        Math.cos(angle),
        Math.sin(angle)
    )
}

function nonAbsDistance(from, to) {
    return from - to;
}

function roundToPath(dist, min, max) {
    if (min && dist < 0
    ||  max && dist > 0) {
        return 0;
    }
    return dist;
}

function midCell(x, y) {
    if (y === undefined) {
        return x + 0.5;
    }
    return [
        x + 0.5,
        y + 0.5
    ]
}

function normalizeDegrees(angle) {
    return (angle % 360 + 360) % 360;
}

function mapRange(value, inMin, inMax, outMin = 0, outMax = 1) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}