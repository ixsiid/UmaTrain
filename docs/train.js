
export function calculate(speed, stamina, power, guts, smart) {
	fetch('./train.json')
		.then(res => res.json())
		.then(json => console.log(json));
}
