import glsl from 'glslify';
import { ShaderMaterial, Texture } from 'three';

interface Uniforms {
	uDiffuseTexture1: Texture;
	uDiffuseTexture2: Texture;
	uMixFactor: number;
}

/**
 * 💉 injected uniforms:  ✅
 * uniform mat4 modelMatrix; ✅ 	        = object.matrixWorld
 * uniform mat4 modelViewMatrix; ✅ 	    = camera.matrixWorldInverse * object.matrixWorld
 * uniform mat4 projectionMatrix; ✅ 	= camera.projectionMatrix
 * uniform mat4 viewMatrix; ✅		    = camera.matrixWorldInverse
 * uniform mat3 normalMatrix; ✅			= inverse transpose of modelViewMatrix
 * uniform vec3 cameraPosition; ✅		= camera position in world space
 */

const vertexShader = glsl`

/**
 * 💉 injected attributes:  ✅
 * attribute vec3 position; //POSITION ✅
 * attribute vec3 normal; //NORMAL ✅
 * attribute vec3 tangent; //TANGENT
 * attribute vec2 uv; //TEXCOORD_0 ✅
 * attribute vec2 uv2; //TEXCOORD_1
 * attribute vec4 color; //COLOR_0
 * attribute vec3 skinWeight; //WEIGHTS_
 * attribute vec3 skinIndex; //JOINTS_0
 * 
 */
varying vec2 vUv;
varying vec3 vNormal;


void main(){
    vUv = uv;
    vNormal = normal;
    vec4 modelViewPosition = modelViewMatrix * vec4(position , 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}
`;

const fragmentShader = /*glsl*/ `

    // varyings : 
    varying vec2 vUv;
    varying vec3 vNormal;

    // uniforms : 
    uniform sampler2D uDiffuseTexture1;
    uniform sampler2D uDiffuseTexture2;
    uniform float uMixFactor;
  
    void main() {
    
        vec4 pixel1 = texture2D(uDiffuseTexture1, vUv);
        vec4 pixel2 = texture2D(uDiffuseTexture2, vUv);
        vec4 mergedPixel = mix(pixel1, pixel2, uMixFactor);

        gl_FragColor = mergedPixel;
    }
    
`;

class CrossfadeMaterial extends ShaderMaterial {
	constructor({
		uDiffuseTexture1,
		uDiffuseTexture2 = Texture.DEFAULT_IMAGE,
		uMixFactor = 0
	}: Uniforms) {
		super({
			uniforms: {
				uDiffuseTexture1: { value: uDiffuseTexture1 },
				uDiffuseTexture2: { value: uDiffuseTexture2 },
				uMixFactor: { value: uMixFactor }
			},
			vertexShader,
			fragmentShader
		});
	}

	setTexture1(texture: Texture) {
		this.uniforms.uDiffuseTexture1.value = texture;
	}

	setTexture2(texture: Texture) {
		this.uniforms.uDiffuseTexture2.value = texture;
	}

	setMixFactor(value: number) {
		this.uniforms.uMixFactor.value = value;
		this.needsUpdate = true;
	}

	update = (uniforms: Uniforms) => {
		Object.entries(uniforms).map(([key, val]) => {
			this.uniforms[key].value = val;
		});
		this.needsUpdate = true;
	};
}

export { CrossfadeMaterial };
