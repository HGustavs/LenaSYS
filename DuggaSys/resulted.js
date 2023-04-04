/********************************************************************************
 Globals
 *********************************************************************************/
var tableName = "resultTable";
var filerByDate = {
	date1: null,
	date2: null
}
var duggasArr = [];
var searchTerms = [];
var showDuggaFilterElement;
var showColumnFilterElement;
var toggleDuggaCheckAll;
var checkboxElements;
var searchBarElement;
var searchDelayTimeout;
var colOrder = ["duggaName","hash", "password","teacherVisited", "submitted", "timesSubmitted", "timesAccessed"];
var x = window.matchMedia('(max-width: 380px)');

x.onchange = (e) => {
    if (e.matches) {
        displayNavIcons();
    }
}  

function displayNavIcons() {
    document.getElementById("home").style.display="revert";
    document.getElementById("theme-toggle").style.display="revert";
    document.getElementById("back").style.display="revert";    
}

function searchByFilter() {
	// Date object requires string to not apply random time zone.
	var dateElement = document.querySelectorAll(".date-interval-selector");
	if (dateElement[0].value != "" && dateElement[1].value != ""){
		filerByDate.date1 = new Date(JSON.stringify(dateElement[0].value));
		filerByDate.date2 = new Date(JSON.stringify(dateElement[1].value));
	}

	setSearchTerms();
	updateTable();
}

function setSearchTerms() {

	searchTerms = searchBarElement.value.split("&&");
}

document.addEventListener("DOMContentLoaded", loadHTMLelements);
document.addEventListener("click", function(e) {
	var child = e.target;
	var parent = [showDuggaFilterElement, showColumnFilterElement];
	for (let i = 0; i < parent.length; i++) {
		var bool = (!parent[i].classList.contains("hidden") && (child.classList.contains("filter-btn-duggaName") || parent[i].contains(child)));

		if (bool) parent[i].classList.remove("hidden")
		else parent[i].classList.add("hidden")
	}
});


function loadHTMLelements() {
	searchBarElement = document.querySelector(".searchbar-filter");
	showDuggaFilterElement = document.querySelector(".show-dugga-filter-popup");
	showColumnFilterElement = document.querySelector(".show-column-filter-popup");
	toggleDuggaCheckAll = document.getElementById("toggle-dugganame-filter");
	toggleColumnCheckAll = document.getElementById("toggle-column-filter");
	//checkboxElements = document.getElementsByName("duggaEntryname");

	// Whenever user presses key in searchbar filter is applied automatically
	// Timeout used so search is only applied if they user hasnt pressed a key for a while (not make 100 searches if user types a 10 letter keyword/search term)
	searchBarElement.addEventListener("keyup", function(e) {
		clearTimeout(searchDelayTimeout);
		searchDelayTimeout = setTimeout(function() {
			searchByFilter();
		}, 300)
	});
}

function updateCheckbox(elem) {
	// When unchecking any checkbox after select all has been checked, select all should uncheck
	var selectAllElement;
	switch (elem.name) {
		case "duggaEntryname":
			selectAllElement = toggleDuggaCheckAll;
			break;
		case "columnEntryname":
			selectAllElement = toggleColumnCheckAll;
			break;
	}
	if (selectAllElement.checked && !elem.checked) {
		selectAllElement.checked = false;
	}
	updateTable();
}

function selectAll(elem) {
	// Get array of checkbox elements
	var checkboxElements;
	switch (elem.id) {
		case "toggle-dugganame-filter":
			checkboxElements = document.getElementsByName("duggaEntryname");
			break;
		case "toggle-column-filter":
			checkboxElements = document.getElementsByName("columnEntryname");
			break;
	}

	// Check all if checked, uncheck all if unchecked
	var check = elem.checked;
	for (var element of checkboxElements) {
		element.checked = check;
	}

	updateTable();
}

function showAvailableDuggaFilter() {
	//Hides other dropdown
	showColumnFilterElement.classList.add("hidden");

	showDuggaFilterElement.classList.toggle("hidden");
}
function showAvailableColumnFilter() {
	//Hides other dropdown
	showDuggaFilterElement.classList.add("hidden");

	showColumnFilterElement.classList.toggle("hidden");
}

function setup(){
  
    AJAXService("GET", { cid: querystring['courseid'], vers: querystring['coursevers'] }, "RESULT");
}


function updateTable() {
	updateColumnOrder();
	updateDuggaFilter();
	myTable.renderTable();
}

function returnedResults(data) {
	var assignmentList;
	var duggaEntrynameCheckbox = "";
	var duggaFilterOptions = data['duggaFilterOptions'];
	assignmentList += "<option value='All' selected>All</option>";
	var lasti;
	for(var i = 0; i < duggaFilterOptions.length; i++) {
		assignmentList += "<option value='"+ duggaFilterOptions[i].entryname +"'>"+ duggaFilterOptions[i].entryname + "</option>";
		duggaEntrynameCheckbox += `
		<div class="dugga-entry-box toggle-${i%2}">
			<input type="checkbox" checked name="duggaEntryname" value="${duggaFilterOptions[i].entryname}" onclick="updateCheckbox(this)">
			<label>${duggaFilterOptions[i].entryname}</label>
		</div>
		`;

		lasti = i;
	}
	duggaEntrynameCheckbox += `
	<div class="toggle-dugganame-filter-box toggle-${(lasti + 1)%2}">
		<input type="checkbox" checked id="toggle-dugganame-filter" onclick="selectAll(this)">
		<label>Select all</label>
	</div>`

	document.querySelector(".show-dugga-filter-popup").innerHTML = duggaEntrynameCheckbox;



    createSortableTable(data['tableInfo']); 	
	if (typeof myTable != "undefined") {
		createColumnFilter();
	} else {
		console.log("Table is undefined");
	}
	setDateIntervals(data)
	loadHTMLelements();
	updateTable();
}

// Creates the column filter checkboxes according to the table head
function createColumnFilter() {
	var nameList = myTable.getColumnNames();
	var columnEntrynameCheckbox = "";
	var n = 0;
	for (const index in nameList) {
		columnEntrynameCheckbox += `
		<div class="column-entry-box toggle-${n%2}">
			<input type="checkbox" checked name="columnEntryname" value="${nameList[index]}" onclick="updateCheckbox(this)">
			<label>${nameList[index]}</label>
		</div>
		`;
		n++;
	}
	columnEntrynameCheckbox += `
	<div class="toggle-column-filter-box toggle-${(n + 1)%2}">
		<input type="checkbox" checked id="toggle-column-filter" onclick="selectAll(this)">
		<label>Select all</label>
	</div>`;

	document.querySelector(".show-column-filter-popup").innerHTML = columnEntrynameCheckbox;
}


function createSortableTable(data){
    var tabledata = {
		tblhead:{
			duggaName: "Dugga",
			hash:"Hash",
			password:"Password",
			teacher_visited: "Teacher visited",
			submitted:"Submission Date",
			timesSubmitted: "Times submitted",
			timesAccessed: "Times accessed",
		},
		tblbody: data,
		tblfoot:{}
	};

	myTable = new SortableTable({
		data: tabledata,
		tableElementId: tableName,
		filterElementId: "columnfilter",
		renderCellCallback: renderCell,
        renderSortOptionsCallback: renderSortOptions,
        rowFilterCallback: rowFilter,
		columnOrder: colOrder.slice(), // Copy array to keep original for future reference
		hasRowHighlight: true,
		hasCounterColumn: true,
	});

	var sortCol = localStorage.getItem("resultTable___sortcol");
	var sortDir = parseInt(localStorage.getItem("resultTable___sortkind"));
	if(sortCol != null && sortDir != null){
		myTable.toggleSortStatus(sortCol, sortDir); // Set sort from localstorage
	}else{
		myTable.toggleSortStatus("duggaName", 1); // Default ascending sort of dugga column
	}

	updateTable();
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
	else if (col == "teacher_visited") {
		str += "<div class='resultTableText'>";
		str += "<div>" + (celldata==null?"NOT VISITED YET":celldata); +"</div>";
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
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "(ASC)" +"<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";

        }else if (sortKind == 0){
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "(DES)" + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
			
        }else{
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "(ASC)" + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
        }
    }else{
		str += colname;
	}
    
    return str;
}

// Update column visibility
function updateColumnOrder() {
	var newOrder = [];
	var nameList = myTable.getColumnNames();
	var checkboxElements = document.getElementsByName("columnEntryname");

	// Get column IDs of checked columns
	for (const index in nameList) {
		var name = nameList[index];
		for(var element of checkboxElements) {
			if(element.value == name && element.checked) {
				newOrder.push(index);
				break;
			}
		}
	}

	// Update table
	myTable.reorderColumns(newOrder);
}

// Update row filter
function updateDuggaFilter() {
	// Reset array
	duggasArr.length = 0;

	// Add duggas that are checked in the dugga filter
	var checkboxElements = document.getElementsByName("duggaEntryname");
	for(var element of checkboxElements) {
		if(element.checked){
			duggasArr.push(element.value);
		}
	}
}

// How rows are filtered, for multiple filters add more if statements
// Add new variable to each type filter
function rowFilter(row) {
	var isFilterDateMatch = true;
	var isSearchMatch = true;

	// Check if dugga is in approved list
	var duggaName = row["duggaName"];
	if(duggasArr.indexOf(duggaName) == -1)
	{
		return false;
	}

	if (filerByDate.date1 != null && filerByDate.date2 != null)	{
		// Datepicker does not contain hours, minutes and seconds. Submitted date is adjusted to match datepicker format
		var date = new Date(row["submitted"])
		var newdate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0); 
		isFilterDateMatch = (newdate >= filerByDate.date1 && newdate <= filerByDate.date2);
	}

	for(var term of searchTerms){
		if(term != ""){
			for(var column in row){
			
				if(row[column] == null){
					isSearchMatch = false;
				} 
				else if(row[column].toString().toLowerCase().includes(term.toLowerCase())){
					isSearchMatch = true;
					break;
				}else{
					isSearchMatch = false;
				}
			}

		}
	}

	return (isFilterDateMatch && isSearchMatch);
}

// Basic ascending/descending order
 function compare(a, b) { 
	var status = sortableTable.currentTable.getSortkind();
	if(status==1){
		var tempA = a;
		var tempB = b;
	}else{
		var tempA = b;
		var tempB = a;
	}

	if(isNaN(tempA) && isNaN(tempB)){
		if (tempA.toLowerCase() < tempB.toLowerCase()){
			return 1;
		}else if (tempA.toLowerCase() > tempB.toLowerCase()){
			return -1;
		}
	}else if (tempA == null || tempB == null){
		if (tempA == null){
			return 1;
		}else if (tempB == null){
			return -1;
		}
	} else {
		var numA = parseInt(tempA);
		var numB = parseInt(tempB);
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

/**
 * @description Sets the earliest and latest dates for the collected 
 * submissions in the filter date inputs.
 * */
function setDateIntervals(data){
	// iterate tableinfo and get the highest and lowest date
	var temp, lowest, highest;
	// fill comparison vars with the values of the first submission
	lowest = data.tableInfo[0].submitted;
	highest = data.tableInfo[0].submitted;
	for (var objects of data.tableInfo){
		temp = objects.submitted;
		
		if(temp <= lowest){
			lowest = temp;
		}
		
		if(temp >= highest){
			highest = temp;
		}
	}
	// Remove the timestamp that makes the string incompatible with date value
	lowest = lowest.substr(0,10);
	highest = highest.substr(0,10);
	// Sets the default value of the datepickers
	document.querySelector("#datepicker-interval-1").value = lowest;
	document.querySelector("#datepicker-interval-2").value = highest;

}

