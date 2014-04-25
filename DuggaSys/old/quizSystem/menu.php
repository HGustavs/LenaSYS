<form name="aboutPageMenuLink" action="." method="post">
	<input type="hidden" name="aboutPageLink" /> 
	<a href="#" onclick="document['aboutPageMenuLink'].submit();return false;" <?php if (isset($_POST['aboutPageLink']) )
    echo 'class="currentLink"' ?>>About</a>
</form>
<form name="dataMenuLink" action="." method="post">
    <input type="hidden" name="dataLink" /> 
    <a href="#" onclick="document['dataMenuLink'].submit();return false;" <?php if (isset($_POST['dataLink']) )
    echo 'class="currentLink"' ?>>Database dump</a>
</form>
<form name="registerStudentsMenuLink" action="." method="post">
    <input type="hidden" name="registerStudentsLink" /> 
    <a href="#" onclick="document['registerStudentsMenuLink'].submit();return false;" <?php if (isset($_POST['registerStudentsLink']))
    echo 'class="currentLink"' ?>>Register students</a>
</form>
<form name="studentsMenuLink" action="." method="post">
    <input type="hidden" name="listStudentsLink" /> 
    <a href="#" onclick="document['studentsMenuLink'].submit();return false;" <?php if (isset($_POST['listStudentsLink']))
    echo 'class="currentLink"' ?>>List students</a>
</form>
<form name="listQuizzesMenuLink" action="." method="post">
    <input type="hidden" name="listQuizzesLink" /> 
    <a href="#" onclick="document['listQuizzesMenuLink'].submit();return false;" <?php if (isset($_POST['listQuizzesLink']))
    echo 'class="currentLink"' ?>>Edit quizzes</a>
</form>
<form name="checkQuizzesMenuLink" action="." method="post">
    <input type="hidden" name="checkQuizzesLink" /> 
    <a href="#" onclick="document['checkQuizzesMenuLink'].submit();return false;" <?php if (isset($_POST['checkQuizzesLink']))
    echo 'class="currentLink"' ?>>Check quizzes</a>
</form><form name="coursesMenuLink" action="." method="post">
    <input type="hidden" name="coursesLink" /> 
    <a href="#" onclick="document['coursesMenuLink'].submit();return false;" <?php if (isset($_POST['coursesLink']))
    echo 'class="currentLink"' ?>>Courses</a>
</form>
<!-- In development -->
<!--<form name="searchAllForm" action="." method="post" class="searchForm">
    <input type="text" name="searchString" value="" /> 
    <a href="#" onclick="document['searchAllForm'].submit();return false;">Search</a>
</form>-->
<form name="logoutMenuLink" action="." method="post" class="logoutForm">
    <input type="hidden" name="logoutLink" /> 
    <a href="#" onclick="document['logoutMenuLink'].submit();return false;">Log out</a>
</form>
