Relation name:</br>
<input onkeyup="changeObjectAppearance('relationType');" id='nametext' type='text'></br>
Relation type: </br>
<select onclick="changeObjectAppearance('relationType');" id='object_type'>
    <option value='weak'>weak</option>
    <option value='strong' selected>strong</option>
</select></br>
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
<button type='submit' class='submit-button' onclick="changeObjectAppearance('relationType'); setType(form); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
