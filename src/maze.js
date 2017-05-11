export default create;

const grid = [];
let   game,
	  dimension,
      density,
	  size;

function create(spec) {
	game = spec.game || null;
	dimension = spec.dimension || 100;
	density = spec.density || 10;
	size = dimension / density;

	if (game === null) {
		throw 'game needs object!';
	}
	for (let y = 0; y < density; y++) {
		for (let x = 0; x < density; x++) {
			grid.push(new Cell(x, y));
		}
	}
	let current = grid[0],
		remained = grid.length,
		next;

	while(remained--) {
		current.visited = true;
		next = current.checkNeighbours();
		if (next) {
			next.visited = true;
			removeWall(current, next);
			current = next;
		}
	}
	return render;
}

function render() {
	let length = grid.length;
	for (let i = 0; i < length; i++) {
		grid[i].render();
	}
}

function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.visited = false;
	this.walls = [1,1,1,1];
}

Cell.prototype = {
	get bounds() {
		let left = this.x * size,
			top = this.y * size;
		return {
			top,
			right: left + size,
			bottom: top + size,
			left
		}
	},

	get points() {
		let { top, right, bottom, left } = this.bounds;
		return [
			[left, top, right, top],
			[right, top, right, bottom],
			[right, bottom, left, bottom],
			[left, bottom, left, top]
		]
	},

	render: function() {
		let length = this.walls.length,
			wallPoints;
		
		if (this.visited) {
			let { left, top } = this.bounds;
			game.noStroke()
				.fill('#222')
				.rect(left, top, size, size);
		}
		game.stroke('#fff');
		for (var i = 0; i < length; i++) {
			if (this.walls[i]) {
				wallPoints = this.points[i];
				game.line.apply(game, wallPoints);
			}
		}
	},

	checkNeighbours: function() {
		let x = this.x,
			y = this.y,
			result = [],
			neighbours = [
				grid[index(x, y-1)], // top
				grid[index(x+1, y)], // right
				grid[index(x, y+1)], // bottom
				grid[index(x-1, y)]  // left
			],
			length = neighbours.length;
			
		for (let i = 0; i < length; i++) {
			if (neighbours[i] && !neighbours[i].visited) {
				result.push(neighbours[i]);
			}
		}
		if (result.length > 0) {
			let idx = Math.floor(Math.random() * result.length);
			return result[idx];
		}
	}
}

function index(x, y) {
	if (x < 0 || y < 0 || x > density-1 || y > density-1) {
		return -1;
	}
	return x + y * density;
}

function removeWall(a, b) {
	let x = a.x - b.x,
		y = a.y - b.y;
	if (x === 1) {
		a.walls[3] = 0;
		b.walls[1] = 0;
	} else if (x === -1) {
		a.walls[1] = 0;
		b.walls[3] = 0;
	}
	if (y === 1) {
		a.walls[0] = 0;
		b.walls[2] = 0;
	} else if (y === -1) {
		a.walls[2] = 0;
		b.walls[0] = 0;
	}
}