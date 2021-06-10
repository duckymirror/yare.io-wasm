

const { memory } = require('console');
const fs = require('fs');
const minify = require('minify');

(async function() {
	const inputPath = process.argv[2];
	const contents = fs.readFileSync(inputPath, {encoding: 'base64'});
	const unique = new Date().getTime();
	const botCode = bot.toString().replace(/function bot\(\) \{([\s\S]+)\}/, '$1').replace(/__UNIQUE__/g, unique).replace(/__CONTENTS__/g, contents);

	const botCodeMinified = await minify.js(botCode);
	fs.writeFileSync(inputPath.replace(/.wasm$/i, ".js"), botCodeMinified);
})();



function bot() {
	memory.spirits = Object.values(spirits);
	memory.bases = [ base, enemy_base ];
	memory.stars = stars;
	memory.player_id = this_player_id;

	if (memory.wasm_cache != "__UNIQUE__") {
		buff = Buffer.from("__CONTENTS__", "base64");
		
		arr = new Uint8Array(buff.length);
		for (let i = 0; i < buff.length; ++i)
			arr[i] = buff[i];

		importObject = {
			spirits: {
				count: () => memory.spirits.length,
				isFriendly: (index) => memory.spirits[index].player_id == memory.player_id,
				positionX: (index) => memory.spirits[index].position[0],
				positionY: (index) => memory.spirits[index].position[1],
				size: (index) => memory.spirits[index].size,
				shape: (index) => memory.spirits[index].shape == "squares" ? 1 : 0,
				energyCapacity: (index) => memory.spirits[index].energy_capacity,
				energy: (index) => memory.spirits[index].energy,
				hp: (index) => memory.spirits[index].hp,

				energize: (fromIndex, toIndex) => memory.spirits[fromIndex].energize(spirits[toIndex]),
				energizeBase: (index) => memory.spirits[index].energize(memory.base),
				energizeEnemyBase: (index) => memory.spirits[index].energize(memory.enemy_base),
				move: (index, x, y) => memory.spirits[index].move([x, y]),
				merge: (fromIndex, toIndex) => memory.spirits[fromIndex].merge(spirits[toIndex]),
				divide: (index) => memory.spirits[index].divide(),
				jump: (index, x, y) => memory.spirits[index].jump([x, y]),
				shout: (index, string) => {},
				label: (index, string) => {},
			},
			bases: {
				count: () => memory.bases.length,
				positionX: (index) => memory.bases[index].position[0],
				positionY: (index) => memory.bases[index].position[1],
				size: (index) => memory.bases[index].size,
				energyCapacity: (index) => memory.bases[index].energy_capacity,
				energy: (index) => memory.bases[index].energy,
				hp: (index) => memory.bases[index].hp,
			},
			stars: {
				count: () => memory.stars.length,
				positionX: (index) => memory.stars[index].position[0],
				positionY: (index) => memory.stars[index].position[1],
			},
			console: {
				log: (string) => {},
			}
		};

		wasm = new WebAssembly.Module(arr);
		inst = new WebAssembly.Instance(wasm, importObject);
		memory.wasm_tick = inst.exports.tick;
		memory.wasm_cache = "__UNIQUE__";
		console.log("compiled new wasm script");
	}

	memory.wasm_tick();
}