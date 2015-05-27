  //---------------------                                                                                                                               
  // Fragment/Pixel Shader                                                                                                                              
  //---------------------                                                                                                                               
                                                                                                                                                         
   varying vec3 vNormal;                                                                                                                                 
   varying vec3 vLightDir;                                                                                                                               
                                                                                                                                                         
   void main( void )                                                                                                                                     
   {                                                                                                                                                     
     // We must normalize vectors                                                                                                                       
     vec3 N = normalize(vNormal);                                                                                                                       
     vec3 L = normalize(vLightDir);                                                                                                                     
                                                                                                                                                        
    // Lambert Diffuse Lighting                                                                                                                        
     float diffuse=dot(N,-L);                                                                                                                           
                                                                                                                                                       
     gl_FragColor = vec4(diffuse,0.0,0.0,1.0);                                                                                                          
                                                                                                                                                        
  }                                                                                                                                                     
                                                                                                                                                        
  //---------------------                                                                                                                               
  // Vertex Shader                                                                                                                                      
  //---------------------                                                                                                                               
                                                                                                                                                        
  uniform vec3 uLight1Position;                                                                                                                         
                                                                                                                                                        
  varying vec3 vLightDir;                                                                                                                               
  varying vec3 vNormal;                                                                                                                                 
                                                                                                                                                        
  void main( void )                                                                                                                                     
  {                                                                                                                                                     
                                                                                                                                                        
     vec4 vertex = gl_ModelViewProjectionMatrix * gl_Vertex;                                                                                            
     gl_Position = vertex;                                                                                                                              
                                                                                                                                                        
     vLightDir = -vec3(gl_ModelViewMatrix * vec4(uLight1Position,0.0));                                                                                 
     vNormal = gl_NormalMatrix * gl_Normal;                                                                                                             
           
  }   
