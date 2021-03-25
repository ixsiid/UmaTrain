
export function calculate(speed, stamina, power, guts, smart) {
	fetch('./train.js')
		.then(res => res.json())
		.then(json => console.log(json));
}
