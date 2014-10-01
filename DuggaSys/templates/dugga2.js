function setup()
{

		$('.hexo').click(function(){
				hexClick(this.id);
		});

		AJAXService("GETPARAM",{ },"PDUGGA");
}

function returnedDugga(data)
{
	  if(data['debug']!="NONE!") alert(data['debug']);

		if(data['param']=="UNK"){
				alert("UNKNOWN DUGGA!");
		}else{
			  retdata=jQuery.parseJSON(data['param'].replace(/&quot;/g, '"'));
				$("#fargnamn").html(retdata['colorname']);
				//$("#fargen").css("background-color",retdata['color']);
				$("#fargen").attr("src", "templates/color_"+retdata['color']+".png");
							// Add our previous answer
				var previous = data['answer'].split(' ');
				if (previous.length >= 9){
					document.getElementById('H0').innerHTML=previous[4];
					document.getElementById('H1').innerHTML=previous[5];
					document.getElementById('H2').innerHTML=previous[6];
					document.getElementById('H3').innerHTML=previous[7];
					document.getElementById('H4').innerHTML=previous[8];
					document.getElementById('H5').innerHTML=previous[9];
				}			
		}	  
}

var hc=null;
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

function saveClick()
{
		// Loop through all bits
		bitstr="";

		bitstr+=" "+$("#H0").html();
		bitstr+=" "+$("#H1").html();
		bitstr+=" "+$("#H2").html();
		bitstr+=" "+$("#H3").html();
		bitstr+=" "+$("#H4").html();
		bitstr+=" "+$("#H5").html();

		bitstr+=" "+window.screen.width;
		bitstr+=" "+window.screen.height;
	
		bitstr+=" "+$(window).width();
		bitstr+=" "+$(window).height();
		
		// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
		saveDuggaResult(bitstr);
}
