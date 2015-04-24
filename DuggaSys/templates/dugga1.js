/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	Param:  {"tal":"2"}
	Answer: {"danswer":"00000010 0 2"}

-------------==============######## Documentation End ###########==============-------------
*/


//----------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------

var retdata=null;
var hc=null;
var timeSpent = 0;
var timer;

//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
		$('.bit').click(function(){
				bitClick(this.id);
		});

		$('.hexo').click(function(){
				hexClick(this.id);
		});
}

//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data)
{
	startTimer();
	console.log(data['param']);
	
	  if(data['debug']!="NONE!") alert(data['debug']);

		if(data['param']=="UNK"){
				alert("UNKNOWN DUGGA!");
		}else{		
			retdata=jQuery.parseJSON(data['param'].replace(/&quot;/g, '"'));
			$("#talet").html(retdata['tal']);
			// Add our previous answer
			if(data['answer'] != null && data['answer'] != "UNK"){
				resetBitstring();
				var previous = data['answer'].split(' ');
				if (previous.length >= 4){
					var bitstring = previous[3];
					var hexvalue1 = previous[4];
					var hexvalue2 = previous[5]; 
				}			
				// NB: LSB is now on the highest string index
				for (var i=bitstring.length;i>=0;i--){
					if (bitstring[i]==1){
						bitClick("B"+(7-i));
						//console.log("B"+(7-i)+":"+bitstring[i]);
					}				
				}
				document.getElementById('H0').innerHTML=hexvalue1;
				document.getElementById('H1').innerHTML=hexvalue2;
			}
		}		
}

//--------------------================############================--------------------
//                                  Master Functions
//--------------------================############================--------------------

function startTimer()
{
	console.log("Starting timer");
	timer = setInterval( incrementTimer, 1000);
	
}
function incrementTimer(){
	timeSpent = timeSpent + 1;
	console.log(timeSpent);
}
function stopTimer(){
	console.log("Stopping timer");
	clearInterval(timer);
}

function saveClick()
{
		stopTimer();
		// Loop through all bits
		bitstr="";
		$(".bit").each(function( index ) {
				bitstr=bitstr+this.innerHTML;
		});
		
		bitstr+=" "+$("#H0").html();
		bitstr+=" "+$("#H1").html();
		
		bitstr+=" "+screen.width;
		bitstr+=" "+screen.height;
		
		bitstr+=" "+$(window).width();
		bitstr+=" "+$(window).height();
		
		// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
		saveDuggaResult(bitstr);
}

function showFacit(param, uanswer, danswer)
{
			var p = jQuery.parseJSON(param.replace(/&quot;/g, '"'));
			var daJSON = jQuery.parseJSON(danswer.replace(/&quot;/g, '"'));
			
			var da = daJSON['danswer'];
			var danswer = da.split(' ');
			
			$("#talet").html(p['tal']);
			
			// Add our previous answer
			var previous = uanswer.split(' ');
			if (previous.length >= 4){
				var bitstring = previous[3];
				var hexvalue1 = previous[4];
				var hexvalue2 = previous[5]; 
			}			
			resetBitstring();
			
			// NB: LSB is now on the highest string index
			for (var i=bitstring.length;i>=0;i--){
				if (bitstring[i]==1){
					bitClick("B"+(7-i));
				}				
			}
			
			// NB: LSB is now on the highest string index
			for (var i=danswer[0].length;i>0;i--){

				if (danswer[0][i-1]==1){
					// Set border around correct bits
					document.getElementById("B"+(8-i)).style.border = "4px dotted black";
				}								 

				if (danswer[0][i-1] == $("#B"+(8-i)).html()){
					$("#B"+(8-i)).css("background","green");
					document.getElementById('B'+(8-i)).innerHTML+= " == " + danswer[0][i-1];
					
				} else {
					$("#B"+(8-i)).css("background","red");
					document.getElementById('B'+(8-i)).innerHTML+= " != " + danswer[0][i-1];					
				}
			}
			
			if (hexvalue1 == danswer[1]) {
				document.getElementById('H0').style.background = "green";
				document.getElementById('H0').innerHTML=hexvalue1 + " == "+danswer[1];
			} else {
				document.getElementById('H0').style.background = "red";
				document.getElementById('H0').innerHTML=hexvalue1 + " != "+danswer[1];			
			}
			if (hexvalue2 == danswer[2]) {
				document.getElementById('H1').style.background = "green";
				document.getElementById('H1').innerHTML=hexvalue2 + " == "+danswer[2];
			} else {
				document.getElementById('H1').style.background = "red";
				document.getElementById('H1').innerHTML=hexvalue2 + " != "+danswer[2];			
			}
}

function closeFacit(){

}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------

function bitClick(divid)
{
			if($("#"+divid).html()=="1"){
					$("#"+divid).html("0");
					$("#"+divid).removeClass("ett");
					$("#"+divid).addClass("noll" );
			}else{
					$("#"+divid).html("1");
					$("#"+divid).addClass("ett" );
					$("#"+divid).removeClass("noll");
			}
}

function hexClick(divid)
{

	dw=$(window).width();
	dpos=$("#"+divid).position();
	dwid=$("#"+divid).width();
	dhei=$("#"+divid).height();
	bw=Math.round(dwid)*2.0;
	if(bw<128) bw=128;
	
	lpos=dpos.left;
	
	popclass="arrow-top";
	if((lpos+bw)>dw){
			popclass="arrow-topr";
			lpos=lpos-bw+dwid;
	}
	 
	var hh=(dhei*2);
	if(hh<160) hh=160;
	hh+="px";
	
	$("#pop").css({top: (dpos.top+dhei+10), left:lpos, width:bw,height:hh,display:"block"})
	$("#pop").removeClass("arrow-topr");
	$("#pop").removeClass("arrow-top");
	$("#pop").addClass(popclass);
	
	hc=divid;
}

function setval(sval)
{
		if(hc!=null){
				$("#"+hc).html(sval);		
		}
		$("#pop").css({display:"none"})
}

function resetBitstring(){
	for (var i=0;i<8;i++){
		document.getElementById("B"+i).innerHTML="0";
		document.getElementById("B"+i).className="bit noll";		
	}
}
