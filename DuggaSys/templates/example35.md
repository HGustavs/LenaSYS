# Overview
This example shows us how to darken the lighting to achieve a more realistic lighting result.
Below we see the shader that renders the image.

# Example Code
Since the normal map can move the normal by a very large amount, this can result in lighting on the back side of the object. We compute diffuse attenutation for that object to reduce this effect.

By using normal world space diffuse lighting (with a smooth step shortly after the normal lighting is black) we can remove the effects of the normal map on the back of the object. 