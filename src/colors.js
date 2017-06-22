import { mapRange, normalizeDegrees } from './utils/utils';

const BODY = document.body;
const COLOR_PASS = '#1f9364';
const COLOR_WALL = '#931f24';

export default function (cell, rotation) {
    const direction = normalizeDegrees((360 - rotation) - 225) * (2 / 180);
    const lookAt = Math.floor(direction);
    BODY.style.backgroundColor = cell.walls[lookAt] ? COLOR_WALL : COLOR_PASS;
}