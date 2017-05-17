import paper from 'paper';
import createMaze from './maze/algorithm';
import renderMaze from './maze/render';
import createPlayer from './player';
import { gridToScale } from './utils/units';
import action from './action';

const app = document.querySelector('#app');
const grid = createMaze(10, 15);
const gridScale = gridToScale(grid);

const spec = {
    grid,
    width: app.width * .9,
    height: app.height * .9,
    offset: app.width * .05,
    get scale() {
        return gridScale(
            this.width,
            this.height
        )
    }
}

paper.setup(app);
action.spin();

const player = createPlayer(spec);
const render = renderMaze(spec);

// ----------------------------------------

render();
player.render();