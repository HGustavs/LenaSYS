Attribute name:</br>
<input onkeyup="changeObjectAppearance('attributeType');" id='nametext' type='text'></br>
Attribute type: </br>
<select onchange="changeObjectAppearance('attributeType');" id='object_type'>
    "<option value='Primary key'>Primary key</option>
    "<option value='Partial key'>Partial key</option>
    "<option value='normal' selected="true">Normal</option>
    "<option value='Multivalue'>Multivalue</option>
    "<option value='Composite'>Composite</option>
    "<option value='Drive'>Derive</option>
</select></br>
Background color:<br>
<select onchange="changeObjectAppearance('attributeType');" id='symbolColor'>
    <option value='#64B5F6'>Blue</option>
    <option value='#81C784'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#E57373'>Red</option>
    <option value='#FFF176'>Yellow</option>
    <option value='#FFB74D'>Orange</option>
    <option value='#BA68C8'>Purple</option>
    <option value='#ffffff' selected="true">White</option>
    <option value='#000000'>Black</option>
</select><br>
Font family:<br>
<select onchange="changeObjectAppearance('attributeType');" id='font'>
    "<option value='Arial' selected="true">Arial</option>
    "<option value='Courier New'>Courier New</option>
    "<option value='Impact'>Impact</option>
    "<option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select onchange="changeObjectAppearance('attributeType');" id='fontColor'>
    <option value='#64B5F6'>Blue</option>
    <option value='#81C784'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#E57373'>Red</option>
    <option value='#FFF176'>Yellow</option>
    <option value='#FFB74D'>Orange</option>
    <option value='#BA68C8'>Purple</option>
    <option value='#ffffff'>White</option>
    <option value='#000000' selected="true">Black</option>
</select><br>
Text size:<br>
<select onchange="changeObjectAppearance('attributeType');" id='TextSize'>
    "<option value='Tiny' selected="true">Tiny</option>
    "<option value='Small'>Small</option>
    "<option value='Medium'>Medium</option>
    "<option value='Large'>Large</option>
</select><br>
Line colors:<br>
<select onchange="changeObjectAppearance('attributeType');" id='AttributeLineColor'>
    <option value='#64B5F6'>Blue</option>
    <option value='#81C784'>Green</option>
    <option value='#e6e6e6'>Grey</option>
    <option value='#E57373'>Red</option>
    <option value='#FFF176'>Yellow</option>
    <option value='#FFB74D'>Orange</option>
    <option value='#BA68C8'>Purple</option>
    <option value='#ffffff'>White</option>
    <option value='#000000' selected="true">Black</option>
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('attributeType'); setType(); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
