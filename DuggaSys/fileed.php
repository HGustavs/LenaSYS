<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>File editor</title>
	<link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
	<link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">  
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<script src="../Shared/dugga.js"></script>
	<script src="../Shared/SortableTableLibrary/sortableTable.js"></script> 
	<script src="fileed.js"></script>
    <script src="../Shared/markdown.js"></script>

</head>
<body onload="previewOnload();setupSort()">
	<?php 
		$noup="SECTION";
		include '../Shared/navheader.php';
	?>

	<!-- content START -->
	<div id="content">
		<div class='titles' style='padding-top:10px;'>
			<h1 style='flex:1;text-align:center;'>Files</h1>
		</div>
		<div id="searchBar">
			<input id="searchinput" type="text" name="search" placeholder="Search.." onkeyup="searchterm=document.getElementById('searchinput').value;searchKeyUp(event);fileLink.renderTable();">
			<button id="searchbutton" class="switchContent" onclick="return searchKeyUp(event);" type="button">
				<img id="lookingGlassSVG" style="height:18px;" src="../Shared/icons/LookingGlass.svg">
			</button>
		</div>
    	<input class='submit-button fileed-button' type='button' value='Add Link' onclick='showLinkPopUp();'/>
		<input class='submit-button fileed-button' type='button' value='Add File' onclick='showFilePopUp();'/>
		<div id="fileLink" style='width:100%;'></div>
		<!-- content END -->
	
		<?php 
			include '../Shared/loginbox.php';
		?>

		<!-- Add File Dialog START -->
		<div id='addFile' class='loginBoxContainer' style='display:none;'>
      		<div class='loginBox' style='width:464px;'>
	      		<div class='loginBoxheader' style='cursor:default;'>
	      			<h3 class="filePopUp">Add File</h3>
	      			<h3 class="linkPopUp">Add Link</h3>
	      			<div class='cursorPointer' onclick='closeAddFile();'>x</div>
	      		</div>
      			<form enctype="multipart/form-data" action="filereceive.php" onsubmit="return validateForm()" method="POST">
      				<div>
	      				<input type='hidden' id='cid' name='cid' value='Toddler' />
	      				<input type='hidden' id='coursevers' name='coursevers' value='Toddler' />
	      				<input type='hidden' id='kind' name='kind' value='Toddler' />
	      				<div class='inputwrapper filePopUp'>
	      					<span>Upload File:</span>
	      					<input name="uploadedfile[]" id="uploadedfile" type="file" multiple="multiple" />
	      				</div>
      					<div class='filePopUp'>
	      					<div>
		      					<input type='radio' name='fileRB' value='GFILE' id='globalFileRB' />
		      					<label>Global</label>
		      				</div>
		      				<div>
		      					<input type='radio' name='fileRB' value='LFILE' id='localFileRB' />
		      					<label>Local</label>
		      				</div>
		      				<div>
		      					<input type='radio' name='fileRB' value='MFILE' id='couseLocalFileRB' />
		      					<label>Course local</label>
		      				</div>
      					</div>
	      				<div class='inputwrapper linkPopUp'>
	      					<span>URL:</span>
	      					<input style="width:380px" id ="uploadedlink" class="textinput" name="link" placeholder="https://facebook.com" type="text" />
	      				</div>
      				</div> 
					<div id='uploadbuttonname'>
						<input id='file-submit-button' class='submit-button' type="submit" onclick="setFileKind();uploadFile(fileKind);" />
					</div>
      				<div style ='display:none;' id='errormessage'></div> 
      			</form>
      		</div>
		</div>
	</div>
	<!-- Edit File Dialog END -->
    <!-- Markdown-preview functionality START -->
    <div class="PreviewWindow">
        <div class="PrevHead">This is the preview window test
        </div>
        <div class="Markdown">
            <div class="markNav">Markdown
                <span class="headerType" title="Header">aA&#9663;</span>
                    <div id="select-header">
                        <span id="headerType1" onclick="selected();headerVal1()" value="H1">Header 1</span>
                        <span id="headerType2" onclick="selected();headerVal2()" value="H2">Header 2</span>
                        <span id="headerType3" onclick="selected();headerVal3()" value="H3">Header 3</span>
                    </div>
                <span id="boldText" onclick="boldText()" title="Bold"><b>B</b></span>
                <span id="cursiveText" onclick="cursiveText()" title="Italic"><i>i</i></span>
            </div>
            <div class="markText">
                <textarea id="mrkdwntxt" oninput="updatePreview(this.value)" name="markdowntext" rows="32" cols="40"></textarea>
            </div>
        </div>
        <div class="MarkdownPrev">
            <div class="prevNav">Markdown Preview</div>
            <div class="markTextPrev">
                <div class="prevSpan">
                    <div class="descbox">
                        <span id="markdown"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="OptionButtons">
            <button id="button-save" onclick="saveMarkdown()">Save</button>
            <button id="button-cancel" onclick="">Cancel</button>
        </div>
        <button id="button-close" onclick="cancelPreview()">Close</button>
    </div>
    <!-- Markdown-preview functionality END -->

</body>
</html>
