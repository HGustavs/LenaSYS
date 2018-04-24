Class name: </br>
<input onkeyup="changeObjectAppearance('classType');" id='nametext' type='text'></br>
<!--<select onclick="changeObjectAppearance('lineType');" id='object_type'>
    <option value='normal'>Normal</option>
</select></br>-->
<!--setType();-->
Attributes: <br/>
<textarea id="UMLAttributes" class="UMLTextarea" style="height:100px; resize='none'"/><br/>

Operations: <br/>
<textarea id="UMLOperations" class="UMLTextarea" style="height:100px; resize='none'"/><br/>

<button type='submit' class='submit-button' onclick="changeObjectAppearance('classType'); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>Ok</button>
