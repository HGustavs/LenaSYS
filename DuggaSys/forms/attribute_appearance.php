Attribute name:</br>
<input onkeyup="changeObjectAppearance('attributeType');" id='nametext' type='text'></br>
Attribute type: </br>
<select onclick="changeObjectAppearance('attributeType');" id='object_type'>
    "<option value='Primary key'>Primary key</option>
    "<option value='Normal'>Normal</option>
    "<option value='Multivalue'>Multivalue</option>
    "<option value='Composite' selected>Composite</option>
    "<option value='Drive' selected>Derive</option>
</select></br>
Background color:<br>
<select onclick="changeObjectAppearance('attributeType');" id='symbolColor'>
    <option value='#4488BB'>Blue</option>
    <option value='#3399ff'>Light Blue</option>
    <option value='#2CA633'>Green</option>
    <option value='#00ff00'>Light Green</option>
    <option value='#dadada'>Grey</option>
    <option value='#ea5b5b'>Red</option>
    <option value='#f0f09e'>Yellow</option>
    <option value='#ff6600'>Orange</option>
    <option value='#993399'>Purple</option>
    <option value='#4b0082'>Indigo</option>
    <option value='#fa8072'>Salmon</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
Font family:<br>
<select onclick="changeObjectAppearance('attributeType');" id='font'>
    "<option value='arial' selected>Arial</option>
    "<option value='Courier New'>Courier New</option>
    "<option value='Impact'>Impact</option>
    "<option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select onclick="changeObjectAppearance('attributeType');" id='fontColor'>
    <option value='#4488BB'>Blue</option>
    <option value='#3399ff'>Light Blue</option>
    <option value='#2CA633'>Green</option>
    <option value='#00ff00'>Light Green</option>
    <option value='#dadada'>Grey</option>
    <option value='#ea5b5b'>Red</option>
    <option value='#f0f09e'>Yellow</option>
    <option value='#ff6600'>Orange</option>
    <option value='#993399'>Purple</option>
    <option value='#4b0082'>Indigo</option>
    <option value='#fa8072'>Salmon</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
Text size:<br>
<select onclick="changeObjectAppearance('attributeType');" id='TextSize'>
    "<option value='Tiny'>Tiny</option>
    "<option value='Small'>Small</option>
    "<option value='Medium'>Medium</option>
    "<option value='Large'>Large</option>
</select><br>
Line colors:<br>
<select onclick="changeObjectAppearance('attributeType');" id='AttributeLineColor'>
    <option value='#4488BB'>Blue</option>
    <option value='#3399ff'>Light Blue</option>
    <option value='#2CA633'>Green</option>
    <option value='#00ff00'>Light Green</option>
    <option value='#dadada'>Grey</option>
    <option value='#ea5b5b'>Red</option>
    <option value='#f0f09e'>Yellow</option>
    <option value='#ff6600'>Orange</option>
    <option value='#993399'>Purple</option>
    <option value='#4b0082'>Indigo</option>
    <option value='#fa8072'>Salmon</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('attributeType'); setType(); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
