import type { Action } from './types';

export const css: Action<Record<string, string | number>> = (node, properties) => {
	function setProperties() {
		Object.entries(properties).map(([key, val]) => node.style.setProperty(`--${key}`, `${val}`));
	}

	setProperties();

	return {
		update(newProperties) {
			properties = newProperties;
			setProperties();
		}
	};
};
