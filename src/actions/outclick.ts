// export const outclick = <Node extends HTMLElement>(node: Node) => {
// 	const handleClick = (event: MouseEvent) => {
// 		if (!node.contains(event.target as Node)) {
// 			node.dispatchEvent(new CustomEvent('outclick'));
// 		}
// 	};

// 	document.addEventListener('click', handleClick, true);

// 	return {
// 		destroy() {
// 			document.removeEventListener('click', handleClick, true);
// 		}
// 	};
// };

export function outclick(node: HTMLElement, handler: () => void): { destroy: () => void } {
	const onClick = (event: MouseEvent) =>
		node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented && handler();

	document.addEventListener('click', onClick, true);

	return {
		destroy() {
			document.removeEventListener('click', onClick, true);
		}
	};
}
