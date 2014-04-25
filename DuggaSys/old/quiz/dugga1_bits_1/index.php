<?php 
header("X-UA-Compatible: IE=edge,chrome=1");
$courseName="DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)";
$courseOccasion="HT-13 LP4";
$duggaNr=1;
$ajaxPath="../../quizAjax/";
include "../dugga_checklogin.php";

//$accountname="a00nisse";
if ($accountname=checklogin($errorMsg, $courseName, $courseOccasion, $duggaNr)): 
?>
<html>
	<head>
		<meta charset="UTF-8"/>			
		<script type="text/javascript" src="../js/jquery-1.8.0.min.js"></script>
		<script lang='Javascript'>
					var account="<?php echo $accountname ?>";		
					var duggaNr="<?php echo $duggaNr ?>";		
					var courseName="<?php echo $courseName ?>";		
					var courseOccasion="<?php echo $courseOccasion ?>";	
					var quizObjectsIDs=new Array();
					var quizVariantInstructions="";
					
					$(document).ready(function() {
						fetchQuiz();
						fetchQuizObject("ObjDesc");
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
							fetchQuizObject(quizObjectsIDs[0]);
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
							quizVariantInstructions=data.objectData;
							foo();
						}
					}
		</script>
	
		<script type="text/javascript" src="dugga.js"></script>	
	
	<script lang='Javascript'>
		//Globals
		var TICKBOX_WIDTH=50;
		var TICKBOX_HEIGHT=50;
		var tickBoxes=new Array();
		
		function handler_mousedown(ev){
				if (typeof ev.targetTouches!='undefined' && ev.targetTouches.length>0) {
					var touch = ev.targetTouches[0];
					mx = touch.pageX;
					my = touch.pageY;
				} else {
					if(document.all) { // IE
						mx = ev.clientX;
						my = ev.clientY;
					} else if (ev.layerX||ev.layerX==0) { // Firefox
						mx = ev.pageX;
						my = ev.pageY;
					} else if (ev.offsetX || ev.offsetX == 0) { // Opera
						mx=ev.offsetX-acanvas.offsetLeft;
						my=ev.offsetY-acanvas.offsetTop;
					}
				}
				var pos_x_y=findPosition(acanvas);
				mx -= pos_x_y[0];
				my -= pos_x_y[1];

				for(var i=0;i<tickBoxes.length;i++){
					tickBoxes[i].checkIfClicked(mx,my);
				}
				foo();
		}
		
		function handler_mouseup(){
			
		}
		
		function handler_mousemove(cx, cy){
			
		}
		
					
		function tickBox(x, y, value)
		{
			this.x=x;
			this.y=y;
			this.width=TICKBOX_WIDTH;
			this.height=TICKBOX_HEIGHT;
			this.isTicked=false;
			this.value=value;
		}
		
		tickBox.prototype.checkIfClicked=function(mx, my)
		{
			if(mx>this.x && mx<=this.x+this.width && my>this.y && my<=this.y+this.height){
				if(this.isTicked) this.isTicked=false;
				else this.isTicked=true;
			}
		}
		
		tickBox.prototype.draw=function()
		{
			context.save();
			context.font = "22px Arial";
			context.lineWidth = 3;
			context.textAlign="center";
			context.textBaseline="middle";
			if(this.isTicked) {
				context.fillStyle = "#000000";
				context.fillRect(this.x, this.y, this.width, this.height);
				context.fillStyle = "#FFFFFF";
				context.fillText("1", this.x+this.width*0.5, this.y+this.height*0.5);	
			} else {
				context.fillStyle = "#FFFFFF";
				context.fillRect(this.x, this.y, this.width, this.height);
				context.fillStyle = "#000000";
				context.fillText("0", this.x+this.width*0.5, this.y+this.height*0.5);	
			}
			context.strokeRect(this.x, this.y, this.width, this.height);
			context.restore();
		}
		
		function findPosition(object) {
			var current_left=0;
			var current_top=0;
			do{
				current_left+=object.offsetLeft;
				current_top+=object.offsetTop;
			} while(object=object.offsetParent);
			return [current_left,current_top];
		}
		
		function foo()
		{
			acanvas.width = acanvas.width;				
			context.save();
			//draw quizVariantInstructions;
			context.fillStyle = "#000000";
			context.font = "22px Arial";
			context.lineWidth = 3;
			context.textAlign="center";
			context.textBaseline="middle";
			context.fillText(quizVariantInstructions, acanvas.width*0.5, acanvas.width/3);
			for(var i=0;i<tickBoxes.length;i++){
				tickBoxes[i].draw();
			}
			context.restore();
		}	 
		
		function submbutton()
		{
			var sum=0;
			for(var i=0;i<tickBoxes.length;i++){
				if(tickBoxes[i].isTicked) sum+=tickBoxes[i].value;
			}
			checkAnswer(sum.toString());
		}
		
		function checkAnswerCallBack(data){
			if (typeof data.Error != 'undefined') {
				$("#result").css("background-color","#ffcccc");
				$("#result").html("<p>"+data.Error+"</p>");
				if(typeof data.answerHash != 'undefined'){
					$("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
				}
			} else {
				if(data.isCorrect=="false"){
					$("#result").css("background-color","#ffcccc");
					$("#result").html("Du har tyvärr svarat fel");
				} else {
					$("#result").css("background-color","#ccffcc");
					$("#result").html("Du har svarat rätt");
					$("#result").append("<br />Din svarskod:"+data.hashedAnswer);
					$("#result").append("<br />Spara alltid din svarskod!");
					
					if(data.Success=="false"){
						$("#result").append("<br />Ett problem har uppstått, ditt svar har inte sparats. Det är mycket viktigt att du sparar din svarskod och kontaktar kursansvarige omgående.");
					} 
				}
				
			}
		}
		
		function init(){
			var xOffset=10;
			var tickBoxX=acanvas.width-TICKBOX_WIDTH*2-0.5;
			var tickBoxY=acanvas.height*0.5-TICKBOX_HEIGHT*0.5-0.5;
			
			for(var i=0;i<8;i++){
				var tickBoxValue=Math.pow(2,i);
				if(i%4==0 && i>0) tickBoxX-=TICKBOX_WIDTH;
				tickBoxes.push(new tickBox(tickBoxX, tickBoxY, tickBoxValue));
				tickBoxX-=TICKBOX_WIDTH+xOffset;
				
			}
		}
	
	</script>

	</head>
	<body onload="setupcanvas();init();">
	<div>

				<canvas id='a' width='600' height='600' style='border:2px solid black;float:left;'>
				</canvas>

				<div style="border:2px solid black;background-color:#fed;width:300;height:450;float:left;margin-left:10px;">
					<div id="infobox" style="padding:4px;">
					<div id="quizInstructions"></div>
					<div id="quizVariantInstructions"></div>
					<div id="result"></div>
					<form>
						<button type="button" onclick="submbutton();">SKICKA</button>						
					</form>		
					<div id="result"></div>
					</div>
				</div>


	</div>

	</body>
</html>

<?php 

else:
    include "../dugga_loginwindow.php";
endif;

?>

