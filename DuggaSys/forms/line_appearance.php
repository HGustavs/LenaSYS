Line type: </br>
<select onclick="changeObjectAppearance('lineType');" id='object_type'>
    "<option value='Normal'>Normal</option> +
    "<option value='Forced'>Forced</option> +
    "<option value='Derived'>Derived</option> +
</select></br>
Line colors:<br>
<select onclick="changeObjectAppearance('attributeType');" id='AttributeLineColor'>
    "<option value='#4488BB'>Blue</option>" +
    "<option value='#3399ff'>Light Blue</option>" +
    "<option value='#2CA633'>Green</option>" +
    "<option value='#00ff00'>Light Green</option>" +
    "<option value='#dadada'>Grey</option>" +
    "<option value='#ea5b5b'>Red</option>" +
    "<option value='#f0f09e'>Yellow</option>" +
    "<option value='#ff6600'>Orange</option>" +
    "<option value='#993399'>Purple</option>" +
    "<option value='#4b0082'>Indigo</option>" +
    "<option value='#fa8072'>Salmon</option>" +
    "<option value='#ffffff'>White</option>" +
    "<option value='#000000'>Black</option>" +
</select><br>
<button type='submit' class='submit-button' onclick="changeObjectAppearance('lineType'); setType(form); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
