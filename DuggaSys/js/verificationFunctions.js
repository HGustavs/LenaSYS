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