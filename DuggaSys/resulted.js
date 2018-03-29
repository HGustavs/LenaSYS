
/********************************************************************************
   Globals
*********************************************************************************/
var sessionkind = 0;
var querystring = parseGet();
var filez;
var mmx = 0, mmy = 0;
var msx = 0, msy = 0;
var rProbe = null;
var subheading=0;
var allData;
//var benchmarkData = performance.timing; // Will be updated after onload event
//var ajaxStart;
//var tim;

var students=new Array;
var momtmp=new Array;
var sortcolumn=1;
var clickedindex;
var typechanged=false;
var teacher;
var entries;
var moments;
var results;
var versions;
var clist;
var onlyPending=false;
var timeZero=new Date(0);
var showTeachers = false;
var duggaArray = [[]];

function setup(){
  //Benchmarking function
  //benchmarkData = performance.timing;
  //console.log("Network Latency: "+(benchmarkData.responseEnd-benchmarkData.fetchStart));
  //console.log("responseEnd -> onload: "+(benchmarkData.loadEventEnd-benchmarkData.responseEnd));

  /*    Add filter menu   */
  var filt =""; 
  filt+="<td id='select' class='navButt'><span class='dropdown-container' onmouseover='hoverc();'>";
  filt+="<img class='navButt' src='../Shared/icons/tratt_white.svg'>";
  filt+="<div id='dropdownc' class='dropdown-list-container'>";
  filt+="</div>";
  filt+="</span></td>";

  filt+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hovers();'>";
  filt+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
  filt+="<div id='dropdowns' class='dropdown-list-container'>";
  filt+="</div>";
  filt+="</span></td>";
  $("#menuHook").before(filt);

  // Set part of filter config
  if (localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-pending")=="true"){
      onlyPending=true;
  } else {
      onlyPending=false;
  }

  var t = localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
  if(t != null) {
    if((t.indexOf("showteachers**true",0)>=0)){
      showTeachers = true;
  }else{
      showTeachers = false;
  }
  }

  window.onscroll = function() {magicHeading()};

  AJAXService("GET", { cid : querystring['cid'],vers : querystring['coursevers'] }, "RESULT");
}

function redrawtable()
{
  str="";

  str+="<div class='titles' style='padding-bottom:10px;'>";
    str+="<h1 style='flex:1;text-align:center;'>Results</h1>";
  str+="</div>";
  
  str+="<div id='horizhighlight' style='position:absolute;left:240px;top:50px;right:400px;bottom:0px;pointer-events:none;display:none;'></div>";
  str+="<div id='verthighlight' style='position:absolute;left:240px;top:50px;right:400px;bottom:0px;pointer-events:none;display:none;'></div>";

  // Redraw Magic heading 

  str += "<div id='sideDecker' style='position:absolute;left:50px;margin-top:43px;display:none;width:175px;'>";
  str += "<table class='markinglist' style='table-layout: fixed;'>";
  str += "<tbody>";
    var row=1;
    for(var i=0;i<students.length;i++){
      var isTeacher = false; // Will be true if a member of the course has "W" access
      var strx = "";
      // Check if row is even/uneven and add corresponding class, this creates the "striped" pattern in the table
      if(row % 2 == 1){
        strx+="<tr class='fumo hi'>";
      }
      else{
        strx+="<tr class='fumo lo'>";
      }
      strx +="<td id='row"+row+"' class='rownoMagic'><div>"+row+"</div></td>"
      var student=students[i];
      for(var j=0;j<student.length;j++){
        if(student[j].access == "W") { // Member is a teacher
          isTeacher = true;
        }
        if(j==0){
        strx +="<td onmouseover='cellIn(event);' onmouseout='cellOut(event);'";
        // Mark the cell if it is a teacher, first iteration: changing background color to bright yellow to indicate something
        strx +=" style='padding-left:6px;"+((student[j].access=="W")?" background-color: #ffff90;'":"")+"'";
        strx +=" id='u"+student[j].uid+"_d"+student[j].lid+"' class='result-data c"+j;
        strx +="'>"+student[j].grade+"</td>";  
        }
      }
      strx +="</tr>"
      if(!onlyPending && (showTeachers || (!showTeachers && !isTeacher))) {
        str+=strx;
        row++;
      }
    }
  str += "</tbody>"
  str += "</table>"
  str += "</div>"


  str += "<div id='upperDecker' style='position:absolute;left:8px;display:none;'>";
  str += "<table class='markinglist' style='table-layout: fixed;'>";
  str += "<thead>";
  str += "<tr class='markinglist-header'>";
  str += "<th id='header' class='rowno idField' style='width: 28px;'><span>#</span></th><th onclick='toggleSortDir(0);' class='result-header dugga-result-subheadermagic' id='header0magic'><div class='dugga-result-subheader-div' title='Firstname/Lastname/SSN'>Fname/Lname/SSN</div></th>"
  if (momtmp.length > 0){
    // Make first header row!
    //    No such header for magic heading - by design

    // Make second header row!
    for(var j=0;j<momtmp.length;j++){
      if(momtmp[j].kind==3){
        str+="<th onclick='toggleSortDir("+(j+1)+");' id='header"+(j+1)+"magic' class='result-header dugga-result-subheadermagic'><div class='dugga-result-subheader-div' title='"+momtmp[j].entryname+"'>"+momtmp[j].entryname+"</div></th>"                         
      }else{
        str+="<th onclick='toggleSortDir("+(j+1)+");' id='header"+(j+1)+"magic' class='result-header dugga-result-subheadermagic'><div class='dugga-result-subheader-div' title='Course part grade'>Course part</div></th>"                         
      }
    }
  }   
  str+="<th style='width: 100%'></th>"; // Padding cell, to make sure the other fields are compressed to a bare minimum
  str+="</tr>";
  str += "</thead>"
  str += "</table>"
  str += "</div>"

  // Redraw main result table    
  str+="<table class='markinglist' id='markinglist'>";
  str+="<thead>";
  str+="<tr class='markinglist-header'>";
  str+="<th id='header' ></th><th colspan='1' id='subheading' class='result-header'>";
  str+="";
  str+="</th>";

    // Make first header row!
    var colsp=1;
    var colpos=1;

    // Only write out this part if momtmp array is not empty
    if (momtmp.length > 0){
      var momname=momtmp[0].momname;
      for(var j=1;j<momtmp.length;j++){
        if(momtmp[j].momname!==momname){
          str+="<th class='result-header' colspan='"+colsp+"'>"+momname+"</th>"               
          momname = momtmp[j].momname;
          colpos=j;
          colsp=0;
        }
        colsp++;
      }
      str+="<th class='result-header' colspan='"+colsp+"'>"+momname+"</th>"               
      str+="</tr><tr class='markinglist-header'>";

      // Make second header row!
      str+="<th  id='header' class='rowno realIdField'><span>#</span></th><th class='result-header dugga-result-subheader' id='header0' onclick='toggleSortDir(0);'><div class='dugga-result-subheader-div' title='Firstname/Lastname/SSN'>Fname/Lname/SSN</div></th>"  
      for(var j=0;j<momtmp.length;j++){
        if(momtmp[j].kind==3){
          str+="<th onclick='toggleSortDir("+(j+1)+");' class='result-header dugga-result-subheader' id='header"+(j+1)+"'><div class='dugga-result-subheader-div' title='"+momtmp[j].entryname+"'>"+momtmp[j].entryname+"</div></th>"                         
        }else{
          str+="<th onclick='toggleSortDir("+(j+1)+");' class='result-header dugga-result-subheader' id='header"+(j+1)+"'><div class='dugga-result-subheader-div' title='Course part grade'>Course part</div></th>"               
        }
      }
    }

    // Make second header row if momtmp array is empty
    if (momtmp.length === 0){
      str+="</tr><tr class='markinglist-header'>";
      str+="<th  id='header' class='rowno'><span>#</span></th><th class='result-header dugga-result-subheader' id='header0' onclick='toggleSortDir(0);'><div class='dugga-result-subheader-div' title='Firstname/Lastname/SSN'>Fname/Lname/SSN</div></th>"
    }

    str+="<th style='width: 100%'></th>"; // Padding cell, to make sure the other fields are compressed to a bare minimum
    str+="</tr></thead><tbody>";

    // Make result table
    var row=1;
    for(var i=0;i<students.length;i++){
      var isTeacher = false; // Will be true if a member of the course has "W" access
      var strt="";
      // Check if row is even/uneven and add corresponding class, this creates the "striped" pattern in the table
      if(row % 2 == 1){
        strt+="<tr class='fumo hi'>";
      }
      else{
        strt+="<tr class='fumo lo'>";
      }
      strt+="<td id='row"+row+"' class='rowno'><div>"+row+"</div></td>";
      var student=students[i];
      for(var j=0;j<student.length;j++){
        if(student[j].access == "W") { // Member is a teacher
          isTeacher = true;
        }
        strt+="<td onmouseover='cellIn(event);' onmouseout='cellOut(event);'";
        // Mark the cell if it is a teacher, first iteration: changing background color to bright yellow to indicate something
        strt+=" style='padding-left:6px;"+((student[j].access=="W")?" background-color: #ffff90;":"")+"'";
        strt+=" id='u"+student[j].uid+"_d"+student[j].lid+"' class='result-data c"+j;
        if(j==0){
          strt+="'>"+student[j].grade+"</td>";                                  
        } else {
          if(student[j].kind==4){ strt+=" dugga-moment"; }
          // color based on pass,fail,pending,assigned,unassigned
          if (student[j].grade === 1 && student[j].needMarking === false) {strt += " dugga-fail";}
          else if (student[j].grade > 1) {strt += " dugga-pass";}
          else if (student[j].needMarking === true) {strt+= " dugga-pending"; onlyPending=false;}
          else if (student[j].grade === 0 ) {strt += " dugga-assigned";}
          else {strt += " dugga-unassigned";}
          strt += "'>";
          strt += "<div class='gradeContainer";                    
          if(student[j].ishere===false){
            strt += " grading-hidden";
          }
          strt += "'>";
          if (student[j].grade === null ){
            strt += makeSelect(student[j].gradeSystem, querystring['cid'], student[j].vers, student[j].lid, student[j].uid, student[j].grade, 'I', student[j].qvariant, student[j].quizId);
          } else if (student[j].grade === -1 ){
            strt += makeSelect(student[j].gradeSystem, querystring['cid'], student[j].vers, student[j].lid, student[j].uid, student[j].grade, 'IFeedback', student[j].qvariant, student[j].quizId);
          }else {
            strt += makeSelect(student[j].gradeSystem, querystring['cid'], student[j].vers, student[j].lid, student[j].uid, student[j].grade, 'U', student[j].qvariant, student[j].quizId);
          }
          strt += "<img id='korf' class='fist";
          if(student[j].userAnswer===null && !(student[j].quizfile=="feedback_dugga")){ // Always shows fist. Should be re-evaluated
            strt += " grading-hidden";
          }
          strt +="' src='../Shared/icons/FistV.png' onclick='clickResult(\"" + querystring['cid'] + "\",\"" + student[j].vers + "\",\"" + student[j].lid + "\",\"" + student[0].firstname + "\",\"" + student[0].lastname + "\",\"" + student[j].uid + "\",\"" + student[j].submitted + "\",\"" + student[j].marked + "\",\"" + student[j].grade + "\",\"" + student[j].gradeSystem + "\",\"" + student[j].lid + "\",\"" + student[j].qvariant + "\",\"" + student[j].quizId + "\");' />";
          strt += "</div>";
      
      strt += "<div class='text-center'>";
        if(student[j].ishere===true && student[j].timesGraded!==0){
          strt += "Times Graded: " + student[j].timesGraded;
        }
      strt += "</div>";
      
          strt += "<div class='text-center' id='deadlineDate'>"                                 
          if (student[j].submitted.getTime() !== timeZero.getTime()){
            strt+=student[j].submitted.toLocaleDateString()+ " " + student[j].submitted.toLocaleTimeString();  
          }
		  else if (student[j].submitted.dugga.deadlineDate() < student[j].submitted.getDate()){
			  document.getElementById("deadlineDate").style.color = "red";
		  }
          strt += "</div></td>";                      
        }
      }
      strt+="</tr>"
      // Only show teachers if the showTeacher variable is set (should be off by default)
      if(!onlyPending && (showTeachers || (!showTeachers && !isTeacher))) {
        str+=strt; 
        row++;
      }
    }
    str+="</tbody></table>";
    document.getElementById("content").innerHTML=str;
    idField();
}

function idField() {
  $(".idField").css("width", $(".realIdField").css("width"));
}

function cellIn(ev)
{
    var greger=ev.target;

    if(greger.nodeName!="TD") greger=greger.parentElement;
    if(greger.nodeName!="TD") greger=greger.parentElement; /* These are two by design */

    var bodyRect = document.body.getBoundingClientRect(),
    gregerRect = greger.getBoundingClientRect(),
    offset   = gregerRect.top - bodyRect.top;
    offsetH   = gregerRect.left - bodyRect.left;

    $("#verthighlight").css("display","block");
    $("#horizhighlight").css("display","block");
    $("#horizhighlight").addClass("hhighlight-border-color");
    if($("#header"+(greger.cellIndex-1)).hasClass("result-header-inverse")){
        $("#verthighlight").removeClass("vhighlight-border-color");
        $("#verthighlight").addClass("vhighlight-border-color-inverse");
    } else {
        $("#verthighlight").removeClass("vhighlight-border-color-inverse");
        $("#verthighlight").addClass("vhighlight-border-color");
    }
    $("#verthighlight").css("left",offsetH+"px");
    $("#verthighlight").css("top",greger.offsetHeight+104+"px");

    $("#verthighlight").css("width",greger.offsetWidth-8+"px");
    $("#verthighlight").css("height",$("#markinglist > tbody").outerHeight()+6+"px");

    $("#horizhighlight").css("top",offset+"px");
    $("#horizhighlight").css("left","11px");

    $("#horizhighlight").css("height",greger.offsetHeight-4+"px");
    $("#horizhighlight").css("width",$("#markinglist").outerWidth()+"px");
}

function cellOut(ev)
{
    $("#horizhighlight").css("display","none");
    $("#verthighlight").css("display","none");
}

// Resort based on our paramters:
//   sortdir - asc or desc
//   columno - sort column
//   type1 - if sorting fname/lname/ssn column
//   type2 - if not sorting fname/lname/ssn column
// 
// All parameters are stored in local storage.
function resort()
{
    // Read sorting config from localStorage  
    var sortdir=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");
    if (sortdir === null || sortdir === undefined){dir=1;}
    $("#sortdir"+sortdir).prop("checked", true);
    var columno=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
    if (columno === null || columno === undefined ){columno=0;}
    var colkind=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1");
    if (colkind == null || colkind == undefined){colkind=0;}
    var colkind2=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2");
    if (colkind2 == null || colkind2 == undefined){colkind2=0;}     

    if (students.length > 0) {
          
        if(columno < students[0].length){
    
            if (columno == 0) {       
                $("#sortcol0_"+colkind).prop("checked", true);
            } else {
                $("#sortcol"+columno).prop("checked", true);
                $("#sorttype"+colkind2).prop("checked", true);                
            }
            // Each if case checks what to sort after and then sorts appropiatle depending on ASC or DESC
            if(columno==0){
              if(colkind==0){
                students.sort(function compare(a,b){                        
                    if(a[0].firstname>b[0].firstname){
                      return sortdir;
                    }else if(a[0].firstname<b[0].firstname){
                        return -sortdir;
                    }else{
                      return 0;
                    }
                  });
              }else if(colkind==1){
                          students.sort(function compare(a,b){
                  if(a[0].lastname>b[0].lastname){
                    return sortdir;
                  }else if(a[0].lastname<b[0].lastname){
                    return -sortdir;
                  }else{
                     return 0;
                  }
                });
              }else if(colkind==2){
                        students.sort(function compare(a,b){
                          if(a[0].ssn>b[0].ssn){
                              return sortdir;
                            }else if(a[0].ssn<b[0].ssn){
                                return -sortdir;
                                }else{
                                return 0;
                            }
                        });
              }else if(colkind==3){
                        students.sort(function compare(a,b){ 
                          if(a[0].class>b[0].class || b[0].class == undefined){
                              return sortdir;
                            }else if(a[0].class<b[0].class || a[0].class == undefined){
                              return -sortdir;
                          }else{
                                return 0;
                            }
                        });
              }else if(colkind==4){
                students.sort(function compare(a,b){ 
                          if(a[0].setTeacher>b[0].setTeacher || b[0].setTeacher == undefined){
                              return sortdir;
                            }else if(a[0].setTeacher<b[0].setTeacher || a[0].setTeacher == undefined){
                              return -sortdir;
                          }else{
                                return 0;
                            }
                        });
              }
            }else{
              // other columns sort by
              // 0. need marking -> FIFO 
              // 1. grade
              // 2. submitted
              // 3. marked
              // 4. 
              // 5. 
              if (colkind2===null){colkind2=0;}
              sortcolumn=columno;
              if(colkind2==0){
               students.sort(function compare(a,b){
                   if(a[sortcolumn].needMarking==true&&b[sortcolumn].needMarking==true){
                       if(a[sortcolumn].submitted<b[sortcolumn].submitted){
                           return sortdir;
                       }if(a[sortcolumn].submitted>b[sortcolumn].submitted){
                           return -sortdir;                 
                       }else{
                           return 0;
                       }
                   }else if(a[sortcolumn].needMarking==true&&b[sortcolumn].needMarking==false){
                        return sortdir;
                   }else if (a[sortcolumn].needMarking==false&&b[sortcolumn].needMarking==true){
                       return -sortdir;
                   }else{
                       if(a[sortcolumn].grade!=-1 && b[sortcolumn].grade == -1){
                          return sortdir;
                      } else if(a[sortcolumn].grade==-1 && b[sortcolumn].grade != -1){
                          return -sortdir;
                      } else{ 
                          if(a[sortcolumn].grade>b[sortcolumn].grade){              
                              return sortdir;
                          }else if(a[sortcolumn].grade<b[sortcolumn].grade){
                              return -sortdir;
                          }else{
                              if(a[sortcolumn].submitted>b[sortcolumn].submitted){
                                  return -sortdir;                  
                              }else if(a[sortcolumn].submitted<b[sortcolumn].submitted){
                                  return sortdir;
                              }else{
                                  return 0;
                              }
                          }
                      }
                   }
               });      
            } else if(colkind2==1){
              students.sort(function compare(a,b){
                  if(a[sortcolumn].grade!=-1 && b[sortcolumn].grade == -1){
                      return -sortdir;
                  } else if(a[sortcolumn].grade==-1 && b[sortcolumn].grade != -1){
                      return sortdir;
                  } else{ 
                      if(a[sortcolumn].grade>b[sortcolumn].grade){              
                          return sortdir;
                      }else if(a[sortcolumn].grade<b[sortcolumn].grade){
                          return -sortdir;
                      }else{
                          return 0;
                      }
                  }
              });       
            } else if(colkind2==2){
              students.sort(function compare(a,b){                    
                  if(a[sortcolumn].submitted>b[sortcolumn].submitted){
                      return sortdir;
                  }else if(a[sortcolumn].submitted<b[sortcolumn].submitted){
                      return -sortdir;                  
                  }else{
                      return 0;
                  }
              });       
            } else if(colkind2==3){
              students.sort(function compare(a,b){                       
                  if(a[sortcolumn].marked>b[sortcolumn].marked){
                      return sortdir;
                  }else if(a[sortcolumn].marked<b[sortcolumn].marked){
                      return -sortdir;                  
                  }else{
                      return 0;
                  }
              });       
            } else{
              students.sort(function compare(a,b){
                 if(a[sortcolumn].grade>b[sortcolumn].grade){             
                     return sortdir;
                 }else if(a[sortcolumn].grade<b[sortcolumn].grade){
                     return -sortdir;
                 }else{
                     return 0;
                 }
              });       
              }
            }          
        }
    }
   redrawtable();
   $("#header"+columno).addClass("result-header-inverse");
   if (sortdir<0){
     $("#header"+columno).append("<img id='sortdiricon' src='../Shared/icons/asc_primary.svg'/>");
     $("#header"+columno+"magic").append("<img id='sortdiricon' src='../Shared/icons/asc_primary.svg'/>");
   } else {
     $("#header"+columno).append("<img id='sortdiricon' src='../Shared/icons/desc_primary.svg'/>"); 
     $("#header"+columno+"magic").append("<img id='sortdiricon' src='../Shared/icons/desc_primary.svg'/>");    
   }
}

// If col and current col are equal we flip sort order otherwise we
// change to selected column and always start with desc FIFO order for col 1->
// col 0 get special treatment and is by default sorted on lastname.
function toggleSortDir(col){
    var dir = localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");
    var ocol=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
    
    if (col != ocol){
        $("input[name='sortcol']:checked").prop({"checked":false});
        $("input[name='sorttype']:checked").prop({"checked":false});
        if (col == 0){
            $("#sorttype0_1").prop({"checked":true});   
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1",1);
        } else {
            $("#sortcol"+col).prop({"checked":true});          
            $("#sorttype0").prop({"checked":true});                      
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", 0);          
        }
        dir=-1;
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol", col);          
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);                
    } else {
    //$("input[name='sortdir']:checked").each(function() {dir=this.value;});
    dir=dir*-1;
    $("input[name='sortdir']:checked").val(dir);
    localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);
    }
    resort();  
    magicHeading();
}

function process()
{     
    // Read dropdown from local storage
    clist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
    if (clist){ 
        clist=clist.split("**"); 
    } 

    // Create temporary list that complies with dropdown
    momtmp=new Array;
    var momname = "Moment unavailable";
    for(var l=0;l<moments.length;l++){
        if (moments[l].kind===4){
            momname = moments[l].entryname;
        }
        moments[l].momname = momname;   
    }
    
    // Create temporary list that complies with dropdown
    momtmp=new Array;
    for(var l=0;l<moments.length;l++){
        if (clist !== null ){
            index=clist.indexOf("hdr"+moments[l].lid+"check");
            if(clist[index+1]=="true"){
                momtmp.push(moments[l]);
            }
        } else {
            /* default to show every moment/dugga */
            momtmp.push(moments[l]);
        }
    }

    // Reconstitute table
    students=new Array;
    for(i=0;i<entries.length;i++){

      var uid=entries[i].uid;

    // Loop through all teacher names and store the appropriate name in a variable
    for(j=0; j<teacher.length;j++){
        var tuid=teacher[j].tuid;
    if(uid==tuid){
      var setTeacher = teacher[j].teacher;
      }
    }
    if(setTeacher !== null){
        // Place spaces in the string when a lowercase is followed by a uppercase
        setTeacher = setTeacher.replace(/([a-z])([A-Z])/g, '$1 $2');
      }
                    
          // All results of this student
          var res=results[uid];
          var restmp=new Array;
          
          if (typeof res != 'undefined'){
              // Pre-filter result list for a student for lightning-fast access
              for(var k=0;k<res.length;k++){
                  restmp[res[k].dugga]=res[k];
              }
          }
          var student=new Array;
          // Creates a string that displays the first <td> (the one that shows the studentname etc) and places it into an array
          student.push({grade:("<div class='dugga-result-div'>"+entries[i].firstname+" "+entries[i].lastname+"</div><div class='dugga-result-div'>"+entries[i].username+" / "+entries[i].class+"</div><div class='dugga-result-div'>"+entries[i].ssn+"</div><div class='dugga-result-div'>"+setTeacher+"</div>"),firstname:entries[i].firstname,lastname:entries[i].lastname,ssn:entries[i].ssn,class:entries[i].class,access:entries[i].access,setTeacher});
          // Now we have a sparse array with results for each moment for current student... thus no need to loop through it
          for(var j=0;j<momtmp.length;j++){
              // If it is a feedback quiz -- we have special handling.
              if(momtmp[j].quizfile=="feedback_dugga"){
                  var momentresult=restmp[momtmp[j].lid];   
                  // If moment result does not exist... either make "empty" student result or push mark
                  if(typeof momentresult!='undefined'){             
                      student.push({ishere:true,grade:momentresult.grade,marked:new Date((momentresult.marked*1000)),submitted:new Date((momentresult.submitted*1000)),kind:momtmp[j].kind,lid:momtmp[j].lid,uid:uid,needMarking:momentresult.needMarking,gradeSystem:momtmp[j].gradesystem,vers:momentresult.vers,userAnswer:momentresult.useranswer,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, quizfile:momtmp[j].quizfile, timesGraded:momentresult.timesGraded, gradeExpire:momentresult.gradeExpire});
                  }else{
                      student.push({ishere:true,kind:momtmp[j].kind,grade:"",lid:momtmp[j].lid,uid:uid,needMarking:false,marked:new Date(0),submitted:new Date(0),grade:-1,vers:querystring['coursevers'],gradeSystem:momtmp[j].gradesystem,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, userAnswer:"UNK", quizfile:momtmp[j].quizfile, gradeExpire:momentresult.gradeExpire});              
                  }             
              }else{
                  var momentresult=restmp[momtmp[j].lid];
                  // If moment result does not exist... either make "empty" student result or push mark
                  if(typeof momentresult!='undefined'){             
                      student.push({ishere:true,grade:momentresult.grade,marked:new Date((momentresult.marked*1000)),submitted:new Date((momentresult.submitted*1000)),kind:momtmp[j].kind,lid:momtmp[j].lid,uid:uid,needMarking:momentresult.needMarking,gradeSystem:momtmp[j].gradesystem,vers:momentresult.vers,userAnswer:momentresult.useranswer,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant,quizfile:momtmp[j].quizfile, timesGraded:momentresult.timesGraded, gradeExpire:momentresult.gradeExpire});
                  }else{
                      student.push({ishere:false,kind:momtmp[j].kind,grade:"",lid:momtmp[j].lid,uid:uid,needMarking:false,marked:new Date(0),submitted:new Date(0),grade:-1,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, quizfile:momtmp[j].quizfile});              
                  }   
              }
          }
          students.push(student);
    }     
    // Update dropdown list
    var dstr="";

      dstr+="<div class='checkbox-dugga checkmoment' style='border-bottom:1px solid #888'><input type='checkbox' class='headercheck' name='selectduggatoggle' id='selectdugga' onclick='checkedAll();'><label class='headerlabel'>Select all/Unselect all</label></div>";

      var activeMoment = 0;
      for(var j=0;j<moments.length;j++){

        var lid=moments[j].lid;
        var name=moments[j].entryname;
        dstr+="<div class='checkbox-dugga";       
        if (moments[j].visible == 0) {dstr +=" checkhidden";}
        
        if (moments[j].kind == 4) {dstr +=" checkmoment";}
        
        dstr+="'><input name='selectdugga' type='checkbox' class='headercheck' id='hdr"+lid+"check'";
              if (moments[j].kind == 4) {
                    duggaArray.push( [] );
                    var idAddString = "hdr"+lid+"check";
                  dstr+=" onclick='checkMomentParts(" + activeMoment + ", \"" + idAddString + "\"); toggleAll();'";
                    activeMoment++;
                } else {
                var idAddString = "hdr"+lid+"check";
                    if(activeMoment>0){
                        duggaArray[activeMoment-1].push(idAddString);
                    }else{
                        duggaArray[activeMoment].push(idAddString);
                    }
        }

        if (clist){
            index=clist.indexOf("hdr"+lid+"check");
            if(index>-1){
                if(clist[index+1]=="true"){
                    dstr+=" checked ";
                }
            }                   
        } else {
            /* default to check every visible dugga/moment */
            if (moments[j].visible != 0) dstr+=" checked ";
        }     
        dstr+=">";
        dstr+= "<label class='headerlabel' id='hdr"+lid;
        dstr+="' for='hdr"+lid+"check' ";
        dstr+=">"+name+"</label></div>";
    }
    // Filter for teachers.
    dstr+="<div class='checkbox-dugga checkmoment' style='border-bottom:1px solid #888'>";
    dstr+="<input type='checkbox' class='headercheck' name='showTeachers' value='0' id='showteachers'";
    if(clist){
      index=clist.indexOf("showteachers");
      if(index>-1){
        if(clist[index+1]=="true"){
          dstr+=" checked";
        }
      }
    }
    dstr+="><label class='headerlabel' for='showteachers'>Show Teachers</label></div>";

    // Filter for only showing pending
    dstr+="<div class='checkbox-dugga checkmoment'><input type='checkbox' class='headercheck' name='pending' value='0' id='pending'";
    if (onlyPending){ dstr+=" checked"; }
    dstr+="><label class='headerlabel' for='pending'>Only pending</label>";
  dstr+="<div style='display:flex;justify-content:flex-end;border-top:1px solid #888'><button onclick='leavec()'>Filter</button></div>";

  document.getElementById("dropdownc").innerHTML=dstr;
  var dstr="";

  // Sorting
    dstr+="<div class='checkbox-dugga' style='border-bottom:1px solid #888'><input type='radio' class='headercheck' name='sortdir' value='1' id='sortdir1'><label class='headerlabel' for='sortdir1'>Sort ascending</label><input name='sortdir' onclick='toggleSortDir(0)' type='radio' class='headercheck' value='-1' id='sortdir0'><label class='headerlabel' for='sortdir0'>Sort descending</label></div>";
  dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(0)' value='0' id='sortcol0_0'><label class='headerlabel' for='sortcol0_0' >Firstname</label></div>";
  dstr+="<div class='checkbox-dugga' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(1)' value='0' id='sortcol0_1'><label class='headerlabel' for='sortcol0_1' >Lastname</label></div>";
  dstr+="<div class='checkbox-dugga' style='border-bottom:1px solid #888;' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(2)' value='0' id='sortcol0_2'><label class='headerlabel' for='sortcol0_2' >SSN</label></div>";   
    dstr+="<div class='checkbox-dugga' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(3)' value='0' id='sortcol0_3'><label class='headerlabel' for='sortcol0_3' >Class</label></div>";
    dstr+="<div class='checkbox-dugga' style='border-bottom:1px solid #888;' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(4)' value='0' id='sortcol0_4'><label class='headerlabel' for='sortcol0_4' >Teacher</label></div>";

    dstr+="<table><tr><td>";
    for(var j=0;j<momtmp.length;j++){
        var lid=moments[j].lid;
        var name=momtmp[j].entryname;
        var truncatedname=name;
        if(truncatedname.length>12){
                    truncatedname=momtmp[j].entryname.slice(0, 3)+"..."+momtmp[j].entryname.slice(momtmp[j].entryname.length-8);
        }


        dstr+="<div class='checkbox-dugga checknarrow ";        
        if (moments[j].visible == 0){
            dstr+="checkbox-dugga-hidden'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(-1)' id='sortcol"+(j+1)+"' value='"+(j+1)+"'><label class='headerlabel' title='"+name+"' for='sortcol"+(j+1)+"' >"+truncatedname+"</label></div>";
        }else{
            dstr+="'><input name='sortcol' type='radio' class='sortradio' id='sortcol"+(j+1)+"' onclick='sorttype(-1)' value='"+(j+1)+"'><label class='headerlabel' title='"+name+"' for='sortcol"+(j+1)+"' >"+truncatedname+"</label></div>";
        }
    }
    dstr+="</td><td style='vertical-align:top;'>";
    dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(0)' id='sorttype0' value='0'><label class='headerlabel' for='sorttype0' >FIFO</label></div>";
    dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(1)' id='sorttype1' value='1'><label class='headerlabel' for='sorttype1' >Grade</label></div>";
    dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(2)' id='sorttype2' value='2'><label class='headerlabel' for='sorttype2' >Submitted</label></div>";
    dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(3)' id='sorttype3' value='3'><label class='headerlabel' for='sorttype3' >Marked</label></div>";
    dstr+="</td></tr></table>";
    dstr+="<div style='display:flex;justify-content:flex-end;border-top:1px solid #888'><button onclick='leaves()'>Sort</button></div>"
    document.getElementById("dropdowns").innerHTML=dstr;  

    resort();
    //console.log(performance.now()-tim);
}

function hoverc()
{
  toggleAll(); // Check toggle all if there are any elements checked
    $('#dropdowns').css('display','none');
    $('#dropdownc').css('display','block');
}

function leavec()
{
  $('#dropdownc').css('display','none');   
  
  // Update columns only now
  var str="";
  $(".headercheck").each(function(){
      str+=$(this).attr("id")+"**"+$(this).is(':checked')+"**";
  });
  
  showTeachers=$('#showteachers').is(":checked");
    old=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
    localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees",str);

  onlyPending=$('#pending').is(":checked");
    var opend=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-pending");
    localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-pending", onlyPending);

  if(str!=old || onlyPending==opend) process();
  magicHeading();
}

// Function to select and unselect all duggas 
function checkedAll() {
  // Current state
  var duggaElements = document.getElementsByName("selectdugga");
  var selectToggle = document.getElementById('selectdugga');

  // Are there any elements checked?
  var anyChecked = false;

  for (var i =0; i < duggaElements.length; i++) {
    if(duggaElements[i].checked) {
      anyChecked = true;
      break;
    }
  }

  // Yes, there is at lease one element checked, so default is clear
  if(anyChecked) {
    selectToggle.checked = false;
    for (var i =0; i < duggaElements.length; i++) {
      duggaElements[i].checked = false;    
    }
  } else { // There are no element(s) checked, so set all
    selectToggle.checked = true;
    for (var i =0; i < duggaElements.length; i++) {
      duggaElements[i].checked = true;    
    }
  }
}

// Check all/none box if there are any filters on, else uncheck
function toggleAll() {
  // Current state
  var duggaElements = document.getElementsByName("selectdugga");
  var selectToggle = document.getElementById('selectdugga');

  // Are there any elements checked?
  var anyChecked = false;

  for (var i =0; i < duggaElements.length; i++) {
    if(duggaElements[i].checked) {
      anyChecked = true;
      break;
    }
  }

  selectToggle.checked = anyChecked;
}

function checkMomentParts(pos, id) {
  for (var i = 0; i < duggaArray[pos].length; i++) {
    var setThis = document.getElementById(duggaArray[pos][i]);
    setThis.checked = document.getElementById(id).checked;
  }
}

function hovers()
{
    $('#dropdownc').css('display','none');
    $('#dropdowns').css('display','block');
}

function leaves()
{
  $('#dropdowns').css('display','none'); 
  var col=0;
  var dir=1;

  var ocol=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
  var odir=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir"); 

    
  $("input[name='sortcol']:checked").each(function() {col=this.value;});
  $("input[name='sortdir']:checked").each(function() {dir=this.value;});
  
  localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol", col);
  localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);


  if (!(ocol==col && odir==dir) || typechanged) {
    typechanged=false;
    resort();
  }
  magicHeading();
}

function sorttype(t){
    var c=$("input[name='sortcol']:checked").val();
    if (c == 0){
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1", t);   
        $("input[name='sorttype']").prop("checked", false);
    } else {
        if (t == -1){
            t = localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", t);
            $("#sorttype"+t).prop("checked", true);                     
        } else {
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", t);
            $("#sorttype"+t).prop("checked", true);         
        }
    }
    typechanged=true;
    magicHeading();
}

function magicHeading()
{
    // Display Magic Headings when scrolling
    if(window.pageYOffset+15>$("#subheading").offset().top){
        $("#upperDecker").css("display","block");
    }else{
        $("#upperDecker").css("display","none");            
    }
    
    $("#upperDecker").css("width",$("#markinglist").outerWidth()+"px");
    
    if(window.pageXOffset>$("#subheading").offset().left){
        $("#sideDecker").css("display","block");
    }else{
        $("#sideDecker").css("display","none");      
    }
    
    // Add or Remove the inverse class depending on sorting
    $(".dugga-result-subheader").each(function(){
        var elemid=$(this).attr('id');
        var elemwidth=$(this).width();
        $("#"+elemid+"magic").css("width",elemwidth+"px");
        if($(this).hasClass("result-header-inverse")){
            $("#"+elemid+"magic").addClass("result-header-inverse");
        } else {
            $("#"+elemid+"magic").removeClass("result-header-inverse"); 
        }
    });

    // Position Magic Headings
    $("#upperDecker").css("top",(window.pageYOffset+48)+"px");
    $("#sideDecker").css("left",(window.pageXOffset)+"px");
}

$(function()
{
  $("#release").datepicker({ dateFormat : "yy-mm-dd" });
  $("#deadline").datepicker({ dateFormat : "yy-mm-dd" });
});

//----------------------------------------
// Commands:
//----------------------------------------

function gradeDugga(e, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire){

    closeWindows();
    
	var uidGrab = uid;
	var momentGrab = moment;
    var currentTime = new Date();
	var currentTimeGetTime = currentTime.getTime();
    	
    if ($(e.target ).hasClass("Uc")){
        changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
    } else if ($(e.target ).hasClass("Gc")) {
        changeGrade(2, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire);
		location.reload();
    } else if ($(e.target ).hasClass("VGc")){
        changeGrade(3, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
    } else if ($(e.target ).hasClass("U")) {
        changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
    } else if ($(e.target ).hasClass("Uh")){
        for(var a=0;a<students.length;a++){
            var student = students[a];
            
            for(var j=0;j<student.length;j++){
			    var studentObject = student[j];
				
				//Lid and uid is used to make sure that only the dugga that is intended to change grade change grade
				if(studentObject.lid === momentGrab && studentObject.uid === uidGrab){ // && studentObject.gradeExpire!=null
				
					var newGradeExpire = new Date(studentObject.gradeExpire);
					
					// This variable adds 24h to the current time
	                var newDateObj = new Date(newGradeExpire.getTime() + 24*60*60000);
                    var newGradeExpirePlusOneDay = newDateObj.getTime();
					
					// Compair the gradeExpire value to the current time
					if(newGradeExpirePlusOneDay > currentTimeGetTime){
						//The user must press the ctrl-key to activate if-statement
						if(event.ctrlKey){
							changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
						}else{
							alert("You must press down the ctrl-key to change from grade G to U.");
						}
					} else {
						alert("You can no longer change the grade to U, due to 24 hours has passed since grade G was set.");
					}
				}
            }
        }
   }
    else {
      //alert("This grading is not OK!");
    }
	
	
}

function makeImg(gradesys, cid, vers, moment, uid, mark, ukind,gfx,cls,qvariant,qid){
  return "<img src=\""+gfx+"\" id=\"grade-"+moment+"-"+uid+"\" class=\""+cls+"\" onclick=\"gradeDugga(event,"+gradesys+","+cid+",'"+vers+"',"+moment+","+uid+","+mark+",'"+ukind+"',"+qvariant+","+qid+");\"  />";
}

function makeSelect(gradesys, cid, vers, moment, uid, mark, ukind, qvariant, qid)
{

    var str = "";

    // Irrespective of marking system we allways print - and U
    if (mark === null || mark === 0 || mark === -1){
        str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Uc.png","Uc", qvariant, qid);
    } else if (mark === 1) {
        str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/U.png","U", qvariant, qid);
    } else {
        str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Uh.png","Uh", qvariant, qid);
    }

    // Gradesystem: 1== UGVG 2== UG 3== U345
    if (gradesys === 1) {
      if (mark === 2){
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/G.png","G", qvariant, qid);
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VGh.png","VGh", qvariant, qid);
      } else if (mark === 3) {
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gh.png","Gh", qvariant, qid);
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VG.png","VG", qvariant, qid);
      } else {
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gc.png","Gc", qvariant, qid);
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VGc.png","VGc", qvariant, qid);
      }
    } else if (gradesys === 2) {
        if (mark === 2){
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/G.png","G", qvariant, qid);
        } else {
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gc.png","Gc", qvariant, qid);
        }
    } else if (gradesys === 3){
      /*
      if (mark === 4){
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\" value = \"4\" checked = \"checked\" onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\">3</label>";
      }
      else{
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\" value = \"4\"  onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\">3</label>";
      }
      if (mark === 5){
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\" value = \"5\" checked = \"checked\" onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\">4</label>";
      }
      else{
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\" value = \"5\"  onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\">4</label>";
      }
      if (mark === 6){
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\" value = \"6\" checked = \"checked\" onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\">5</label>";
      }
      else{
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\" value = \"6\"  onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\">5</label>";
      }
      */
    } else {
      //alert("Unknown Grade System: "+gradesys);
    }
    return str;
}

function hoverResult(cid, vers, moment, firstname, lastname, uid, submitted, marked)
{
    $("#Nameof").html(firstname + " " + lastname + " - Submitted: " + submitted + " Marked: " + marked);

    // Start counting pixels
    msx = -1;
    msy = -1;

    AJAXService("DUGGA", { cid : cid, vers : vers, moment : moment, luid : uid }, "RESULT");
}

function clickResult(cid, vers, moment, firstname, lastname, uid, submitted, marked, foundgrade, gradeSystem, lid, qvariant, qid)
{
    $("#Nameof").html(firstname + " " + lastname + " - Submitted: " + submitted + " Marked: " + marked);

    var menu = "<div class='' style='width:100px;display:block;'>";
    menu += "<div class='loginBoxheader'>";
    menu += "<h3>Grade</h3>";
    menu += "</div>";
    menu += "<table>";
    menu += "<tr><td>";
    if ((foundgrade === null && submitted === null )) {
      menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "I", parseInt(qvariant), parseInt(qid));
    }else if (foundgrade == -1){
      menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "IFeedback", parseInt(qvariant), parseInt(qid));
    }else if (foundgrade !== null){
      menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "U", parseInt(qvariant), parseInt(qid));
    }else {
      menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "U", parseInt(qvariant), parseInt(qid));
    }
    menu += "</td></tr>";
    menu += "</table>";
    menu += "</div> <!-- Menu Dialog END -->";
    document.getElementById('markMenuPlaceholder').innerHTML=menu;
    
    AJAXService("DUGGA", { cid : cid, vers : vers, moment : moment, luid : uid, coursevers : vers }, "RESULT");
}

function changeGrade(newMark, gradesys, cid, vers, moment, uid, mark, ukind, qvariant, qid, gradeExpire)
{
    var newFeedback = "UNK";
    if (document.getElementById('newFeedback') !== null){
        newFeedback = document.getElementById('newFeedback').value;
    }
    AJAXService("CHGR", { cid : cid, vers : vers, moment : moment, luid : uid, mark : newMark, ukind : ukind, newFeedback : newFeedback, qvariant : qvariant, quizId : qid, gradeExpire : gradeExpire }, "RESULT");
}

function moveDist(e)
{
    mmx = e.clientX;
    mmy = e.clientY;

    if (msx == -1 && msy == -1) {
      msx = mmx;
      msy = mmy;
    } else {
      // Count pixels and act accordingly
      if ((Math.abs(mmx - msx) + Math.abs(mmy - msy)) > 16) {
        $("#resultpopover").css("display", "none");
        closeFacit();
        document.getElementById('MarkCont').innerHTML="";
      }
    }
}

function enterCell(thisObj)
{  
      var c="";
      var u="";
      var cls = thisObj.className;
      var clsArr = cls.split(" ");
      for (var i=0;i<clsArr.length;i++){
          if (clsArr[i].indexOf("dugga-")!= -1){
              c = clsArr[i];
          } else if (clsArr[i].indexOf("u_")!= -1){
              u="."+clsArr[i];
          }
      }
      // highligt the row first
      $("tr"+u).addClass("highlightRow");
      
      if (c==="dugga-pass") {
          $(thisObj).addClass("dugga-pass-highlighted");
      } else if (c==="dugga-fail") {
          $(thisObj).addClass("dugga-fail-highlighted");      
      } else if (c==="dugga-pending") {
          $(thisObj).addClass("dugga-pending-highlighted");     
      } else if (c==="dugga-assigned") {
          $(thisObj).addClass("dugga-assigned-highlighted");
      } else if (c==="dugga-unassigned") {
          $(thisObj).addClass("dugga-unassigned-highlighted");      
      } else {
      }
}

function leaveCell(thisObj)
{
    $(thisObj).removeClass("dugga-pass-highlighted dugga-fail-highlighted dugga-assigned-highlighted dugga-unassigned-highlighted dugga-pending-highlighted");
    $("tr").removeClass("highlightRow");
}

//----------------------------------------
// Adds Canned Response to Response Dialog
//----------------------------------------

function displayPreview(filepath, filename, fileseq, filetype, fileext, fileindex, displaystate)
{
    clickedindex=fileindex;
    document.getElementById("responseArea").outerHTML='<textarea id="responseArea" style="width: 100%;height:100%;-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;">'+allData["files"][allData["duggaentry"]][clickedindex].feedback+'</textarea>'
    
    if(displaystate){
        document.getElementById("markMenuPlaceholderz").style.display="block";    
    }else{
        document.getElementById("markMenuPlaceholderz").style.display="none";   
    } 
        
    var str ="";
    if (filetype === "text") {
        str+="<textarea style='width: 100%;height: 100%;box-sizing: border-box;'>"+allData["files"][allData["duggaentry"]][fileindex].content+"</textarea>";
    } else if (filetype === "link"){
        var filename=allData["files"][allData["duggaentry"]][fileindex].content;
        if(window.location.protocol === "https:"){
            filename=filename.replace("http://", "https://");
        }else{
            filename=filename.replace("https://", "http://");       
        }
        str += '<iframe src="'+filename+'" width="100%" height="100%" />';      
    } else {
        if (fileext === "pdf"){
            str += '<embed src="'+filepath+filename+fileseq+'.'+fileext+'" width="100%" height="100%" type="application/pdf" />';       
        } else if (fileext === "zip" || fileext === "rar"){
            str += '<a href="'+filepath+filename+fileseq+'.'+fileext+'"/>'+filename+'.'+fileext+'</a>';       
        } else if (fileext === "txt"){
            str+="<pre style='width: 100%;height: 100%;box-sizing: border-box;'>"+allData["files"][allData["duggaentry"]][fileindex].content+"</pre>";
        }
    }
    document.getElementById("popPrev").innerHTML=str;

    $("#previewpopover").css("display", "block");
}

//----------------------------------------
// Adds Canned Response to Response Dialog
//----------------------------------------

function addCanned()
{
    document.getElementById("responseArea").innerHTML+=document.getElementById("cannedResponse").value;
}

//----------------------------------------
// Sort results
//----------------------------------------

function saveResponse()
{
    respo=document.getElementById("responseArea").value;
  
    var filename=allData["files"][allData["duggaentry"]][clickedindex].filename+allData["files"][allData["duggaentry"]][clickedindex].seq;
  
    AJAXService("RESP", { cid : querystring['cid'],vers : querystring['coursevers'],resptext:respo, respfile:filename, duggaid: allData["duggaid"],luid : allData["duggauser"],moment : allData["duggaentry"], luid : allData["duggauser"] }, "RESULT");  
    document.getElementById("responseArea").innerHTML = "";
    $("#previewpopover").css("display", "none");
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedResults(data)
{
  if (data.gradeupdated === true){
      // Update background color
      $("#u"+data.duggauser+"_d"+data.duggaid).removeClass("dugga-fail dugga-pending dugga-assigned dugga-unassigned");
      if (data.results != "1"){
          $("#u"+data.duggauser+"_d"+data.duggaid).addClass("dugga-pass");
      } else {
          $("#u"+data.duggauser+"_d"+data.duggaid).addClass("dugga-fail");       
      }
      // Find the array row for updated grade in our local data structure "students"
      var rowpos=-1;
      var dpos=-1;
      for (var t=0;t<students.length;t++){
          if (students[t][1].uid == data.duggauser) {
              rowpos=t;
              for (var j=0;j<students[t].length;j++){
                  if (students[t][j].lid == data.duggaid){
                    dpos=j;
                    students[t][j].grade = parseInt(data.results);
                    break;
                  }
              }
              break;
          }
      }

      if(rowpos !== -1){
        // Regenerate the marking buttons to reflect the new grade
        var tst = makeSelect(students[rowpos][dpos].gradeSystem, querystring['cid'], students[rowpos][dpos].vers, parseInt(data.duggaid), parseInt(data.duggauser), parseInt(data.results), 'U', null, null);
        tst += "<img id='korf' class='fist";
        //console.log(students[rowpos][dpos]);
        if(students[rowpos][dpos].userAnswer===null){
          tst += " grading-hidden";
        }
        tst +="' src='../Shared/icons/FistV.png' onclick='clickResult(\"" + querystring['cid'] + "\",\"" + students[rowpos][dpos].vers + "\",\"" + students[rowpos][dpos].lid + "\",\"" + students[rowpos][0].firstname + "\",\"" + students[rowpos][0].lastname + "\",\"" + students[rowpos][dpos].uid + "\",\"" + students[rowpos][dpos].submitted + "\",\"" + students[rowpos][dpos].marked + "\",\"" + students[rowpos][dpos].grade + "\",\"" + students[rowpos][dpos].gradeSystem + "\",\"" + students[rowpos][dpos].lid + "\");' />";

        $("#u"+data.duggauser+"_d"+data.duggaid+" > .gradeContainer").html(tst);
      } else {
        alert("Error updating result");
      }
  } else {
    
    entries=data.entries;
    moments=data.moments;
    versions=data.versions;
    results=data.results;
    teacher=data.teachers;
    
    //tim=performance.now();

    subheading=0;

    if (data['debug'] !== "NONE!") alert(data['debug']);

    $(document).ready(function () {
            $("#dropdownc").mouseleave(function () {
                leavec();
            });
    });
    $(document).ready(function () {
            $("#dropdowns").mouseleave(function () {
                leaves();
            });
    });

    allData = data; // used by dugga.js
  
    if (data['dugganame'] !== "") {
        // Display student submission
        $.getScript(data['dugganame'], function() {
          $("#MarkCont").html(data['duggapage']);          
          showFacit(data['duggaparam'],data['useranswer'],data['duggaanswer'], data['duggastats'], data['files'],data['moment'],data['duggafeedback']);
        });
        $("#resultpopover").css("display", "block");
    } else {
        // Process and render filtered data
      process();  
    }
  }
}
