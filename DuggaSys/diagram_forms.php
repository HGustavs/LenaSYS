<?php
  $form = $_GET['form'];
  $colors = '<option value=\'#64B5F6\'>Blue</option>
          <option value=\'#81C784\'>Green</option>
          <option value=\'#e6e6e6\'>Grey</option>
          <option value=\'#E57373\'>Red</option>
          <option value=\'#FFF176\'>Yellow</option>
          <option value=\'#FFB74D\'>Orange</option>
          <option value=\'#BA68C8\'>Purple</option>
          <option value=\'#ffffff\'>White</option>
          <option value=\'#000000\'>Black</option>';
  $fonts = '<option value=\'Arial\'>Arial</option>
          <option value=\'Courier New\'>Courier New</option>
          <option value=\'Impact\'>Impact</option>
          <option value=\'Calibri\'>Calibri</option>';
  $backgroundColor = 'Background color:<br>
        <select onchange="changeObjectAppearance();" id=\'fillColor\'>
        '.$colors.'
        </select><br>';
  $fontFamily = 'Font family:<br>
        <select onchange="changeObjectAppearance();" id=\'font\'>
        '.$fonts.'
        </select><br>';
  $fontColor = 'Font color:<br>
          <select onchange="changeObjectAppearance();" id=\'fontColor\'>
          '.$colors.'
          </select><br>';
  $textSize = 'Text size:<br>
        <select onchange="changeObjectAppearance();" id=\'TextSize\'>
        "<option value=\'Tiny\'>Tiny</option>
        "<option value=\'Small\'>Small</option>
        "<option value=\'Medium\'>Medium</option>
        "<option value=\'Large\'>Large</option>
        </select><br>';
  $lineColors = 'Line colors:<br>
        <select onchange="changeObjectAppearance();" id=\'LineColor\'>
        '.$colors.'
        </select><br>
        ';
  $okButton = '<button type=\'submit\' class=\'submit-button\' onclick="SaveState(); changeObjectAppearance(); setType(); closeAppearanceDialogMenu();" style=\'float: none; display: block; margin: 10px auto;\'>OK</button>';
  //form for attributes
  if($form == 'attributeType') {
      echo'Attribute name:</br>
      <input onkeyup="changeObjectAppearance(\'attributeType\');" id=\'nametext\' type=\'text\'></br>
      Attribute type: </br>
      <select onchange="changeObjectAppearance(\'attributeType\');" id=\'object_type\'>
      "<option value=\'Primary key\'>Primary key</option>
      "<option value=\'Partial key\'>Partial key</option>
      "<option value=\'normal\' selected="true">Normal</option>
      "<option value=\'Multivalue\'>Multivalue</option>
      "<option value=\'Drive\'>Derive</option>
      </select></br>
      '.$backgroundColor.$fontFamily.$fontColor.$textSize.$lineColors.$okButton;
  }
  //form for classes
  else if($form == 'classType') {
      echo'Class name: </br>
      <input onkeyup="changeObjectAppearance(\'classType\');" id=\'nametext\' type=\'text\'></br>

      Attributes:<br>
      <textarea onkeyup="changeObjectAppearance(\'classType\');" id="UMLAttributes" class="UMLTextarea" style="height:100px; resize:none"></textarea><br>

      Operations:<br>
      <textarea onkeyup="changeObjectAppearance(\'classType\');" id="UMLOperations" class="UMLTextarea" style="height:100px; resize:none"></textarea><br>

      <button type=\'submit\' class=\'submit-button\' onclick="changeObjectAppearance(\'classType\'); closeAppearanceDialogMenu();" style=\'float: none; display: block; margin: 10px auto;\'>Ok</button>
      ';
  }
  //form for entities
  else if($form == 'entityType') {
      echo'Entity name: </br>
      <input onkeyup="changeObjectAppearance(\'entityType\');" id=\'nametext\' type=\'text\'></br>
      Entity type: </br>
      <select onchange="changeObjectAppearance(\'entityType\');" id=\'object_type\'>
      <option value=\'Weak\'>Weak</option>
      <option value=\'Strong\' selected="true">Strong</option>
      </select></br>
      '.$backgroundColor.$fontFamily.$fontColor.$textSize.$lineColors.$okButton;
  }
  //form for figures
  else if($form == 'figureType') {
      echo'Fill color:<br>
      <select onchange="changeObjectAppearance(\'figureType\');" id=\'figureFillColor\'>
      <option value=\'noFill\'>No Fill</option>
      '.$colors.'
      </select><br>'.$lineColors.'
      Opacity:<br>
      <input type="range" id="figureOpacity" oninput="changeObjectAppearance(\'figureType\');" style="width:100%; margin: -2px; padding: 0px;"><br>
      <button type=\'submit\' class=\'submit-button\' onclick="changeObjectAppearance(\'figureType\'); closeAppearanceDialogMenu();" style=\'float: none; display: block; margin: 10px auto;\'>OK</button>
      ';
  }
  //form for global
  else if($form == 'globalType') {
      echo'Font family:<br>
      <select id=\'font\' onchange=\'globalFont(); hashFunction(); updateGraphics();\'>
      <option value=\'\' selected> - Choose font - </option>
      '.$fonts.'
      </select><br>
      Font color:<br>
      <select id =\'fontColor\' onchange=\'globalFontColor(); hashFunction(); updateGraphics();\'>
      <option value=\'\' selected> - Choose text color - </option>
      '.$colors.'
      </select><br>
      Text size:<br>
      <select id=\'TextSize\' onchange=\'globalTextSize(); hashFunction(); updateGraphics();\'>
      <option value=\'\' selected> - Choose text size - </option>
      <option value=\'Tiny\' >Tiny</option>
      <option value=\'Small\'>Small</option>
      <option value=\'Medium\'>Medium</option>
      <option value=\'Large\'>Large</option>
      </select><br>
      Fill color:<br>
      <select onchange="globalFillColor(); hashFunction(); updateGraphics();" id=\'FillColor\'>
      <option value=\'\' selected> - Choose symbol color - </option>
      '.$colors.'
      </select><br>
      Stroke color:<br>
      <select onchange="globalStrokeColor(); hashFunction(); updateGraphics();" id=\'StrokeColor\'>
      <option value=\'\' selected> - Choose line color - </option>
      '.$colors.'
      </select><br>
      Line thickness:<br>
      <input id="line-thickness" oninput=\'globalLineThickness(); hashFunction(); updateGraphics();\' style="width:100%; margin: -2px; padding: 0px;" type="range" min="1" max="3" value="1">

      <button type=\'submit\' class=\'submit-button\' onclick="SaveState(); globalLineThickness(); closeAppearanceDialogMenu();" style=\'float: none; display: block; margin: 0px auto;\'>OK</button>
      ';
  }
  //form for lines
  else if($form == 'lineType') {
      $cardinality = $_GET['cardinality'];
      if($cardinality == 1) {
        echo"
        Line type: </br>
        <select onchange=\"changeObjectAppearance('lineType');\" id='object_type'>
            <option value='normal'>Normal</option>
            <option value='Forced'>Forced</option>
            <option value='Derived'>Derived</option>
        </select></br>
        ";
      }else if($cardinality == 2) {
        echo"
        Line type: </br>
        <select onchange=\"changeObjectAppearance('lineType');\" id='object_type'>
            <option value='normal'>Normal</option>
            <option value='Forced'>Forced</option>
            <option value='Derived'>Derived</option>
        </select></br>
        Cardinality: <br/>
        <select onchange=\"changeCardinality(false)\" id='cardinality'>
          <option value='None'>None</option>
          <option value='1'>1</option>
          <option value='N'>N</option>
          <option value='M'>M</option>
        </select><br/>
        ";
      }else if ($cardinality == 3) {
        echo"
        Line type: </br>
        <select onchange=\"changeObjectAppearance('lineType');\" id='object_type'>
            <option value='normal'>Normal</option>
            <option value='Association'>Association</option>
            <option value='Inheritance'>Inheritance</option>
            <option value='Implementation'>Implementation</option>
            <option value='Dependency'>Dependency</option>
            <option value='Aggregation'>Aggregation</option>
            <option value='Composition'>Composition</option>
        </select></br>

        Line direction: <br/>
        <select onchange=\"changeLineDirection()\" id='line_direction'>
          <option value='First'>First object</option>
          <option value='Second'>Second object</option>
        </select><br/>

        Cardinality: <br/>
        <select onchange=\"changeCardinality(true)\" id='cardinality'>
          <option value='None'>None</option>
          <option value='0..1'>0..1</option>
          <option value='1..1'>1..1</option>
          <option value='0..*'>0..*</option>
          <option value='1..*'>1..*</option>
        </select><br/>
        <select onchange=\"changeCardinality(true)\" id='cardinalityUml' style=\"margin-top:3px\">
          <option value='None'>None</option>
          <option value='0..1'>0..1</option>
          <option value='1..1'>1..1</option>
          <option value='0..*'>0..*</option>
          <option value='1..*'>1..*</option>
        </select><br/>
        ";
      }
      echo"<button type='submit' class='submit-button' onclick=\"changeObjectAppearance('lineType'); setType(form); closeAppearanceDialogMenu();\" style='float: none; display: block; margin: 10px auto;'>OK</button>";

  }
  //form for relations
  else if($form == 'relationType') {
      echo'Relation name:</br>
      <input onkeyup="changeObjectAppearance(\'relationType\');" id=\'nametext\' type=\'text\'></br>
      Relation type: </br>
      <select onchange="changeObjectAppearance(\'relationType\');" id=\'object_type\'>
      <option value=\'Weak\'>Weak</option>
      <option value=\'Strong\' selected>Strong</option>
      </select></br>
      '.$backgroundColor.$fontFamily.$fontColor.$textSize.$lineColors.$okButton;
  }
  //form for text
  else if($form == 'textType') {
      echo'Text:</br>
      <textarea id="freeText" class="FreeTextTextarea" oninput="changeObjectAppearance(\'textType\')" style="height:100px;resize:none;"></textarea><br>
      '.$fontFamily.$fontColor
      .'Text alignment:<br>
      <select onchange="changeObjectAppearance(\'textType\');" id="textAlign">
      <option value="start">Left</option>
      <option value="center" selected="true">Center</option>
      <option value="end">Right</option>
      </select><br>'.$textSize
      .'<button type=\'submit\' class=\'submit-button\' onclick="changeObjectAppearance(\'textType\'); closeAppearanceDialogMenu();" style=\'float: none; display: block; margin: 10px auto;\'>OK</button>';
  }
 ?>
