import p5 from 'p5';
import createMaze from './maze';

const game = new p5(function (g) {
    
    const width = 800;
    const height = 800;
    const maze = createMaze({
        density: 10,
        dimension: width,
        game: g
    });

    g.setup = function () {
        g.createCanvas(width, height)
         .background('#444');
        maze();
    }

    g.draw = function () {

    }

});