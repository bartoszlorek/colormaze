import p5 from 'p5';
import generate from './maze/generate';
import renderer from './maze/renderer';

const canvas = new p5(p => {

	const width = 800;
	const height = 800;

    const maze = generate(10);
    const render = renderer(p, maze);

	p.setup = function () {
		p.createCanvas(width, height)
			.background('#444');
		render(width, height);
	}

	p.draw = function () {}

});