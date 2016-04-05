# XML Specification

The following two tags are the root objects of console, screenshot and canvas scripts. All tags for console, screenshot and canvas type scripts are to be used inside timesteps. Square brackets indicate optional attributes.

**<script [type=””]>** Root object and script identifier (console, screenshot or canvas). No specified script type will be considered a console script.

**<timestep delay=””>** Delay is to be specified in seconds and represented as following 0.000.

## Console
```xml
<special state=””/> Unspecified.

<color     foreground=””/> Text representation of color.

background=””/> Text representation of color.

operation=””/> Unspecified “reset”.

<text> Text string to display.

<newline/> Move cursor to new line.

<cursor state=””/> State of cursor, save or restore.

    key-control=””/> Unspecified. (application, terminal)

    show=””/> Show cursor, true or false.

    absoluterow=”” absolutecolumn=””/> Row and column position of cursor.

    blinking=””/> Blinking cursor, true or false.

<erase scope”” range=””> Scope unspecified, in_page. Range all, clear screen.

<screen switchto=””/> switchto, 1 or 0. Two separate screen buffers, i.e. two separate screens.
```

## Screenshot

```xml
<mousemove x=”” y=”” /> Mouse position, specified in pixels.

<picture src=””/> Change screenshot.

<mouseclick x=”” y=”” /> Mouse position when the mouse is clicked. (Changes picture)
```

## Canvas
Referring to canvas reference documentation for more information. http://www.w3schools.com/tags/ref_canvas.asp
### General
```xml
<canvasSize width=”” height=””/>    Specifies the width and height of the canvas object that should be created.

<recordedCanvasSize x="" y=""/>   Specifies the size of the canvas during recording. Used to calculate the scale ratio for mouse movement during playback.
State updates

Used for updating canvas properties.

<state_fillstyle value=””/>                Colors, styles and shadows

     _strokeStyle value=””/>

_shadowColor value=””/>

_shadowBlur value=””/>

_shadowOffsetX value=””/>

_shadowOffsetY value=””/>

_lineCap value=””/>                Line styles

_lineJoin value=””/>

_lineWidth value=””/>

_miterLimit value=””/>

_font value=””/>                Text

_textAlign value=””/>

_textBaseline value=””/>

_width value=””/>                Pixel manipulation

_height value=””/>

_data value=””/>

_globalAlpha value=””/>            Compositing

_globalCompositeOperation value=””/>
Function calls

Used for calling canvas functions from XML.

<beginPath/>

<moveTo x=”” y=””/>

<lineTo x=”” y=””/>

<stroke/>

<createLinearGradient x=”” y=”” x1=”” y1=””/>

<createPattern x=”” y=”” img=””/>

<createRadialGradient x=”” y=”” r=”” x1=”” y1=”” r1=””/>

<rect x=”” y=”” width=”” height=””/>

<fillRect x=”” y=”” width=”” height=””/>

<strokeRect x=”” y=”” width=”” height=””/>

<clearRect x=”” y=”” width=”” height=””/>

<fill/>

<closePath/>

<clip/>

<quadraticCurveTo x=”” y=”” cpx=”” cpy=””/>

<beizerCurveTo x=”” y=”” cpx=”” cpy=”” cpx1=”” cpy1=””/>

<arc x=”” y=”” r=”” sangle=”” eangle=”” counterclockwise=””/>

<arcTo x=”” y=”” r=”” x1=”” y1=””/>

<isPointInPath x=”” y=””/>

<scale width=”” height=””/>

<rotate angle=””/>

<translate x=”” y=””/>

<transform a=”” b=”” c=”” d=”” e=”” f=””/>

<setTransfrom a=”” b=”” c=”” d=”” e=”” f=”” />

<fillText x=”” y=”” text=”” maxwidth=”” />

<strokeText x=”” y=”” text=”” maxwidth=”” />

<measureText text=”” />

<drawImage img=”” sx=”” sy=”” swidth=”” sheight=”” x=”” y=”” width=”” height=”” />

<createImageData imagedata=”” width=”” height=”” />

<getImageData x=”” y=”” width=”” height=”” />

<putImageData imagedata=”” x=”” y=”” dirtyx=”” dirtyy=”” dirtywidth=”” dirtyheight=”” />

<save/>

<createEvent/>

<getContext/>

<toDataURL/>

<restore/>

<imageData values=”v1 v2 v3 … vn”/>

Optimized XML tags

<ts d=”” />
State updates

Used for updating canvas properties.

<st_fs v=””/>                

Colors, styles and shadows

     _ss v=””/>

_shdwC v=””/>

_shdwB v=””/>

_shdwOffsetX v=””/>

_shdwOffsetY v=””/>

_lC v=””/>                Line styles

_lJ v=””/>

_lW v=””/>

_miterLimit v=””/>

_font v=””/>                Text

_txtAlign v=””/>

_txtBaseline v=””/>

_w v=””/>                Pixel manipulation

_h v=””/>

_data v=””/>

_globalAlpha v=””/>            Compositing

_globalCompositeOperation v=””/>
Function calls

Used for calling canvas functions from XML.

<bP/>

<mT x=”” y=””/>

<lT x=”” y=””/>

<stroke/>

<crtLinearGrad x=”” y=”” x1=”” y1=””/>

<crtPat x=”” y=”” img=””/>

<crtRadialGrad x=”” y=”” r=”” x1=”” y1=”” r1=””/>

<rec x=”” y=”” w=”” h=””/>

<fRec x=”” y=”” w=”” h=””/>

<sRec x=”” y=”” w=”” h=””/>

<cRec x=”” y=”” w=”” h=””/>

<fill/>

<cP/>

<clip/>

<quadCrvTo x=”” y=”” cpx=”” cpy=””/>

<beizCrvTo x=”” y=”” cpx=”” cpy=”” cpx1=”” cpy1=””/>

<arc x=”” y=”” r=”” sangle=”” eangle=”” ccw=””/>

<aT x=”” y=”” r=”” x1=”” y1=””/>

<isPinP x=”” y=””/>

<scale w=”” h=””/>

<rot angle=””/>

<translate x=”” y=””/>

<transform a=”” b=”” c=”” d=”” e=”” f=””/>

<setTransfrom a=”” b=”” c=”” d=”” e=”” f=”” />

<fTxt x=”” y=”” txt=”” maxw=”” />

<sTxt x=”” y=”” txt=”” maxw=”” />

<mTxt txt=”” />

<drawImg img=”” sx=”” sy=”” sw=”” sh=”” x=”” y=”” w=”” h=””/>

<crtImgData imgdata=”” w=”” h=”” />

<getImgData x=”” y=”” w=”” h=”” />

<putImgData imgdata=”” x=”” y=”” dx=”” dy=”” dw=”” dh=”” />

<save/>

<crtEvent/>

<getContext/>

<toDataURL/>

<restore/>
```


