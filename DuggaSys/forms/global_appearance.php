Font family:<br>
<select id='font' onchange='globalFont(); hashFunction(); updateGraphics();'>
    <option value='' selected> - Choose font - </option>
    <option value='Arial'>Arial</option>
    <option value='Courier New'>Courier New</option>
    <option value='Impact'>Impact</option>
    <option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select id ='fontColor' onchange='globalFontColor(); hashFunction(); updateGraphics();'>
    <option value='' selected> - Choose text color - </option>
    <option value='#64B5F6'>Blue</option>
    <option value='#81C784'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#E57373'>Red</option>
    <option value='#FFF176'>Yellow</option>
    <option value='#FFB74D'>Orange</option>
    <option value='#BA68C8'>Purple</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
Text size:<br>
<select id='TextSize' onchange='globalTextSize(); hashFunction(); updateGraphics();'>
    <option value='' selected> - Choose text size - </option>
    <option value='Tiny' >Tiny</option>
    <option value='Small'>Small</option>
    <option value='Medium'>Medium</option>
    <option value='Large'>Large</option>
</select><br>
Fill color:<br>
<select onchange="globalFillColor(); hashFunction(); updateGraphics();" id='FillColor'>
    <option value='' selected> - Choose symbol color - </option>
    <option value='#64B5F6'>Blue</option>
    <option value='#81C784'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#E57373'>Red</option>
    <option value='#FFF176'>Yellow</option>
    <option value='#FFB74D'>Orange</option>
    <option value='#BA68C8'>Purple</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
Stroke color:<br>
<select onchange="globalStrokeColor(); hashFunction(); updateGraphics();" id='StrokeColor'>
    <option value='' selected> - Choose line color - </option>
    <option value='#64B5F6'>Blue</option>
    <option value='#81C784'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#E57373'>Red</option>
    <option value='#FFF176'>Yellow</option>
    <option value='#FFB74D'>Orange</option>
    <option value='#BA68C8'>Purple</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
Line thickness:<br>
<input id="line-thickness" onclick='globalLineThickness(); hashFunction(); updateGraphics();' style="width:100%; margin: -2px; padding: 0px;" type="range" min="1" max="5" value="2">

<button type='submit' class='submit-button' onclick="SaveState(); closeAppearanceDialogMenu(); setType(form);" style='float: none; display: block; margin: 0px auto;'>OK</button>
