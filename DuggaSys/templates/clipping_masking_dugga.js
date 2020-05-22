/********************************************************************************

   Documentation

*********************************************************************************

Example seed
---------------------
	 Example seed - simple
	 Param: {"target":"image_uploaded_to_course.png"}
-------------==============######## Documentation End ###########==============-------------
*/

//------------==========########### GLOBALS ###########==========------------
var score = -1;
var canvas = null;
var requiresParams = true;
var duggaParams=null;
var hasFeedback=false;
var isTeacher=false;
var feedback=null;
var hasFacit=false;
var facit=null;
var hasSavedAnswer=false;
var savedAnswer=null;
var hasUserStats=false;
var userStats=null;
var pushcount = 0;
var elapsedTime = 0;
var dataV;

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

// -----------------------------------------------------------------------------------------------
// Setup dugga. Code to execute before we have any parameters for the dugga.
// -----------------------------------------------------------------------------------------------

function setup()
{
	  inParams = parseGet();
		canvas = document.getElementById('a');
		if (canvas) {
				context = canvas.getContext("2d");
				fitToContainer();
				$( window ).resize(function() {
						fitToContainer();
						render();
				});
				context.clearRect(0, 0, canvas.width, canvas.height);

				if(requiresParams){
						AJAXService("GETPARAM", { }, "PDUGGA");
				}else{
            show();
        }
		}
}

// -----------------------------------------------------------------------------------------------
// Show dugga when we have received parameters
// -----------------------------------------------------------------------------------------------

function show(){
    // Fetch target image
    document.getElementById("target-img").src="showdoc.php?cid=" + inParams['cid'] + "&fname="+duggaParams.target;

    // Insert saved dugga answer
    document.getElementById("operationList").innerHTML="";
    if (hasSavedAnswer) {
        var previous = savedAnswer.split(',');
        previous.shift();
        previous.pop();

        for (var i = 0; i < previous.length; i++) {
            if (previous[i] !== ""){
                var newTableBody = "<tr id='v" + i +"'>";
                newTableBody += '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
                newTableBody += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+previous[i]+'</span><span id="opCode_'+i+'" style="display:none">'+previous[i]+'</span></td>';
                newTableBody += '<td><button onclick="$(this).closest(\'tr\').prev().insertAfter($(this).closest(\'tr\'));refreshOpNum();">&uarr;</button></td>';
                newTableBody += '<td><button onclick="$(this).closest(\'tr\').next().after($(this).closest(\'tr\'));refreshOpNum();">&darr;</button></td>';
                newTableBody += '<td><button onclick="$(this).closest(\'tr\').remove();refreshOpNum();">X</button></td>';
                newTableBody += "</tr>";

                $("#operationList").append(newTableBody);
            }
        }
        render();
    }

    // Display teacher feedback
		if (hasFeedback || isTeacher) {
				var fb ="";
        if(isTeacher){
            fb+="<textarea id='newFeedback'></textarea><div class='feedback-info'>* grade to save feedback.</div>"
        }
        fb+="<table class='list'><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
        if(hasFeedback){
            var feedbackArr = feedback.split("||");
            for (var k=feedbackArr.length-1;k>=0;k--){
                var fb_tmp = feedbackArr[k].split("%%");
                fb+="<tr><td style='vertical-align:top;width:40px;'>"+fb_tmp[0].slice(0,10)+"</td><td>"+fb_tmp[1]+"</td></tr>";
            }
        }
				fb += "</tbody></table>";
				document.getElementById('feedbackTable').innerHTML = fb;
				document.getElementById('feedback').style.display = "block";
		}

    if(hasFacit){

    }else{
        $("#submitButtonTable").appendTo("#content");
    		$("#lockedDuggaInfo").appendTo("#content");
    }

    if (hasUserStats){
      document.getElementById('duggaTime').innerHTML=userStats[0];
      document.getElementById('duggaTotalTime').innerHTML=userStats[1];
      document.getElementById('duggaClicks').innerHTML=userStats[2];
      document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
      $("#duggaStats").css("display","block");
    }

}

// -----------------------------------------------------------------------------------------------
// This method is the return function after the AJAXService call for dugga variant parameters
// We get data such as:
//   - specific variant parameters
//   - saved answer
//   - list of submitted files
//   - feedback
// -----------------------------------------------------------------------------------------------
function returnedDugga(data)
{
		dataV = data;
		if (data['debug'] != "NONE!") { alert(data['debug']); }
		if (data['param'] == "UNK") {
				alert("UNKNOWN DUGGA!");
		} else {
				duggaParams = jQuery.parseJSON(data['param']);
		}
    if(data["feedback"] !== null && data["feedback"] !== "" && data["feedback"] !== "UNK") {
        hasFeedback=true;
        feedback=data["feedback"];
        $("#showFeedbackButton").css("display","block");
    }
    if(data["answer"] !== null || data["answer"] !== "UNK") {
        hasSavedAnswer=true;
        savedAnswer=data['answer'];
    }
    displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
    show();
}

// -----------------------------------------------------------------------------------------------
// This method clears any input and resets the elapsed time and # steps, giving the user a new chance to reach the highscore
// -----------------------------------------------------------------------------------------------
function reset()
{
  	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");
    document.getElementById("operationList").innerHTML="";
  	Timer.stopTimer();
  	Timer.score=0;
  	Timer.startTimer();
  	ClickCounter.initialize();
}

// -----------------------------------------------------------------------------------------------
// This method submits the current answer and marks the dugga as pending grading.
// -----------------------------------------------------------------------------------------------
function saveClick()
{
  	Timer.stopTimer();

  	timeUsed = Timer.score;
  	stepsUsed = ClickCounter.score;

  	if (querystring['highscoremode'] == 1) {
  		  score = Timer.score;
  	} else if (querystring['highscoremode'] == 2) {
  		  score = ClickCounter.score;
  	}

  	// Loop through all the added operations
  	bitstr = ",";
  	$("*[id*=opCode_]").each(function (){
  			bitstr+=this.innerHTML + ",";
  	});
  	bitstr += "T " + elapsedTime;
  	bitstr += " " + window.screen.width;
  	bitstr += " " + window.screen.height;
  	bitstr += " " + $(window).width();
  	bitstr += " " + $(window).height();

  	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
  	saveDuggaResult(bitstr);
}

// -----------------------------------------------------------------------------------------------
// Prepare the dugga to show facit.
// This method is used to
//   - mark a student's submition
//   - preview a specific dugga variant
// -----------------------------------------------------------------------------------------------
function showFacit(param, uanswer, danswer, userStats_, files_, moment_, feedback_)
{
    requiresParams=false;
    if (param!==null){
        duggaParams=jQuery.parseJSON(param);
    }

    if (!(uanswer === null || uanswer === "UNK")) {
        hasSavedAnswer=true
        savedAnswer=uanswer;
    }
    
    isTeacher=true;
    if(!(feedback_ === null || feedback_ === "" || feedback_ === "UNK")) {
        hasFeedback=true;
        feedback=feedback_;
    }

    hasFacit=true;
    /*
    alert(typeof(danswer))
    if(!(danswer === null && danswer === "UNK" && danswer === "")){
        facit=jQuery.parseJSON(danswer);
    }

    if(!(userStats_===null||userStats_==="UNK")){
      hasUserStats=true;
      userStats=userStats_;
    }
*/
		setup();
}

function closeFacit()
{
}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------
//------------==========########### CONTROLLER FUNCTIONS ###########==========------------

function fitToContainer()
{
	divw = $("#content").width();
	if (divw > 500){ divw -= 248; }
	if (divw < window.innerHeight) {
      canvas.width = divw;
  		canvas.height = divw;
	} else {
      canvas.width = window.innerHeight - 180;
  		canvas.height = canvas.width;
	}

	document.getElementById("opTableContainer").style.maxHeight=(canvas.height-25-38)+"px";
}


function toggleSelectOperation(e){
		if ($(e).closest("tr").hasClass("selectedOp")){
				$(e).closest("tr").removeClass("selectedOp");
				document.getElementById("addOpButton").value = "Add Op.";
				$("#operationList").find("tr:odd").css('background-color', '#dad8db');
		} else {
				$(e).closest("tr").addClass("selectedOp");
				document.getElementById("addOpButton").value = "Change Op.";
				// Unselect any previous selected row
				$("#operationList").find("tr").each(function (){
						if (this.id != $(e).closest("tr").attr('id')) $(this).removeClass("selectedOp");
				});
		}
}



function refreshOpNum(){
	var idx = 1;
	$("*[id^=opNum]").each(function (){
			this.innerHTML = idx++;
	});
	$("#operationList").find("tr:odd").css('background-color', '#dad8db');
	$("#operationList").find("tr:even").css('background-color', '#ffffff');
  render();
}

//----------------------------------------------------------------------------------
// High score function, gets called from hideDuggainfoPopup function in dugga.js
// dataV = global variable with the data set in returnedDugga
//----------------------------------------------------------------------------------

function startDuggaHighScore(){
	Timer.startTimer();
	ClickCounter.initialize();

	if(querystring['highscoremode'] == 1) {
		if(dataV['score'] > 0){
			Timer.score = dataV['score'];
		}
		Timer.showTimer();
	} else if (querystring['highscoremode'] == 2) {
		if(dataV['score'] > 0){
			ClickCounter.score = dataV['score'];
		}
		ClickCounter.showClicker();
	}
}

function newbutton()
{
	//ClickCounter.onClick();
	var newOp = $('#ops > optgroup > option:selected').text();
	var newOpCode = $("#ops").val();

	if($("#operationList").find("tr").hasClass("selectedOp")){
			$(".selectedOp").each(function(){
				$(this).find("*[id^=op_]").html(newOp);
				$(this).find("*[id^=opCode_]").html(newOpCode);
				toggleSelectOperation(this);
			});
      render();
	} else {
		var i = 0;
		$('#operationList tr').each(function (){
				var tmp = this.id.replace("v","");
				if (tmp > i) i=tmp;
		});
		i++;
		var newTableBody = "<tr id='v" + i +"'>";
		newTableBody += '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
		newTableBody += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+newOp+'</span><span id="opCode_'+i+'" style="display:none">'+newOpCode+'</span></td>';
		newTableBody += '<td><button onclick="$(this).closest(\'tr\').prev().insertAfter($(this).closest(\'tr\'));refreshOpNum();">&uarr;</button></td>';
		newTableBody += '<td><button onclick="$(this).closest(\'tr\').next().after($(this).closest(\'tr\'));refreshOpNum();">&darr;</button></td>';
		newTableBody += '<td><button onclick="$(this).closest(\'tr\').remove();refreshOpNum();">X</button></td>';
		newTableBody += "</tr>";

		$("#operationList").append(newTableBody);
		refreshOpNum();
	}
}

function goMofo(txt)
{
    if(txt=="Polka"){
        drawPolka("#f36","#efe");
    }else if(txt=="Dots"){
        drawDotted("#6af","#ffe");
    }else if(txt=="Stars"){
        drawStars("#6af","#ffe");
    }else if(txt=="Gradient"){
        drawGradient("#f36","#3f6");
    }else if(txt=="Crosses"){
        drawCrosses("#6af","#ffe");
    }else if(txt=="White"){
        drawSolid("#FFF");
    }else if(txt=="Pink"){
        drawSolid("#FFB6C1");
    }else if(txt=="Brown"){
        drawSolid("#D2691E");
    }else if(txt=="Green"){
        drawSolid("#8f3");
    }else if(txt=="Rect1"){
        clipRect(50,50,100,100);
    }else if(txt=="Rect2"){
        clipRect(25,50,100,200);
    }else if(txt=="Rect3"){
        clipRect(250,400,350,700);
    }else if(txt=="Heart"){
        clipHeart();
    }else if(txt=="Diamond"){
        clipDiamond();
    }else if(txt=="CapsuleH"){
        clipCapsuleH();
    }else if(txt=="CapsuleV"){
        clipCapsuleV();
    }else if(txt=="Cross"){
        clipCross();
    }else if(txt=="Restore"){
        restore();
    }
}

    function drawSymbol(x1,y1,x2,y2)
    {
        var hy=(y2-y1)*0.5;
        var hx=(x2-x1)*0.5;

        context.beginPath();

        context.moveTo(x1,y1+hy);
        context.lineTo(x1+hx,y1);
        context.lineTo(x2,y1+hy);
        context.lineTo(x1+hx,y2);
        context.closePath();

        context.clip();

    }

    function drawPolka(col1,col2)
    {
        context.fillStyle=col1;
        for(i=-5;i<12;i+=3){
            context.beginPath();
            context.moveTo(i*50,0);
            context.lineTo((i+1)*50,0);
            context.lineTo((i+8)*50,700);
            context.lineTo((i+7)*50,700);
            context.closePath();
            context.fill();
        }
    }

    function drawDotted(col1,col2)
    {
        context.fillStyle=col1;
        for(var i=-1;i<12;i++){
            for(var j=-1;j<12;j++){
                context.beginPath();
                context.arc(i*75, j*100, 20, 0, 2 * Math.PI, false);
                context.fill();

                context.beginPath();
                context.arc((i*75)-25, (j*100)+50, 20, 0, 2 * Math.PI, false);
                context.fill();
            }
        }
    }

    function drawStars(col1,col2)
    {
        context.fillStyle=col1;
        for(var i=-1;i<12;i++){
            for(var j=-1;j<12;j++){
                drawStar(i*75,j*100,10,25,10,col1);
                drawStar((i*75)-25,(j*100)+50,10,25,10,col1);
            }
        }
    }

    function drawCrosses(col1,col2)
    {
        context.fillStyle=col1;
        for(var i=-1;i<12;i++){
            for(var j=-1;j<12;j++){
                drawCross(i*75,j*100,12,10,25,col1);
                drawCross((i*75)-25,(j*100)+50,12,10,25,col1);
            }
        }
    }

    function drawSolid(col1)
    {
        context.fillStyle=col1;
        context.fillRect(0,0,600,700);
    }

    function drawNgon(xk,yk,edges,radius,col1)
    {
        var ang=(2.0*Math.PI/edges);
        var v=0;

        context.fillStyle=col1;
        context.moveTo(xk+(Math.sin(v)*radius),yk+(Math.cos(v)*radius));
        for(var i=1;i<edges;i++){
            v+=ang;
            context.lineTo(xk+(Math.sin(v)*radius),yk+(Math.cos(v)*radius));
        }
        context.fill();
    }

    function drawCross(xk,yk,edges,radius1,radius2,col1)
    {

        var ang=(2.0*Math.PI/edges);
        var v=0;

        context.fillStyle=col1;
        context.beginPath();
        context.moveTo(xk+(Math.sin(v)*radius1),yk+(Math.cos(v)*radius1));
        for(i=1;i<edges;i++){
            v+=ang;
            if((i%3)==0){
                r=radius1;
            }else{
                r=radius2;
            }
            context.lineTo(xk+(Math.sin(v)*r),yk+(Math.cos(v)*r));
        }
        context.fill();
    }

    function drawStar(xk,yk,edges,radius1,radius2,col1)
    {

        var ang=(2.0*Math.PI/edges);
        var v=0;

        context.fillStyle=col1;
        context.beginPath();
        context.moveTo(xk+(Math.sin(v)*radius1),yk+(Math.cos(v)*radius1));
        for(i=1;i<edges;i++){
            v+=ang;
            if((i%2)==0){
                r=radius1;
            }else{
                r=radius2;
            }
            context.lineTo(xk+(Math.sin(v)*r),yk+(Math.cos(v)*r));
        }
        context.fill();
    }

    function drawGradient(col1,col2)
    {

        var grd=context.createLinearGradient(0,0,0,700);
        grd.addColorStop(0,col1);
        grd.addColorStop(1,col2);

        context.fillStyle=grd;
        context.fillRect(0,0,600,700);

    }

    function clipRect(x1,y1,x2,y2)
    {
        context.save();

        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y1);
        context.lineTo(x2,y2);
        context.lineTo(x1,y2);
        context.closePath();

        context.clip();
    }

    function clipHeart()
    {
        context.save();

        context.beginPath();
        context.moveTo(295,500);
        context.bezierCurveTo(295,500,4,294,0,175);
        context.bezierCurveTo(-6,-30,294,-44,295,97);
        context.lineTo(295,97);
        context.bezierCurveTo(295,-44,596,-31,590,174);
        context.bezierCurveTo(586,293,296,499,296,499);
        context.lineTo(295,500);
        context.lineTo(295,500);
        context.globalAlpha = 1.0;
        context.clip();
    }

    function clipDiamond()
    {
        context.save();

        context.beginPath();
        context.moveTo(535,249);
        context.lineTo(298, 486);
        context.lineTo(60, 249);
        context.lineTo(298, 12);
        context.lineTo(535,249);
        context.clip();
    }

    function clipCapsuleV()
    {
        context.save();

        context.beginPath();
        context.moveTo(216,245);
        context.lineTo(217,577);
        context.bezierCurveTo(217,619,251,653,293,653);
        context.bezierCurveTo(335,653,369,619,369,577);
        context.lineTo(369,577);
        context.lineTo(369,245);
        context.bezierCurveTo(369,203,335,169,293,169);
        context.bezierCurveTo(251,169,217,203,217,245);
        context.lineTo(216,245);

        context.clip();
    }

    function clipCapsuleH()
    {
        context.save();

        context.beginPath();
        context.moveTo(472,329);
        context.lineTo(114,329);
        context.bezierCurveTo(68,329,32,366,32,411);
        context.bezierCurveTo(32,456,68,493,114,493);
        context.lineTo(114,494);
        context.lineTo(472,493);
        context.bezierCurveTo(517,493,554,456,554,411);
        context.bezierCurveTo(554,366,517,329,472,329);
        context.lineTo(472,329);
        context.lineTo(472,329);

        context.clip();
    }

    function clipCross()
    {
        context.save();

        context.beginPath();
        context.moveTo(478,320);
        context.lineTo(409,252);
        context.lineTo(478,184);
        context.lineTo(477,183);
        context.bezierCurveTo(509,151,509,99,477,67);
        context.bezierCurveTo(445,35,393,35,361,67);
        context.lineTo(361,67);
        context.lineTo(293,135);
        context.lineTo(224,67);
        context.lineTo(224,67);
        context.bezierCurveTo(192,35,140,35,108,67);
        context.bezierCurveTo(76,99,76,151,108,183);
        context.lineTo(108,184);
        context.lineTo(176,252);
        context.lineTo(108,320);
        context.lineTo(108,320);
        context.bezierCurveTo(76,352,76,404,108,436);
        context.bezierCurveTo(140,468,192,468,224,436);
        context.lineTo(225,437);
        context.lineTo(293,369);
        context.lineTo(361,437);
        context.lineTo(361,436);
        context.bezierCurveTo(393,468,445,468,477,436);
        context.bezierCurveTo(509,404,509,353,477,320);
        context.lineTo(478,320);
        context.lineTo(478,320);
        context.clip();
    }

    function restore()
    {
        context.restore();
    }
    function render(){
        canvas.width = canvas.width;
        context.scale(canvas.width/600,canvas.height/700);
        $("*[id*=opCode_]").each(function (){
            goMofo(this.innerHTML);
        });
    }

    function toggleFeedback()
{
    $(".feedback-content").slideToggle("slow");
}
function toggleInstructions()
{
    $(".instructions-content").slideToggle("slow");
}