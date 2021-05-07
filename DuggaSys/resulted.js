/********************************************************************************
 Globals
 *********************************************************************************/
 var tableName = "resultTable";
var filterList;
var buttonFlag = true;
var duggaFilter;

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

function updateTable(){
	
	filterList["duggaFilter"] = document.getElementById("assignmentDropdown").value;
	localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList));	
	myTable.renderTable();
}

function returnedResults(data){
    console.log(data);
    process();

	var assignmentList;
	var duggaFilterOptions = data['duggaFilterOptions'];
	assignmentList += "<option value='none'>none</option>";
	for(var i = 0; i < duggaFilterOptions.length; i++){
		assignmentList += "<option value='"+ duggaFilterOptions[i].entryname +"' selected>"+ duggaFilterOptions[i].entryname + "</option>";
	}
	document.getElementById("assignmentDropdown").innerHTML = assignmentList; 
		
    createSortableTable(data['tableInfo']);
}

function createSortableTable(data){

    var tabledata = {
		tblhead:{
			duggaName: "Dugga",
			hash:"Hash",
			password:"Password",
			submitted:"Submission Date",
            grade: "Grade"
		},
		tblbody: data,
		tblfoot:{}
	};

	var colOrder = ["duggaName","hash", "password", "submitted", "grade"];
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
		myTable.toggleSortStatus(sortCol, sortDir); //Set sort from localstorage
	}else{
		myTable.toggleSortStatus("duggaName", 1); //Default ascending sort of dugga column
	}

	myTable.renderTable();
}

function renderCell(col, celldata, cellid) {
	
	str = "<div class='resultTableCell'>";
	if (col == "hash"){
		str += "<div class='resultTableText'>";
		str += "<a href='" + getLinkFromHash(celldata) + "'>" + celldata + "</a>";
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

function renderSortOptions(col, status, colname) {
    str = "";

	if(col == "duggaName" || col == "submitted"){
		str += "<div style='white-space:nowrap;cursor:pointer'>"
        if(status == 1){		
            str += "<span onclick='myTable.setNameColumn(\"" + colname + "\"); myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "(ASC)" +"</span>";

        }else if (status == 0){
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
		filterList[filtername] = "none";
	}
	localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList)); //Saves the filter in local storage when opening resulted.php.	
}

//for multiple filters, add more if statements
function rowFilter(row) {
	var returnVariable = true;
	if(filterList["duggaFilter"] != "none"){
    	if(row["duggaName"] == filterList["duggaFilter"] || row["subCourse"] == filterList["duggaFilter"]){
        	returnVariable = true;            
   		}else{
			returnVariable = false;
		}
	}
		
	return returnVariable;
}

 function compare(a, b) {
    if (a.toLowerCase() < b.toLowerCase()){
    	return 1;
    }else if (a.toLowerCase() > b.toLowerCase()){
		return -1;
	}

	return 0;	
}

function clickedInternal(event, clickdobj){

	if (clickdobj.classList.contains("resultTable-password")){
		var textElement = clickdobj.childNodes[0].childNodes[0];
		textElement.classList.toggle("passwordBlock");
	}
}
