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
    <option value='#ccefff'>Blue</option>
    <option value='#ddffee'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#ff9999'>Red</option>
    <option value='#ffffcc'>Yellow</option>
    <option value='#ffe0cc'>Orange</option>
    <option value='#ffccff'>Purple</option>
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
    <option value='#ccefff'>Blue</option>
    <option value='#ddffee'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#ff9999'>Red</option>
    <option value='#ffffcc'>Yellow</option>
    <option value='#ffe0cc'>Orange</option>
    <option value='#ffccff'>Purple</option>
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
    <option value='#ccefff'>Blue</option>
    <option value='#ddffee'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#ff9999'>Red</option>
    <option value='#ffffcc'>Yellow</option>
    <option value='#ffe0cc'>Orange</option>
    <option value='#ffccff'>Purple</option>
    <option value='#ffffff'>White</option>
    <option value='#000000'>Black</option>
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('attributeType'); setType(); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
