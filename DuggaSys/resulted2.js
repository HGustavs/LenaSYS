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
        //console.log(row);
        if(row["duggaName"] == duggaFilter || row["subCourse"] == duggaFilter || duggaFilter == "none"){
            return true;            
        }else{
			return false;
		}
    }
	return true;
	if(!filterList["showStudents"] && row["FnameLname"]["access"].toUpperCase().indexOf("W") != 0)
		return false;
	// Filters to display only rows where Duggas that have been submitted after deadline and/or duggas that are pending and needs to be graded
	if (filterList["passedDeadline"] || filterList["onlyPending"] ){
	// Filters to display only rows where Duggas that have been submitted after deadline AND duggas that are pending and needs to be graded
		if (filterList["passedDeadline"] && filterList["onlyPending"] ) {
			var rowPending = false;
			for (var colname in row) {
				if (colname != "FnameLname" && row[colname]["needMarking"] == true && row[colname]["submitted"] > row[colname]["deadline"] ) {
					rowPending = true;
					break;
				} else if (colname != "FnameLname" && row[colname]["needMarking"] == true && row[colname]["submitted"] < row[colname]["deadline"] ) {
					rowPending = true;
					break;
				}
			}
			if (!rowPending) {
				return false;
			}
		}
		// Filters to display only rows where duggas are pending and needs to be graded
		else if (filterList["onlyPending"]) {
			var rowPending = false;
			for (var colname in row) {
				if (colname != "FnameLname" && row[colname]["needMarking"] == true && row[colname]["submitted"] < row[colname]["deadline"]) {
					rowPending = true;
					break;
				}
			}
			if (!rowPending) {
				return false;
			}
		}
		// Filters to display only rows where Duggas that have been submitted after deadline
		else if (filterList["passedDeadline"]) {
			var rowPending = false;
			for (var colname in row) {
				if (colname != "FnameLname" && row[colname]["needMarking"] == true && row[colname]["submitted"] > row[colname]["deadline"] ) {
					rowPending = true;
					break;
				}
			}
			if (!rowPending) {
				return false;
			}
		}
	}
	var teacherDropdown = document.getElementById("teacherDropdown").value;
	if(teacherDropdown !== "none" && row.FnameLname.examiner != teacherDropdown){
		return false;
	}
  	// divides the search on white space
	var tempSplitSearch = searchterm.split(" ");
	var splitSearch = [];

	tempSplitSearch.forEach(function (s) {
		if (s.length > 0)
			splitSearch.push(s.trim().split(":"));
	})

  	// The else makes sure that you can search on names without a search-category.
	if (searchterm != "" && splitSearch != searchterm) {
		return smartSearch(splitSearch, row);
	} else {
		for (colname in row) {
			if (colname == "FnameLname") {
				var name = "";
				if(searchterm.length == 1){ //if only 1 character has been entered in the search field
				if (row[colname]["firstname"] != null) {
					name += row[colname]["firstname"] + " ";
				}
				if (row[colname]["lastname"] != null) {
					name += row[colname]["lastname"];
				}
        		var nameArray = name.split(" "); //Array with [firstname, lastname]
				//Checks for the first character in firstname and/or lastname
				if (nameArray[0].toUpperCase().startsWith(searchterm.toUpperCase()) || nameArray[1].toUpperCase().startsWith(searchterm.toUpperCase())) {
					return true;
				}
				//when more characters than 1 has been entered
			} else {
				if (row[colname]["firstname"] != null) {
					name += row[colname]["firstname"] + " ";
				}
				if (row[colname]["lastname"] != null) {
					name += row[colname]["lastname"];
				}
				name = name.replace(" ", "");
				if(name.toUpperCase().indexOf(searchterm.toUpperCase()) != -1){
					return true;
				}
				 if (row[colname]["ssn"] != null) {
				 	if (row[colname]["ssn"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
				 		return true;
					}
				if (row[colname]["username"] != null) {
					if (row[colname]["username"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
						return true;
				}
				if (row[colname]["class"] != null) {
					if (row[colname]["class"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
						return true;
				}
				if (row[colname]["setTeacher"] != null) {
					if (row[colname]["setTeacher"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1)
						return true;
				} 
			}
			}
		}
		return false;
	}
}
