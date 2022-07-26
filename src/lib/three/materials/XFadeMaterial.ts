import { ShaderMaterial, Texture, Vector2 } from "three";

interface Uniforms {
  //crossfade uniforms
  uTexture1Mirrored: boolean;
  uTexture2Mirrored: boolean;
  uDiffuseTexture1: Texture;
  uDiffuseTexture2: Texture;
  uDispMap: Texture;
  uEffectFactor?: number;
  uDispFactor?: number;
  //higlight uniforms
  uMouse: Vector2;
  uResolution: Vector2;
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

const vertexShader = /*glsl*/ `

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
    uniform bool uTexture1Mirrored; 
    uniform bool uTexture2Mirrored; 
    uniform sampler2D uDiffuseTexture1;
    uniform sampler2D uDiffuseTexture2;
    uniform float uEffectFactor;
    uniform float uDispFactor;
    uniform sampler2D uDispMap;
    uniform vec2 uMouse;
    uniform vec2 uResolution;



    vec2 rotate(vec2 v, float a) {
        float s = sin(a);
        float c = cos(a);
        mat2 m = mat2(c, -s, s, c);
        return m * v;
       }
  
  
    void main() {

        vec2 uv = vUv;

        // vec4 disp = texture2D(uDispMap, uv);
        // vec2 distortedPosition = vec2(uv.x + uDispFactor * (disp.r*uEffectFactor), uv.y);
        // vec2 distortedPosition2 = vec2(uv.x - (1.0 - uDispFactor) * (disp.r*uEffectFactor), uv.y);
    
        // vec4 texel_1 = texture2D(uDiffuseTexture1, distortedPosition);
        // vec4 texel_2 = texture2D(uDiffuseTexture2, distortedPosition);
        // mix(x,y,a) -> x×(1−a)+y×a. 


       

        vec2 uv1 = uTexture1Mirrored ? vec2(1. - uv.x, uv.y) : uv;
        vec2 uv2 = uTexture2Mirrored ? vec2(1. - uv.x, uv.y) : uv;

        vec4 texel_1 = texture2D(uDiffuseTexture1, uv1);
        vec4 texel_2 = texture2D(uDiffuseTexture2, uv2);
        vec4 mergedTexel = mix(texel_1, texel_2, uDispFactor);

       
        gl_FragColor = mergedTexel; 
    }
    
`;

class XFadeMaterial extends ShaderMaterial {
  constructor({
    uTexture1Mirrored,
    uTexture2Mirrored,
    uMouse,
    uResolution,
    uDiffuseTexture1,
    uDiffuseTexture2,
    uEffectFactor = 1.2,
    uDispFactor = 0,
    uDispMap,
  }: Uniforms) {
    super({
      uniforms: {
        uTexture1Mirrored: { value: uTexture1Mirrored },
        uTexture2Mirrored: { value: uTexture2Mirrored },
        uMouse: { value: uMouse },
        uResolution: { value: uResolution },
        uDiffuseTexture1: { value: uDiffuseTexture1 },
        uDiffuseTexture2: { value: uDiffuseTexture2 },
        uDispMap: { value: uDispMap },
        uEffectFactor: { value: uEffectFactor },
        uDispFactor: { value: uDispFactor },
      },
      vertexShader,
      fragmentShader,
    });
  }

  get uTexture1Mirrored() {
    return this.uniforms.uTexture1Mirrored.value;
  }
  set uTexture1Mirrored(v: boolean) {
    this.uniforms.uTexture1Mirrored.value = v;
  }
  get uTexture2Mirrored() {
    return this.uniforms.uTexture2Mirrored.value;
  }
  set uTexture2Mirrored(v: boolean) {
    this.uniforms.uTexture2Mirrored.value = v;
  }

  get uMouse() {
    return this.uniforms.uMouse.value;
  }
  set uMouse(v: Vector2) {
    this.uniforms.uMouse.value = v;
  }
  get uResolution() {
    return this.uniforms.uResolution.value;
  }
  set uResolution(v: Vector2) {
    this.uniforms.uResolution.value = v;
  }

  get uDiffuseTexture1() {
    return this.uniforms.uDiffuseTexture1.value;
  }
  set uDiffuseTexture1(v: Texture) {
    this.uniforms.uDiffuseTexture1.value = v;
  }
  get uDiffuseTexture2() {
    return this.uniforms.uDiffuseTexture2.value;
  }
  set uDiffuseTexture2(v: Texture) {
    this.uniforms.uDiffuseTexture2.value = v;
  }
  get uEffectFactor() {
    return this.uniforms.uEffectFactor.value;
  }
  set uEffectFactor(v: number) {
    this.uniforms.uEffectFactor.value = v;
  }
  get uDispFactor() {
    return this.uniforms.uDispFactor.value;
  }
  set uDispFactor(v: number) {
    this.uniforms.uDispFactor.value = v;
  }
  get uDispMap() {
    return this.uniforms.uDispMap.value;
  }
  set uDispMap(v: Texture) {
    this.uniforms.uDispMap.value = v;
  }

  update = (uniforms: Uniforms) => {
    Object.entries(uniforms).map(([key, val]) => {
      this.uniforms[key].value = val;
    });
    this.needsUpdate = true;
  };
}

export { XFadeMaterial };
