function validateNewCourseSubmit() 
{
  if( document.newCourse.coursename.value == "" ) {
    $("input[name*='coursename']").css("background-color", "#ff7c6a");
    return false;
  } else {
    $("input[name*='coursename']").css("background-color", "#89ff7b");
  }
  if( document.newCourse.coursecode.value == "" ) {
    $("input[name*='coursecode']").css("background-color", "#ff7c6a");
    return false;
  } else {
    $("input[name*='coursecode']").css("background-color", "#89ff7b");
  }
  if( document.newCourse.visib.value == "-1") {
    $("select").css("background-color", "#ff7c6a");
    return false;
  } else {
    $("select").css("background-color", "#89ff7b");
  }
  return true;
}

function validateNewQuizSubmit() 
{
  if( document.newQuizForm.quizname.value == "" ) {
  	console.log("quizname not valid");
    $("input[name*='quizname']").css("background-color", "#ff7c6a");
    return false;
  } else {
  }
  if( document.newQuizForm.gradesysselect.value == "-1") {
    $("#gradeSysSelect").css("background-color", "#ff7c6a");
    return false;
  } else {
  }
  if (document.newQuizForm.autogradebox.checked && document.newQuizForm.answerinput.value=="") {
  	$("#quizAnswerInput").css("background-color", "#ff7c6a");
  	return false;
  } else {
  	
  };

  	var releasedateinput = new Date(document.newQuizForm.releasedateinput.value);
	var deadlineinput = new Date(document.newQuizForm.deadlineinput.value);

	if (releasedateinput >= deadlineinput) {
	    $("#deadlineinput").css("background-color", "#ff7c6a");
	    return false;
	}

  return true;
}

function validateNewSectionSubmit()
{
	if( document.newSection.sectionname.value == "" ) {
		$("input[name*='sectionname']").css("background-color", "#ff7c6a");
		return false;
	} else {
		$("input[name*='sectionname']").css("background-color", "#89ff7b");
	}
	if( document.newSection.type.value == -1 ) {
		$("select[name*='type']").css("background-color", "#ff7c6a");
		return false;
	} else {
		$("select[name*='type']").css("background-color", "#89ff7b");
	}
	if( document.newSection.visib.value == "-1") {
		$("select[name*='visib']").css("background-color", "#ff7c6a");
		return false;
	} else {
		$("select[name*='visib']").css("background-color", "#89ff7b");
	}
	
	if( document.newSection.type.value == 4 &&  document.newSection.link.value == "") {
		$("input[name*='link']").css("background-color", "#ff7c6a");
		return false;
	} else if ( document.newSection.type.value == 4 &&  document.newSection.link.value != "" ) {
		$("input[name*='link']").css("background-color", "#89ff7b");
	}
	return true;
}

function validateUpdateCourses(ID)
{
	var element = document.getElementById('settings_'+ID);
	var elementChild = element.childNodes[0];
	var settingsChildren = elementChild.childNodes;
	for(i = 0; i < settingsChildren.length; i++) {
		if (settingsChildren[i].nodeType == 1) {
			if (settingsChildren[i].getAttribute("name") == "coursename") {
				if (settingsChildren[i].value == "") {
					$("input[name*='coursename']").css("background-color", "#ff7c6a");
					return false;
				} else {
					$("input[name*='coursename']").css("background-color", "#89ff7b");
					break;
				}
			}
		}
	}
	return true;
}

function validateUpdateSections(ID)
{
	var element = document.getElementById('sectioned_'+ID);
	var settingsChildren = element.childNodes;
	for(i = 0; i < settingsChildren.length; i++) {
		if (settingsChildren[i].nodeType == 1) {
			if (settingsChildren[i].getAttribute("name") == "sectionname") {
				if (settingsChildren[i].value == "") {
					$("input[name*='sectionname']").css("background-color", "#ff7c6a");
					return false;
				} else {
					$("input[name*='sectionname']").css("background-color", "#89ff7b");
					break;
				}
			}
		}
	}
	return true;
}

function validateNewPasswordSubmit()
{
	var parent = $("form[name=newPassword]");
	var curpw = parent.find('input[name=currentpassword]'),
		newp1 = parent.find('input[name=password]'),
		newp2 = parent.find('input[name=password2]');
	var errnum = 0;

	var elems = [curpw, newp1, newp2];

	for(var i = 0; i < elems.length; i++) {
		if(elems[i].val().length < 1) {
			elems[i].css("background-color", "#ff7c6a");
			errnum++;
		} else {
			elems[i].css("background-color", "#89ff7b");
		}
	}

	if(newp1.val() != newp2.val()) {
		errnum++;
		newp1.css("background-color", "#ff7c6a");
		newp2.css("background-color", "#ff7c6a");
	}


	return errnum < 1;
}
