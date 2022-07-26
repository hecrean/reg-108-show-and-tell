import glsl from 'glslify';
import { Matrix4, ShaderMaterial, Texture, Vector2, Vector3 } from 'three';
import { ShaderPass } from 'three-stdlib';

interface Uniforms {
	uDiffuseTexture: Texture;
	uMouse: Vector2;
	uResolution: Vector2;
	cameraWorldMatrix: Matrix4;
	cameraProjectionMatrixInverse: Matrix4;
}

/**This is a postprocessing shader to put a dot at a chosen position... */

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
    uniform sampler2D uDiffuseTexture;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    // uniform vec3 cameraPosition;
    uniform mat4 cameraWorldMatrix;
    uniform mat4 cameraProjectionMatrixInverse;
    // uniform float uViewportAspectRatio;
    // uniform float uFOV;
    // uniform float uClippingPlaneNear;
    // uniform float uClippingPlaneFar;



    struct Ray {
        vec3 origin;
        vec3 direction;
    };

    float sphereSDF(vec3 position, vec3 origin, float radius) {
      // return sqrt(dot(origin-position)) - radius;
      return .1;
    }
    
 

    void main() {
    


        vec2 screenPosition =( gl_FragCoord.xy * 2.0 - (uResolution - vec2(0.5,0.5)) ) / uResolution; // normalised device coordinates of screen position;
        vec2 p = gl_FragCoord.xy / uResolution.xy;

        vec3 rayDirection = normalize((cameraWorldMatrix * cameraProjectionMatrixInverse * vec4( screenPosition.xy, 1.0, 1.0 )).xyz);
        vec3 rayOrigin = cameraPosition;
        Ray ray = Ray(rayOrigin, rayDirection);

        vec3 sphereOrigin = vec3(0.);


        vec3 sum = texture(uDiffuseTexture, p).xyz;
        float rayDistance = 0.0;
        float MAX_DISTANCE = 2000.0;

        for (int i = 0; i< 1000;i ++) {
            vec3 currentStep = ray.origin + ray.direction * rayDistance ;
    
            float dist = sphereSDF(currentStep, sphereOrigin, .10);
    
            if (dist < 0.00001 ) {
              sum = vec3(1.0); 
            }
            if (rayDistance > MAX_DISTANCE) {  
              break;
            }
            rayDistance += 0.09; 
        }

        gl_FragColor = vec4(sum.xyz, 1.0);
    }
    
`;

class RaymarchingMaterial extends ShaderMaterial {
	constructor({
		uDiffuseTexture,
		uMouse,
		uResolution,
		cameraWorldMatrix,
		cameraProjectionMatrixInverse
	}: Uniforms) {
		super({
			uniforms: {
				uDiffuseTexture: { value: uDiffuseTexture },
				uMouse: { value: uMouse },
				uResolution: { value: uResolution },
				cameraWorldMatrix: { value: cameraWorldMatrix },
				cameraProjectionMatrixInverse: {
					value: cameraProjectionMatrixInverse
				}
			},
			vertexShader,
			fragmentShader
		});
	}

	update = (uniforms: Uniforms) => {
		Object.entries(uniforms).map(([key, val]) => {
			this.uniforms[key].value = val;
		});
	};
}

export { RaymarchingMaterial };
