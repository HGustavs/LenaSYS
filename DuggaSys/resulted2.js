var tableName = "resultTable";

function setup(){
    /*window.onscroll = function () {

	};*/
    AJAXService("GET", { cid: querystring['courseid'], vers: querystring['coursevers'] }, "RESULT");
}


function returnedResults(data){
    console.log(data);
    createSortableTable(data);
}

function createSortableTable(data){

    var tabledata = {
		tblhead:{
			duggaName: "Dugga",
			hash:"Hash",
			password:"Password",
			submitted:"Submission Date",
            grade: "Grade",

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
        //renderSortOptionsCallback: renderSortOptions,
		columnOrder: colOrder,
		hasRowHighlight: true,
		hasMagicHeadings: true,
		hasCounterColumn: true
	});

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

function renderSortOptions(col, status, colname) {

    if (col == "duggaName"){
        //document.getElementById("sortcol0_0").checked = true;
        //document.getElementById("sortdirAsc").checked = true;
    }



}
