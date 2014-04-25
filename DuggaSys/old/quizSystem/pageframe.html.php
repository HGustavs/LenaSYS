<html>
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link href="css/base.css" rel="stylesheet" type="text/css" />
		<link href="css/app.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
		<title><?php $pagetitle ?></title>
		<script type="text/javascript">
			$(document).ready(function() {
				/* $('form').find(':input[type=submit]').focus(function() {
					target = this;
					alert("1:"+target);
				});*/
				$('form').submit(function() { 
					//alert("2:"+target);
					//alert("form submitted "+$(document).scrollTop()+" "+$(this).find("#scrolly").val());
					$(this).find("#scrolly").val($(document).scrollTop());
					//var val = $("input[type=submit][clicked=true]").val()
				});
				$('.confirm').click(function(){
					var answer = confirm('Are you sure?');
					return answer // answer is a boolean
				});  
				<?php 
				if(isset($_POST['scrolly'])){ 
					echo '$(document).scrollTop('.$_POST['scrolly'].');';
					//echo 'alert("setting scrolly");';
				}	
				?>
			});
			
		
		</script>
	</head>
	<body>
	<div id="wrapper">

            <div id="menu">
                <?php include "menu.php"; ?>
				
            </div>
			<?php
			echo '<div id="messages"';
			
                if (isset($errorMsg) && $errorMsg != "") {
                   echo " class='errorMsg'>".$errorMsg." ";
                } else if (isset($userMsg) && $userMsg != "") {
                   echo " class='userMsg'>".$userMsg." ";
                } else {
					echo "class='hiddenMsg'>";
				}
			
			echo '</div>';
            ?>
			<div id="content">
               
                
                <?php
                // DEBUG //////
				/*echo "<pre>";
                print_r($_POST);
				//print_r($_SESSION);
                echo "</pre>";*/
				///////////////
                ?>
                <?php include $content; ?>
            </div>
            <div id="footer">
                <p>Page footer</p>
				 <?php
                // DEBUG //////
				echo "<pre>";
                print_r($_POST);
				//print_r($_SESSION);
                echo "</pre>";
				///////////////
                ?>
            </div>
        </div>	
    </body>
</html>
