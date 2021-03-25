
export async function calculate({
				speed = 0, stamina = 0, power = 0, guts = 0, smart = 0
			} = {}, {
				tension = 1.0
			} = {}) {

	speed = Math.min(1000, Math.max(0, speed));
	stamina = Math.min(1000, Math.max(0, stamina));
	power = Math.min(1000, Math.max(0, power));
	guts = Math.min(1000, Math.max(0, guts));
	smart = Math.min(1000, Math.max(0, smart));

	return await fetch('./train.json')
		.then(res => res.json())
		.then(train_score => {
			const result = {
				status: [0, 0, 0, 0, 0, 0, 0],
				train_level: [0, 0, 0, 0, 0],
				train_count: 0,
				train_score,
			};

			Object.defineProperty(result, 'train', {
				enumerable: true,
				value: function (name) {
					const index = this.train_score.title.findIndex(t => t == name);
					const level = Math.min(4, this.train_level[index] / 4 | 0); // '| 0' は整数部の抜き出し
					this.train_level[index] += 1;
					this.train_count += 1;

					for (let i = 0; i < 7; i++) this.status[i] += train_score[name][level][i] * tension | 0;
				}
			});

			Object.defineProperty(result, 'clone', {
				enumerable: true,
				value: function () {
					const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
					copy.status = copy.status.map(x => x);
					copy.train_level = copy.train_level.map(x => x);
					return copy;
				}
			});

			// smart
			while (result.status[4] < smart) result.train('smart');

			/// stamina: stamina or power
			const stamina_optimise = [];
			// only stamina train
			const only_stamina = result.clone();
			while (only_stamina.status[1] < stamina) only_stamina.train('stamina');
			const stamina_train_count = only_stamina.train_count - result.train_count;
			while (only_stamina.status[3] < guts) only_stamina.train('guts');
			while (only_stamina.status[0] < speed) only_stamina.train('speed');
			while (only_stamina.status[2] < power) only_stamina.train('power');
			stamina_optimise.push(only_stamina);

			// decrese stamina train
			for (let i = 1; i < stamina_train_count; i++) {
				const current = result.clone();
				for (let j = 0; j < stamina_train_count - i; j++) current.train('stamina');
				while (current.status[1] < stamina) current.train('power');
				while (current.status[3] < guts) current.train('guts');
				while (current.status[0] < speed) current.train('speed');
				while (current.status[2] < power) current.train('power');
				stamina_optimise.push(current);
			}

			return stamina_optimise;
		});
}
