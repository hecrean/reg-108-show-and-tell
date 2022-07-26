export type Color =
	| `rgba(${number},${number},${number},${number})`
	| `rgb(${number},${number},${number})`;

export enum Colors {
	eyleablue = 'rgb(0, 68, 107)',
	eyleayellow = 'rgb(255, 209, 0)',
	lightblue = 'rgba(173, 223, 237, 0.4)',
	lightblueaccent = 'rgb(173, 223, 237)',
	deepblue = 'rgb(0, 43, 84)',
	teal = 'rgb(96, 205, 203)',
	tealaccent1 = 'rgba(96, 205, 203, 0.35)',
	tealaccent2 = 'rgba(96, 205, 203, 0.7)',
	darkteal = 'rgb(44, 145, 153)'
}
