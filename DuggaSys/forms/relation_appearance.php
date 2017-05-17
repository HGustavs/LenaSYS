Relation name:</br>
<input onkeyup="changeObjectAppearance('relationType');" id='nametext' type='text'></br>
Relation type: </br>
<select onclick="changeObjectAppearance('relationType');" id='object_type'>
    <option value='Weak'>Weak</option>
    <option value='Strong' selected>Strong</option>
</select></br>
Background color:<br>
<select onclick="changeObjectAppearance('relationType');" id='symbolColor'>
    "<option value='#add8e6'>Blue</option>" +
    "<option value='#dfe'>Green</option>" +
    "<option value='#dadada'>Grey</option>" +
    "<option value='#ea5b5b'>Red</option>" +
    "<option value='#f0f09e'>Yellow</option>" +
    "<option value='#ffffff'>White</option>" +
</select><br>
Font family:<br>
<select onclick="changeObjectAppearance('relationType');" id='font'>
    <option value='arial' selected>Arial</option>
    <option value='Courier New'>Courier New</option>
    <option value='Impact'>Impact</option>
    <option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select onclick="changeObjectAppearance('relationType');" id='fontColor'>
    <option value='black' selected>Black</option>
    <option value='blue'>Blue</option>
    <option value='Green'>Green</option>
    <option value='grey'>Grey</option>
    <option value='red'>Red</option>
    <option value='yellow'>Yellow</option>
</select><br>
Text size:<br>
<select onclick="changeObjectAppearance('relationType');" id='TextSize'>
    <option value='Tiny'>Tiny</option>
    <option value='Small'>Small</option>
    <option value='Medium'>Medium</option>
    <option value='Large'>Large</option>
</select><br>
Line colors:<br>
<select onclick="changeObjectAppearance('attributeType');" id='AttributeLineColor'>
    "<option value='#4488BB'>Blue</option>" 
    "<option value='#2CA633'>Green</option>" 
    "<option value='#dadada'>Grey</option>" 
    "<option value='#ea5b5b'>Red</option>" 
    "<option value='#f0f09e'>Yellow</option>"
    "<option value='#ffffff'>White</option>" 
    "<option value='#000000'>Black</option>" 
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('relationType'); setType(form); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
