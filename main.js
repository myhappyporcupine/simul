const birthRate = 0.8;
const deathRate = 0.2;

class Creature {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
	get pos() {
		return {x: this.x, y: this.y};
	}
	set pos(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}
}

class World {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.creatures = [
			new Creature(randInt(this.width), randInt(this.height), randColor())
		];
	}
	kill() {
		for (let i = this.creatures.length - 1; i >= 0; i--) {
			if (Math.random() < deathRate)
				this.creatures.splice(i, 1);
		}
	}
	birth() {
		if (Math.random() < birthRate)
			this.creatures.push(
				new Creature(randInt(this.width), randInt(this.height), randColor())
			);
	}
	move() {
		for (let creature of this.creatures) {
			if (Math.random() < 0.5) {
				let direction = randInt(4);
				switch (direction) {
					case 0:
						creature.y += -1;
						break;
					case 1:
						creature.x += +1;
						break;
					case 2:
						creature.y += +1;
						break;
					case 3:
						creature.x += -1;
						break;
					default:
						break;
				}
				if (creature.x < 0) creature.x = 0;
				else if (creature.x >= this.width) creature.x = this.width - 1;
				if (creature.y < 0) creature.y = 0;
				else if (creature.y >= this.height) creature.y = this.height - 1;
			}
		}
	}
	run() {
		this.kill();
		this.birth();
		this.move();
	}
	dom() {
		let table = document.createElement("table");
		for (let y = 0; y < this.height; y++) {
			let tr = document.createElement("tr");
			for (let x = 0; x < this.width; x++) {
				let td = document.createElement("td");
				td.style.width = "20px";
				td.style.height = "20px";
				for (let creature of this.creatures)
					if (x == creature.x && y == creature.y)
						td.style.backgroundColor = creature.color;
				td.style.border = "1px solid #aaa";
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		return table;
	}
}

function randInt(limit /* exclusive */) {
	return Math.floor(Math.random() * limit);
}

function randColor() {
	let r = randInt(256).toString(16).padStart(2, 0);
	let g = randInt(256).toString(16).padStart(2, 0);
	let b = randInt(256).toString(16).padStart(2, 0);
	return `#${r}${g}${b}`;
}

let world, table;
world = new World(12, 8);
document.body.appendChild(table = world.dom());
setInterval(() => {
	world.run();
	table.remove();
	document.body.appendChild(table = world.dom());
}, 100);