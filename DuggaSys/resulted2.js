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
            grade: "Grade",
			link: "Link"

		},
		tblbody: data,
		tblfoot:{}
	};

	var colOrder = ["duggaName","hash", "password", "submitted", "grade", "link"];
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

	if (data['debug'] != "NONE!")
		alert(data['debug']);
}

function renderCell(col, celldata, cellid) {
	
	if(col == "grade"){

		str = "<div class='resultTableCell'>";
		str += "<div class='gradeContainer resultTableText'>";
		str += "<img id='korf' class='fist' src='../Shared/icons/FistV.png' onclick='clickResult("+celldata+")'/>";
		str += "</div>";
		str += "</div>";
	}else{
		str = "<div class='resultTableCell'>";
		str += "<div class='resultTableText'>";
		str += "<div>" + celldata +"</div>";
		str += "</div>";
		str += "</div>";
	}
	return str;
}

function renderSortOptions(col, status, colname){
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

function makeCustomFilter(filtername) {
	
	if (filterList[filtername] == null) {
		filterList[filtername] = "none";
	}
	if (filtername == "duggaFilter") { //Saves the filter in local storage when opening resulted.php.
		localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList));
	}
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