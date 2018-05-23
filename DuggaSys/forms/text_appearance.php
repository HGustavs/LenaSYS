Text:</br>
<textarea id="freeText" class="FreeTextTextarea" oninput="changeObjectAppearance('textType')" style="height:100px;resize:none;"></textarea><br>
Font family:<br>
<select onchange="changeObjectAppearance('textType');" id='font'>
    "<option value='Arial' selected="true">Arial</option>
    "<option value='Courier New'>Courier New</option>
    "<option value='Impact'>Impact</option>
    "<option value='Calibri'>Calibri</option>
</select><br>
Font color:<br>
<select onchange="changeObjectAppearance('textType');" id='fontColor'>
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
Text alignment:<br>
<select onchange="changeObjectAppearance('textType');" id="textAlign">
    <option value="start">Left</option>
    <option value="center" selected="true">Center</option>
    <option value="end">Right</option>
</select><br>
Text size:<br>
<select onchange="changeObjectAppearance('textType');" id='TextSize'>
    "<option value='Tiny' selected="true">Tiny</option>
    "<option value='Small'>Small</option>
    "<option value='Medium'>Medium</option>
    "<option value='Large'>Large</option>
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('textType'); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
