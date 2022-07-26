import glsl from 'glslify';
import { ShaderMaterial, Texture, Vector2 } from 'three';

interface Uniforms {
	//crossfade uniforms
	u_diffuse_texture: Texture;
	u_view_rectangle_uv_coords: [bottomLeft: Vector2, topRight: Vector2];
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
varying vec4 vPosition;

void main(){
    vUv = uv;
    vNormal = normal;
    vec4 modelViewPosition = modelViewMatrix * vec4(position , 1.0);
    vPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectionMatrix * modelViewPosition;
}
`;

const fragmentShader = /*glsl*/ `

    // varyings : 
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec4 vPosition;

    // uniforms : 
    uniform sampler2D u_diffuse_texture;
    uniform vec3 u_view_rectangle_uv_coords[2];


    float insideBox(vec2 v, vec2 bottomLeft, vec2 topRight) {
      vec2 s = step(bottomLeft, v) - step(topRight, v);
      return s.x * s.y;   
    }

    void main() {

        vec2 uv = vUv;

        vec2 bottom_left = u_view_rectangle_uv_coords[0].xy;
        vec2 top_right = u_view_rectangle_uv_coords[1].xy;

        vec4 texel = texture2D(u_diffuse_texture, uv);
        
        float t = insideBox(vPosition.xy, bottom_left, top_right);

        vec4 highlight_color = vec4(1.,0,0.,0.1);

        gl_FragColor = t * texel + (1. - t) * highlight_color; 
    }
`;

class CutOutMaterial extends ShaderMaterial {
	constructor({ u_diffuse_texture, u_view_rectangle_uv_coords }: Uniforms) {
		super({
			uniforms: {
				u_diffuse_texture: { value: u_diffuse_texture },
				u_view_rectangle_uv_coords: { value: u_view_rectangle_uv_coords }
			},
			vertexShader,
			fragmentShader
		});
	}

	get u_diffuse_texture() {
		return this.uniforms.u_diffuse_texture.value;
	}
	set u_diffuse_texture(v: Uniforms['u_diffuse_texture']) {
		this.uniforms.u_diffuse_texture.value = v;
	}
	get u_view_rectangle_uv_coords() {
		return this.uniforms.u_view_rectangle_uv_coords.value;
	}
	set u_view_rectangle_uv_coords(v: Uniforms['u_view_rectangle_uv_coords']) {
		this.uniforms.u_view_rectangle_uv_coords.value = v;
	}

	update = (uniforms: Uniforms) => {
		Object.entries(uniforms).map(([key, val]) => {
			this.uniforms[key].value = val;
		});
		this.needsUpdate = true;
	};
}

export { CutOutMaterial };
