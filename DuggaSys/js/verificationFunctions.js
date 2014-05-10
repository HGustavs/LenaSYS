function validateNewCourseSubmit() 
{
  if( document.newCourse.coursename.value == "" ){
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
  if( document.newCourse.visib.value == "0") {
    $("select").css("background-color", "#ff7c6a");
    return false;
  } else {
    $("select").css("background-color", "#89ff7b");
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
	return true;
}