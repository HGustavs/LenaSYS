<?php
session_start();
include_once "../../coursesyspw.php";
include_once "../Shared/sessions.php";
pdoConnect();
?>

<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/ico" href="../Shared/icons/favicon.ico"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>File editor</title>
    <link type="text/css" href="../Shared/css/style.css" rel="stylesheet">
    <link type="text/css" href="../Shared/css/markdown.css" rel="stylesheet">
    <link type="text/css" href="../Shared/css/jquery-ui-1.10.4.min.css" rel="stylesheet">
    <script src="../Shared/js/jquery-1.11.0.min.js"></script>
    <script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
    <script src="../Shared/dugga.js"></script>
    <script src="../Shared/SortableTableLibrary/sortableTable.js"></script>
    <script src="fileed.js"></script>
    <script src="../Shared/markdown.js"></script>
</head>
<body onload="setup();">
    <?php
        $noup = "SECTION";
        include '../Shared/navheader.php';
    ?>
    <?php
        include '../Shared/loginbox.php';
    ?>
	<!-- content START -->
	<div id="content">
		<div class='titles' style='padding-top:10px;'>
			<h1 style='flex:1;text-align:center;'>Files</h1>
    </div>
    <div style='display:flex;justify-content:space-between;align-items:flex-end;'>
        <div style='display:flex;flex-wrap:wrap;'>
            <div style='white-space:nowrap'>
                <input type="radio" name="sortKind" value="All" checked onclick="count=0;searchterm='';searchKeyUp(event);fileLink.renderTable();"/>
                <label name="sortAll" style='white-space:nowrap'>All files</label>
            </div>
            <div style='white-space:nowrap'>
                <input type="radio" name="sortKind" value="Global" onclick="count=0;searchterm='kind::global';searchKeyUp(event);fileLink.renderTable();"/>
                <label name="sortGlobal" style='white-space:nowrap'>Global</label>
            </div>
            <div style='white-space:nowrap'>
                <input type="radio" name="sortKind" value="CourseLocal" onclick="count=0;searchterm='kind::course';searchKeyUp(event);fileLink.renderTable();"/>
                <label name="sortCLocal" style='white-space:nowrap'>Course local</label>
            </div>
            <div style='white-space:nowrap'>
                <input type="radio" name="sortKind" value="VersionLocal" onclick="count=0;searchterm='kind::version';searchKeyUp(event);fileLink.renderTable();"/>
                <label name="sortVLocal" style='white-space:nowrap'>Version local</label>
            </div>
            <div style='white-space:nowrap'>
                <input type="radio" name="sortKind" value="Links" onclick="count=0;searchterm='kind::link';searchKeyUp(event);fileLink.renderTable();"/>
                <label name="sortLinks" style='white-space:nowrap'>Links</label>
            </div>
        </div>
    </div>
		<div id="fileLink" style='width:100%;margin-bottom: 30px;'></div>
		<!-- content END -->

    <!-- Add File Dialog START -->
    <div id='addFile' class='loginBoxContainer' style='display:none;'>
        <div class='loginBox' style='width:464px;'>
            <div class='loginBoxheader' style='cursor:default;'>
                <h3 class="fileHeadline" id="mFileHeadline">Add Course Local File</h3>
                <h3 class="fileHeadline" id="gFileHeadline">Add Global File</h3>
                <h3 class="fileHeadline" id="lFileHeadline">Add Version Local File</h3>
                <h3 class="linkPopUp">Add Link</h3>
                <div class='cursorPointer' onclick='closeAddFile();'>x</div>
            </div>
            <form enctype="multipart/form-data" action="filereceive.php" onsubmit="return validateForm()" method="POST">
                <div>
                    <input type='hidden' id='cid' name='cid' value='Toddler'/>
                    <input type='hidden' id='coursevers' name='coursevers' value='Toddler'/>
                    <input type='hidden' id='kind' name='kind' value='Toddler'/>
                    <div class='inputwrapper filePopUp'>
                        <span>Upload File:</span>
                        <input name="uploadedfile[]" id="uploadedfile" type="file" multiple="multiple"/>
                    </div>
                    <div class='inputwrapper linkPopUp'>
                        <span>URL:</span>
                        <input style="width:380px" id="uploadedlink" class="textinput" name="link"
                               placeholder="https://facebook.com" type="text"/>
                    </div>
                </div>
                <div id='uploadbuttonname'>
                    <input class='submit-button fileed-submit-button' type="submit" onclick="uploadFile(fileKind);"/>
                </div>
                <div style='display:none;' id='errormessage'></div>
            </form>

        </div>
    </div>
</div>
<!-- Edit File Dialog END -->

<!-- Markdown-preview and edit file functionality START -->
<div class="previewWindowContainer">
    <div class="previewWindow">
        <div class="loginBoxheader">
            <h3 class ="fileName"></h3>
            <div style="cursor:pointer;" onclick="closePreview();">x</div>
        </div>
            <input type='hidden' id='cID' name='cid' value='Toddler'/>
            <input type='hidden' id='courseVers' name='coursevers' value='Toddler'/>
            <input type='hidden' id='fileKind' name='kind' value='Toddler'/>
            <input type='hidden' id='fileName' name='filename' value='Toddler'/>
            <input type='hidden' id='textField' name='textField' value='Toddler'/>
            <div class="markdownPart">

                <div class="markdown">
                    <fieldset id="markset">
                        <legend>  Markdown</legend>
                        <div class="markdown-icon-div">
                        <span class="markdown-icons" onclick="boldText()" title="Bold"><b>B</b></span>
                        <span class="markdown-icons" onclick="cursiveText()" title="Italic"><i>i</i></span>
                        <span class="markdown-icons" onclick="codeBlockText()" title="CodeBlock">&#10065;</span>
                        <span class="markdown-icons" onclick="lists()" title="lists"><img
                                                                                src="../Shared/icons/list-symbol.svg"></span>
                        <span class="markdown-icons" id="quoteIcon" onclick="quoteText()" title="quote">&#10078;</span>
                        <span class="markdown-icons" id="linkIcon" onclick="linkText()" title="link"><img
                                                                                src="../Shared/icons/link-icon.svg"></span>
                        <span class="markdown-icons" id="imgIcon" onclick="externalImg()" title="Img"><img
                                                                                src="../Shared/icons/insert-photo.svg"></span>
                        <span class="markdown-icons headerType" id="headerIcon" title="Header">aA&#9663;</span>

                        <div class="selectHeader" id="select-header">
                            <span id="headerType1" onclick="selected();headerVal1()" value="H1">Header 1</span>
                            <span id="headerType2" onclick="selected();headerVal2()" value="H2">Header 2</span>
                            <span id="headerType3" onclick="selected();headerVal3()" value="H3">Header 3</span>
                            <span id="headerType4" onclick="selected();headerVal4()" value="H4">Header 4</span>
                            <span id="headerType5" onclick="selected();headerVal5()" value="H5">Header 5</span>
                            <span id="headerType6" onclick="selected();headerVal6()" value="H6">Header 6</span>
                        </div>
                        </div>
                            <div class="markText">
                            <textarea id="mrkdwntxt" oninput="updatePreview(this.value)" name="markdowntext"></textarea>
                            </div>
                            </fieldset>
                </div>

                <div class="markdownPrev">
                    <fieldset id="markPrevSet" style="overflow:scroll;"><legend id="markPrev">Markdown preview</legend>
                    <div class="markTextPrev">
                        <div class="prevSpan">
                            <div class="descbox">
                                <span id="markdown"></span>
                            </div>
                        </div>
                    </div>
                    </fieldset>
                </div>
                <button class="save-close-button-md" type="submit" onclick="saveMarkdown()">Save</button>
                <button class="save-close-button-md" onclick="cancelPreview()">Close</button>
            </div>
            <div class="editFilePart">
                <div class="editFileWindow">
                    <div class="editFileCode">
                        <div class="fileText">
                            <textarea id="filecont" oninput="editFile(this.value)" name="filetext" rows="32" cols="79"></textarea>
                        </div>
                    </div>

                    <button class="save-close-button-fe" type="submit" onclick="saveTextToFile()"> Save </button>
                    <button class="save-close-button-fe" onclick="cancelPreview()">Close</button>
                    <div class="optionButtons">

                    </div>
                </div>
            </div>
    </div>
</div>
<!-- Markdown-preview and edit file functionality END -->

<!--Fab-button-->
<div class="fixed-action-button" id="fabButton">
    <a class="btn-floating fab-btn-lg noselect" id="fabBtn">+</a>
    <ol class="fab-btn-list" style="margin: 0; padding: 0; display: none;" reversed>
				<li onclick="showFilePopUp('GFILE');" >
					<a id="gFabBtn" class="btn-floating fab-btn-sm scale-transition scale-out" data-tooltip='Add Global File'>
							<img id="gFabBtnImg" class="fab-icon" src="../Shared/icons/global-icon.svg">
					</a>
				</li>
      	<li  onclick="showFilePopUp('LFILE');" >
					<a id="lFabBtn" class="btn-floating fab-btn-sm scale-transition scale-out" data-tooltip='Add Version Local File'>
							<img id="lFabBtnImg" class="fab-icon" src="../Shared/icons/version_local-icon.svg">
					</a>
				</li>
      	<li onclick="showFilePopUp('MFILE');" >
					<a id="mFabBtn" class="btn-floating fab-btn-sm scale-transition scale-out" data-tooltip='Add Course Local File'>
							<img id="mFabBtnImg" class="fab-icon" src="../Shared/icons/course_local-icon.svg">
					</a>
				</li>
      	<li onclick="showLinkPopUp();" >
					<a id="linkFabBtn" class="btn-floating fab-btn-sm scale-transition scale-out noselect" data-tooltip="Add Link">
							<img id="linkFabBtnImg" class="fab-icon" src="../Shared/icons/link-icon.svg">
					</a>
       	</li>
    </ol>
</div>

<div class="confirmationWindow">
    <div class="loginBoxheader">
        <h3 class="fileName"></h3>
        <div style="cursor:pointer;" onclick="closeConfirmation();">x</div>
    </div>
    <p class="confirmationText" id="editedFile" >Hej</p>
    <button class="confirmationButton" onclick="closeConfirmation()">Ok</button>
</div>
</body>
</html>
