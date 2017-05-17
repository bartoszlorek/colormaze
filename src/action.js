import { forEach, isArray } from 'lodash';
import paper, { Key } from 'paper';

const events = {};
let spins = false,
    names = [];

export default function action(key, callback) {
    if (typeof callback !== 'function') {
        throw 'second parameter must be a function';
    }
    if (isArray(key)) {
        forEach(key, k => events[k] = callback);
    } else {
        events[key] = callback;
    }
    names = Object.keys(events);
}

action.spin = () => {
    if (paper.view === null) {
        return false;
    }
    spins = true;
    paper.view.onFrame = function (e) {
        if (spins) {
            forEach(names, n => {
                if (Key.isDown(n)) {
                    events[n]();
                }
            });
        }
    }
}

action.stop = () => {
    spins = false;
}