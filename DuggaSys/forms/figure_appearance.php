Fill color:<br>
<select onchange="changeObjectAppearance('figureType');" id='figureFillColor'>
    <option value='noFill'>No Fill</option>
    <option value='opacity'>Opacity</option>
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
Line color:<br>
<select onchange="changeObjectAppearance('figureType');" id='figureLineColor'>
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
<button type='submit' class='submit-button' onclick="changeObjectAppearance('figureType'); closeAppearanceDialogMenu();" style='float: none; display: block; margin: 10px auto;'>OK</button>
