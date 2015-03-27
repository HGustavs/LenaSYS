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

function hover(obj){
	console.log("We hover!" + obj.id);
}

function stop_hover(obj){
	console.log("We stopped hovering!" + obj.id);
}

function xml_to_string(xml_node)
{
    if (xml_node.xml)
        return xml_node.xml;
    else if (XMLSerializer)
    {
        var xml_serializer = new XMLSerializer();
        return xml_serializer.serializeToString(xml_node);
    }
    else
    {
        alert("ERROR: Extremely old browser");
        return "";
    }
}

function loadData(studyprogram, pnr) {
	$.get( "studentfollowupservice.php", { studyprogram: studyprogram, pnr: pnr })  
		.done(
			function( data ) {
				//alert( "Data Loaded: " + data );
				//renderStudentView(data);
				renderStudyprogramView(data);				
			});

}

function renderStudentView(data){
	/* Render input data (JSON) format */
	/* Figure out year 1, year 2, and year 3 */
	/* 
	 * 
	 * 1. get start year 
	 * 
	 */
	student_data = data[0];
	forkunskap = data[1];
	
	var startYear = student_data[0].kull;
	startYear = startYear.match(/[0-9][0-9]/);
	console.log(startYear);
	
	/* 2. derive terminer */
	
	/*
	 * Year1
	 * H + startYear and V + (startYear+1)
	 * Year2
	 * H + (startYear+1) and V + (startYear+2)
	 * Year3
	 * H + (startYear+2) and V + (startYear+3)
	 *
	 */
	var currentTermin;
	var terminer = [];
		$.each(student_data, function () {
    	var termin = this.termin;
    	if (terminer.indexOf(termin) < 0) {
        	terminer.push(termin);
	    };
	});
	
	terminer.sort(natcmp);
	 	
	 	console.log(terminer);
	 	
	 	// add terminer
	 	
		var year = 1;				
	 	//while (   terminer.length){	 	
	 		var htmlStr = "";
	 		for (var l=0;l<=1;l++){
				htmlStr += '<div class="panel panel-info"> <div class="panel-heading"> <h3 class="panel-title">Termin: '+terminer[l]+'</h3></div>'		
				htmlStr += '<div class="panel-body"> <div id="'+terminer[l]+'" class="list-group"></div></div></div>'
			}
				document.getElementById("year"+year+"-body").innerHTML = htmlStr;					

			year++;
		 //}
		 
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
		/* Add förkunskapskrav */
		for (var ii=0; ii<forkunskap.length; ii++){
			var nyttkrav = document.createElement('span');
			nyttkrav.className = "forkunskap label label-danger " + forkunskap[ii].kurskod;
			nyttkrav.innerHTML = forkunskap[ii].krav;
			nyttkrav.setAttribute('onmouseover', "hoverReq(this,\'" + forkunskap[ii].kurskod +"\');");
			/* TODO: Add title with kursnamn */
			console.log(forkunskap[ii].kurskod+"-forkunskapskrav");
			document.getElementById(forkunskap[ii].kurskod+"-forkunskapskrav").appendChild(nyttkrav);
		}
}

function renderStudyprogramView(data){
	var student_data = data[0];
	alert(student_data.length);

		var currentTermin;
	var terminer = [];
		$.each(student_data, function () {
    	var termin = this.termin;
    	if (terminer.indexOf(termin) < 0) {
        	terminer.push(termin);
	    };
	});
		alert(terminer.length);
	
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

}
