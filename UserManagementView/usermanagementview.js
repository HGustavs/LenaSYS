AJAXService("GET", {}, "UMVSTUDENT");

function strcmp(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}

function natcmp(a, b) {
    var x = [], y = [];

    a.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { x.push([$1 || 0, $2]) })
    b.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { y.push([$1 || 0, $2]) })

    while(x.length && y.length) {
        var xx = x.shift();
        var yy = y.shift();
        var nn = (xx[0] - yy[0]) || strcmp(xx[1], yy[1]);
        if(nn) return nn;
    }

    if(x.length) return -1;
    if(y.length) return +1;

    return 0;
}



function loadData(studyprogram, pnr) {
	$.get( "usermanagementviewservice.php", { studyprogram: studyprogram, pnr: pnr })  
		.done(
			function( data ) {
				//alert( "Data Loaded: " + data );
				if (data[0][0]==="student"){
					renderStudentView(data);
				} else if (data[0][0]==="studyprogram"){
					renderStudyprogramView(data);	
				} else {
					alert("Error, unkown data returned\n"+data);
				}								
			});

}

function renderStudentView(data){
	
	var htmlStr = "";
	var titleData = data['titleData'];
	
	htmlStr += '<h1 id="headerText">' + titleData[0]['class']+ ' för ' + titleData[0]['fullname'] +'</h1>';
	
	var titleList = document.getElementById('studentTitle');
	titleList.innerHTML = htmlStr;
	
	if(data['debug'] != "NONE!") {
		alert(data['debug']);
	}
	
}

function renderStudyprogramView(data){
	var student_data = data[1];

		var currentTermin;
	var terminer = [];
		$.each(student_data, function () {
    	var termin = this.termin;
    	if (terminer.indexOf(termin) < 0) {
        	terminer.push(termin);
	    };
	});
	
	terminer.sort(natcmp);
	/* Render input data (JSON) format */
						
	 	for (var year = 0; year <3; year++){	 	
	 		var htmlStr = "";
	 		for (var l=0;l<=1;l++){
				htmlStr += '<div class="panel panel-info"> <div class="panel-heading"> <h3 class="panel-title">Termin: '+terminer[(year*2)+l]+'</h3></div>'		
				htmlStr += '<div class="panel-body"> <div id="'+terminer[(year*2)+l]+'" class="list-group"></div></div></div>'
			}
				document.getElementById("year"+(year+1)+"-body").innerHTML = htmlStr;					
		 }
		 
		 for(var j=0; j < student_data.length; j++){
			 var newPanelBodyContainerListGroupItem = document.createElement('div');
			 newPanelBodyContainerListGroupItem.className = "list-group-item";
			 newPanelBodyContainerListGroupItem.id = student_data[j].kurskod+"-container";
			 var div0 = document.createElement('div');
			 div0.className="stoplight";
			 var div1 = document.createElement('div');
			 div1.className = "stoplight-outer";
			 var div2 = document.createElement('div');
			 div2.className = "stoplight-inner-green";
			 div1.appendChild(div2);
			 div0.appendChild(div1);
			 newPanelBodyContainerListGroupItem.appendChild(div0);
			 var span1 = document.createElement('span');
			 //console.log(data[j].kurskod);
			 span1.id = student_data[j].kurskod;
			 span1.innerHTML = student_data[j].kurskod;
			 span1.title = student_data[j].kursnamn;
			 span1.className = "label label-info kurskod";
			 var span2 = document.createElement('span');
			 span2.className = "my-pull-right";
			 	var span3 = document.createElement('span');
			 	span3.id=student_data[j].kurskod+"-resultat";
			 	span3.innerHTML=student_data[j].resultat;
			 	var avklarat = student_data[j].resultat / student_data[j].poang * 100;
//			 	newPanelBodyContainerListGroupItem.style.backgroundImage = "repeating-linear-gradient(90deg, #b3ecb3, #b3ecb3 "+avklarat+"%, white 0%, white 100%)";
			 	newPanelBodyContainerListGroupItem.style.backgroundImage = "repeating-linear-gradient(90deg, #d1f3d1, #d1f3d1 "+avklarat+"%, white 0%, white 100%)";
			 	if (student_data[j].resultat == student_data[j].poang){
			 		span3.className = "badge alert-default";				 		
			 	} else if (student_data[j].resultat < student_data[j].poang && student_data[j].resultat > 0) {
			 		span3.className = "badge alert-default";	
			 	} else {
			 		span3.className = "badge alert-default";
			 	}			 	
			 	var span4 = document.createElement('span');
			 	span4.className = "badge alert-default";
			 	span4.innerHTML = student_data[j].poang;		 
			 	span2.appendChild(span3);
			 	span2.appendChild(document.createTextNode(" / "));
			 	span2.appendChild(span4);
			 	var newp = document.createElement('p');
			 	newp.className = "kursnamn";
			 	newp.innerHTML = student_data[j].kursnamn;
			 	var span5 = document.createElement('span');
			 	span5.id = student_data[j].kurskod+"-forkunskapskrav";
			 newPanelBodyContainerListGroupItem.appendChild(span1);		 
			 newPanelBodyContainerListGroupItem.appendChild(span2);
			 newPanelBodyContainerListGroupItem.appendChild(newp);
			 newPanelBodyContainerListGroupItem.appendChild(span5);
		 
			//console.log(document.getElementById(data[j].termin)); 
			document.getElementById(student_data[j].termin).appendChild(newPanelBodyContainerListGroupItem);
		}
		/* Added this... */

}
