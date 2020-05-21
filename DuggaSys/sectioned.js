// -------------==============######## Globals ###########==============-------------

var querystring = parseGet();
var retdata;
var newversid;
var active_lid;
var isClickedElementBox = false;
var testsAvailable;
var nameSet = false;
var hoverMenuTimer;
var xelink;
var momentexists = 0;
var resave = false;
var versnme = "UNKz";
var versnr;
var motd;

// Stores everything that relates to collapsable menus and their state.
var menuState = {
  idCounter: 0,
  /* Used to give elements unique ids. This might? brake
						   because an element is not guaranteed to recieve the
						   same id every time. */
  hiddenElements: [], // Stores the id of elements who's childs should be hidden.
  arrowIcons: [] // Stores ids of arrows whose state needs to be remembered.
}

function setup() {
  AJAXService("get", {}, "SECTION");
}

// -------------==============######## Internal Help Functions ###########==============-------------

// Save ids of all elements, whose state needs to be remembered, in local storage.
function saveHiddenElementIDs(clickedElement) {
  addOrRemoveFromArray(clickedElement, menuState.hiddenElements);
  localStorage.setItem('hiddenElements', JSON.stringify(menuState.hiddenElements));
}

// Save ids of all arrows, whose state needs to be remembered, in local storage.
function saveArrowIds(clickedElement) {
  var childNodes = document.getElementById(clickedElement).firstChild.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeName == "IMG") {
      addOrRemoveFromArray(childNodes[i].id, menuState.arrowIcons);
    }
  }
  localStorage.setItem('arrowIcons', JSON.stringify(menuState.arrowIcons));
}

/* Hide all child elements to the moment and section elements in the
   hiddenElements array. */
function hideCollapsedMenus() {
  $('.header, .section, .code, .test, .link, .group, .statisticsContent, .message').show();
  for (var i = 0; i < menuState.hiddenElements.length; i++) {
    var ancestor = findAncestor($("#" + menuState.hiddenElements[i])[0], "moment");
    if ((ancestor != undefined || ancestor != null) && ancestor.classList.contains('moment')) {
      jQuery(ancestor).nextUntil('.moment').hide();
    }
    ancestor = findAncestor($("#" + menuState.hiddenElements[i])[0], "section");
    if ((ancestor != undefined || ancestor != null) && ancestor.classList.contains('section')) {
      jQuery(ancestor).nextUntil('.section').hide();
    }

    if (menuState.hiddenElements[i] == "statistics") {
      $(".statistics").nextAll().hide();
    }
  }
}

// Show down arrow by default and then hide this arrow and show the right
//   arrow if it is in the arrowIcons array.
//	 The other way around for the statistics section.
function toggleArrows() {
  $('.arrowComp').show();
  $('.arrowRight').hide();
  for (var i = 0; i < menuState.arrowIcons.length; i++) {
    if (menuState.arrowIcons[i].indexOf('arrowComp') > -1) {
      $('#' + menuState.arrowIcons[i]).hide();
    } else {
      $('#' + menuState.arrowIcons[i]).show();
    }
  }

  $('#arrowStatisticsOpen').show();
  $('#arrowStatisticsClosed').hide();
  for (var i = 0; i < menuState.hiddenElements.length; i++) {
    if (menuState.hiddenElements[i] == "statistics") {
      $('#arrowStatisticsOpen').hide();
      $('#arrowStatisticsClosed').show();
    }
  }
}
menuState
// Finds all ancestors to the element with classname Hamburger and toggles them.
// added some if-statements so escapePress wont always toggle
function hamburgerChange(operation = 'click') {
  if (operation != "click") {
    if (findAncestor(document.getElementById("hamburgerIcon"), "change") != null) {
      bigMac();
      toggleHamburger();
    }
  } else {
    toggleHamburger();
  }
}

function toggleHamburger() {
  var x = document.getElementById("hamburgerIcon");
  findAncestor(x, "hamburger").classList.toggle("change");
}

// -------------==============######## Dialog Handling ###########==============-------------

//----------------------------------------------------------------------------------
// selectItem: Prepare item editing dialog after cog-wheel has been clicked
//----------------------------------------------------------------------------------

function selectItem(lid, entryname, kind, evisible, elink, moment, gradesys, highscoremode, comments, grptype, deadline, tabs, feedbackenabled, feedbackquestion) {

  // Variables for the different options and values for the deadlne time dropdown meny.
  var hourArrOptions=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
  var hourArrValue=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  var minuteArrOptions=["00","05","10","15","20","25","30","35","40","45","50","55"];
  var minuteArrValue=[0,5,10,15,20,25,30,35,40,45,50,55];

  nameSet = false;
  if (entryname == "undefined") entryname = "New Header";
  if (kind == "undefined") kind = 0;
  xelink = elink;
  // Display Select Marker
  $(".item").css("border", "none");
  $(".item").css("box-shadow", "none");
  $("#I" + lid).css("border", "2px dashed #FC5");
  $("#I" + lid).css("box-shadow", "1px 1px 3px #000 inset");

  // Default showing of gradesystem. Will show if has type "Test" or "Moment"
  if (kind != 3 || kind != 4) {
    document.querySelector("#inputwrapper-gradesystem").style.display = "none";
  } else {
    document.querySelector("#inputwrapper-gradesystem").style.display = "block";
    }

  // Default showing of set deadline. Will show if has type "Test" only
  if (kind != 3) {
      document.querySelector("#inputwrapper-deadline").style.display = "none";
      document.querySelector("#dialog8").style.display = "none";
  } else {
     document.querySelector("#inputwrapper-deadline").style.display = "block";
  }
  
  // Set GradeSys, Kind, Visibility, Tabs (tabs use gradesys)
  $("#gradesys").html(makeoptions(gradesys, ["-", "U-G-VG", "U-G"], [0, 1, 2]));
  $("#type").html(makeoptions(kind, ["Header", "Section", "Code", "Test", "Moment", "Link", "Group Activity", "Message"], [0, 1, 2, 3, 4, 5, 6, 7]));
  $("#visib").html(makeoptions(evisible, ["Hidden", "Public", "Login"], [0, 1, 2]));
  $("#tabs").html(makeoptions(tabs, ["0 tabs", "1 tabs", "2 tabs", "3 tabs", "1 tab + end", "2 tabs + end", "3 tabs + end"], [0, 1, 2, 3, 4, 5, 6]));
  $("#highscoremode").html(makeoptions(highscoremode, ["None", "Time Based", "Click Based"], [0, 1, 2]));
  if(deadline !== undefined){
    $("#deadlinehours").html(makeoptions(deadline.substr(11,2),hourArrOptions,hourArrValue));
    $("#deadlineminutes").html(makeoptions(deadline.substr(14,2),minuteArrOptions,minuteArrValue));
    $("#setDeadlineValue").val(deadline.substr(0,10));
  }
  var groups = [];
  for (var key in retdata['groups']) {
    // skip loop if the property is from prototype
    if (!retdata['groups'].hasOwnProperty(key)) continue;
    groups.push(key);
  }
  $("#grptype").html("<option value='UNK'>Select Group type</option>" + makeoptions(grptype, groups, groups));

  // Set Link
  $("#link").val(elink);
  changedType(kind);

  // Set Moments - requires iteration since we only process kind 4
  str = "";
  if (retdata['entries'].length > 0) {

    // Account for null
    if (moment == "") str += "<option selected='selected' value='null'>&lt;None&gt;</option>"
    else str += "<option value='null'>&lt;None&gt;</option>";

    // Account for rest of moments!
    for (var i = 0; i < retdata['entries'].length; i++) {
      var item = retdata['entries'][i];
      if (item['kind'] == 4) {
        if (parseInt(moment) == parseInt(item['lid'])) str += "<option selected='selected' " +
          "value='" + item['lid'] + "'>" + item['entryname'] + "</option>";
        else str += "<option value='" + item['lid'] + "'>" + item['entryname'] + "</option>";
      }
    }
  }
  $("#moment").html(str);

  // Set Name
  $("#sectionname").val(entryname);
  $("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='sectionname' value='" + entryname + "' style='width:448px;'/>");

  // Set Comment
  $("#comments").val(comments);
  $("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='comments' value='" + comments + "' style='width:448px;'/>");

  // Set Lid
  $("#lid").val(lid);

  // Display Dialog
  $("#editSection").css("display", "flex");

  //------------------------------------------------------------------------------
  //checks if feedback is enabled and enables input box for feedbackquestion choice.
  //------------------------------------------------------------------------------
  if(kind == 3){
    $('#inputwrapper-Feedback').css("display","block");
    if(feedbackenabled == 1){
      $( "#fdbck" ).prop( "checked", true );
      $("#inputwrapper-FeedbackQuestion").css("display","block");
      $("#fdbckque").val(feedbackquestion);
    }else{
      $( "#fdbck" ).prop( "checked", false );
      $("#inputwrapper-FeedbackQuestion").css("display","none");
    }
  }else{
    $("#inputwrapper-FeedbackQuestion").css("display","none");
    $('#inputwrapper-Feedback').css("display","none");
    $( "#fdbck" ).prop( "checked", false );
  }
}

//----------------------------------------------------------------------------------
// changedType: When kind of section has been changed we must update dropdown lists accordingly
//----------------------------------------------------------------------------------


// If type "Test" or "Moment" then Grade system will be shown
function changedType(kind) {
  // Prepares option list for code example (2)/dugga (3) dropdown/links (5) / Not applicable
    document.querySelector("#inputwrapper-gradesystem").style.display = "none";
  if (kind == 2) {
    $("#link").html(makeoptionsItem(xelink, retdata['codeexamples'], 'sectionname', 'exampleid'));
  } else if (kind == 3) {
    document.querySelector("#inputwrapper-group").style.display = "none";
    document.querySelector("#inputwrapper-gradesystem").style.display = "block";
    $("#link").html(makeoptionsItem(xelink, retdata['duggor'], 'qname', 'id'));
  } else if (kind == 4) {
    document.querySelector("#inputwrapper-group").style.display = "block";
    document.querySelector("#inputwrapper-gradesystem").style.display = "block";
  } else if (kind == 5 || kind == 7) {
    $("#link").html(makeoptionsItem(xelink, retdata['links'], 'filename', 'filename'));
  } else {
    $("#link").html("<option value='-1'>-=# Not Applicable #=-</option>");
  }
}

//----------------------------------------------------------------------------------
// showEditVersion: Displays Edit Version Dialog
//----------------------------------------------------------------------------------

function showEditVersion() {
  var tempMotd = motd;
	tempMotd = motd.replace(/&Aring;/g, "Å").replace(/&aring;/g, "å").replace(/&Auml;/g, "Ä").replace(/&auml;/g, "ä").replace(/&Ouml;/g, "Ö").replace(/&ouml;/g, "ö").replace(/&amp;/g, "&").replace(/&#63;/g, "?");
  $("#eversname").val(versnme);
  $("#eMOTD").val(tempMotd);
  $("#eversid").val(querystring['coursevers']);
  let sdate = retdata['startdate'];
  let edate = retdata['enddate'];
  if (sdate !== null) $("#estartdate").val(sdate.substr(0, 10));
  if (edate !== null) $("#eenddate").val(edate.substr(0, 10));
  $("#editCourseVersion").css("display", "flex");
}

// Close the "edit course version" and "new course version" windows by pressing the ESC button
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    $("#editCourseVersion").css("display", "none");
    $("#newCourseVersion").css("display", "none");
    $("#userFeedbackDialog").css("display", "none");
  }
})

function displaymessage() {
  $(".messagebox").css("display", "block");
}

function showSubmitButton() {
  $(".submitDugga").css("display", "inline-block");
  $(".updateDugga").css("display", "none");
  $(".closeDugga").css("display", "inline-block");
}

function showSaveButton() {
  $(".submitDugga").css("display", "none");
  $(".updateDugga").css("display", "block");
  $(".closeDugga").css("display", "block");
}

// Show the hamburger menu
function bigMac() {
  $(".hamburgerMenu").toggle();
}

// Displaying and hidding the dynamic comfirmbox for the section edit dialog
function confirmBox(operation, item = null) {
  if (operation == "openConfirmBox") {
    active_lid = item ? $(item).parents('table').attr('value') : null;
    $("#sectionConfirmBox").css("display", "flex");
    $('#close-item-button').focus();
  } else if (operation == "deleteItem") {
    deleteItem(active_lid);
    $("#sectionConfirmBox").css("display", "none");
  } else if (operation == "closeConfirmBox") {
    $("#sectionConfirmBox").css("display", "none");
    $("#noMaterialConfirmBox").css("display", "none");
  }
}

function closeSelect() {
  $(".item").css("border", "none");
  $(".item").css("box-shadow", "none");
  $("#editSection").css("display", "none");
  defaultNewItem();
}

function defaultNewItem() {

  $('#saveBtn').removeAttr('disabled'); // Resets save button to its default form
  $('#submitBtn').removeAttr('disabled'); // Resets submit button to its default form
  document.getElementById("sectionname").style.backgroundColor = "#fff"; // Resets color for name input
  $('#tooltipTxt').hide(); // Resets tooltip text to its default form
}

function showCreateVersion() {
    $("#newCourseVersion").css("display", "flex");
}


//kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link || 6 == Group Activity || 7 == Message
function createFABItem(kind, itemtitle, comment) {
  if (kind >= 0 && kind <= 7) {
    selectItem("undefined", itemtitle, kind, "undefined", "undefined", "0", "", "undefined", comment,"undefined", "undefined", 0, null);
    newItem();
  }
}

function addColorsToTabSections(kind, visible, spkind) {
  var retStr = "<td style='width:32px;overflow:hidden;";

  if (spkind == "E") {
    retStr += "'><div class='spacerEnd'></div></td>";
  } else {
    retStr += "'><div class='spacerLeft'></div></td>";
  }

  return retStr;
}

// -------------==============######## Commands ###########==============-------------

//----------------------------------------------------------------------------------
// prepareItem: Prepare sectioneditor parameters
//----------------------------------------------------------------------------------

function prepareItem() {
  // Create parameter object and fill with information
  var param = {};
  var jsondeadline = {"deadline1":"", "comment1":"","deadline2":"", "comment2":"", "deadline3":"", "comment3":""};

  // Storing tabs in gradesys column!
  var kind = $("#type").val()
  if (kind == 0 || kind == 1 || kind == 2 || kind == 5 || kind == 6 || kind == 7) {
    param.tabs = $("#tabs").val();
  } else {
    param.gradesys = $("#gradesys").val();
  }

  param.lid = $("#lid").val();
  param.kind = kind;
  param.link = $("#link").val();
  param.highscoremode = $("#highscoremode").val();
  param.sectname = $("#sectionname").val();
  param.visibility = $("#visib").val();
  param.tabs = $("#tabs").val();
  param.moment = $("#moment").val();
  param.comments = $("#comments").val();
  param.grptype = $("#grptype").val();
  param.deadline = $("#setDeadlineValue").val()+" "+$("#deadlinehours").val()+":"+$("#deadlineminutes").val();

  if ($('#fdbck').prop('checked')){
    param.feedback = 1;
    param.feedbackquestion = $("#fdbckque").val();
  } else{
    param.feedback = 0;
    param.feedbackquestion = null;
  }

  if(param.comments == "TOP"){
    param.pos = "-1";
  }
  else{
    param.pos = "100";
  }

  return param;
}

//----------------------------------------------------------------------------------
// deleteItem: Deletes Item from Section List
//----------------------------------------------------------------------------------

function deleteItem(item_lid = null) {
  var lid = item_lid ? item_lid : $("#lid").val();
  AJAXService("DEL", {
    lid: lid
  }, "SECTION");
  $("#editSection").css("display", "none");
}

//----------------------------------------------------------------------------------
// updateItem: Updates Item from Section List
//----------------------------------------------------------------------------------

function updateItem() {
  AJAXService("UPDATE", prepareItem(), "SECTION");

  $("#sectionConfirmBox").css("display", "none");
  $("#editSection").css("display", "none");
}

function updateDeadline() {
    var kind = $("#type").val();
    if (kind == 3) {
        AJAXService("UPDATEDEADLINE", prepareItem(), "SECTION");
    }
}

//----------------------------------------------------------------------------------
// newItem: New Item for Section List
//----------------------------------------------------------------------------------

function newItem() {

  AJAXService("NEW", prepareItem(), "SECTION");
  $("#editSection").css("display", "none");

  //setTimeout(scrollToBottom, 200); // Scroll to the bottom to show newly created items.
}

//----------------------------------------------------------------------------------
// createVersion: New Version of Course
//----------------------------------------------------------------------------------

function createVersion() {

  var param = {};
  //param.courseid = querystring['courseid'];
  param.cid = querystring['courseid'];
  param.versid = document.getElementById("cversid").value;
  param.versname = document.getElementById("versname").value;
  param.motd = document.getElementById("vmotd").value;
  param.copycourse = document.getElementById("copyvers").value;
  param.coursecode = retdata.coursecode;
  param.coursename = querystring["coursename"];
  param.makeactive = 2 + $("#makeactive").is(':checked');
  param.startdate = getDateFormat(new Date($("#startdate").val()));
  param.enddate = getDateFormat(new Date($("#enddate").val()));

  newversid = param.versid;

  if (param.versid == "" || param.versname == "") {
    alert("Version Name and Version ID must be entered!");
  } else {
    if (param.copycourse != "None") {
      //create a copy of course version
      AJAXService("CPYVRS", param, "COURSE");
    } else {
      //create a fresh course version
      AJAXService("NEWVRS", param, "COURSE");
    }
    $("#newCourseVersion").css("display", "none");
    changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] + "&coursename=" + querystring["coursename"] + "&coursevers=" +document.getElementById("cversid").value );
  }
}

//----------------------------------------------------------------------------------
// updateVersion: Edit Version of Course
//----------------------------------------------------------------------------------

function updateVersion() {

  var param = {};

  param.courseid = querystring['courseid'];
  param.cid = querystring['courseid'];
  param.versid = document.getElementById("eversid").value;
  param.versname = document.getElementById("eversname").value;
  param.copycourse = document.getElementById("copyvers").value;
  param.coursecode = retdata.coursecode;
  param.coursename = querystring["coursename"];
  param.makeactive = 2 + $("#emakeactive").is(':checked');
  param.startdate = $("#estartdate").val();
  param.enddate = $("#eenddate").val();
  param.motd = document.getElementById("eMOTD").value;

  AJAXService("UPDATEVRS", param, "SECTION");

  $("#editCourseVersion").css("display", "none");
  changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] + "&coursename=" + querystring["coursename"] + "&coursevers=" +document.getElementById("eversid").value );
}

//queryString for coursename is added
function goToVersion(courseDropDown) {
  var value = courseDropDown.options[courseDropDown.selectedIndex].value;
  changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] + "&coursename=" + querystring["coursename"] + "&coursevers=" + value);
}

function accessCourse() {
  var coursevers = $("#course-coursevers").text();
  window.location.href = "accessed.php?cid=" + querystring['courseid'] + "&coursevers=" + coursevers;
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedCourse(data) {
  if (data['debug'] != "NONE!") alert(data['debug']);
  window.setTimeout(function () {
    changeCourseVersURL("sectioned.php?courseid=" + querystring["courseid"] +
      "&coursename=" + querystring["coursename"] + "&coursevers=" + newversid);
  }, 1000);
}

function returnedGroups(data) {
  if (data['debug'] != "NONE!") alert(data['debug']);
  var grpmembers = data['grplst'];
  var str = "";
  let grp = "";
  let grpemail = "";
  let j = 1;
  for (let i = 0; i < grpmembers.length; i++) {
    let member = grpmembers[i];
    let cgrp = member[0];

    if (cgrp != grp) {
      j = 1;
      if (grp != "") {
        str += "</tbody>";
        str += "</table>";
        str += "<div style='text-align:right;border-top:2px solid #434343'><a style='white-space:nowrap' href='mailto:" + grpemail + "'>Email group</a></div>"
        grpemail = "";
      }
      grp = cgrp;
      cgrp = cgrp.split('_');
      str += "<table>";
      str += "<thead><tr><th rowspan=2 style='text-align:left;'>Group " + cgrp[1] + "</th></tr></thead>";
      str += "<tbody>";
    }
    str += "<tr><td>" + (j++) + "</td><td><a  style='white-space:nowrap' href='mailto:" + member[3] + "'>" + member[1] + " " + member[2] + "</a></td></tr>";
    if (grpemail != "") grpemail += ",";
    grpemail += member[3];
  }
  if (grp != "") {
    str += "</tbody>";
    str += "</table>";
    str += "<div style='text-align:right;border-top:2px solid #434343'><a href='mailto:" + grpemail + "'>Email group</a></div>"
    grpemail = "";
  }
  if (str != "") {
    $("#grptbl").html(str);
    $("#grptblContainer").css("display", "flex");
  }
}


function returnedSection(data) {
  retdata = data;
  if (data['debug'] != "NONE!") alert(data['debug']);

  var now = new Date();
  var startdate = new Date(retdata['startdate']);
  var enddate = new Date(retdata['enddate']);

  var numberOfParts = 0;
  for (var i = 0; i < retdata['entries'].length; i++) {
    var item = retdata['entries'][i];
    if (item['kind'] == 4) {
      numberOfParts++;
    }
  }

  // Fill section list with information
  if (querystring['coursevers'] != "null") {
    var versionname = "";
    if (retdata['versions'].length > 0) {
      for (var j = 0; j < retdata['versions'].length; j++) {
        var itemz = retdata['versions'][j];
        if (retdata['courseid'] == itemz['cid']) {
          var vversz = itemz['vers'];
          var vnamez = itemz['versname'];
          if (retdata['coursevers'] == vversz) {
              versionname = vnamez;
          }
        }
      }
    }

    // Update header with course information from data
    document.getElementById("course-coursecode").innerHTML = retdata['coursecode'];
    document.getElementById("course-coursename").innerHTML = retdata['coursename'];
    document.getElementById("course-versname").innerHTML = versionname;

    var str = "";

    if (data['writeaccess']) {
      // Build dropdowns
      var bstr = "";
      for (var i = 0; i < retdata['versions'].length; i++) {
        var item = retdata['versions'][i];
        if (retdata['courseid'] == item['cid']) {
          bstr += "<option value='" + item['vers'] + "'";
          if (retdata['coursevers'] == item['vers']) {
            bstr += " selected";
          }
          bstr += ">" + item['versname'] + " - " + item['vers'] + "</option>";
        }
        // save vers, versname and motd from table vers as global variables.
        versnme = versionname;
        if (querystring['coursevers'] == item['vers']) motd = item['motd'];
        if (querystring['coursevers'] == item['vers']) versnr = item['vers'];
      }

      document.getElementById("courseDropdownTop").innerHTML = bstr;
      bstr = "<option value='None'>None</option>" + bstr;
      document.getElementById("copyvers").innerHTML = bstr;

      // Show FAB / Menu
      document.getElementById("FABStatic").style.display = "Block";
      document.getElementById("FABStatic2").style.display = "Block";
      // Show addElement Button
      document.getElementById("addElement").style.display = "Block";
    } else {
      // Hide FAB / Menu
      document.getElementById("FABStatic").style.display = "None";
      document.getElementById("FABStatic2").style.display = "None";
    }

    if (data['readaccess']) {
      // Build dropdowns
      var bstr = "";
      for (var i = 0; i < retdata['versions'].length; i++) {
        var item = retdata['versions'][i];
        if (retdata['courseid'] == item['cid']) {
          bstr += "<option value='" + item['vers'] + "'";
          if (retdata['coursevers'] == item['vers']) {
            bstr += " selected";
          }
          bstr += ">" + item['versname'] + " - " + item['vers'] + "</option>";
        }
        // save vers, versname and motd from table vers as global variables.
        versnme = versionname;
        if (querystring['coursevers'] == item['vers']) motd = item['motd'];
        if (querystring['coursevers'] == item['vers']) versnr = item['vers'];
      }

      bstr = "<option value='None'>None</option>" + bstr;
      document.getElementById("copyvers").innerHTML = bstr;
    }

    if (data['studentteacher']) {
      // Show FAB / Menu
      document.getElementById("FABStatic").style.display = "Block";
      // Show addElement Button
      document.getElementById("addElement").style.display = "Block";
    }


    // hide som elements if to narrow
    var hiddenInline = "";
    var showInline = true;
    if ($(window).width() < 480) {
      showInline = false;
      hiddenInline = "none";
    } else {
      showInline = true;
      hiddenInline = "inline";
    }

    str += "<div id='Sectionlistc'>";

    // For now we only have two kinds of sections
    if (data['entries'].length > 0) {
      var kk = 0;

      for (i = 0; i < data['entries'].length; i++) {
        var item = data['entries'][i];
        var deadline = item['deadline'];
        var released = item['release'];

        // Separating sections into different classes
        var valarr = ["header", "section", "code", "test", "moment", "link", "group", "message"];
        // New items added get the class glow to show they are new
        if(item['pos'] == "-1" || item['pos'] == "100"){
          str += "<div id='" + makeTextArray(item['kind'], valarr) + menuState.idCounter + data.coursecode + "' class='" + makeTextArray(item['kind'], valarr) +" glow"+ "' style='display:block'>";
        }
        else{
          str += "<div id='" + makeTextArray(item['kind'], valarr) + menuState.idCounter + data.coursecode + "' class='" + makeTextArray(item['kind'], valarr) + "' style='display:block'>";
        }

        menuState.idCounter++;
        // All are visible according to database

        // Content table
        str += "<table id='lid" + item['lid'] + "' value='" + item['lid'] + "' style='width:100%;table-layout:fixed;'><tr style='height:32px;' ";
        if (kk % 2 == 0) {
          str += " class='hi' ";
        } else {
          str += " class='lo' ";
        }
        str += " >";
  

        var hideState = "";
        if (parseInt(item['visible']) === 0) hideState = " hidden"
        else if (parseInt(item['visible']) === 3) hideState = " deleted"
        else if (parseInt(item['visible']) === 2) hideState = " login";

        // kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link || 6 Group-Moment || 7 Message
        var itemKind = parseInt(item['kind']);

        if(itemKind === 2 || itemKind == 5){
          str += "<td style='width:0px'><div class='spacerLeft'></div></td><td id='indTab' class='tabs" + item["tabs"] + "'><div class='spacerRight'></div></td>";
        }

        if(itemKind === 6 || itemKind == 7){
          str += "<td style='width:0px'><div class='spacerLeft'></div></td><td id='indTab' class='tabs" + item["tabs"] + "'><div class='spacerRight'></div></td>";
        }

        if (itemKind === 3 || itemKind === 4) {

          // Styling for quiz row e.g. add a tab spacer
          if (itemKind === 3) str += "<td style='width:0px'><div class='spacerLeft'></div></td><td id='indTab' class='tabs" + item["tabs"] + "'><div class='spacerRight'></div></td>";
          var grady = -1;
          var status = "";
          var marked;
          var submitted;
          var lastSubmit = null;

          for (var jjj = 0; jjj < data['results'].length; jjj++) {
            var lawtem = data['results'][jjj];
            if ((lawtem['moment'] == item['lid'])) {
              grady = lawtem['grade'];
              status = "";

              var st = lawtem['submitted'];
              if (st !== null) submitted = new Date(st)
              else submitted = null;

              var mt = lawtem['marked'];
              if (mt !== null) marked = new Date(mt)
              else marked = null;

              if (itemKind === 3 || itemKind === 6) {
                if (lawtem["useranswer"] !== null && submitted !== null && marked === null) {
                  status = "pending";
                }
                if (submitted !== null && marked !== null && (submitted.getTime() > marked.getTime())) {
                  status = "pending";
                }
                if (lastSubmit === null) {
                  lastSubmit = submitted;
                } else if (submitted !== null) {
                  if (lastSubmit.getTime() < submitted.getTime()) {
                    lastSubmit = submitted;
                  }
                }
              }

            }
          }

          if (itemKind === 3) {
            str += "<td class='LightBox" + hideState + "'>";
          } else if (itemKind === 4) {
            str += "<td class='LightBoxFilled" + hideState + "'>";
          }
          if ((grady == -1 || grady == 0 || grady == null) && status === "") {
            // Nothing submitted nor marked (White)
            str += "<div class='StopLight WhiteLight'></div>";
          } else if (status === "pending") {
            //	Nothing marked yet (Yellow)
            str += "<div class='StopLight YellowLight' title='Status: Handed in\nDate: " + lastSubmit + "' ></div>";
          } else if (grady == 1) {
            //	Marked Fail! (Red)
            str += "<div class='StopLight RedLight' title='Status: Failed\nDate: " + marked + "' ></div>";
          } else if (grady > 1) {
            //	Marked Pass i.e. G/VG/3/4/5 (Green)
            str += "<div class='StopLight GreenLight'  title='Status: Pass\nDate: " + marked + "' ></div>";
          }
          str += "</td>";
        }

        // Make tabs to align each section element
        // kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link || 6 == Group || 7 == Comment
        if (itemKind === 0 || itemKind === 1 || itemKind === 2 || itemKind === 5 || itemKind === 6 || itemKind === 7) {
          var itemGradesys = parseInt(item['gradesys']);
          var itemVisible = item['visible'];
          if (itemGradesys > 0 && itemGradesys < 4) {
            for (var numSpacers = 0; numSpacers < itemGradesys; numSpacers++) {
              str += addColorsToTabSections(itemKind, itemVisible, "L");
            }
          } else if (itemGradesys == 4) {
            str += addColorsToTabSections(itemKind, itemVisible, "E");
          } else if (itemGradesys == 5) {
            str += addColorsToTabSections(itemKind, itemVisible, "L");
            str += addColorsToTabSections(itemKind, itemVisible, "E");
          } else if (itemGradesys == 6) {
            str += addColorsToTabSections(itemKind, itemVisible, "L");
            str += addColorsToTabSections(itemKind, itemVisible, "L");
            str += addColorsToTabSections(itemKind, itemVisible, "E");
          }
        }

        // kind 0 == Header || 1 == Section || 2 == Code  || 3 == Test (Dugga)|| 4 == Moment || 5 == Link
        if (itemKind === 0) {
          // Styling for header row
          str += "</td><td class='header item" + hideState + "' placeholder='" + momentexists + "'id='I" + item['lid'] + "' ";
          kk = 0;

        } else if (itemKind === 1) {
          // Styling for Section row
          str += "<td class='section item" + hideState + "' placeholder='" + momentexists + "'id='I" + item['lid'] + "' style='cursor:pointer;' ";
          kk = 0;

        } else if (itemKind === 2) {
          str += "<td class='example item" + hideState + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";

          kk++;

        } else if (itemKind === 3) {
          if (item['highscoremode'] != 0 && itemKind == 3) {
            str += "<td style='width:20px;'><img style=';' title='Highscore' src='../Shared/icons/top10.png' onclick='showHighscore(\"" + item['link'] + "\",\"" + item['lid'] + "\")'/></td>";
          }
          str += "<td class='example item" + hideState + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
          kk++;

        } else if (itemKind === 4) {
          //new moment bool equals true
          momentexists = item['lid'];
          str += "<td class='moment item" + hideState + "' placeholder='" + momentexists + "' id='I" + item['lid'] + "' style='cursor:pointer;' ";
          kk = 0;

        } else if (itemKind === 5) { // Link

          str += "<td class='example item' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
          kk++;

        } else if (itemKind === 6) { //Group
          // Alt 1
          let grpmembershp = data['grpmembershp'].split(" ");
          var grptype = item['grptype'] + "_";
          var grp = grptype + "UNK";

          if (document.getElementById("userName").innerHTML != "Guest") {
            for (let i = 0; i < grpmembershp.length; i++) {
              let g = grpmembershp[i].replace(grptype, "");
              if (g.length < grpmembershp[i].length) {
                if (grp !== grptype + "UNK") {
                  grp += ",";
                } else {
                  grp = "";
                }
                grp += grptype + g;
              }
            }
          }

          str += "<td style='width:32px;' onclick='getGroups(\"" + grp + "\");'><img src='../Shared/icons/group-iconDrk.svg' style='display:block;margin-right:4.5px;max-width:32px;max-height:32px;overflow:hidden;'></td>";
          str += "<td class='section-message item' onclick='getGroups(\"" + grp + "\");' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";

        } else if (itemKind === 7) { //Message
          if (!(item['link'] == "" || item['link'] == "---===######===---")) {
            str += "<td style='width:32px;'><img title='Important message' src='../Shared/icons/warningTriangle.svg'></td>";
          }
          str += "<td class='section-message item' placeholder='" + momentexists + "' id='I" + item['lid'] + "' ";
        }

        // Close Information
        str += ">";
        // Content of Section Item
        if (itemKind == 0) {
          // Header
          str += "<span style='margin-left:8px;' title='" + item['entryname'] + "'>" + item['entryname'] + "</span>";
        } else if (itemKind == 1) {
          // Section
          str += "<div class='nowrap" + hideState + "' style='margin-left:8px;display:flex;align-items:center;' title='" + item['entryname'] + "'>";
          str += "<span class='ellipsis listentries-span'>" + item['entryname'] + "</span>";
          str += "<img src='../Shared/icons/desc_complement.svg' id='arrowComp" + item['lid'] + "' class='arrowComp' style='display:inline-block;'>";
          str += "<img src='../Shared/icons/right_complement.svg' id='arrowRight" + item['lid'] + "' class='arrowRight' style='display:none;'></div>";
        } else if (itemKind == 4) {
          // Moment
          var strz = makeTextArray(item['gradesys'], ["", "(U-G-VG)", "(U-G)"]);
          str += "<div class='nowrap" + hideState + "' style='margin-left:8px;display:flex;align-items:center;' title='" + item['entryname'] + "'>";
          str += "<span class='ellipsis listentries-span'>" + item['entryname'] + " " + strz + " </span>";
          str += "<img src='../Shared/icons/desc_complement.svg' id='arrowComp" + item['lid'] + "' class='arrowComp' style='display:inline-block;'>";
          str += "<img src='../Shared/icons/right_complement.svg'" + "id='arrowRight" + item['lid'] + "' class='arrowRight' style='display:none;'>";
          str += "</div>";
        } else if (itemKind == 2) {
          // Code Example
          var param = {
            'exampleid': item['link'],
            'courseid': querystring['courseid'],
            'coursename' : querystring['coursename'],
            'cvers': querystring['coursevers'],
            'lid': item['lid']
          };
          str += "<div class='ellipsis nowrap'><span>" + makeanchor("codeviewer.php", hideState, "margin-left:8px;", item['entryname'], false, param) + "</span></div>";
        } else if (itemKind == 3) {
          // Test / Dugga
          var param = {
            'did': item['link'],
            'courseid': querystring['courseid'],
            'coursename': querystring['coursename'],
            'coursevers': querystring['coursevers'],
            'moment': item['lid'],
            'segment': momentexists,
            highscoremode: item['highscoremode'],
            comment: item['comments'],
            deadline: item['deadline'],
            'cid': querystring['courseid']
          };
          str += "<div class='ellipsis nowrap'><span>" + makeanchor("showDugga.php", hideState, "cursor:pointer;margin-left:8px;", item['entryname'], false, param) + "</span></div>";
        } else if (itemKind == 5) {
          // Link
          if (item['link'].substring(0, 4) === "http") {
            str += makeanchor(item['link'], hideState, "cursor:pointer;margin-left:8px;", item['entryname'], false, {});
          } else {
            var param = {
              'exampleid': item['link'],
              'courseid': querystring['courseid'],
              'coursevers': querystring['coursevers'],
              'fname': item['link']
            };
            str += makeanchor("showdoc.php", hideState, "cursor:pointer;margin-left:8px;", item['entryname'], false, param);
          }
        } else if (itemKind == 6) {
          // Group
          str += "<a class='ellipsis nowrap' onclick='getGroups(\"" + grp + "\");' style='cursor:pointer;'>" + item['entryname'];
          let re = new RegExp(grptype, "g");
          grp = grp.replace(re, "");
          if (document.getElementById("userName").innerHTML == "Guest") {
            str += "  &laquo;Not logged in&raquo</span></div>";
          } else if (grp.indexOf("UNK") >= 0) {
            str += " &laquo;Not assigned yet&raquo</span></div>";
          } else {
            str += grp + "</span></a>";
          }
        } else if (itemKind == 7) {
          // Message
          str += "<span style='margin-left:8px;' title='" + item['entryname'] + "'>" + item['entryname'] + "</span>";
        }

        str += "</td>";

        // Add generic td for deadlines if one exists
        if ((itemKind === 3) && (deadline !== null || deadline === "undefined")) {
          var dl = deadline.split(" ");
          var timeFilterAndFormat = "00:00:00"; // time to filter away
          var yearFormat = "0000-";
          var dateFormat = "00-00";

          str += "<td class='dateSize' style='text-align:right;overflow:hidden;'><div class='' style='white-space:nowrap;'>";

          if (dl[1] == timeFilterAndFormat) {
            str += "<div class='dateField'>";
            str += deadline.slice(0, yearFormat.length)
            str += "</div>";
            str += deadline.slice(yearFormat.length, yearFormat.length + dateFormat.length);
          } else {
            str += "<span class='dateField'>" + deadline.slice(0, yearFormat.length) + "</span>";
            str += deadline.slice(yearFormat.length, yearFormat.length + dateFormat.length + 1 + timeFilterAndFormat.length - 3);
          }

          str += "</div></td>";
        }

        // Due to date and time format problems slice is used to make the variable submitted the same format as variable deadline
        if (submitted) {
          var dateSubmitted = submitted.toJSON().slice(0, 10).replace(/-/g, '-');
          var timeSubmitted = submitted.toJSON().slice(11, 19).replace(/-/g, '-');
          var dateTimeSubmitted = dateSubmitted + [' '] + timeSubmitted;

          // create a warning if the dugga is submitted after the set deadline and withing the grace time period if one exists
          if ((status === "pending") && (dateTimeSubmitted > deadline)) {
            if (hasGracetimeExpired(deadline, dateTimeSubmitted)) {
              str += "<td style='width:25px;'><img style='width:25px; padding-top:3px' title='This dugga is not guaranteed to be marked due to submition after deadline.' src='../Shared/icons/warningTriangle.svg'/></td>";
            }
          }
        }

        // Userfeedback
        if (data['writeaccess'] && itemKind === 3 && item['feedbackenabled'] == 1) {
          str += "<td style='width:32px;'>";
          str += "<img id='dorf' src='../Shared/icons/FistV.svg' title='feedback' onclick='showUserFeedBack(\"" + item['lid']  + "\",\"" + item['feedbackquestion']  + "\");'>";
          str += "</td>";
        }

        // Cog Wheel
        if (data['writeaccess'] || data['studentteacher']) {
          str += "<td style='width:32px;' ";

          if (itemKind === 0) str += "class='header" + hideState + "' ";
          if (itemKind === 1) str += "class='section" + hideState + "' ";
          if (itemKind === 4) str += "class='moment" + hideState + "' ";

          str += "><img id='dorf' title='Settings' class='' src='../Shared/icons/Cogwheel.svg' ";
          str += " onclick='selectItem(" + makeparams([item['lid'], item['entryname'], item['kind'], item['visible'], item['link'], momentexists, item['gradesys'], item['highscoremode'], item['comments'], item['grptype'], item['deadline'], item['tabs'], item['feedbackenabled'], item['feedbackquestion']]) + ");' />";
          str += "</td>";
        }

        // trashcan
        if (data['writeaccess']) {
          str += "<td style='width:32px;' class='" + makeTextArray(itemKind, ["header", "section", "code", "test", "moment", "link", "group", "message"]) + " " + hideState + "'>";
          str += "<img id='dorf' title='Delete item' class='' src='../Shared/icons/Trashcan.svg' onclick='confirmBox(\"openConfirmBox\", this);'>";
          str += "</td>";
        }

        str += "</tr>";
        str += "</table></div>";
      } // End of for-loop

    } else {
      // No items were returned!
      str += "<div id='noAccessMessage' class='bigg'>";
      str += "<span>You either have no access or there isn't anything under this course</span>";
      str += "</div>";
    }

    str += "</div></div>";

    var slist = document.getElementById('Sectionlisti');
    slist.innerHTML = str;

    if (resave == true) {
      str = "";
      $("#Sectionlist").find(".item").each(function (i) {
        if (i > 0) str += ",";
        ido = $(this).attr('id');
        phld = $(this).attr('placeholder')
        str += i + "XX" + ido.substr(1) + "XX" + phld;

      });
      AJAXService("REORDER", {
        order: str
      }, "SECTION");
      resave = false;
    }

    if (data['writeaccess']) {
      // Enable sorting always if we are superuser as we refresh list on update

      $("#Sectionlistc").sortable({
        helper: 'clone',
        update: function (event, ui) {
          str = "";
          $("#Sectionlist").find(".item").each(function (i) {
            if (i > 0) str += ",";
            ido = $(this).attr('id');
            phld = $(this).attr('placeholder')
            str += i + "XX" + ido.substr(1) + "XX" + phld;

          });

          AJAXService("REORDER", {
            order: str
          }, "SECTION");
          resave = true;
          return false;
        }

      });
      // But disable sorting if there is a #noAccessMessage
      if( $("#noAccessMessage").length) {
        $("#Sectionlistc").sortable("disable");
      }
    }
  } else {
    str = "<div class='err' style='z-index:500; position:absolute; top:60%; width:95%;'><span style='font-weight:bold; width:100%'>Bummer!</span> This version does not seem to exist!</div>";

    document.getElementById('Sectionlist').innerHTML+= str;
    $("#newCourseVersion").css("display", "block");




  }


  // The next 5 lines are related to collapsable menus and their state.
  getHiddenElements();
  hideCollapsedMenus();
  getArrowElements();
  toggleArrows();
  menuState.idCounter = 0;

  // Change title of the current page depending on which page the user is on.
  document.getElementById("sectionedPageTitle").innerHTML = data.coursename + " - " + data.coursecode;

  // Sets a title on the course heading name


  if(versionname){
    document.getElementById("course-coursename").title = data.coursename + " " + data.coursecode + " " + versionname;




  drawPieChart(); // Create the pie chart used in the statistics section.
  fixDeadlineInfoBoxesText(); // Create the upcomming deadlines used in the statistics section
  drawSwimlanes(); // Create the swimlane used in the statistics section.

  // Change the scroll position to where the user was last time.
  $(window).scrollTop(localStorage.getItem("sectionEdScrollPosition" + retdata.coursecode));

  // Replaces the link corresponding with dropdown choice ---===######===--- with dummylink, in this case error page 403
  replaceDefualtLink();
  


  addClasses();
  showMOTD();
  }
}
// Displays MOTD if there in no MOTD cookie or if the cookie dosen't have the correcy values
function showMOTD(){
  if((document.cookie.indexOf('MOTD=') <= -1) || ((document.cookie.indexOf('MOTD=')) == 0 && ignoreMOTD())){
    if(motd == 'UNK' || motd == 'Test' || motd == null || motd == "") {
      document.getElementById("motdArea").style.display = "none";
    }else{
      document.getElementById("motdArea").style.display = "block";
      document.getElementById("motd").innerHTML = "<tr><td>" + motd + "</td></tr>";
      document.getElementById("FABStatic2").style.top = "auto";
    }
  }
}
// Checks if the MOTD cookie already have the current vers and versname
function ignoreMOTD(){
  var c_string = getCookie('MOTD');
  c_array = c_string.split(',');
  for(let i = 0; i<c_array.length;i+=2){
    if(c_array[i] == versnme && c_array[i+1] == versnr){
      return false;
    }
  }
  return true;
}

function resetMOTDCookieForCurrentCourse(){
  var c_string = getCookie('MOTD');
  if (c_string != ('') && c_string != null){
  c_array = c_string.split(',');
  for(let i = 0; i<c_array.length;i+=2){
    if(c_array[i] == versnme && c_array[i+1] == versnr){
      c_array.splice(i, 2);
    }
  }
  document.cookie = 'MOTD=' + c_array;
}
  showMOTD();
}

function closeMOTD(){
  if(document.cookie.indexOf('MOTD=') <= -1){
    document.cookie = 'MOTD=';
    setMOTDCookie();
  }else{
    setMOTDCookie();
  }
  document.getElementById('motdArea').style.display='none';
  document.getElementById("FABStatic2").style.top = "auto";
}
// Adds the current versname and vers to the MOTD cookie
function setMOTDCookie(){
  var c_string = getCookie('MOTD');
  c_string += versnme+","+versnr+",";
  document.cookie = 'MOTD=' + c_string;
}
// Returns the value based on the cookies name
function getCookie(c_name) {
  var c_value = " " + document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
      c_value = null;
  }
  else {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1) {
          c_end = c_value.length;
      }
      c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}

function showHighscore(did, lid) {
  AJAXService("GET", {
    did: did,
    lid: lid
  }, "DUGGAHIGHSCORE");
}

function getGroups(grp) {
  AJAXService("GRP", {
    showgrp: grp
  }, "GRP");
}

function returnedHighscore(data) {

  var str = "";

  str += "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

  if (data['highscores'].length > 0) {
    for (i = 0; i < data['highscores'].length; i++) {
      var item = data['highscores'][i];
      if (!isNaN(data["user"][0]) && data["user"][0] === i) {
        str += "<tr class='highscoreUser'>"
      } else {
        str += "<tr>";
      }
      str += "<td>" + (i + 1) + "</td>";
      str += "<td>" + item['username'] + "</td>";
      str += "<td>Score: " + item['score'] + "</td>";
      str += "</tr>";
    }
  }

  if (data["user"]["username"]) {
    str += "<tr class='highscoreUser'>";
    str += "<td></td>";
    str += "<td>" + data["user"]["username"] + "</td>";
    str += "<td>Score: " + data["user"]["score"] + "</td>";
    str += "</tr>";
  }

  var highscorelist = document.getElementById('HighscoreTable').innerHTML = str;
  $("#HighscoreBox").css("display", "block");
}


function svgPie(cx, cy, radius, startpct, endpct, fill, stroke) {
  x1 = cx + (radius * Math.cos(6.28 * startpct));
  y1 = cy + (radius * Math.sin(6.28 * startpct));
  x2 = cx + (radius * Math.cos(6.28 * endpct));
  y2 = cy + (radius * Math.sin(6.28 * endpct));
  //console.log(endpct-startpct);
  if (endpct - startpct > 0.5) {
    var halfsies = (endpct - startpct) * 0.5;
    var p1 = svgPie(cx, cy, radius, startpct, startpct + halfsies + 0.003, fill, stroke);
    var p2 = svgPie(cx, cy, radius, startpct + halfsies, endpct, fill, stroke);
    return p1 + p2;
  } else {
    return "<path d='M" + cx + "," + cy + " L" + x1 + "," + y1 + " A" + radius + "," + radius + " 0 0,1 " + x2 + "," + y2 + " z' fill='" + fill + "' />";
  }
}

//----------------------------------------------------------------------------------
// drawPieChart: Statistic-sections functions, for drawing out all the statistics (pie chart and swimlanes) and upcomming deadlines.
//----------------------------------------------------------------------------------
function drawPieChart() {

  var totalQuizes = 0;
  var passedQuizes = 0;
  var notGradedQuizes = 0;
  var failedQuizes = 0;
  var notSubmittedQuizes = 0;
  // Calculate total quizes.
  for (var i = 0; i < retdata['entries'].length; i++) {
    if (retdata['entries'][i].kind == "3") totalQuizes++;
  }

  // Calculate passed, failed and not graded quizes.
  for (var i = 0; i < retdata['results'].length; i++) {
    // Moments are also stored in ['results'] but do not have a useranswer, so we dont care about these
    if (retdata['results'][i]['useranswer'] != null) {
      if (retdata['results'][i].grade > 1) {
        passedQuizes++;
      } else if (retdata['results'][i].grade == 1 && retdata['results'][i].submitted < retdata['results'][i].marked) {
        failedQuizes++;
      } else {
        notGradedQuizes++;
      }
    }
  }

  // if a course has no tests, the chart will show that the student has 100% not submitted tests.
  if (totalQuizes == 0) {
    totalQuizes++;
    notSubmittedQuizes++;
  }

  // PCT = Percentage
  var notGradedPCT = (notGradedQuizes / totalQuizes) - 0.25;
  var passedPCT = (passedQuizes / totalQuizes);
  var failedPCT = (failedQuizes / totalQuizes);
  var notSubmittedPCT = (totalQuizes - notGradedQuizes - passedQuizes - failedQuizes) / totalQuizes;

  // Slice 1 from 0 to notGraded ??
  var str = "";
  str += "<circle cx='150' cy='100' r='90' fill='#BDBDBD' />";
  str += svgPie(150, 100, 90, -0.25, notGradedPCT, "#FFEB3B", "#000");
  str += svgPie(150, 100, 90, notGradedPCT, notGradedPCT + passedPCT, "#00E676", "#000");
  str += svgPie(150, 100, 90, notGradedPCT + passedPCT, notGradedPCT + passedPCT + failedPCT, "#E53935", "#000");

  str += "<rect x='36' y='200' width='11' height='11' fill='#00E676' />";
  str += "<rect x='36' y='220' width='11' height='11' fill='#E53935' />";
  str += "<rect x='166' y='200' width='11' height='11' fill='#FFEB3B' />";
  str += "<rect x='166' y='220' width='11' height='11' fill='#BDBDBD' />";

  str += "<text x='55' y='211' font-family='Arial' font-size='12px' fill='black'>Passed: (" + Math.round(passedPCT * 100) + "%)</text>";
  str += "<text x='55' y='231' font-family='Arial' font-size='12px' fill='black'>Failed: (" + Math.round(failedPCT * 100) + "%)</text>";
  str += "<text x='185' y='211' font-family='Arial' font-size='12px' fill='black'>Pending: (" + Math.round((notGradedPCT + 0.25) * 100) + "%)</text>";
  str += "<text x='185' y='231' font-family='Arial' font-size='12px' fill='black'>N/A: (" + Math.round(notSubmittedPCT * 100) + "%)</text>";

  document.getElementById("pieChartSVG").innerHTML = str;
  var passed = Math.round(passedPCT * 100);
  var failed = Math.round(failedPCT * 100);
  var pending = Math.round((notGradedPCT + 0.25) * 100);
  courseCompletion(passed, failed, pending);
}

function courseCompletion(passed, failed, pending){
  var cid = retdata['courseid'];
  var coursevers = retdata['coursevers'];
  var uid, uname = $("#userName").html();

  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname:uname},
    type: "GET",
    success: function(data){
      var parsed_data = JSON.parse(data);
      uid = parsed_data.uid;
      $.ajax({
        url: "../Shared/retrieveuser_course.php",
        data: {uid:uid, cid:cid, vers:coursevers, passed:passed, failed:failed, pending:pending},
        type: "POST",
        success: function(data){
        }
      });
    },
    error:function(){
      console.log("*******Error*******");
    }
  });


}
//----------------------------------------------------------------------------------
// fixDeadlineInfoBoxesText: Makes an on-screen table containing deadlines
//----------------------------------------------------------------------------------

function fixDeadlineInfoBoxesText() {
  var closestDeadlineArray = [];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var str = "<tr><th style='padding:4px;text-align:left;'>Test</th><th style='padding:4px;width:60px;text-align:left;'>Release</th><th style='padding:4px;width:60px;text-align:left;'>Deadline</th></tr>";

  var deadlineEntries = [];
  var current = new Date();
  for (var i = 0; i < retdata['entries'].length; i++) {
    if (retdata['entries'][i].kind == 3) {
      var deadline = new Date(retdata['entries'][i].deadline);
      var start = new Date(retdata['entries'][i].qstart);
      //let deadlineDistance=datediff(deadline,current);
      let deadlineDistance = (deadline - current) / (24 * 60 * 60 * 1000);
      if (deadlineDistance > -7 && deadlineDistance < 14) {
        deadlineEntries.push({
          'deadline': deadline,
          'start': start,
          'text': retdata['entries'][i].entryname
        });
      }
    }
  }

  deadlineEntries.sort(function (a, b) {
    return a.deadline - b.deadline;
  });

  for (i = 0; i < deadlineEntries.length; i++) {
    var entry = deadlineEntries[i];
    if (entry.deadline < current) {
      str += "<tr style='color:red;'>";
    } else {
      str += "<tr style='color:black;'>";
    }
    str += "<td style='padding:4px;'><div style='white-space:nowrap;text-overflow:ellipsis;overflow:hidden' title='" + entry.text + "'>" + entry.text + "</div></td>";
    str += "<td style='padding:4px;white-space:nowrap;'>" + months[entry.start.getMonth()] + " " + entry.start.getDate() + "</td>";
    str += "<td style='padding:4px;white-space:nowrap;'>" + months[entry.deadline.getMonth()] + " " + entry.deadline.getDate() + "</td>";
    str += "</tr>";
  }

  if (deadlineEntries.length == 0) { // if we have no deadlines, put this nice text instead
    document.getElementById("deadlineList").innerHTML = "<tr><td>There are no near-term deadlines</td></tr>";
  } else {
    document.getElementById("deadlineList").innerHTML = str;
  }
}

function drawSwimlanes() {

  var startdate = new Date(retdata['startdate']);
  var enddate = new Date(retdata['enddate']);
  var current = new Date(2018, 9, 14);

  var deadlineEntries = [];
  var momentEntries = {};
  var current = new Date();
  var momentno = 0;
  for (var i = 0; i < retdata['entries'].length; i++) {
    var deadline = new Date(retdata['entries'][i].deadline);
    var start = new Date(retdata['entries'][i].qstart);
    if (retdata['entries'][i].kind == 3 && retdata['entries'][i].visible == "1") {
      var marked = null;
      var submitted = null;
      var grade = null;
      for (var j = 0; j < retdata['results'].length; j++) {
        if (retdata['results'][j].moment == retdata['entries'][i].lid) {
          marked = retdata['results'][j].marked;
          submitted = retdata['results'][j].submitted;
          grade = retdata['results'][j].grade;
        }
      }
      deadlineEntries.push({
        'deadline': deadline,
        'start': start,
        'text': retdata['entries'][i].entryname,
        'moment': retdata['entries'][i].moment,
        'marked': marked,
        'submitted': submitted,
        'grade': grade
      });
    } else if (retdata['entries'][i].kind == 4) {
      momentEntries[retdata['entries'][i].lid] = retdata['entries'][i].entryname;
      momentno++;
    }
  }

  //var weekLength = weeksBetween(startdate, enddate);
  var weekLength = Math.ceil((enddate - startdate) / (7 * 24 * 60 * 60 * 1000));
  var currentWeek = weeksBetween(current, startdate);
  var daySinceStart = Math.ceil((current - startdate) / (24 * 60 * 60 * 1000));
  var daywidth = 4;
  var weekwidth = daywidth * 7;
  var colwidth = 60;
  var weekheight = 25;
  var addNumb = 2;
  var tempNumb = 2;

  var str = "";
  // Fades a long text. Gradients on swimlane text depending on if dugga is submitted or not.
  str += "<defs><linearGradient gradientUnits='userSpaceOnUse' x1='0' x2='300' y1='0' y2='0' id='fadeTextGrey'><stop offset='85%' stop-opacity='1' stop-color='#000000' /><stop offset='100%' stop-opacity='0'/> </linearGradient> <linearGradient gradientUnits='userSpaceOnUse' x1='0' x2='300' y1='0' y2='0' id='fadeTextRed'><stop offset='85%' stop-opacity='1' stop-color='#FF0000' /><stop offset='100%' stop-opacity='0'/> </linearGradient></defs>";

  for (var i = 0; i < weekLength; i++) {
    if(i==0){
      addNumb = 0;
      tempNumb = 2;
    }else if(i > 0){
      tempNumb = 0;
      addNumb = 2;
    }
    var widthAdjuster = weekwidth+addNumb;
    str += "<rect x='" + (i * widthAdjuster) + "' y='" + (15) + "' width='" + (widthAdjuster+tempNumb) + "' height='" + (weekheight * (deadlineEntries.length + 1)) + "' ";
    if ((i % 2) == 0) {
      str += "fill='#ededed' />";
    } else {
      str += "fill='#ffffff' />";
    }
    str += "<text x='" + ((i * widthAdjuster) + (widthAdjuster * 0.5) + (tempNumb * 0.5)) + "' y='" + (33) + "' font-family='Arial' font-size='12px' fill='black' text-anchor='middle'>" + (i + 1) + "</text>";
  }

  for (var i = 1; i < (deadlineEntries.length + 2); i++) {
    str += "<line x1='0' y1='" + ((i * weekheight) + 15) + "' x2='" + (weekLength * weekwidth + (addNumb*10)) + "' y2='" + ((i * weekheight) + 15) + "' stroke='black' />";
  }


  var weeky = 15;
  for (obj in momentEntries) {
    for (var i = 0; i < deadlineEntries.length; i++) {
      entry = deadlineEntries[i];
      if (obj == entry.moment) {
        weeky += weekheight;
        // Now we generate a SVG element for this
        //startweek=weeksBetween(startdate, entry.start);
        //deadlineweek=weeksBetween(startdate, entry.deadline);
        startday = Math.floor((entry.start - startdate) / (24 * 60 * 60 * 1000));
        duggalength = Math.ceil((entry.deadline - entry.start) / (24 * 60 * 60 * 1000));

        // Yellow backgroundcolor if the dugga have been submitted but grade is pending.
        // Green backgroundcolor if the dugga have been submitted and the grade is passed.
        // Red backgroundcolor if the dugga have been submitted and the grade is failed.
        var fillcol = "#BDBDBD";
        if ((entry.submitted != null) && (entry.grade == undefined)) fillcol = "#FFEB3B"
        else if ((entry.submitted != null) && (entry.grade > 1)) fillcol = "#00E676"
        else if ((entry.submitted != null) && (entry.grade == 1)) fillcol = "#E53935";

        // Grey backgroundcolor & red font-color if no submissions of the dugga have been made.
        var textcol = `url("#fadeTextGrey")`;
        if (fillcol == "#BDBDBD" && entry.deadline - current < 0) {
          textcol = `url("#fadeTextRed")`;
        } else if((fillcol == "#FFEB3B") && (entry.deadline - current < 0) && (entry.submitted != null)) {
          textcol = `url("#fadeTextRed")`;
        }
        if(duggalength < 0){
          duggalength = duggalength * -1;
        }
        var tempVariable = duggalength*daywidth;

        str += "<rect opacity='0.7' x='" + (startday * daywidth) + "' y='" + (weeky) + "' width='" + (tempVariable) + "' height='" + weekheight + "' fill='" + fillcol + "' />";
        str += "<text x='" + (12) + "' y='" + (weeky + 18) + "' font-family='Arial' font-size='12px' fill='" + textcol + "' text-anchor='left'> <title> " + entry.text + " </title>" + entry.text + "</text>";
      }
    }

  }
  str += "<line opacity='0.7' x1='" + ((daywidth * daySinceStart) - daywidth) + "' y1='" + (15 + weekheight) + "' x2='" + ((daywidth * daySinceStart) - daywidth) + "' y2='" + (((1 + deadlineEntries.length) * weekheight) + 15) + "' stroke-width='4' stroke='red' />";
  let svgHeight = ((1 + deadlineEntries.length) * weekheight) + 15;
  document.getElementById("swimlaneSVG").innerHTML = str;
  document.getElementById("swimlaneSVG").setAttribute("viewBox", "0 0 300 " + svgHeight);

}

// -------------==============######## Setup and Event listeners ###########==============-------------

$(document).mouseover(function (e) {
    //showFabList(e);
    FABMouseOver(e);
});

$(document).mouseout(function (e) {
    FABMouseOut(e);
});

$(document).mousedown(function (e) {
  mouseDown(e);

  if (e.button == 0) {
    FABDown(e);
  }
});

$(document).mouseup(function (e) {
  mouseUp(e);


});

$(document).ready(function(){
$(fabBtn).on("touchstart", function (e) {
  if ($(e.target).parents(".fixed-action-button").length !== 0 && $(e.target).parents(".fab-btn-list").length === 0) {
    e.preventDefault();
  }

  $("#fabBtnList").show();
  mouseDown(e);
  TouchFABDown(e);
});
});

$(document).on("touchend", function (e) {
  if ($(e.target).parents(".fixed-action-button").length !== 0 && $(e.target).parents(".fab-btn-list").length === 0) {
    e.preventDefault();
  }
  mouseUp(e);
  TouchFABUp(e);
});

//----------------------------------------------------------------------------------
// mouseDown: make sure mousedown is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseDown(e) {

  var box = $(e.target);

  // is the clicked element a loginbox? or is it inside a loginbox?
  if (box[0].classList.contains("loginBox")) {
    isClickedElementBox = true;
  } else if ((findAncestor(box[0], "loginBox") != null) &&
    (findAncestor(box[0], "loginBox").classList.contains("loginBox"))) {
    isClickedElementBox = true;
  } else {
    isClickedElementBox = false;
  }

}

//----------------------------------------------------------------------------------
// mouseUp: make sure mouseup is only handled in one single place regardless if touch or mouse
//----------------------------------------------------------------------------------

function mouseUp(e) {
  // if the target of the click isn't the container nor a descendant of the container or if we have clicked inside box and dragged it outside and released it
  if ($('.loginBox').is(':visible') && !$('.loginBox').is(e.target) && $('.loginBox').has(e.target).length === 0 && (!isClickedElementBox)) {

    event.preventDefault();

    closeWindows();
    closeSelect();
    showSaveButton();
  } else if (!findAncestor(e.target, "hamburgerClickable") && $('.hamburgerMenu').is(':visible')) {
    hamburgerChange("notAClick");
  }
}

//----------------------------------------------------------------------------------
// event handlers: Detect mouse / touch gestures uniformly
//----------------------------------------------------------------------------------

$(window).keyup(function (event) {
  var deleteButtonDisplay = ($('#sectionConfirmBox').css('display'));
  if (event.keyCode == 27) {
    // if key is escape
    showSaveButton();
     hamburgerChange("escapePress");
    document.activeElement.blur(); // to lose focus from the newItem button when pressing escape
  } else if (event.keyCode == 13) {
    //Remember that keycode 13 = enter button
    document.activeElement.blur();
    var saveButtonDisplay = ($('#saveBtn').css('display'));
    var editSectionDisplay = ($('#editSection').css('display'));
    var submitButtonDisplay = ($('#submitBtn').css('display'));
    var errorMissingMaterialDisplay = ($('#noMaterialConfirmBox').css('display'));
    if (saveButtonDisplay == 'block' && editSectionDisplay == 'flex') {
      updateItem();
    } else if (submitButtonDisplay == 'block' && editSectionDisplay == 'flex') {
      newItem();
      showSaveButton();
    } else if (testsAvailable == true) {
      confirmBox("closeConfirmBox");
      testsAvailable = false;
    } else if (errorMissingMaterialDisplay == 'flex') {
      closeWindows();
    }
  }
    else if(event.keyCode == 37){
      if (deleteButtonDisplay == 'flex') {
        $('#delete-item-button').focus();
      }
    }
    else if(event.keyCode == 39){
      if (deleteButtonDisplay == 'flex') {
        $('#close-item-button').focus();
      }
    }
});

// React to scroll events
$(document).scroll(function (e) {
  if (typeof (retdata) !== "undefined") {
    localStorage.setItem("sectionEdScrollPosition" + retdata.coursecode, $(window).scrollTop());
  }
});

// Functions to prevent collapsing when clicking icons
$(document).on('click', '#corf', function (e) {
  e.stopPropagation();
});

$(document).on('click', '#dorf', function (e) {
  e.stopPropagation();
});

// The event handler returns two elements. The following two if statements gets the element of interest.
$(document).on('click', '.moment, .section, .statistics', function () {

  if (this.id.length > 0) {
    saveHiddenElementIDs(this.id);
  }
  if (this.id.length > 0) {
    saveArrowIds(this.id);
  }
  hideCollapsedMenus();
  toggleArrows();

});


// Setup (when loaded rather than when ready)
$(window).load(function () {
  accessAdminAction();
  $(".messagebox").hover(function () {
    $("#testbutton").css("background-color", "red");
  });
  $(".messagebox").mouseout(function () {
    $("#testbutton").css("background-color", "#614875");
  });
  $("#sectionList_arrowStatisticsOpen").click(function () {
    $("#sectionList_arrowStatisticsOpen").hide();
    $("#sectionList_arrowStatisticsClosed").show();
    $("#statisticsList").show();
    $("#statistics").hide();
    $(".statisticsContent").show();
    $("#courseList").css({
      'display':'flex',
      'flex-direction': 'column'
    });
    $(".statisticsContentBottom").show();
  });
  $("#sectionList_arrowStatisticsClosed").click(function () {
    $("#sectionList_arrowStatisticsOpen").show();
    $("#sectionList_arrowStatisticsClosed").hide();
    $("#statisticsList").hide();

  });
  $("#announcement").click(function(){
    sessionStorage.removeItem("closeUpdateForm");
    $("#announcementBoxOverlay").toggle();
    if($("#announcementForm").is(":hidden")){
      $("#announcementForm").show();
    }

  });
  $(".createBtn").click(function(){
    sessionStorage.setItem('closeUpdateForm', true);
  });

  retrieveAnnouncementAuthor();
  retrieveAnnouncementsCards();
  displayListAndGrid();
  displayAnnouncementBoxOverlay();
  multiSelect();
  toggleFeedbacks();
});


//show the full announcement
function showAnnouncement(){
  document.getElementById('fullAnnnouncementOverlay').style.display="block";
}

//retrieve the announcment author 
function retrieveAnnouncementAuthor(){
  var uname = $("#userName").html();
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if($("#userid").length > 0) {
          var parsed_data = JSON.parse(this.response);
          if(($("#announcementForm").length) > 0){
            document.getElementById("userid").value = parsed_data.uid;
            retrieveCourseProfile(parsed_data.uid);
          }
      }
    }
  };
  xmlhttp.open("GET","../Shared/retrieveUserid.php?uname="+uname,true);
  xmlhttp.send();

}

//retrieve course profile
function retrieveCourseProfile(userid){
  $(".selectLabels label input").attr("disabled", true);
  var cid = '';
  $("#cid").change(function(){
    cid = $("#cid").val();
    if (($("#cid").val()) != '') {
      $("#versid").prop("disabled", false);
      $.ajax({
        url: "../Shared/retrievevers.php",
        data: {cid: cid},
        type: "POST",
        success: function(data){
          var item = JSON.parse(data);
          $("#versid").find('*').not(':first').remove();
          $.each(item.versids, function(index,item) {        
              $("#versid").append("<option value="+item.versid+">"+item.versid+"</option>");
          });
          
        },
        error:function(){
          console.log("*******Error*******");
        }
      });

    }else{
      $("#versid").prop("disabled", true);
    }

  });
  if (($("#versid option").length) <= 2) {
    $("#versid").click(function(){
      getStudents(cid, userid);
    });
  }else if(($("#versid option").length) > 2){
    $("#versid").change(function(){
      getStudents(cid, userid);
    });
  }
}
function getStudents(cid, userid){
   var versid = '';
   versid = $("#versid").val();
   if (($("#versid").val()) != '') { 
    $("#recipient").prop("disabled", false);
    $.ajax({
      url: "../Shared/retrieveuser_course.php",
      data: {cid: cid, versid:versid, remove_student:userid},
      type: "POST",
      success: function(data){
        var item = JSON.parse(data);
        $("#recipient").find('*').not(':first').remove();
        $("#recipient").append("<optgroup id='finishedStudents' label='Finished students'></optgroup>");
        $.each(item.finished_students, function(index,item) {        
          $("#finishedStudents").append("<option value="+item.uid+">"+item.firstname+" "+item.lastname+"</option>");
        });
        $("#recipient").append("<optgroup id='nonfinishedStudents' label='Non-finished students'></optgroup>");
        $.each(item.non_finished_students, function(index,item) {        
          $("#nonfinishedStudents").append("<option value="+item.uid+">"+item.firstname+" "+item.lastname+"</option>");
        });
        $(".selectLabels label input").attr("disabled", false);
        selectRecipients();
      },
      error:function(){
        console.log("*******Error user_course*******");
      }
    });
  }else{
    $("#recipient").prop("disabled", true);
  }
}

//validate create announcement form
function validateCreateAnnouncementForm(){
  $("#announcementForm").submit(function(e){
    var announcementTitle = ($("#announcementTitle").val()).trim();
    var announcementMsg = ($("#announcementMsg").val()).trim();
    var cid = $("#cid").val();
    var versid = $("#versid").val();
    var recipients = $("#recipient").val();
    if (announcementTitle == null || announcementTitle == '') {  
        $("#announcementTitle").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (announcementMsg == null || announcementMsg == '') {  
        $("#announcementMsg").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (cid == null || cid == '') {  
        $("#cid").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (versid == null || versid == '') {  
        $("#versid").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }else if (recipients == null || recipients == '') {  
        $("#recipient").addClass('errorCreateAnnouncement');
        e.preventDefault();
    }
    $(".errorCreateAnnouncement").css({
      'border':'1px solid red'
    });   
  });
}
function validateUpdateAnnouncementForm(){
  $("#announcementForm").submit(function(e){
    var announcementTitle = ($("#announcementTitle").val()).trim();
    var announcementMsg = ($("#announcementMsg").val()).trim();

    if (announcementTitle == null || announcementTitle == '') {  
      $("#announcementTitle").addClass('errorCreateAnnouncement');
      e.preventDefault();
    }else if (announcementMsg == null || announcementMsg == '') {  
      $("#announcementMsg").addClass('errorCreateAnnouncement');
      e.preventDefault();
    }
    $(".errorCreateAnnouncement").css({
      'border':'1px solid red'
    });  
  });
}
//retrive announcements
function retrieveAnnouncementsCards(){
  var currentLocation = $(location).attr('href');
  var url = new URL(currentLocation);
  var cid = url.searchParams.get("courseid");
  var versid = url.searchParams.get("coursevers");
  var uname = $("#userName").html();
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname:uname},
    type: "GET",
    success: function(data){
      var parsed_data = JSON.parse(data);
      var uid = parsed_data.uid;
     var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var parsed_data = JSON.parse(this.response);
          document.getElementById("announcementCards").innerHTML = parsed_data.retrievedAnnouncementCard;
          var unread_announcements = parsed_data.nRows;
          if(unread_announcements > 0){
            $("#announcement img").after("<span id='announcementnotificationcount'>0</span>");
            $("#announcementnotificationcount").html(parsed_data.nRows);
          }
          accessAdminAction();
          var paragraph = "announcementMsgParagraph";
          readLessOrMore(paragraph);
          showLessOrMoreAnnouncements();
          scrollToTheAnnnouncementForm();
          $(".deleteBtn").click(function(){
            sessionStorage.setItem('closeUpdateForm', true);

          });

        }
      };
      xmlhttp.open("GET","../Shared/retrieveAnnouncements.php?cid="+cid+"&versid="+versid+"&recipient="+uid,true);
      xmlhttp.send();
    }
  });
}
//update anouncement form
function updateannouncementForm(updateannouncementid, cid, versid, tempFuction){
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        tempFuction(this, updateannouncementid, cid, versid);
    }
  };
  xmlhttp.open("GET","../Shared/updateAnnouncement.php?updateannouncementid="+updateannouncementid,true);
  xmlhttp.send();

}
function handleResponse(xhttp, updateannouncementid, cid, versid){
  var title, message;
  var parsed_data = JSON.parse(xhttp.response);
  title = parsed_data.title;
  message = parsed_data.message;
  if($("#announcementForm").is(":hidden")){
    $("#announcementForm").show();
  }
  $(".formTitle").html("Update announcement");
  $(".formSubtitle").html("Please fill in this form to update the announcement.");
  $("#announcementTitle").val(title);
  $("#announcementMsg").html(message);
  $(".createBtn").html("Update");
  $(".createBtn").attr("name", "updateBtn");
  $(".createBtn").attr("onclick", "validateUpdateAnnouncementForm()");
  $("#courseidAndVersid").remove();
  $("#recipientBox").remove();

  $("#announcementForm .announcementFormcontainer .clearfix").before('<div><input type="hidden" name="updateannouncementid" id="updateannouncementid" value="'+updateannouncementid+'"></div>');
  $("#announcementForm .announcementFormcontainer .clearfix").before('<div><input type="hidden" name="cid" id="cid" value="'+cid+'"></div>');
  $("#announcementForm .announcementFormcontainer .clearfix").before('<div><input type="hidden" name="versid" id="versid" value="'+versid+'"></div>');


}

//announcement card grid and list view
function displayListAndGrid(){
  $("#displayAnnouncements").prepend('<div id="btnContainer"><button class="btn listBtn"><i class="fa fa-bars"></i> List</button>'+
    '<button class="btn active gridBtn"><i class="fa fa-th-large"></i> Grid</button></div><br>');

  var announcementCard = document.getElementsByClassName("announcementCard");
  var i;

  $(".listBtn").click(function(){
    for (i = 0; i < announcementCard.length; i++) {
      announcementCard[i].style.width = "100%";
    }
  });

  $(".gridBtn").click(function(){
    for (i = 0; i < announcementCard.length; i++) {
      announcementCard[i].style.width = "48%";
    }
  });

  var btnContainer = document.getElementById("btnContainer");
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  $(window).resize(function() {
    if (($(window).width()) < 1050) {
      $(".gridBtn").removeClass("active");
      $(".listBtn").addClass("active");
    }else{
      $(".listBtn").removeClass("active");
      $(".gridBtn").addClass("active");
    }
  });
}
function accessAdminAction(){
  var adminLoggedin = $("#adminLoggedin").val();
  if(adminLoggedin == 'yes'){
    $("#announcementForm").add();
    $(".actionBtns").add();
  }else{
    $("#announcementForm").remove();
    $(".actionBtns").remove();
    if($("#announcementForm").is(":hidden") || ($("#announcementForm").length) == 0){
      $("#displayAnnouncements").css("margin-top", "0px");
    }else{
      $("#displayAnnouncements").css("margin-top", "20px");
    }
  }
}
function displayAnnouncementForm(reload){
  if ($("#updateannouncementid").length > 0) {
    location.reload();
    sessionStorage.setItem('closeUpdateForm', true);

  }else{
    $("#announcementForm").hide();
    sessionStorage.removeItem("closeUpdateForm");

  }

}
function displayAnnouncementBoxOverlay(){
  var closeUpdateForm = sessionStorage.getItem("closeUpdateForm");
  if(closeUpdateForm == 'true'){
    $("#announcementBoxOverlay").show();
  
  }
}
function scrollToTheAnnnouncementForm(){
  $(".editBtn").click(function() {
    $('html,body').animate({
        scrollTop: $("#announcementForm").offset().top},
        'slow');
  });
}
function closeActionLogDisplay(){
  $(".closeActionLogDisplay").parent().remove();
}
//read less or more announcement card
function readLessOrMore(paragraph){
    var maxLength = 70;

    $("."+paragraph).each(function(){

      var myStr = $(this).text();

      if($.trim(myStr).length > maxLength){
        var newStr = myStr.substring(0, maxLength);
        var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
        $(this).empty().html(newStr);
        $(this).append(' <a href="javascript:void(0);" class="read-more">read more...</a>');
        $(this).append('<span class="more-text">' + removedStr + '</span>');

      }

    });

    var announcementCard = document.getElementsByClassName("announcementCard");
    $(".read-more").click(function(){
      $(this).siblings(".more-text").contents().unwrap();
      $(this).remove();
      if(paragraph == 'announcementMsgParagraph'){
        for (i = 0; i < announcementCard.length; i++) {
          announcementCard[i].style.width = "100%";
        }
      } 
     
    });
}

function showLessOrMoreAnnouncements(){
  var announcementCardLength = $(".announcementCard").length;
  if (announcementCardLength == 0) {
      $("#announcementCards").append("<p style='color:#775886;'>No announcements yet</p>");
  }else if(announcementCardLength > 6){
      $(".announcementCard:gt(5)").hide();
      $("#displayAnnouncements").append('<div class="showmoreBtnContainer"><button class="showAllAnnouncement">'+
        '<span class="hvr-icon-forward"><span class="showmore">Show more</span><i class="fa fa-chevron-circle-right hvr-icon"></i></span>'+
        '</button></div>');
  }
   $('.showAllAnnouncement').on('click', function() {
    $('.announcementCard:gt(5)').toggle();
    $(".showmore").text() === 'Show more' ? $(".showmore").text('Show less') : $(".showmore").text('Show more');
  });

}
function updateReadStatus(announcementid, cid, versid){
  var uname = $("#userName").html();
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname: uname},
    type: "GET",
    success: function(data){
      var parsed_data = JSON.parse(data);
      var uid = parsed_data.uid;
      $.ajax({
        url: "../Shared/updateviewedAnnouncementCards.php",
        data: {announcementid : announcementid, uid : uid, cid : cid, versid : versid},
        type: "POST",
        success: function(data){
        }
      });
    }
  });

}
function selectRecipients(){
   $(".selectAll input").change(function() {
      if(this.checked) {
        $("#recipient option").not(":first").prop("selected", true);
        $("#recipient option").not(":first").attr("selected","selected");
        $(".selectFinished input, .selectNonFinished input").prop("checked", false);
      }else{
        $("#recipient option").attr("selected", false);
      }
  });
  $(".selectFinished input").change(function() {
    if(this.checked) {
      $("#finishedStudents option").prop("selected", true);
      $("#finishedStudents option").attr("selected","selected");
      $(".selectAll input, .selectNonFinished input").prop("checked", false);
      $("#nonfinishedStudents option").attr("selected", false);
    }else{
      $("#recipient option").attr("selected", false);
    }
  });
  $(".selectNonFinished input").change(function() {
    if(this.checked) {
      $("#nonfinishedStudents option").prop("selected", true);
      $("#nonfinishedStudents option").attr("selected","selected");
      $(".selectAll input, .selectFinished input").prop("checked", false);
      $("#finishedStudents option").attr("selected", false);

    }else{
      $("#recipient option").attr("selected", false);
    }
  });

}
function multiSelect(){
  $("#recipient").mousedown(function(e){
    e.preventDefault();
    
    var select = this;
    var scroll = select.scrollTop;
    
    e.target.selected = !e.target.selected;
    
    setTimeout(function(){select.scrollTop = scroll;}, 0);
    
    $(select).focus();
  }).mousemove(function(e){e.preventDefault()});
}
//start of recent feedback from the teacher
function toggleFeedbacks(){
  let uid, uname = $("#userName").html();
  $.ajax({
    url: "../Shared/retrieveUserid.php",
    data: {uname:uname},
    type: "GET",
    success: function(data){
      let parsed_uid = JSON.parse(data);
      uid = parsed_uid.uid;
      $.ajax({
        url: "../Shared/retrieveFeedbacks.php",
        data: {uid: uid},
        type: "POST",
        success: function(data){
          let parsed_data = JSON.parse(data);
          let gradedAnswer = parsed_data.gradedAnswer;
          $(".feedbackContent").html(gradedAnswer);
          if ($(".recentFeedbacks").length == 0) {
             $(".feedbackContent").append("<p class='noFeedbacks'><span>There are no recent feedbacks to view.</span><span class='viewOldFeedbacks' onclick='viewOldFeedbacks();'>View old feedbacks</span></p>");

          }
          $(".oldFeedbacks").hide();                  
          let feedbackComment = 'feedbackComment';
          readLessOrMore(feedbackComment);
          let unseen_feedbacks = parsed_data.unreadFeedbackNotification;
          if(unseen_feedbacks > 0){
            $("#feedback img").after("<span id='feedbacknotificationcounter'>0</span>");
            $("#feedbacknotificationcounter").html(unseen_feedbacks);

          }
        },
        error:function(){
          console.log("Couldn't return feedback data");
        }

      });

    }

  });

  if ($("#feedback").length > 0) {
    $("header").after("<div id='feedbackOverlay'><div class='feedbackContainer'><div class='feedbackHeader'><h2>Recent Feedbacks</h2></div><div class='feedbackContent'></div></div></div>");

  }

  $("#feedback").click(function(){
    $("#feedbackOverlay").toggle();
     if ($("#feedbacknotificationcounter").length > 0) {
      var viewed = "YES";
      $.ajax({
        url: "../Shared/retrieveFeedbacks.php",
        data: {uid: uid, viewed:viewed},
        type: "POST",
        success: function(){
          $("#feedbacknotificationcounter").remove();
        }
      });
     }
  });
}
function viewOldFeedbacks(){
  $(".noFeedbacks").remove();
  $(".feedbackContent").append('<div id="loadMore"><span>Load More</span><div>');
  $(".feedback_card").slice(0, 5).show();
  $("#loadMore").on('click', function (e) {
    e.preventDefault();
    $(".feedback_card:hidden").slice(0, 5).slideDown();
    if ($(".feedback_card:hidden").length == 0) {
      $("#loadMore").hide();
    }
    $('html,body').animate({
      scrollTop: $(this).offset().top
    }, 1500);
  }); 
}
// Checks if <a> link is external
function link_is_external(link_element) {
    return (link_element.host !== window.location.host);
}

// Replaces the link corresponding wtih the dropdown choices ---===######===--- with a link to errorpage instead
function replaceDefualtLink(){
  var links = document.getElementsByTagName('a');

  for(var i = 0; i < links.length; i++){
    if((links[i].getAttribute('href')) == ("showdoc.php?exampleid=---===######===---&courseid=" + querystring['courseid'] + "&coursevers=" +
    querystring['coursevers'] + "&fname=---===######===---")){
      links[i].href = "../errorpages/403.php";
    }
  }
}

// Adds classes to <a> element depending on if they are external / internal
function addClasses() {
  var links = document.getElementsByTagName('a');

  for (var i = 0; i < links.length; i++) {
    if ((links[i].innerHTML.toLowerCase().indexOf("example") !== -1) || (links[i].innerHTML.toLowerCase().indexOf("exempel") !== -1) || (links[i].innerHTML.toLowerCase().indexOf("examples") !== -1)) {
      links[i].classList.add("example-link");
    } else if (link_is_external(links[i])) {
      links[i].classList.add("external-link");
    } else {
      links[i].classList.add("internal-link");
    }
  }
}

// Function for checking if a grace time exists and if the submition time is withing that grace time window
function hasGracetimeExpired(deadline, dateTimeSubmitted) {
  var m_dateTimeSubmitted = new Date(dateTimeSubmitted);
  var m_gracetime = new Date(deadline);
  var m_deadline = new Date(deadline);

  if ((m_deadline.getHours() >= 17) || (m_deadline.getDay() > 5)) {
    if (m_deadline.getDay() <= 4) {
      m_gracetime.setDate(m_deadline.getDate() + 1);
    }
    else if (m_deadline.getDay() == 5){
      m_gracetime.setDate(m_deadline.getDate() + 3);
    }
    else if (m_deadline.getDay() == 6){
      m_gracetime.setDate(m_deadline.getDate() + 2);
    }
      m_gracetime.setHours(8);
      m_gracetime.setMinutes(0);
      m_gracetime.setSeconds(0);
  }
  if (m_dateTimeSubmitted > m_gracetime) {
    return true;
  }
  else {
    return false;
  }
}
/*Validates all versionnames*/
function validateVersionName(versionName, dialogid) {
  //Regex for 2 capital letters, 2 numbers
  var Name = /^HT\d{2}$|^VT\d{2}$|^ST\d{2}$/;
  var name = document.getElementById(versionName);
  var x = document.getElementById(dialogid);

  //if versionname is 2 capital letters, 2 numbers
  if (name.value.match(Name)) {
    name.style.borderColor = "#383";
    name.style.borderWidth = "2px";
    x.style.display = "none";
    if (versionName === 'versname') {
      window.bool3 = true;
    }
    if (versionName === 'eversname') {
      window.bool4 = true;
    }

  } else {

    name.style.borderColor = "#E54";
    x.style.display = "block";
    name.style.borderWidth = "2px";

    if (versionName === 'versname') {
      window.bool3 = false;
    }
    if (versionName === 'eversname') {
      window.bool4 = false;
    }
  }
}

/*Validate versionID */
function validateCourseID(courseid, dialogid) {
  //regex for only numbers, between 3 and 6 numbers
  var Code = /^[0-9]{3,6}$/;
  var code = document.getElementById(courseid);
  var x2 = document.getElementById(dialogid);
  var val = document.getElementById("cversid").value;

  if (code.value.match(Code)) {
    code.style.borderColor = "#383";
    code.style.borderWidth = "2px";
    x2.style.display = "none";
    window.bool = true;
  } else {

    code.style.borderColor = "#E54";
    x2.innerHTML = "Only numbers(between 3-6 numbers)";
    x2.style.display = "block";
    code.style.borderWidth = "2px";
    window.bool = false;
  }

  const versionIsValid = retdata["versions"].some(object => object.cid === retdata["courseid"] && object.vers === val);
  if(versionIsValid) {
    code.style.borderColor = "#E54";
    x2.innerHTML = "Version ID already exists, try another";
    x2.style.display = "block";
    code.style.borderWidth = "2px";
    window.bool = false;
  }

}

function validateMOTD(motd, dialogid){
  var emotd = document.getElementById(motd);
  var Emotd = /(^$)|(^[-a-zåäöA-ZÅÄÖ0-9_+§&%# ?!,.]*$)/;
  var EmotdRange = /^.{0,50}$/;
  var x4 = document.getElementById(dialogid);
  if (emotd.value.match(Emotd) && emotd.value.match(EmotdRange)) {
    emotd.style.borderColor = "#383";
    emotd.style.borderWidth = "2px";
    x4.style.display = "none";
    window.bool9 = true;
  } else {
    emotd.style.borderColor = "#E54";
    x4.style.display = "block";
    emotd.style.borderWidth = "2px";
    window.bool9 = false;
  }

}

/*Validates that start date comes before end date*/
function validateDate(startDate, endDate, dialogID) {
  var sdate = document.getElementById(startDate);
  var edate = document.getElementById(endDate);
  var x3 = document.getElementById(dialogID);

  var date1 = new Date(sdate.value);
  var date2 = new Date(edate.value);

  // If one of the dates is not filled in
  if (sdate.value == 'yyyy-mm-dd' || sdate.value == "" || edate.value == 'yyyy-mm-dd' || edate.value == "") {
    sdate.style.borderColor = "#E54";
    edate.style.borderColor = "#E54";
    sdate.style.borderWidth = "2px";
    edate.style.borderWidth = "2px";
    x3.innerHTML = "Both start date and end date must be filled in";
    x3.style.display = "block";
  }
 // if start date is less than end date
  if (date1 < date2) {
    sdate.style.borderColor = "#383";
    edate.style.borderColor = "#383";
    sdate.style.borderWidth = "2px";
    edate.style.borderWidth = "2px";
    x3.style.display = "none";
    if (startDate === 'startdate' && endDate === 'enddate') {
      window.bool5 = true;
    }
    if (startDate === 'estartdate' && endDate === 'eenddate') {
      window.bool6 = true;
    }
  }
  // if end date is less than start date
  if (date2 < date1) {
    sdate.style.borderColor = "#E54";
    edate.style.borderColor = "#E54";
    x3.innerHTML = "Start date has to be before end date";
    x3.style.display = "block";
    sdate.style.borderWidth = "2px";
    edate.style.borderWidth = "2px";
    if (startDate === 'startdate' && endDate === 'enddate') {
      window.bool5 = false;
    }
    if (startDate === 'estartdate' && endDate === 'eenddate') {
      window.bool6 = false;
    }
  }
}

/*Validates if deadline is between start and end date*/
function validateDate2(ddate, dialogid) {
  var inputDeadline = document.getElementById("inputwrapper-deadline");
  if (window.getComputedStyle(inputDeadline).display !== "none") {
  
  var ddate = document.getElementById(ddate);
  var x = document.getElementById(dialogid);
  var deadline = new Date(ddate.value);
  //Dates from database
  var startdate = new Date(retdata['startdate']);
  var enddate = new Date(retdata['enddate']);

  //if deadline is between start date and end date
  if (startdate < deadline && enddate > deadline) {
    ddate.style.borderColor = "#383";
    ddate.style.borderWidth = "2px";
    x.style.display = "none";
    window.bool8 = true;

  } else {

    ddate.style.borderColor = "#E54";
    x.style.display = "block";
    ddate.style.borderWidth = "2px";
    window.bool8 = false;

    }
  }
  else{
    window.bool8 = true;
  }
}

function validateSectName(name, dialogid){
  var emotd = document.getElementById(name);
  var Emotd = /^[^"']+$/;
  // var EmotdRange = /^.{0,50}$/;
  var x4 = document.getElementById(dialogid);
  if (emotd.value.match(Emotd)) {
    emotd.style.borderColor = "#383";
    emotd.style.borderWidth = "2px";
    x4.style.display = "none";
    window.bool10 = true;
  } else {
    emotd.style.borderColor = "#E54";
    x4.style.display = "block";
    emotd.style.borderWidth = "2px";
    window.bool10 = false;
  }

}

/*Validates all forms*/

function validateForm(formid) {

  //Validates Item form
  if (formid === 'editSection') {
    var sName = document.getElementById("sectionname").value;
    var deadDate = document.getElementById("setDeadlineValue").value;

    //If fields empty
    if (sName == null || sName == "") {
      alert("Fill in all fields");

    }
    // if all information is correct
    if (window.bool8 === true && window.bool10 === true ) {
      alert('The item is now updated');
      updateItem();
      updateDeadline();

    } else {
      alert("You have entered incorrect information");
    }
  }
   //Validates new course version form
  if (formid === 'newCourseVersion') {
    var versName = document.getElementById("versname").value;
    var versId = document.getElementById("cversid").value;

    //If fields empty
    if (versName == null || versName == "", versId == null || versId == "") {
      alert("Fill in all fields");

    }
    // if all information is correct
    if (window.bool5 === true && window.bool3 === true && window.bool === true) {
      alert('New version created');
      createVersion();
      $('#newCourseVersion input').val("");

    } else {
      alert("You have entered incorrect information");
    }
  }

  // validates edit course version form
  if (formid === 'editCourseVersion') {
    var eversName = document.getElementById("eversname").value;

    //If fields empty
    if (eversName == null || eversName == "") {
      alert("Fill in all fields");

    }

    // if all information is correct
    if (window.bool4 === true && window.bool6 === true && window.bool9 === true) {
      alert('Version updated');
      updateVersion();
      resetMOTDCookieForCurrentCourse();
    } else {
      alert("You have entered incorrect information");
    }
  }
}

//------------------------------------------------------------------------------
//displays dialogue box and the content
//------------------------------------------------------------------------------
function showUserFeedBack(lid,feedbackquestion) {
	AJAXService("GETUF", { courseid: querystring['courseid'], moment: lid }, "USERFB");
  $("#userFeedbackDialog").css("display", "flex");
  $("#feedbacktablecontainer").html("");
  $("#statscontainer").css("display", "none");
  $("#duggaFeedbackQuestion").html(feedbackquestion);
}

//------------------------------------------------------------------------------
//returns the feedbackdata and displays the feedback and statistics.
//------------------------------------------------------------------------------
function returnedUserFeedback(data){
  if(data.userfeedback.length == 0){
    $("#feedbacktablecontainer").html( "<p>No feedback available</p>" );
  }else{
    $("#statscontainer").css("display", "flex");
    var averagerating = parseFloat(data.avgfeedbackscore);
    var highestscore = 0;
    var lowestscore = 10;
    for(var i = 0; i<data.userfeedback.length; i++){
      if(parseInt(data.userfeedback[i].score) > highestscore){
        highestscore=data.userfeedback[i].score;
        
      }
      if(parseInt(data.userfeedback[i].score) < lowestscore){
        lowestscore=data.userfeedback[i].score;
      }
    }
    $("#avg-feedback").html(averagerating.toFixed(2));
    $("#median-feedback").html(highestscore+" / "+lowestscore);
    $("#total-feedback").html(data.userfeedback.length);
    $("#feedbacktablecontainer").html(createUserFeedbackTable(data));
  }
  
}
//------------------------------------------------------------------------------
//Creates a table with the Feedback data.
//------------------------------------------------------------------------------
function createUserFeedbackTable(data){
  var str = "<table id='feedbacktable'  style='border-collapse: collapse' class='list'>";
  str += "<thead><tr><th>Feedback ID</th>";
  str += "<th>Username</th>";
  str += "<th>Course ID</th>";
  str += "<th>Dugga ID</th>";
  str += "<th>Rating</th>";
  str += "<th>Contact student</th></tr></thead><tbody style='background-color: var(--color-background)'>";

  for(var i = 0; i < data.userfeedback.length; i++){
    str +="<tr>";
    str += "<td>"+data.userfeedback[i].ufid+"</td>";
    if(data.userfeedback[i].username === null){
      str += "<td>N/A</td>";
    }else{
      str += "<td>"+data.userfeedback[i].username+"</td>";
    }
    str += "<td>"+data.userfeedback[i].cid+"</td>";
    str += "<td>"+data.userfeedback[i].lid+"</td>";
    str += "<td style='font-weight: bold; font-size: 18px;'>"+data.userfeedback[i].score+"</td>";
    if(data.userfeedback[i].username === null){
      str += "<td style='width:1px;'><input class='inactive-button' type='button' value='Contact student'></td>";
    }else{
      str += "<td style='width:1px;'><input class='submit-button' type='button' value='Contact student' onclick='contactStudent(\"" + data.userfeedback[i].entryname + "\",\"" + data.userfeedback[i].username + "\")'></td>";
    }
    str += "</tr>";
  }

  str += "</tbody></table>";
  return str;
}

//------------------------------------------------------------------------------
//opens an email to the student
//------------------------------------------------------------------------------
function contactStudent(entryname,username){
  
  window.location = "mailto:" + username + "@student.his.se?Subject=Kontakt%20angående%20din%20feedback%20på%20dugga "+entryname;
}
//------------------------------------------------------------------------------
//Displays the feedback question input on enable-button toggle. 
//------------------------------------------------------------------------------
function showFeedbackquestion(){
  if($("#fdbck").prop('checked')){
    $("#inputwrapper-FeedbackQuestion").css("display","block");
  }else{
    $("#inputwrapper-FeedbackQuestion").css("display","none");
  }
}
