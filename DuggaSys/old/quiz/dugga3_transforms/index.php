<?php 
header("X-UA-Compatible: IE=edge,chrome=1");
$courseName="DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)";
$courseOccasion="HT-13 LP4";
$ajaxPath="../../quizAjax/";

$subtaskDuggaNumbers = array(7,8);
$subtask = $_GET["subtask"];
$duggaNr=$subtaskDuggaNumbers[$subtask-1]; // Subtasks start at 1.

//$_POST['answerString']="T5,RP,D1,RN2,T4,S2,D2";
//$_POST['answerString']="PUSH,RN2,T4,RN3,S3,D2,PUSH,RN,T2,S1,D3,POP,RN,T3,S3,RP,D1,POP,RP,T7,S4,RP3,D2,RP2,T2,S2,D3";
if(isset($_GET['answerString'])) $answerString=$_GET['answerString'];
if(isset($_GET['courseOccasion'])) $courseOccasion=$_GET['courseOccasion'];
//$answerString="kkPUSH,RN2,T4,RN3,S3,D2,PUSH,RN,T2,S1,D3,POP,RN,T3,S3,RP,D1,POP,RP,T7,S4,RP3,D2,RP2,T2,S2,D3";

include "../dugga_checklogin.php";
if ($accountname=checklogin($errorMsg, $courseName, $courseOccasion, $duggaNr)): 
?>
<html>
	<head>
		<meta charset="UTF-8"/>	
		<style>
			p, a, h1, h2, h3, h4, h5, table, td, th, label, caption{font-family:Helvetica, Arial, sans-serif;}
		</style>
		<script type="text/javascript" src="../js/jquery-1.8.0.min.js"></script>
		<script type="text/javascript" src="dugga.js"></script>
		<script lang='Javascript'>
					var account="<?php echo $accountname ?>";		
					var duggaNr="<?php echo $duggaNr ?>";		
					var courseName="<?php echo $courseName ?>";		
					var courseOccasion="<?php echo $courseOccasion ?>";	
					var quizObjectsIDs=new Array();
					var templateURI="";
					
					var startString="<?php if(isset($answerString)) echo $answerString ?>";
					
					var operationsList=new Array();
					
					$(document).ready(function() {
						
						fetchQuiz();
						
					});
					
					function fetchQuiz(){
						$.post("<?php echo $ajaxPath?>getQuiz.php", 
							   {loginName: account, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr }, 
								fetchQuizCallBack,
								"json"
						);
					}
					
					function fetchQuizCallBack(data){
						if (typeof data.Error != 'undefined') {
							$("#result").html("<p>"+data.Error+"</p>");
							if(typeof data.answerHash != 'undefined'){
								$("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
							}
						} else {
							$("#quizInstructions").append(data.quizData);
							quizObjectsIDs=data.quizObjectIDs.split(" ");
							if(data.storedAnswer!=null && startString=="") startString=data.storedAnswer;
							fetchQuizObject("template"); // Get template background image for this quiz variant.
						}
					}
					
					function checkAnswer(submitstr){
						$.post("<?php echo $ajaxPath?>answerQuiz.php", 
							{loginName: account, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr, quizAnswer: submitstr}, 
							checkAnswerCallBack,
							"json"
						);
					}
								
					function fetchQuizObject(objectName){
						$.post("<?php echo $ajaxPath?>getQuizObject.php", 
							   {objectID: objectName, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr, loginName: account}, 
								fetchQuizObjectCallBack,
								"json"
						);
					}

					function fetchQuizObjectCallBack(data){
						if (typeof data.Error != 'undefined') {
							$("#result").append("<br/><h3>Error:"+data.Error+"</h3>");
						} else {
							templateURI=data.objectData;  // Name of template background image for this quiz variant.
							setupcanvas();
							acanvas.style.backgroundImage="url('uppg<?echo $subtask?>/"+templateURI+"')";
							console.log("url('uppg<?echo $subtask?>/"+templateURI+"')");
							acanvas.style.backgroundSize="600px";
							// Event listeners commented out since they are already added by setupcanvas() - Daniel S
							// acanvas.addEventListener('mousemove', ev_mousemove, false);
							// acanvas.addEventListener('mouseup', ev_mouseup, false);
							// acanvas.addEventListener('mousedown', ev_mousedown, false);
							if(startString!="") {
								operationsList = startString.split(',');
								populateOperationsList();
							}
							setTimeout("foo();",100);
							
							//init();
						}
					}
		</script>

	</head>
	<body>

		<div>

				<canvas id='a' width='600' height='600' style='border:2px solid black;float:left;' >
				</canvas>


				<div style="border:2px solid black;background-color:#fed;width:300;min-height:450;float:left;margin-left:10px;overflow:auto;">
					<div id="infobox" style="padding:4px;">
					<div id="quizInstructions"></div>
					
					<p id="speed">Speed: 0</p>

					<form>
					
					Function: 
					<select id="function" name="function" >

							<option value="T1">Translate 1</option>
							<option value="T2">Translate 2</option>
							<option value="T3">Translate 3</option>
							<option value="T4">Translate 4</option>
							<option value="T5">Translate 5</option>
							<option value="T6">Translate 6</option>
							<option value="T7">Translate 7</option>
							<option value="T8">Translate 8</option>
							<option value="R+0.2">Rotate +0.2</option>
							<option value="R+0.3">Rotate +0.3</option>
							<option value="R+1">Rotate +1</option>
							<option value="R+2">Rotate +2</option>
							<option value="R+3">Rotate +3</option>
							<option value="R-0.2">Rotate -0.2</option>
							<option value="R-0.3">Rotate -0.3</option>
							<option value="R-1">Rotate -1</option>
							<option value="R-2">Rotate -2</option>
							<option value="R-3">Rotate -3</option>
							<option value="S0.3">Scale 0.3</option>
							<option value="S0.4">Scale 0.4</option>
							<option value="S0.6">Scale 0.6</option>
							<option value="S0.8">Scale 0.8</option>
							<option value="S1.2">Scale 1.2</option>
							<option value="D1">Draw R</option>
							<option value="D2">Draw G</option>
							<option value="D3">Draw B</option>
							<option value="PUSH">Push (remember state)</option>
							<option value="POP">Pop (jump back)</option>

					</select>			
					<button type="button" onclick="newbutton();">NEW</button>
					
					<br>Operations:<br> 
					<select style="width:185px;float:left;" size="20" id="operations" name="operations">
					</select>			
					<div style="border:1px solid #000;margin:5px;padding:5px;float:left;width:75px;">
						<label><strong>Template</strong></label><br />
						<label>show
						<input type="radio" name="displayTemplate" id="showTemplateRadio" checked="checked" onclick="toggleTemplate();" />
						<br/>
						</label>
						<label>hide
						<input type="radio" name="displayTemplate" id="hideTemplateRadio" onclick="toggleTemplate();" />
						</label>
					</div>
					<br/>

					<button type="button" onclick="moveupbutton();">MOVE UP</button>
					<button type="button" onclick="movedownbutton();">MOVE DOWN</button>
					<button type="button" onclick="deletebutton();">DELETE</button><br>
					<br />
					<br />
					<br />
					<button type="button" onclick="submbutton();">SEND</button>
					<br>
							
					</form>		
					<div id="result"></div>
					</div>
					</div>
				</div>

	</div>	
	
	
	<script lang='Javascript'>
		
		function populateOperationsList()
		{

//			var operationsList=startString.split(',');
			
			var functionList=document.getElementById("function");
			
			var opList=document.getElementById("operations");

			var selected_index = opList.selectedIndex;
			opList.innerHTML = "";
			
			var push_level = 0;
			for(var i=0;i<operationsList.length;i++){

				var translate_old_operation_codes = true;
				if (translate_old_operation_codes) {
					var o = operationsList[i];
					if (o==="RP") operationsList[i] = "R+1";
					if (o==="RP2") operationsList[i] = "R+2";
					if (o==="RP3") operationsList[i] = "R+3";
					if (o==="RN") operationsList[i] = "R-1";
					if (o==="RN2") operationsList[i] = "R-2";
					if (o==="RN3") operationsList[i] = "R-3";
					if (o==="S1") operationsList[i] = "S0.3";
					if (o==="S2") operationsList[i] = "S0.4";
					if (o==="S3") operationsList[i] = "S0.6";
					if (o==="S4") operationsList[i] = "S0.8";
					if (o==="S5") operationsList[i] = "S1.2";
				}

				var text="";
				for(var j=0;j<functionList.options.length;j++){
					if(operationsList[i]==functionList.options[j].value) text=functionList.options[j].innerHTML;
				}
				for (var l=0;l<push_level;l++) {
					text = "-  " + text;
				}

				opList.innerHTML+="<option value='"+operationsList[i]+"'>"+text+"</option>";

				if (operationsList[i] === "PUSH") {
					push_level++;
				}
				if (operationsList[i] === "POP") {
					push_level--;
				}
			}
			opList.selectedIndex = selected_index;
		}
	
	// User Interface Variables
		var mx=100,my=100,clickstate=0;
		
		// Application state variables
		var v=0,speed=0;
		
		var MAX_SPEED = 0.1;
		
		// Handlers for clicks -- works equally on touch and keyboard+mouse devices
		function handler_mouseup()
		{
				if(clickstate==0){
						clickstate=1
						speed = MAX_SPEED;
				}else if(clickstate==1){
						clickstate=2
//						v=0;
						speed = MAX_SPEED*0.25;
				}else{
						clickstate=0;
						v=0;
						speed = 0;
				}
		}

		function handler_mousedown()
		{
		}
		
		function handler_mousewheel(delta)
		{	
			delta /= Math.abs(delta);
			speed += delta*0.005;
			speed = Math.max( 0, Math.min( speed, MAX_SPEED ) );
		}
		
		function handler_mousemove(cx,cy)
		{
		
		}		
		
		function newbutton()
		{
	
			var funclist=document.getElementById('function');
				
			var elSel = document.getElementById('operations');
			operationsList.splice(elSel.selectedIndex,0,funclist.options[funclist.selectedIndex].value);
				
			populateOperationsList();
		}
		
		function deletebutton()
		{
			var elSel = document.getElementById('operations');

			operationsList.splice(elSel.selectedIndex,1);
			
			populateOperationsList();
		}
		
		function moveupbutton()
		{
				var elSel = document.getElementById('operations');

				if(elSel.selectedIndex>0)
				{
						var tmp = operationsList[elSel.selectedIndex];
						operationsList[elSel.selectedIndex] = operationsList[elSel.selectedIndex-1];
						operationsList[elSel.selectedIndex-1] = tmp;
						elSel.selectedIndex--;
						populateOperationsList();
				}
		}

		function movedownbutton()
		{
				var elSel = document.getElementById('operations');

				if(elSel.selectedIndex<elSel.length-1)
				{
					var tmp = operationsList[elSel.selectedIndex];
					operationsList[elSel.selectedIndex] = operationsList[elSel.selectedIndex+1];
					operationsList[elSel.selectedIndex+1] = tmp;
					elSel.selectedIndex++;
					populateOperationsList();
				}
		}

			
		function foo()
		{
			acanvas.width = acanvas.width;				
			
			v+=speed;

			document.getElementById("speed").innerHTML = "Speed: " + Math.round(100 * (speed/MAX_SPEED)) + "%";
			
			context.translate(300,300);
			context.save(); 
							
			var elSel = document.getElementById('operations');
  			var i=0;
  			
  			var pushcount=0;
  			
  			for (i=0;i<=elSel.length-1;i++) {
						if(elSel.options[i].value=="T1"){
									context.translate(35,0);
						}if(elSel.options[i].value=="T2"){
									context.translate(55,0);
						}if(elSel.options[i].value=="T3"){
									context.translate(90,0);
						}if(elSel.options[i].value=="T4"){
									context.translate(120,0);
						}if(elSel.options[i].value=="T5"){
									context.translate(160,0);
						}if(elSel.options[i].value=="T6"){
									context.translate(200,0);
						}if(elSel.options[i].value=="T7"){
									context.translate(240,0);
						}if(elSel.options[i].value=="T8"){
									context.translate(280,0);
						}

						// Rotation operations - "R" + signed amount
						if(elSel.options[i].value[0]=="R"){
							var rotation_factor = parseFloat(elSel.options[i].value.substr(1));
							context.rotate(v*rotation_factor); // Apply
						}

						// Scaling operations - "S" + signed amount
						if(elSel.options[i].value[0]=="S"){
							var scale_factor = parseFloat(elSel.options[i].value.substr(1));
							context.scale(scale_factor,scale_factor); // Apply
						}
						
						if(elSel.options[i].value=="D1"){
								drawball(0,0,30,20,10,"#f84",45.0,22.5);
//		function drawball(cx,cy,radie,innerradie,ballradie,col1,inangle,inangleadd)
						}if(elSel.options[i].value=="D2"){
								drawball(0,0,30,20,10,"#4f8",45.0,22.5);
						}if(elSel.options[i].value=="D3"){
								drawball(0,0,30,20,10,"#84f",45.0,22.5);
						}if(elSel.options[i].value=="PUSH"){
								// Must count saves
								context.save();
								pushcount++;
						}if(elSel.options[i].value=="POP"){
								if(pushcount>0){
										context.restore();
								}
						}
  			}

				// Restore equal amount of times
				for(i=0;i<pushcount;i++){
						context.restore();
				}
  			
				context.restore();
				context.globalAlpha = 0.5				
				context.rotate(-v*0.6);								
				drawsun();

				setTimeout("foo();",50);
				
	  }
	  
		
		function makeString(){
			var s="";
			var elSel = document.getElementById('operations');
				oplist=new Array();
				for(var i=0;i<elSel.length;i++){
					s+=elSel.options[i].value;
					if(i!=elSel.length-1) s+=",";
				}
			return s;
		}
		
		function submbutton()
		{
			checkAnswer(makeString());
		}
		
		function checkAnswerCallBack(data){
			if (typeof data.Error != 'undefined') {
				$("#result").css("background-color","#ffcccc");
				$("#result").html("<p>"+data.Error+"</p>");
				if(typeof data.answerHash != 'undefined'){
					$("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
				}
			} else {
				/*if(data.isCorrect=="false"){
					$("#result").css("background-color","#ffcccc");
					$("#result").html("Du har tyvärr svarat fel");
				} else {
					$("#result").css("background-color","#ccffcc");
					$("#result").html("Du har svarat rätt");
					$("#result").append("<br />Din svarskod:"+data.hashedAnswer);
					$("#result").append("<br />Spara alltid din svarskod!");
				*/	
					if(data.Success=="false"){
						$("#result").css("background-color","#ffcccc");
						$("#result").append("<br />Ett problem har uppstått, ditt svar har inte sparats. Det är mycket viktigt att du sparar din svarskod och kontaktar kursansvarige omgående.");
						$("#result").append("<br />Din svarskod:"+data.hashedAnswer);
					} else {
						$("#result").css("background-color","#ccffcc");
						$("#result").html("Your answer has been stored.");
						$("#result").append("<br />Answer receipt:"+data.hashedAnswer);
						$("#result").append("<br />");
					}
				//}
				
			}
		}			
	
		function toggleTemplate(){
			if(document.getElementById("showTemplateRadio").checked){
				acanvas.style.backgroundImage="url('"+templateURI+"')";
			} else {
					acanvas.style.backgroundImage="";
			}
		}
	</script>
	
	</body>
</html>

<?php 

else:
    include "../dugga_loginwindow.php";
endif;

?>

