//---------------------
// Fragment/Pixel Shader
//---------------------

varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vEyeVec;

void main(void)
{
      vec3 L = normalize(vLightDir);
      vec3 N = normalize(vNormal);
      vec3 E = normalize(vEyeVec);
      
      // Lambert Diffuse Lighting
      float diffuse=clamp(dot(N,-L),0.0,1.0);
      					
			// Rim Lighting
			float rimlight=smoothstep(0.5,0.05,dot(N,E));
					
			// Add Rim Lighting to Diffuse Component
			vec4 finalColor = vec4(diffuse+rimlight,rimlight,rimlight,1.0);
			gl_FragColor = finalColor;
}

//---------------------
// Vertex Shader
//---------------------

uniform vec3 uLight1Position;

varying vec3 vLightDir;
varying vec3 vNormal;
varying vec3 vEyeVec;
   
void main( void )
{ 
       
   vec4 vertex = gl_ModelViewProjectionMatrix * gl_Vertex;
   gl_Position = vertex;
   
   vLightDir = -vec3(gl_ModelViewMatrix * vec4(uLight1Position,0.0));
   vNormal = gl_NormalMatrix * gl_Normal;
   vEyeVec = -vec3(gl_ModelViewMatrix * gl_Vertex);

}
