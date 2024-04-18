<?php
    function updateDugga() {
	var did = $("#did").val();
	var nme = $("#name").val();
	var autograde = $("#autograde").val();
	var gradesys = $("#gradesys").val();
	var template = $("#template").val();
  var qstart = $("#qstart").val()+" "+$("#qstartt").val()+":"+$("#qstartm").val();
  if($("#qstart").val()=="") {
		alert("Missing Start Date");
		return;
        
  }
	var deadline = $("#deadline").val()+" "+$("#deadlinet").val()+":"+$("#deadlinem").val();
	var release = $("#release").val()+" "+$("#releaset").val()+":"+$("#releasem").val();
	if($("#release").val()=="")release="UNK";
  var jsondeadline = {"deadline1":"", "comment1":"","deadline2":"", "comment2":"", "deadline3":"", "comment3":""};
  if($("#deadline").val()!=""){
      jsondeadline.deadline1=deadline;
      jsondeadline.comment1=$("#deadlinecomments1").val();
  }else{
      alert("Missing Deadline 1");
      return;
  }
  if(deadline < qstart) {
		alert(`Deadline before start:\nDeadline: ${deadline} - Start: ${qstart}`);
		return;
  }
  if($("#deadline2").val()!=""){
      jsondeadline.deadline2=$("#deadline2").val()+" "+$("#deadlinet2").val()+":"+$("#deadlinem2").val();
      jsondeadline.comment2=$("#deadlinecomments2").val();
  }else{
      jsondeadline.deadline2="";
      jsondeadline.comment2="";
  }

  if($("#deadline3").val()!=""){
      jsondeadline.deadline3=$("#deadline3").val()+" "+$("#deadlinet3").val()+":"+$("#deadlinem3").val();
      jsondeadline.comment3=$("#deadlinecomments3").val();
  }else{
      jsondeadline.deadline3="";
      jsondeadline.comment3="";
  }
  jsondeadline=JSON.stringify(jsondeadline);

	closeWindows();

	AJAXService("SAVDUGGA", { cid: querystring['courseid'], qid: did, nme: nme, autograde: autograde, gradesys: gradesys, template: template, qstart: qstart, deadline: deadline, jsondeadline: jsondeadline, release: release, coursevers: querystring['coursevers'] }, "DUGGA");
}
?>