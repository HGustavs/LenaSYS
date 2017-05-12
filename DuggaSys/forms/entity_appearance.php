Entity name: </br>
<input onKeypress="changeObjectAppearance('entityType');" id='nametext' type='text'></br>
Entity type: </br>
<select onClick="changeObjectAppearance('entityType');" id='object_type'>
    <option value='weak'>weak</option>
    <option value='strong' selected>strong</option>
</select></br>
Background color:<br>
<select onClick="changeObjectAppearance('entityType');" id ='symbolColor'>
    "<option value='#add8e6'>Blue</option>" +
    "<option value='#dfe'>Green</option>" +
    "<option value='#dadada'>Grey</option>" +
    "<option value='#ea5b5b'>Red</option>" +
    "<option value='#f0f09e'>Yellow</option>" +
    "<option value='#ffffff'>White</option>" +
</select><br>
Font family:<br>
<select onClick="changeObjectAppearance('entityType');" id ='font'>
    <option value='arial' selected>Arial</option>
    <option value='Courier New'>Courier New</option>
    <option value='Impact'>Impact</option>
    <option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select onClick="changeObjectAppearance('entityType');" id ='fontColor'>
    <option value='black' selected>Black</option>
    <option value='blue'>Blue</option>
    <option value='Green'>Green</option>
    <option value='grey'>Grey</option>
    <option value='red'>Red</option>
    <option value='yellow'>Yellow</option>
</select><br>
Text size:<br>
<select onClick="changeObjectAppearance('entityType');" id ='TextSize'>
    <option value='Tiny' selected>Tiny</option>
    <option value='Small'>Small</option>
    <option value='Medium'>Medium</option>
    <option value='Large'>Large</option>
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('entityType'); setType(); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
