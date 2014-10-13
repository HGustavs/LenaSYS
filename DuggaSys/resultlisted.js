var sessionkind=0;
var querystring=parseGet();
var filez;
var mmx=0,mmy=0;
var msx=0,msy=0;


AJAXService("GET",{cid:querystring['cid']},"RESULTLIST");

$(function() {
  $( "#release" ).datepicker({dateFormat: "yy-mm-dd"});
    $( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});
});

//----------------------------------------
// Commands:
//----------------------------------------


//----------------------------------------
// Renderer
//----------------------------------------

function padstring(str,padno,kind)
{
		// Right Padding
		if(kind==1){
				if(str.length>padno){
						newstr=str.substring(0, padno);
				}else{
						newstr=str;
						padcnt=padno-str.length;
						for(var io=0;io<padcnt;io++){
								newstr+="&nbsp;";
						}
				}
		}
		return newstr;
}

function returnedResults(data)
{
		str="";
		
		if(data['dugganame']!=""){
				$("#MarkCont").html(data['duggapage']);
				$("#resultpopover").css("display","block");
		}else{

				results=data['results'];
				
				// Make checkboxes!
				str+="<div id='mirth'><table width='100%'><tr>";
				if (data['entries'].length > 0) {
						for(j=0;j<data['moments'].length;j++){
									var moment=data['moments'][j];													
									if((moment['kind']==3&&moment['moment']==null)||(moment['kind']==4)){
											str+="<td>";
											str+=moment['entryname'];
											str+="</td>";
									}
						}
				}
				str+="</tr></table><br/></div>"
				
				str+="<pre class='Trow'>"
				str+="H&ouml;gskolan i Sk&ouml;vde                        RS01 Resultat p&aring; prov\n";
				str+="Institutionen f&ouml;r informationsteknologi R&auml;ttningsprotokoll: Inl&auml;ggning, betyg p&aring; prov\n";
				str+="Christina S&ouml;derqvist 2014-09-08                            Sida   1\n";
				str+="&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;\n";
				str+="DV123G     7.5     Webbutveckling - Webbplatsdesign G1N\n";
				str+="1003       2.5     Analys av webbgränssnitt\n";
				str+="List nr       91876\n";
				str+="Provdatum\n";
				str+="</pre>";

				str+="<pre class='Trow'>";
        str+="                          Anm     A     B    C    1    2    3 4    5    6    7    8  &#9474;\n";
				str+="</pre>";
					
				if (data['entries'].length > 0) {
						for(i=0;i<data['entries'].length;i++){
								var user=data['entries'][i];

								str+="<pre class='Trow'>"
								str+="&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;";
								str+="\n";
								// One row for each student
								
								// Print as follows:
								
								// 1. Start with ssn row. Add Padding for each of the other columns.
								// 2. Write Name. Write values for each of the columns
								// 3. Write Study Program. Add Padding for each of the other columns.
								
								// SSn Padded to 24
								// Name Padded to 24   --- Results. Perhaps if overflow add more rows?
								// Study Program Padded to 24
								
								//str+=user['firstname']+" "+user['lastname']+"<br/>"+user['ssn'];
								str+=padstring(user['firstname']+" "+user['lastname'],24,1);
								str+="FOO";
								
								// Each of the section entries (i.e. moments) 
								for(j=0;j<data['moments'].length;j++){
										var moment=data['moments'][j];					
		
										if((moment['kind']==3&&moment['moment']==null)||(moment['kind']==4)){
																						
												// We have data if there is a set of result elements for this student in this course... otherwise null
												studres=results[user['uid']];
												// There are results to display.
		
												if(moment['kind']==3&&moment['moment']==null){
		
														// Standalone Dugga -- we just need to make a dugga entry with the correct marking system.
														// We are now processing the moment entry in the moment object
														var foundres=null;
														if(studres!=null){
																for(var l=0;l<studres.length;l++){
																		var resultitem=studres[l];		
																		if(resultitem['moment']==moment['lid']){
																				// There is a result to print
																				foundres=resultitem['grade'];
																				str+=resultitem['grade']
																		}
																}
														}
														if(foundres==null){
																str+="NF";
														}
												}
												if(moment['kind']==4){
														// Moment - which may or may not have quizes
														ttr="";
														duggacnt=0;
														for(var k=0;k<data['moments'].length;k++){
																var dugga=data['moments'][k];		
																
																// If the id of current item is same as moment of a dugga
																if((dugga['moment']==moment['lid'])&&(dugga['kind']==3)){
																			
																		duggacnt++;
		
																		// We now have number of listentry, student data, course information etc, are there any results?
																		var foundres=null;
																		if(studres!=null){
																				for(var l=0;l<studres.length;l++){
																						var resultitem=studres[l];		
																						if(resultitem['moment']==dugga['lid']){
																								// There is a result to print
																								foundres=resultitem['grade'];
																								if(foundres!=null){
																										ttr+=foundres;
																								}
																						}
																				}
																		}
																		if(foundres==null){
																				ttr+="NF";
																		}
																}														
														}
														
														if(duggacnt==0){

														}else{

														} 
		
														// We are now processing the moment entry in the moment object
														var foundres=null;
														if(studres!=null){
																for(var l=0;l<studres.length;l++){
																		var resultitem=studres[l];		
																		if(resultitem['moment']==moment['lid']){
																				// There is a result to print
																				foundres=resultitem['grade'];
																				str+=resultitem['grade'];
																		}
																}
														}
														if(foundres==null){
																str+="NF3";
														}
												
														str+=ttr;
												}
		
										}
								}
								
								str+="</pre>"
						}
				}	
		
				var slist=document.getElementById("content");
				slist.innerHTML=str;
		}

	  if(data['debug']!="NONE!") alert(data['debug']);

}

		
