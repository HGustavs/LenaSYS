/********************************************************************************
 Globals
 *********************************************************************************/
var tableName = "resultTable";
var filterList;
var buttonFlag = true;
var duggaFilter;
var filerByDate = {
	date1: null,
	date2: null
}
var duggasArr = [];
var showDuggaFilterElement;
var toggleElement;
var checkboxElements;


function updateFilterInterval() {
	// Date object requires string to not apply random time zone.
	var dateElement = document.querySelectorAll(".date-interval-selector");
	if (dateElement[0].value != "" && dateElement[1].value != ""){
		filerByDate.date1 = new Date(JSON.stringify(dateElement[0].value));
		filerByDate.date2 = new Date(JSON.stringify(dateElement[1].value));
	}

	duggasArr = [];
	var checkboxElements = document.getElementsByName("duggaEntryname");

	for (var element of checkboxElements) {
		if (element.checked) {
			duggasArr.push(element.value)
		}
	}

	updateTable();
}

document.addEventListener("DOMContentLoaded", loadHTMLelements);
document.addEventListener("click", function(e) {
	var child = e.target;
	var parent = showDuggaFilterElement;
	var bool = (!parent.classList.contains("hidden") && (child.classList.contains("filter-btn-duggaName") || parent.contains(child)));

	if (bool) parent.classList.remove("hidden")
	else parent.classList.add("hidden")
});

function loadHTMLelements() {
	showDuggaFilterElement = document.querySelector(".show-dugga-filter-popup");
	toggleElement = document.getElementById("toggle-dugganame-filter");
	checkboxElements = document.getElementsByName("duggaEntryname");
}

function checkboxDuggaNameClicked(thisElement) {
	// When unchecking toggle should also uncheck
	if (toggleElement.checked && !thisElement.checked)
		toggleElement.checked = false;
}

function toggleDuggaNameFilter() {
	var toggleStatus = toggleElement.checked;
	var isAnyChecked = false;
	var isAnyUnChecked = false;

	for (var element of checkboxElements) {
		if (element.checked) isAnyChecked = true;
		else isAnyUnChecked = true
	}

	for (var element of checkboxElements) {
		if (isAnyChecked && isAnyUnChecked) element.checked = false;
		else element.checked = toggleStatus
	}

	if (isAnyChecked && isAnyUnChecked) toggleElement.checked = false;
}

function showAvaiableDuggaFilter() {
	showDuggaFilterElement.classList.toggle("hidden")
}

function setup(){
  
    AJAXService("GET", { cid: querystring['courseid'], vers: querystring['coursevers'] }, "RESULT");
}

function process(){

    filterList = JSON.parse(localStorage.getItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers']));
    if (filterList == null) {
		filterList = {};
	}
	makeCustomFilter("duggaFilter");
}

// Runs every time a new filter is picked
function updateTable() {
	
	filterList["duggaFilter"] = document.getElementById("assignmentDropdown").value;
	localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList));	
	myTable.renderTable();
}

function returnedResults(data) {
    process();

	var assignmentList;
	var duggaEntrynameCheckbox = "";
	var duggaFilterOptions = data['duggaFilterOptions'];
	assignmentList += "<option value='All' selected>All</option>";
	var lasti;
	for(var i = 0; i < duggaFilterOptions.length; i++) {
		assignmentList += "<option value='"+ duggaFilterOptions[i].entryname +"'>"+ duggaFilterOptions[i].entryname + "</option>";
		duggaEntrynameCheckbox += `
		<div class="dugga-entry-box toggle-${i%2}">
			<input type="checkbox" name="duggaEntryname" value="${duggaFilterOptions[i].entryname}" onclick="checkboxDuggaNameClicked(this)">
			<label>${duggaFilterOptions[i].entryname}</label>
		</div>
		`;

		lasti = i;
	}
	duggaEntrynameCheckbox += `
	<div class="toggle-dugganame-filter-box toggle-${(lasti + 1)%2}">
		<input type="checkbox" id="toggle-dugganame-filter" onclick="toggleDuggaNameFilter()">
		<label>Select all</label>
	</div>`

	document.getElementById("assignmentDropdown").innerHTML = assignmentList;
	document.querySelector(".show-dugga-filter-popup").innerHTML = duggaEntrynameCheckbox;
		
    createSortableTable(data['tableInfo']);
	loadHTMLelements();
}

function createSortableTable(data){

    var tabledata = {
		tblhead:{
			duggaName: "Dugga",
			hash:"Hash",
			password:"Password",
			submitted:"Submission Date",
			timesSubmitted: "Times submitted",
			timesAccessed: "Times accessed",
		},
		tblbody: data,
		tblfoot:{}
	};

	var colOrder = ["duggaName","hash", "password", "submitted", "timesSubmitted", "timesAccessed"];

	myTable = new SortableTable({
		data: tabledata,
		tableElementId: tableName,
		filterElementId: "columnfilter",
		renderCellCallback: renderCell,
        renderSortOptionsCallback: renderSortOptions,
        rowFilterCallback: rowFilter,
		columnOrder: colOrder,
		hasRowHighlight: true,
		hasMagicHeadings: true,
		hasCounterColumn: true
	});

	var sortCol = localStorage.getItem("resultTable___sortcol");
	var sortDir = parseInt(localStorage.getItem("resultTable___sortkind"));
	if(sortCol != null && sortDir != null){
		myTable.toggleSortStatus(sortCol, sortDir); // Set sort from localstorage
	}else{
		myTable.toggleSortStatus("duggaName", 1); // Default ascending sort of dugga column
	}

	myTable.renderTable();
}

// Displays different things depending on column
function renderCell(col, celldata, cellid) { 
	
	str = "<div class='resultTableCell'>";
	if (col == "hash"){
		var url = createUrl(celldata);
		str += "<div class='resultTableText'>";
		str += "<a href='" + url + "'>" + celldata + "</a>";
	}
	else if(col == "grade"){
		str += "<div class='gradeContainer resultTableText'>";
		str += "<img id='korf' class='fist' src='../Shared/icons/FistV.png' onclick='clickResult("+celldata+")'/>";

	}
	else if (col == "password") {
		str += "<div class='resultTableText passwordBlock'>";
		str += celldata;
	}
	else {
		str += "<div class='resultTableText'>";
		str += "<div>" + celldata +"</div>";
	}
	str += "</div>";
	str += "</div>";
	
	return str;
}

function renderSortOptions(col, sortKind, colname) { // Which columns and how they are sorted
    str = "";

	if(col == "duggaName" || col == "submitted" || col == "timesSubmitted" || col == "timesAccessed"){
		str += "<div style='white-space:nowrap;cursor:pointer'>"
        if(sortKind == 1){		
            str += "<span onclick='myTable.setNameColumn(\"" + colname + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "(ASC)" +"</span>";

        }else if (sortKind == 0){
            str += "<span onclick='myTable.setNameColumn(\"" + colname + "\"); myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "(DES)" + "</span>";
			
        }else{
            str += "<span onclick='myTable.setNameColumn(\"" + colname + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname +"</span>";
        }
    }else{
		str += colname;
	}
    
    return str;
}

function getLinkFromHash(hash) {
	return "";
}

function makeCustomFilter(filtername) {
	
	if (filterList[filtername] == null) {
		filterList[filtername] = "All";
	}
	localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList)); //Saves the filter in local storage when opening resulted.php.	
}

// How rows are filtered, for multiple filters add more if statements
// Add new variable to each type filter
function rowFilter(row) {
	var isDuggaFilterMatch = true;
	var isFilterDateMatch = true;
  
	for (var duggaName of duggasArr) {
		if (duggaName == row["duggaName"]) {
			isDuggaFilterMatch = true;
			break;
		}
		else{
			isDuggaFilterMatch = false;
		}
	}

	if (filerByDate.date1 != null && filerByDate.date2 != null)	{
		// Datepicker does not contain hours, minutes and seconds. Submitted date is adjusted to match datepicker format
		var date = new Date(row["submitted"])
		var newdate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0); 
		isFilterDateMatch = (newdate >= filerByDate.date1 && newdate <= filerByDate.date2);
	}

	return (isDuggaFilterMatch && isFilterDateMatch);
}

// Basic ascending/descending order
 function compare(a, b) { 
	if(isNaN(a) && isNaN(b)){
		if (a.toLowerCase() < b.toLowerCase()){
			return 1;
		}else if (a.toLowerCase() > b.toLowerCase()){
			return -1;
		}
	}else{
		var numA = parseInt(a);
		var numB = parseInt(b);
		if (numA < numB){
			return 1;
		}else if (numA > numB){
			return -1;
		}
	}
	return 0;	
}
// Runs every time a cell in the table is clicked
function clickedInternal(event, clickdobj){

	if (clickdobj.classList.contains("resultTable-password")){
		var textElement = clickdobj.childNodes[0].childNodes[0];
		textElement.classList.toggle("passwordBlock");
	}
}

