var tableName = "resultTable";
var filterList;
var buttonFlag = true;
var duggaFilter;

function setup(){
    /*window.onscroll = function () {
	
	};*/
	
    AJAXService("GET", { cid: querystring['courseid'], vers: querystring['coursevers'] }, "RESULT");
}

function process(){

    filterList = JSON.parse(localStorage.getItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers']));
    if (filterList == null) {
		filterList = {};
	}

    var dstr = "";
	dstr += makeCustomFilter("duggaFilter", "Show Dugga");
    document.getElementById("customfilter").innerHTML = dstr;
   
}

function updateTable(){
	
	filterList["duggaFilter"] = true;
	duggaFilter = document.getElementById("assignmentDropdown").value;
	console.log(duggaFilter);
	myTable.renderTable();
}

function returnedResults(data){
    console.log(data);
    //data.sort(compare);
    process();
	//filterButton(data['duggaFilterOptions']);
	if(buttonFlag){
		var assignmentList;
		var duggaFilterOptions = data['duggaFilterOptions'];
		assignmentList += "<option value='none'>none</option>";
		for(var i = 0; i < duggaFilterOptions.length; i++){
			assignmentList += "<option value='"+ duggaFilterOptions[i].entryname +"' selected>"+ duggaFilterOptions[i].entryname + "</option>";
		}
		document.getElementById("assignmentDropdown").innerHTML = assignmentList;
		buttonFlag = false;
	}
    createSortableTable(data['tableInfo']);
}

function filterButton(duggaFilterOptions){
	var assignmentList;
	assignmentList += "<option value='none'>none</option>";
	for(var i = 0; i < duggaFilterOptions.length; i++){
		assignmentList += "<option value='"+ duggaFilterOptions[i].entryname +"' selected>"+ duggaFilterOptions[i].entryname + "</option>";
	}
	document.getElementById("assignmentDropdown").innerHTML = assignmentList;
	console.log(assignmentList);
	buttonFlag = false;
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
	//Default ascending sort of dugga column
	myTable.toggleSortStatus("duggaName", 1);

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

function makeCustomFilter(filtername, labeltext) {
	str = "<div class='checkbox-dugga checkmoment'>";
	str += "<input type='checkbox' id='" + filtername + "' onclick='toggleFilter(\"" + filtername + "\")'";
    //console.log(filterList[filtername]);
	if (filterList[filtername] == null) {
		filterList[filtername] = false;
	}
	if (filterList[filtername] || filtername == "duggaFilter") { //Enables filter and saves it in local storage when opening resulted.php.
		str += " checked";

		//Enables the showStudents and the showTeachers filters.
		//filterList[filtername] = true;
		//Saves the checkbox values in localstorage.
		localStorage.setItem("resultTable_filter_" + querystring['courseid'] + "-" + querystring['coursevers'], JSON.stringify(filterList));
	}
	str += "><label class='headerlabel' for='" + filtername + "'>" + labeltext + "</label></div>";
	return str;
}

function rowFilter(row) {

	if (filterList["duggaFilter"]){
        if(row["duggaName"] == duggaFilter || row["subCourse"] == duggaFilter || duggaFilter == "none"){
            return true;            
        }else{
			return false;
		}
    }
	return true;
}