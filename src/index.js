import p5 from 'p5';
import generateMaze from './mazeGenerator';
import mazeRenderer from './mazeRenderer';

const engine = new p5(e => {

	const width = 800;
	const height = 800;
	const renderMaze = mazeRenderer(
		e, generateMaze(10));

	e.setup = function () {
		e.createCanvas(width, height)
			.background('#444');
		renderMaze(width, height);
	}

	e.draw = function () {}

});