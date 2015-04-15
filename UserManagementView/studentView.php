<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
 	
    <title>WEBUG - Program outline</title>

<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
	<!-- My Bootstrap override -->
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
    <link href="usermanagementview.css" rel="stylesheet">
	<link href="usermanagementview_student.css" rel="stylesheet">
        <script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="usermanagementview.js"></script>
	<script type="text/javascript" src="../Shared/dugga.js"></script>

  </head>
  <body>
  	<?php 
		$noup="NONE";
		$loginvar="COURSE"; 
		include '../Shared/navheader.php';
	?>

	<?php
		include '../Shared/loginbox.php';
	?>
		
	<!-- content START -->
  	<div id="contentUMV">
    
    	<!-- Dropdownmenu -->
    	<nav class="rightDropdownMenu">
        	<ul>
            	<li>
                	<a href="http://webblabb.iki.his.se:8080/umv/c13emmjo/week16/UserManagementView/teacherView.php">Nuvarande år</a>
                </li>
                <li>
                	<a href="#" >Tidigare år</a>
                </li> 
        	 </ul> 
        </nav>
       	<!-- End Dropdownmenu -->
        
	<!-- Program year and name -->
    <div id="studentTitle"><h3 id="headerText">Programår X för xxxxxxxxx</h3></div>
	<!-- End Program year and name -->
    
    <!-- Container for Progress Bars -->
    <div class="container" id="container">  
  	    
        <!-- Main Progress Bar -->    
        <div class="progress" id="progress1">
            	
            	<div class="progress-bar progress-bar-success" id="MainProgress" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:60%">
                </div>
                       
		</div>
		<!-- End Main Progress Bar -->
    
 		<!-- 1st G1N Partial progress Bar -->
       	<div class="progress" id="progress2">
    		
            <div class="progress-bar progress-bar-info" id="ProgressbarG1N"
            role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:50%">G1N</div>
      
  		</div>
  		<!-- End 1st G1N Partial progress Bar -->
  
  		<!-- 2st G2F Partial progress Bar -->
        <div class="progress" id="progress4">
            
    		<div class="progress-bar progress-bar-info" id="ProgressbarG2F"role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:20%">G2F</div>
    
  		</div>
  		<!-- End 2st G2F Partial progress Bar -->
        
   		<!-- 3st G1F Partial progress Bar -->
        <div class="progress" id="progress3">
        
    		<div class="progress-bar progress-bar-info" id="ProgressbarG1F"role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:90%">G1F</div>
      
  		</div>
  		<!-- End 3st G1F Partial progress Bar -->
	
    </div>
	<!-- End Container for Progress Bar -->    	
   	
    <!-- Indicator for Big progress bar  -->
    <div  id="progress_m">
      	             
    	<div id="m">40hp</div>  
             
    </div>
    <!-- End Indicator for Big progress bar  -->  
    </br>
   	
    <!-- Big Wrapp for all courses -->
    <div class="my-container-fluid clearfix">
    	    
        <!-- Year1 wrapp -->
        <div class="my-col-xs-4">
            
                <div class="panels">
                
                	<!-- Heading year2 -->
                    <div class="panelheading">
                  
                    	<h3 class="panel-title" id="panel-title">År 1 </h3>
                    
                  	</div>
                  	<!-- End Heading year2-->
                    
                
                <div id="year1-body" class="panel-body">
                  
                <!-- Course1 wrap -->
                <div id="course-1" class="courses">
                
                <!-- Course1 Inner wrap -->
                <div class="courseInnerWrapp">
                      
                        <!-- Course1 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course1 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course1 Bar -->
                            	<div class="progress" id="course_progress">
    							<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                </div>
 								
                                
                            	</div>    
                            	<!-- End Course1 Bar -->
                            
                        	</div>
                        	<!-- End Course1 Bar wrapp -->
                
               			</div>
                		<!-- End Course1 Name -->         
                   
                  <div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  <div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course1 Inner wrap -->
                
                </div>
                <!-- End Course1 wrap -->
                        
                <!-- Course2 wrap -->
                <div id="course-2" class="courses_second">
                
                <!-- Course2 Inner wrap -->
                <div class="courseInnerWrapp">
                      
               		<!-- Course2 Name -->  
                    <div id="courseName">Kursnamn
                        	
                    	<!-- Course2 Bar wrapp -->
                        <div class="courseBar">
                            	
                        	<!-- Course2 Bar -->
                            <div class="progress" id="course_progress">
    							<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                            	</div>
 								
                            </div>    
                            <!-- End Course2 Bar -->
                            
                        </div>
                        <!-- End Course2 Bar wrapp -->
                
               		</div>
                	<!-- End Course2 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course2 Inner wrap -->
                      	                          
                </div>
                
                <!-- Course3 wrap -->      
                <div id="course-3" class="courses">
                
                	<!-- Course3 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course3 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course3 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course3 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course3 Bar -->
                            
                        	</div>
                        	<!-- End Course3 Bar wrapp -->
                
               			</div>
                		<!-- End Course3 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course3 Inner wrap -->
                      	                          
                </div>
                <!-- End Course3 wrap --> 
                      
                <!-- Course4 wrap --> 
                <div id="course-4" class="courses_second">
                	
                    <!-- Course4 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course4 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course4 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course4 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course4 Bar -->
                            
                        	</div>
                        	<!-- End Course4 Bar wrapp -->
                
               			</div>
                		<!-- End Course4 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course4 Inner wrap -->
   
                </div>
                <!-- End Course4 wrap -->
                       
                <!-- Course5 wrap --> 
                <div id="course-5" class="courses">
                	
                    <!-- Course5 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course5 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course5 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course5 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course5 Bar -->
                            
                        	</div>
                        	<!-- End Course5 Bar wrapp -->
                
               			</div>
                		<!-- End Course5 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course5 Inner wrap -->
                      	                         
                </div>
                <!-- End Course5 wrap -->
                
                <!-- Course6 wrap -->      
                <div id="course-6" class="courses_second">
                
                	<!-- Course6 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course6 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course6 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course6 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course6 Bar -->
                            
                        	</div>
                        	<!-- End Course6 Bar wrapp -->
                
               			</div>
                		<!-- End Course6 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course6 Inner wrap -->
                      	                         
                </div>
                <!-- End Course6 wrap -->
                                             
                <!-- Course7 wrap -->
                <div id="course-7" class="courses">
                
                	<!-- Course7 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course7 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course7 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course7 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course7 Bar -->
                            
                        	</div>
                        	<!-- End Course7 Bar wrapp -->
                
               			</div>
                		<!-- End Course7 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course7 Inner wrap -->
                      	                         
                </div>
                <!-- End Course7 wrap -->
                
                <!-- Course8 wrap -->      
                <div id="course-8" class="courses_second">
                
                	<!-- Course8 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course8 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course8 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course8 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course8 Bar -->
                            
                        	</div>
                        	<!-- End Course8 Bar wrapp -->
                
               			</div>
                		<!-- End Course8 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course8 Inner wrap -->
                      	                        
                </div>                
                <!-- End Course8 wrap -->  
                  
			</div>
                  
        </div>
                
	</div>
    <!-- End Year1 wrapp -->
    
	<!-- Year2 wrapp -->
    <div class="my-col-xs-4">
            
                <div class="panels">
                
                	<!-- Heading year2 -->
                    <div class="panelheading">
                  
                    	<h3 class="panel-title" id="panel-title">År 2 </h3>
                    
                  	</div>
                  	<!-- End Heading year2-->
                    
                
                <div id="year1-body" class="panel-body">
                  
                <!-- Course9 wrap -->
                <div id="course-9" class="courses">
                
                <!-- Course9 Inner wrap -->
                <div class="courseInnerWrapp">
                      
                        <!-- Course9 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course9 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course9 Bar -->
                            	<div class="progress" id="course_progress">
    							<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                </div>
 								
                                
                            	</div>    
                            	<!-- End Course9 Bar -->
                            
                        	</div>
                        	<!-- End Course9 Bar wrapp -->
                
               			</div>
                		<!-- End Course9 Name -->         
                   
                  <div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  <div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course9 Inner wrap -->
                
                </div>
                <!-- End Course9 wrap -->
                       
                <!-- Course10 wrap -->
                <div id="course-10" class="courses_second">
                
                <!-- Course10 Inner wrap -->
                <div class="courseInnerWrapp">
                      
               		<!-- Course10 Name -->  
                    <div id="courseName">Kursnamn
                        	
                    	<!-- Course10 Bar wrapp -->
                        <div class="courseBar">
                            	
                        	<!-- Course10 Bar -->
                            <div class="progress" id="course_progress">
    							<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                            	</div>
 								
                            </div>    
                            <!-- End Course10 Bar -->
                            
                        </div>
                        <!-- End Course10 Bar wrapp -->
                
               		</div>
                	<!-- End Course10 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course10 Inner wrap -->
                      	                          
                </div>
                
                <!-- Course11 wrap -->      
                <div id="course-11" class="courses">
                
                	<!-- Course11 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course11 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course11 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course11 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course11 Bar -->
                            
                        	</div>
                        	<!-- End Course11 Bar wrapp -->
                
               			</div>
                		<!-- End Course11 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course11 Inner wrap -->
                      	                          
                </div>
                <!-- End Course11 wrap --> 
                      
                <!-- Course12 wrap --> 
                <div id="course-12" class="courses_second">
                	
                    <!-- Course12 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course12 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course12 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course12 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course12 Bar -->
                            
                        	</div>
                        	<!-- End Course12 Bar wrapp -->
                
               			</div>
                		<!-- End Course12 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course12 Inner wrap -->
   
                </div>
                <!-- End Course12 wrap -->
                       
                <!-- Course13 wrap --> 
                <div id="course-13" class="courses">
                	
                    <!-- Course13 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course13 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course13 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course13 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course13 Bar -->
                            
                        	</div>
                        	<!-- End Course13 Bar wrapp -->
                
               			</div>
                		<!-- End Course13 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course13 Inner wrap -->
                      	                         
                </div>
                <!-- End Course13 wrap -->
                
                <!-- Course14 wrap -->      
                <div id="course-14" class="courses_second">
                
                	<!-- Course14 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course14 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course14 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course14 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course14 Bar -->
                            
                        	</div>
                        	<!-- End Course14 Bar wrapp -->
                
               			</div>
                		<!-- End Course14 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course14 Inner wrap -->
                      	                         
                </div>
                <!-- End Course14 wrap -->
                                             
                <!-- Course15 wrap -->
                <div id="course-15" class="courses">
                
                	<!-- Course15 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course15 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course15 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course15 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course15 Bar -->
                            
                        	</div>
                        	<!-- End Course15 Bar wrapp -->
                
               			</div>
                		<!-- End Course15 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course15 Inner wrap -->
                      	                         
                </div>
                <!-- End Course15 wrap -->
                
                <!-- Course16 wrap -->      
                <div id="course-16" class="courses_second">
                
                	<!-- Course16 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course16 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course16 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course16 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course16 Bar -->
                            
                        	</div>
                        	<!-- End Course16 Bar wrapp -->
                
               			</div>
                		<!-- End Course16 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course16 Inner wrap -->
                      	                        
                </div>                
                <!-- End Course16 wrap -->  
                  
			</div>
                  
        </div>
                
	</div>
    <!-- End Year2 wrapp -->
    
    <!-- Year3 wrapp -->
        <div class="my-col-xs-4">
            
                <div class="panels">
                
                	<!-- Heading year3 -->
                    <div class="panelheading">
                  
                    	<h3 class="panel-title" id="panel-title">År 1 </h3>
                    
                  	</div>
                  	<!-- End Heading year3 -->
                    
                
                <div id="year1-body" class="panel-body">
                  
                <!-- Course17 wrap -->
                <div id="course-17" class="courses">
                
                <!-- Course17 Inner wrap -->
                <div class="courseInnerWrapp">
                      
                        <!-- Course17 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course17 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course17 Bar -->
                            	<div class="progress" id="course_progress">
    							<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                </div>
 								
                                
                            	</div>    
                            	<!-- End Course17 Bar -->
                            
                        	</div>
                        	<!-- End Course17 Bar wrapp -->
                
               			</div>
                		<!-- End Course17 Name -->         
                   
                  <div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  <div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course17 Inner wrap -->
                
                </div>
                <!-- End Course17 wrap -->
                        
                <!-- Course18 wrap -->
                <div id="course-18" class="courses_second">
                
                <!-- Course18 Inner wrap -->
                <div class="courseInnerWrapp">
                      
               		<!-- Course18 Name -->  
                    <div id="courseName">Kursnamn
                        	
                    	<!-- Course18 Bar wrapp -->
                        <div class="courseBar">
                            	
                        	<!-- Course18 Bar -->
                            <div class="progress" id="course_progress">
    							<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                            	</div>
 								
                            </div>    
                            <!-- End Course18 Bar -->
                            
                        </div>
                        <!-- End Course18 Bar wrapp -->
                
               		</div>
                	<!-- End Course18 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course18 Inner wrap -->
                      	                          
                </div>
                
                <!-- Course19 wrap -->      
                <div id="course-19" class="courses">
                
                	<!-- Course19 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course19 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course19 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course19 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course19 Bar -->
                            
                        	</div>
                        	<!-- End Course19 Bar wrapp -->
                
               			</div>
                		<!-- End Course19 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course19 Inner wrap -->
                      	                          
                </div>
                <!-- End Course19 wrap --> 
                      
                <!-- Course20 wrap --> 
                <div id="course-20" class="courses_second">
                	
                    <!-- Course20 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course20 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course20 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course20 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course20 Bar -->
                            
                        	</div>
                        	<!-- End Course20 Bar wrapp -->
                
               			</div>
                		<!-- End Course20 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course20 Inner wrap -->
   
                </div>
                <!-- End Course20 wrap -->
                       
                <!-- Course21 wrap --> 
                <div id="course-21" class="courses">
                	
                    <!-- Course21 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course21 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course21 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course21 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course21 Bar -->
                            
                        	</div>
                        	<!-- End Course21 Bar wrapp -->
                
               			</div>
                		<!-- End Course21 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course21 Inner wrap -->
                      	                         
                </div>
                <!-- End Course21 wrap -->
                
                <!-- Course22 wrap -->      
                <div id="course-22" class="courses_second">
                
                	<!-- Course22 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course22 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course22 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course22 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course22 Bar -->
                            
                        	</div>
                        	<!-- End Course22 Bar wrapp -->
                
               			</div>
                		<!-- End Course22 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course22 Inner wrap -->
                      	                         
                </div>
                <!-- End Course22 wrap -->
                                             
                <!-- Course23 wrap -->
                <div id="course-23" class="courses">
                
                	<!-- Course23 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course23 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course23 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course23 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                </div>    
                            	<!-- End Course23 Bar -->
                            
                        	</div>
                        	<!-- End Course23 Bar wrapp -->
                
               			</div>
                		<!-- End Course23 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course23 Inner wrap -->
                      	                         
                </div>
                <!-- End Course23 wrap -->
                
                <!-- Course24 wrap -->      
                <div id="course-24" class="courses_second">
                
                	<!-- Course24 Inner wrap -->
                	<div class="courseInnerWrapp">
                      
                        <!-- Course24 Name -->  
                       	<div id="courseName">Kursnamn
                        	
                            <!-- Course24 Bar wrapp -->
                        	<div class="courseBar">
                            	
                                <!-- Course24 Bar -->
                            	<div class="progress" id="course_progress">
    								<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:60%">60% Complete (warning)
                                	</div>
 								
                                
                            	</div>    
                            	<!-- End Course24 Bar -->
                            
                        	</div>
                        	<!-- End Course24 Bar wrapp -->
                
               			</div>
                		<!-- End Course24 Name -->         
                   
                  	<div id="courseLink"><a href="#">Länk till kurssida</a></div>
                  	<div id="courseResponsible">Kursanvarig:<a href="mailto:">Marcus Brohede</a></div>
                      
                </div>
                <!-- End Course24 Inner wrap -->
                      	                        
                </div>                
                <!-- End Course24 wrap -->  
                  
			</div>
                  
        </div>
                
	</div>
    <!-- End Year wrapp -->            
        
  </div>
  <!-- End Big Wrapp for all courses -->  
    
    
    
    
	</div>		
  <!-- Section List -->

	<!-- content END -->

  </body>
</html>
