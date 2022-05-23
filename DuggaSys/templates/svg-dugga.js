/********************************************************************************

   Documentation 

*********************************************************************************
Many things are placeholders or missing as of now since i am not exactly sure which functions are needed and which are not.


Example seed
---------------------

	 Example seed
	 Param: {""} - placeholder 
	 Answer: {"1894 52432 3028 |#=#|<svg viewBox="0 0 225 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">\n   <rect x="0" y="0" width="225" height="150" fill="blue" />   \n<line x1="0" y1="75" x2="225" y2="75" stroke="yellow" stroke-width="15" />   \n<rect x="70" y="0" width="15" height="150" fill="yellow" />\n</svg> |#=#|Swe"}
-------------==============######## Documentation End ###########==============-------------
*/

//------------==========########### GLOBALS ###########==========------------

var retdata = null;
var dataV;

var current=0;
var hash;
//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup() 
{
	AJAXService("GETPARAM", { }, "PDUGGA");
}

//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data) 
{
    dataV = data;
	
	if(data['debug'] != "NONE!") { alert(data['debug']); }

	if(data['opt']=="SAVDU"){
		$('#submission-receipt').html(`${data['duggaTitle']}\n\nDirect link (to be submitted in canvas)\n${data['link']}\n\nHash\n${data['hash']}\n\nHash password\n${data['hashpwd']}`);
		showReceiptPopup();
	}


	if(data['param'] == "UNK"){
		alert("UNKNOWN DUGGA!");
	} else{
        retdata = jQuery.parseJSON(data['param']);
        if (data["answer"] !== null && data["answer"] !== "UNK") {
          var str = data['answer'];
          str = str.replace(/\&amp\;/g, '&');
          str = str.replace(/\&lt\;/g, '<');
          str = str.replace(/\&gt\;/g, '>');
          str = str.replace(/\&ouml\;/g, 'ö');
          str = str.replace(/\&Ouml\;/g, 'Ö');
          str = str.replace(/\&auml\;/g, 'ä');
          str = str.replace(/\&Auml\;/g, 'Ä');
          str = str.replace(/\&aring\;/g, 'å');
          str = str.replace(/\&Aring\;/g, 'Å');
          str = str.replace(/\&quot\;/g, '"');
          str = str.replace(/\&#47\;/g, '/');
          str = str.replace(/\&#92\;/g, '\\');
          str = str.replace(/\&#63\;/g, '?');
          str = str.replace(/\\n/g, '\n');
          var editorData = str.split("|#=#|");
          //console.log(str); 

          //adds the submission to the dropdown menu
          svgdata.push({name:editorData[3], kind:1, content:editorData[1], style:editorData[2]});
          current = svgdata.length-1;
        }
        
    }
    // Teacher feedback
	if (data["feedback"] == null || data["feedback"] === "" || data["feedback"] === "UNK") {
        // No feedback
    } else {
        var fb = "<table class='list feedback-list'><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
        var feedbackArr = data["feedback"].split("||");
        for (var k=feedbackArr.length-1;k>=0;k--){
            var fb_tmp = feedbackArr[k].split("%%");
            fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
        } 		
        fb += "</tbody></table>";
        document.getElementById('feedbackTable').innerHTML = fb;		
        document.getElementById('feedbackBox').style.display = "block";
        $("#showFeedbackButton").css("display","block");
    }
    $("#submitButtonTable").appendTo("#content");
    $("#lockedDuggaInfo").appendTo("#content");
    displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);
    hash = data["hash"];
    svgSetup();
}


//----------------------------------------------------------------------------------
// saveClick: Save the dugga and get a receipt
//----------------------------------------------------------------------------------
function saveClick() {
  $.ajax({									//Ajax call to see if the new hash have a match with any hash in the database.
    url: "showDuggaservice.php",
    type: "POST",
    data: "&hash=" + hash, 					//This ajax call is only to refresh the userAnswer database query.
    dataType: "json",
    success: function (data) {
      ishashindb = data['ishashindb'];	//Ajax call return - ishashindb == true: not unique hash, ishashindb == false: unique hash.
      if (ishashindb == true && blockhashgen == true || ishashindb == true && blockhashgen == false && ishashinurl == true || ishashindb == true && locallystoredhash != "null") {				//If the hash already exist in database.
        if (confirm("You already have a saved version!")) {
          Timer.stopTimer();

          timeUsed = Timer.score;
          stepsUsed = ClickCounter.score;

          if (querystring['highscoremode'] == 1) {
            score = Timer.score;
          } else if (querystring['highscoremode'] == 2) {
            score = ClickCounter.score;
          }

          // Loop through all bits
          bitstr = "";

          //|#=#| is used to split the string later since space doesn't work for this case
          bitstr += "|#=#|" + document.getElementById("svg-editor").value;
          bitstr += "|#=#|" + document.getElementById("svg-styleed").value;
          bitstr += "|#=#|" + hash;
          // Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
          saveDuggaResult(bitstr);
        }
      } else {
        Timer.stopTimer();

        timeUsed = Timer.score;
        stepsUsed = ClickCounter.score;

        if (querystring['highscoremode'] == 1) {
          score = Timer.score;
        } else if (querystring['highscoremode'] == 2) {
          score = ClickCounter.score;
        }

        // Loop through all bits
        bitstr = "";

        //|#=#| is used to split the string later since space doesn't work for this case
        bitstr += "|#=#|" + document.getElementById("svg-editor").value;
        bitstr += "|#=#|" + document.getElementById("svg-styleed").value;
        bitstr += "|#=#|" + hash;

        // Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
        saveDuggaResult(bitstr);

      }
    }
  });
}

function reset()
{
	if(confirm("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.")){
		Timer.stopTimer();
		Timer.score=0;
		Timer.startTimer();
		ClickCounter.initialize();
		svgSetup();
    } else {
        
    } 

}
//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------

function instantiate() {
    document.getElementById("svg-content").innerHTML = svgdata[current].content;
    document.getElementById("svg-editor").value = svgdata[current].content;

    // CSS Editing Kind!
    if (svgdata[current].kind == 1) {
        document.getElementById("svg-styleed").value = svgdata[current].style;
        document.getElementById("animStyle").innerHTML = svgdata[current].style;
    } else {
        document.getElementById("svg-styleed").value = "No CSS used in this example document";
    }
}

function svgSetup() {
    // Make dropdown
    var str = "";
    for (var i = 0; i < svgdata.length; i++) {
        str += `<option value='${i}'>${svgdata[i].name}</option>`;
    }
    document.getElementById("filename").innerHTML = str;
    document.getElementById("filename").value = current;
    instantiate();
}

// Text area content processing
function processContent() {
    document.getElementById("svg-content").innerHTML = document.getElementById("svg-editor").value;
    ClickCounter.onClick();
}

// Style area content processing
function processStyleContent() {
    document.getElementById("animStyle").innerHTML = document.getElementById("svg-styleed").value;
    ClickCounter.onClick();
}

function selectFile() {
    current = document.getElementById("filename").value;
    instantiate();
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

function uploadFile(){
  saveClick();
}

//--------------------================############================--------------------
//                                      svgdata 
//--------------------================############================--------------------
var svgdata=[
    {
      name:"SVG View Box",
      kind:0,
      content:`
   <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
      <line x1="0" y1="80" x2="100" y2="20" stroke="black" stroke-width="3" />
      <circle cx="100" cy="100" r="50" fill="green" />
      <rect x="100" y="100" width="90" height="60" fill="orange" />
  </svg> 
  `,
  },  
    {
      name:"SVG Primitives",
      kind:0,
      content:`
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
      <line x1="0" y1="80" x2="100" y2="20" stroke="black" stroke-width="3" />
      <circle cx="100" cy="100" r="50" fill="green" />
      <polygon points="20,20 180,50 100,200" stroke="red" fill="none" stroke-width="1" />
      <text x="100" y="100" font-size="30" text-anchor="middle" fill="white">SVG</text>
  </svg> 
  `,
  },
  {
    name:"SVG Interface",
    kind:0,
    content:`
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
    <line x1="0" y1="80" x2="100" y2="20" stroke="black" />
    <g onclick="alert('Hello 1!')">
        <rect x="0" y="100" width="75" height="40" rx="5" fill="orange" />
        <text x="35" y="124" font-size="15" text-anchor="middle" fill="white">Knapp!</text>
    </g>
    <g onclick="alert('Hello 2!')">
        <rect x="120" y="155" width="75" height="40" rx="5" fill="orange" />
        <text x="158" y="180" font-size="15" text-anchor="middle" fill="white">Knapp!</text>
    </g>
    <path d="M27.73,22.59L42.11,8.21c1.42-1.42,1.42-3.72,0-5.14c-1.42-1.42-3.72-1.42-5.14,0L22.59,17.45L8.21,3.07
      c-1.42-1.42-3.72-1.42-5.14,0c-1.42,1.42-1.42,3.72,0,5.14l14.38,14.38L3.07,36.97c-1.42,1.42-1.42,3.72,0,5.14
      c0.71,0.71,1.64,1.07,2.57,1.07c0.93,0,1.86-0.35,2.57-1.07l14.38-14.38l14.38,14.38c0.71,0.71,1.64,1.07,2.57,1.07
      c0.93,0,1.86-0.36,2.57-1.07c1.42-1.42,1.42-3.72,0-5.14L27.73,22.59z" onclick="alert('Close!')" />
  </svg> 
  `,
  }, 
  {
      name:"SVG Properties",
      kind:0,
      content:`
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
      <defs>      
        <linearGradient id="Gradient1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="red"/>
          <stop offset="50%" stop-color="black" />
          <stop offset="60%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect id="r1" x="20" y="20" width="160" height="160" stroke="#000000" fill="url(#Gradient1)" />
      <circle cx="100" cy="100" r="50" fill="url(#Gradient1)" stroke="green" stroke-width="4" stroke-width="3.0" />
    </svg> 
    `
    },
    {
      name:"Svg Transformations Origo",
      kind:1,
      content:`
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
      <line x1="-20" y1="-20" x2="20" y2="20" stroke="black" stroke-dasharray="1" />
      <line x1="20" y1="-20" x2="-20" y2="20" stroke="black" stroke-dasharray="1" />  
      <line x1="0" y1="80" x2="100" y2="20" stroke="red" />
      <circle cx="100" cy="100" r="50" fill="green" />
      <polygon id="tri" points="20,20 180,50 100,200" stroke="red" fill="none" />
      <text x="100" y="100" font-size="30" text-anchor="middle" fill="white">SVG</text>
    </svg> 
    `,
    style:`
    @keyframes snurr { 
      0%{ 
          transform: rotate(0deg); 
      } 
      100%{ 
          transform: rotate(360deg); 
      }
  }
  #tri{                
      animation-name: snurr;
      animation-duration: 4000ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
  }
    `
    },  
    {
      name:"Svg Transformations Viewbox Moved",
      kind:1,
      content:`
  <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
      <line x1="-20" y1="-20" x2="20" y2="20" stroke="black" stroke-dasharray="1" />
      <line x1="20" y1="-20" x2="-20" y2="20" stroke="black" stroke-dasharray="1" />
      <circle cx="100" cy="100" r="50" fill="green" />
      <g id="tri">
          <polygon points="-80,-80 80,0 20,100" stroke="red" fill="none" />
          <text x="0" y="0" font-size="30" text-anchor="middle" fill="white">SVG</text>
      </g>
  </svg> 
  `,
  style:`
  @keyframes snurr { 
    0% { 
        transform: rotate(0deg); 
    } 
    100%
     { 
        transform: rotate(360deg); 
    }
    
  }
  #tri{                
    animation-name: snurr;
    animation-duration: 4000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  `},
  {
    name:"Svg Rocket",
    kind:1,
    content:`
    <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
    <g id="rocket">
    <polygon fill="#A01010" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" points="-20,100 -30,0 -20,-40 0,-70 20,-40 30,0 20,100 -20,100 " />
    <polygon fill="#C02020" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" points="-30,100 -30,70 -20,50 -20,80 " />
    <polygon fill="#800000" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" points=" 30,100  30,70  20,50  20,80 " />     <circle fill="#A01010"  stroke="#000000" fill-rule="evenodd" clip-rule="evenodd" cx="0" cy="0" r="20" stroke-width="1.5" />
     <circle fill="#30A0B0"  stroke="#000000" fill-rule="evenodd" clip-rule="evenodd" cx="0" cy="0" r="15" stroke-width="1.5" />
    <g id="flame">
      <polygon fill="#F08012" points="5,100 -5,100 -15,120 0,140 15,120 5,100 " />
      <polygon fill="#F8AF2A" points="3,100 -3,100 -8,120 0,130 8,120 3,100 " />
      <polygon fill="#FFFF44" points="1,100 -1,100 -4,110 0,120 4,110 1,100 " />
    </g>
  </g>
  </svg>
  `,
  style:`
  @keyframes snurr { 
    0% {
      transform: translate(0px,0px)  rotate(0deg)
    }
    100%{
       transform: translate(0px,0px)  rotate(360deg);
    }
  }
  #tumbler{
    animation-name: snurr;
    animation-duration: 4000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  `},
  {
    name:"SVG Interface",
    kind:1,
    content:`
  <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
    <g id="tumbler">
        <polygon points="-40,-5 0,-5 80,-10 95,0 80,10 0,5 -40,5" fill="#802" fill="none" stroke-width="1" />
        <path d="M-20,0 L70,0 M75,0 L85,0" stroke="#ddd" stroke-width="3" stroke-linecap="round" />
    </g>
    <g onclick="document.getElementById('tumbler').style.animationPlayState='paused'">
        <rect x="-100" y="60" width="60" height="40" rx="5" fill="orange" />
        <text x="-70" y="85" font-size="15" text-anchor="middle" fill="white">Pause</text>
    </g>
    <g onclick="document.getElementById('tumbler').style.animationPlayState='running'">
        <rect x="-30" y="60" width="60" height="40" rx="5" fill="orange" />
        <text x="0" y="85" font-size="15" text-anchor="middle" fill="white">Play</text>
    </g>
    <g onclick="document.getElementById('tumbler').style.animationName='none'">
        <rect x="-100" y="0" width="60" height="40" rx="5" fill="orange" />
        <text x="-70" y="20" font-size="15" text-anchor="middle" fill="white">Stop</text>
    </g>
    <g onclick="document.getElementById('tumbler').style.animationName='snurr'">
        <rect x="-30" y="0" width="60" height="40" rx="5" fill="orange" />
        <text x="0" y="20" font-size="15" text-anchor="middle" fill="white">Start</text>
    </g>  
  </svg> 
  `,
  style:`
  @keyframes snurr { 
    0% {
      transform: translate(0px,0px)  rotate(0deg)
    }
    100%{
       transform: translate(0px,0px)  rotate(360deg);
    }
  }
  #tumbler{
    animation-name: snurr;
    animation-duration: 4000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    opacity:0.8;
  }
  `},
  
  
  
  ]