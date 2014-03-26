<?php 
header("X-UA-Compatible: IE=edge,chrome=1");
$courseName="DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)";
$ajaxPath="../../../quizAjax/";

$adminQuizVariant = 0;

$duggaNr = 40 + $_GET["subtask"];

//$_POST['answerString']="T5,RP,D1,RN2,T4,S2,D2";
//$_POST['answerString']="PUSH,RN2,T4,RN3,S3,D2,PUSH,RN,T2,S1,D3,POP,RN,T3,S3,RP,D1,POP,RP,T7,S4,RP3,D2,RP2,T2,S2,D3";
$answerString='{"vertices":[{"x":200,"y":0,"z":0},{"x":0,"y":300,"z":0},{"x":0,"y":0,"z":400}],"triangles":[[0,1,2]]}';
if(isset($_GET['answerString'])) $answerString=$_GET['answerString'];
$courseOccasion="HT-13 LP4";
if(isset($_GET['courseOccasion'])) $courseOccasion=$_GET['courseOccasion'];

include "../dugga_checklogin.php";
$accountname=checklogin($errorMsg, $courseName, $courseOccasion, $duggaNr);

// Check admin stuff
$adminAccounts = array("sjod","a00nisse");
if (in_array($accountname,$adminAccounts) and isset($_GET["adminQuizVariant"]) and $_GET["adminQuizVariant"]>0) {
    $adminQuizVariant = $_GET["adminQuizVariant"];
}

if ($accountname):
?>

<html lang="en">
	<head>
		<title>Dugga</title>
		<meta charset="utf-8">
		<!--<style>
			body {
    margin: 0px;
				/*background-color: #000;*/
				overflow: hidden;
				background: -webkit-radial-gradient(circle, #1070a0, #2F2727);
        background: -moz-radial-gradient(circle,  #1070a0, #2F2727);
			}

			div {
    display:block;
    position: absolute;
    left: 20px;
				top: 20px;
				padding:15px;
				background-color:#cfcfcf;
				border:3px solid #bfbfbf;
			}
			button, input[type="submit"]{min-width:130px;}
		</style>-->
        <style>
#webgl_canvas {
width:600px;
                height:600px;
                border:2px solid black;
                float:left;
                padding:4px;
            }
            #infobox {
                border:2px solid black;
                background-color:#fed;
                width:300;float:left;
                margin-left:10px;
            }
            .triangle_vertex_selector {
    width: 3em;
            }
            .x_coord {
    color: red;
    display: inline;
}
            .y_coord {
    color: green;
    display: inline;
}
            .z_coord {
    color: blue;
    display: inline;
}
        </style>
		<script type="text/javascript" src="../js/jquery-1.8.0.min.js"></script>
		<script type="text/javascript" src="../js/three.min.js"></script>
		<script type="text/javascript" src="../js/helvetiker_regular.typeface.js"></script>
	</head>
	<body>
		<div id='webgl_canvas' style=''>
			<canvas id='b' width="600" height="600" style="position:absolute"></canvas>
		</div>

        <div id="infobox">
            <h3>Välkommen <?echo $accountname?></h3>

             <div id="quizInstructions"></div>

<br /><strong>Hörnlista:</strong><br />
<ol id="vertexListElement" start="0" style="margin-left:-8px;"></ol>

Nytt <div class="x_coord">x:<input class="x_coord" type="text" id="vertexX" style="width:40px;" value="0"/></div>
<div class="y_coord">y:<input class="y_coord" type="text" id="vertexY" style="width:40px;" value="0"/></div>
<div class="z_coord">z:<input class="z_coord" type="text" id="vertexZ" style="width:40px;" value="0" /></div>
<button onclick="newVertex();">LÄGG TILL</button>
<p id="vertexMsg" style="min-height:18px"></p>


<br /><strong>Trianglar</strong><br />
Hörn:
<select class="triangle_vertex_selector" id="tv1" onclick="updateVerticeDropdown(this)"></select>
<select class="triangle_vertex_selector" id="tv2" onclick="updateVerticeDropdown(this)"></select>
<select class="triangle_vertex_selector" id="tv3" onclick="updateVerticeDropdown(this)"></select>
<button onclick="newTriangle();">LÄGG TILL</button>

<br>Indexlista:<br>
<select style="width:150px;" size="10" id="triangleListElement" name="triangleListElement">
</select><br />
<button onclick="moveTriangleUp();">FLYTTA UPP</button>
<button onclick="moveTriangleDown();">FLYTTA NER</button><br />
<button onclick="deleteTriangle();">TA BORT</button>
<!--<button type="button" onclick="updateGeometry();">test</button>-->
<button type="button" onclick="toggleRotate();">ROTATION PÅ/AV</button>
<button type="button" onclick="toggleWireframeMode();">WF PÅ/AV</button>
<br />
<button type="button" onclick="submbutton();">SKICKA SVAR</button>
<!--</form>	-->
<div id="result"></div>
</div>

</div>

<script>
    // Variables from PHP.
    var account="<?php echo $accountname ?>";
    var duggaNr="<?php echo $duggaNr ?>";
    var courseName="<?php echo $courseName ?>";
    var courseOccasion="<?php echo $courseOccasion ?>";

    var ajaxPath = "<?php echo $ajaxPath?>";
    var adminQuizVariant = <?php echo $adminQuizVariant?>;

    var startString='<?php if(isset($answerString)) echo $answerString ?>';
</script>

<script type="text/javascript" src="dugga.js"></script>
<script type="text/javascript" src="main.js"></script>

</body>
</html>

<?php
else:
    include "../dugga_loginwindow.php";
endif;

?>

