Line type: </br>
<select onclick="changeObjectAppearance('lineType');" id='object_type'>
    <option value='normal'>Normal</option>
    <option value='Forced'>Forced</option>
    <option value='Derived'>Derived</option>
</select></br>
Cardinality: <br/>
<select onchange="changeCardinality()" id="cardinality">
  <option value="None">None</option>
  <option value="1">1</option>
  <option value="N">N</option>
  <option value="M">M</option>
</select><br/>
<!--Line colors:<br>
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
</select><br>-->
<button type='submit' class='submit-button' onclick="changeObjectAppearance('lineType'); setType(form); changeCardinality(); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
