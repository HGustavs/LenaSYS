Entity name: </br>
<input onkeyup="changeObjectAppearance('entityType');" id='nametext' type='text'></br>
Entity type: </br>
<select onchange="changeObjectAppearance('entityType');" id='object_type'>
    <option value='Weak'>Weak</option>
    <option value='Strong' selected="true">Strong</option>
</select></br>
Background color:<br>
<select onchange="changeObjectAppearance('entityType');" id ='symbolColor'>
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
<select onchange="changeObjectAppearance('entityType');" id ='font'>
    <option value='Arial' selected="true">Arial</option>
    <option value='Courier New'>Courier New</option>
    <option value='Impact'>Impact</option>
    <option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select onchange="changeObjectAppearance('entityType');" id ='fontColor'>
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
<select onchange="changeObjectAppearance('entityType');" id ='TextSize'>
    <option value='Tiny' selected="true">Tiny</option>
    <option value='Small'>Small</option>
    <option value='Medium'>Medium</option>
    <option value='Large'>Large</option>
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
<button type='submit' class='submit-button' onclick="changeObjectAppearance('entityType'); setType(); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
