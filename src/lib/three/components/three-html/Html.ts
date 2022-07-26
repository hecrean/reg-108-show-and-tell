import type { Object3D, Vector3 } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const translate = (object: Object3D, translation: Vector3) => {
	object.translateX(translation.x);
	object.translateY(translation.y);
	object.translateZ(translation.z);
};

class Html extends CSS2DObject {
	constructor(el: HTMLElement, target: Object3D, offset?: Vector3) {
		super(el);
		this.position.copy(target.position.clone());
		if (offset) {
			translate(this, offset);
		}
		this.userData = { kind: el.tagName };
	}
}

export { Html };
