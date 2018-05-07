// Keep track of Currently active Table and all sortable tables
var sortableTable = {
    currentTable:null,
    sortableTables:[],
    edit_rowno:-1,
    edit_columnno:-1,
    edit_columnname:null,
    edit_tableid:null,
}

function searchKeyUp(e) {
	// look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13) {
        document.getElementById('searchbutton').click();
        return false;
    }
    return true;
}

function keypressHandler(event) {    
    if (event.keyCode == 13) {
        updateCellInternal();
    } else if(event.keyCode == 27) {
        clearUpdateCellInternal();
    }
}

function defaultRowFilter() {
	return true;
}

// Global sorting function global
function sortableInternalSort(a,b) {
	let ret = 0;
    //let colname = currentTable.tbl.tblhead.indexOf(currentTable.sortcolumn);
    let colname = sortableTable.currentTable.getKeyByValue();
    console.log(colname);

	if (sortableTable.currentTable.ascending) {
		//alert("Compare: "+a+" "+b);
		ret = compare(a[colname],b[colname]);
	} else {
		//alert("Compare: "+b+" "+a);
		ret = compare(b[colname],a[colname]);
	}
	return ret;
}

function clearUpdateCellInternal() {
    sortableTable.edit_rowno =- 1;
    sortableTable.edit_columnno =- 1;
    sortableTable.edit_columnname = null;
    sortableTable.edit_tableid = null;
    document.getElementById('editpopover').style.display = "none";
}

function updateCellInternal() {
    for (let i = 0; i < sortableTable.sortableTables.length; i++) {
        if (sortableTable.sortableTables[i].tableid == sortableTable.edit_tableid) {
            sortableTable.sortableTables[i].updateCell();
        }
    }
    clearUpdateCellInternal();
}

// clickedInternal
function clickedInternal(event,clickdobj) {
	if (sortableTable.currentTable.showEditCell != null) {
		let cellelement = event.target.closest("td");
		let arr = cellelement.className.split("-");
		let rowelement = event.target.closest("tr");
		let barr = rowelement.id.split("_");

		var columnname = arr[1];
		var columnno = arr[2];
		var rowno = parseInt(barr[1]);
		var tableid = barr[0];
		var str = "";
		sortableTable.edit_rowno = rowno;
		sortableTable.edit_columnno = columnno;
		sortableTable.edit_columnname = columnname;
		sortableTable.edit_tableid = tableid;

		var rowdata = sortableTable.currentTable.getRow(rowno);
		var coldata = rowdata[columnno];

		str += "<div id='input-container' style='flex-grow:1'>";
		str += sortableTable.currentTable.showEditCell(coldata,rowno,rowelement,cellelement,columnname,columnno,rowdata,coldata,tableid);
		str += "</div>";
		str += "<img id='popovertick' class='icon' src='Icon_Tick.svg' onclick='updateCellInternal();'>";
		str += "<img id='popovercross' class='icon' src='Icon_Cross.svg' onclick='clearUpdateCellInternal();'>";
		var lmnt = cellelement.getBoundingClientRect();
		console.log(lmnt.top, lmnt.right, lmnt.bottom, lmnt.left, lmnt.height, lmnt.width);
		var popoverelement = document.getElementById("editpopover");

		popoverelement.innerHTML = str;
		var popoveredit = document.getElementById("popoveredit");
		var xscroll = window.pageXOffset;
		var yscroll = window.pageYOffset;

		popoverelement.style.left = Math.round(lmnt.left+xscroll)+"px";
		popoverelement.style.top = Math.round(lmnt.top+yscroll)+"px";
		popoverelement.style.minHeight = (Math.round(lmnt.height)-5)+"px";
		popoverelement.style.maxWidth = (Math.round(lmnt.width)+0)+"px";
		popoverelement.style.display = "flex";
	}
}

// We call all highlights in order to allow hover of non-active tables
function rowHighlightInternal(event,row) {
    let arr = row.id.split("_");
    let rowno = parseInt(arr[1]);
	let centerel = event.target.closest("td");
	for (let i = 0; i < sortableTable.sortableTables.length; i++) {
		if (sortableTable.sortableTables[i].highlightRow != null) {
			sortableTable.sortableTables[i].highlightRow(row.id,rowno,centerel.className,centerel);
		}
    }
}

// We call all deHighlights in order to allow hover of non-active tables
function rowDeHighlightInternal(event,row) {
	let arr = row.id.split("_");
	let rowno = parseInt(arr[1]);
	let centerel = event.target.closest("td");
	for (let i = 0; i < sortableTable.sortableTables.length; i++) {
		if (sortableTable.sortableTables[i].deHighlightRow != null) {
			sortableTable.sortableTables[i].deHighlightRow(row.id,rowno,centerel.className,centerel);
		}
    }
}

function SortableTable(tbl,tableid,filterid,caption,renderCell,renderSortOptions,renderColumnFilter,rowFilter,colsumList,rowsumList,rowsumHeading,sumFunc,freezePane,highlightRow,deHighlightRow,showEditCell,updateCell,hasmagic) {
	// Private members
	var result = 0;
	var columnfilter = null;
	var sortcolumn = "UNK";
	var sortkind = -1;
	var tbl = tbl;
	var filterid = filterid;
	var caption = caption;
	var renderCell = renderCell;
	var renderSortOptions = renderSortOptions;
	var renderColumnFilter = renderColumnFilter;

	// Keeps track of the last picked sorting order
	var tableSort;
	var colSort;
	var reverseSort;

	if (rowFilter == null) {
		var rowFilter = defaultRowFilter;
	} else {
		var rowFilter = rowFilter;
	}

	var colsumList = colsumList;
	var rowsumList = rowsumList;
	var rowsumHeading = rowsumHeading;
	var sumFunc = sumFunc;
	var freezePane = freezePane;
	var freezePaneArr = [];

	// Public Callback Declarations
	this.highlightRow = highlightRow;
	this.deHighlightRow = deHighlightRow;
	this.showEditCell = showEditCell;
	this.updateCell = updateCell;
	this.ascending = false;
	this.tableid = tableid;
  	this.hasMagicHeadings = hasmagic;

	// Local variable that contains html code for main table and local variable that contains magic headings table
	var str = "";
	var mhstr = "";
	var mhvstr = "";
	var mhfstr = "";

    tbl.cleanHead = [];

    for (let i = 0; i < tbl.tblhead.length; i++){
        tbl.cleanHead.push(tbl.tblhead[i].toLowerCase().replace(/[^a-zA-Z0-9]+/g, ""));
    }

    sortableTable.sortableTables.push(this);

	this.renderTable = function() {
		this.reRender();
	}

	this.getRow = function(rowno) {
		return tbl.tblbody[rowno];
	}

	this.reRender = function() {
		// Local variable that contains html code for main table and local variable that contains magic headings table
		str = "<table style='border-collapse: collapse;' id='"+tableid+"_tbl' class='list list--nomargin'>";
		mhstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;top:0px;left:0px;z-index:2000;margin-top:50px;border-bottom:none;' class='list' id='"+tableid+"_tbl_mh'>";
		mhvstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;z-index:1000;' id='"+tableid+"_tbl_mhv'>";
		mhfstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;top:0px;z-index:3000;' id='"+tableid+"_tbl_mhf'>";
    
		// Assign currently active table
		sortableTable.currentTable = this;

		// Private array that contains names of filtered columns
		columnfilter = JSON.parse(localStorage.getItem(tableid+"_filtercolnames"));
		//columnfilter = tbl.tblhead;

		// Local variable that contains summing array
		var sumContent = [];

		let isFirstVisit = false;
		if (columnfilter == null) {
			isFirstVisit = true;
			columnfilter = {};
		}

		var filterstr = "";
		for (var colname in tbl.tblhead) {
				var col = tbl.tblhead[colname];
				if (isFirstVisit) {
					//columnfilter.push(col);
					columnfilter[colname] = tbl.tblhead[colname];
				}
				if (renderColumnFilter != null) {
					filterstr += renderColumnFilter(colname,col,columnfilter[colname] != null);
				}
		}

		if (renderColumnFilter != null) {
			document.getElementById(filterid).innerHTML = filterstr;
		}

		str += "<caption>"+caption+"</caption>";

		// Make headings Clean Contains headings using only A-Z a-z 0-9 ... move to function removes lines of code and removes redundant code/data!?
	    str += "<thead id='"+tableid+"_tblhead'><tr>";
	    mhstr += "<thead id='"+tableid+"_tblhead_mh'><tr>";
	    mhvstr += "<thead id='"+tableid+"_tblhead_mhv'><tr>";
	    mhfstr += "<thead id='"+tableid+"_tblhead_mhf'><tr>";

		//var freezePaneIndex = tbl.tblhead.indexOf(freezePane);
		for(var colname in tbl.tblhead) {
			var col = tbl.tblhead[colname];

			if (columnfilter[colname] != null) {
				if (renderSortOptions != null) {
					// if (colname <= freezePaneIndex) {
					// 	if (col == sortcolumn){
					// 		mhfstr += "<th id='"+colname+"_"+tableid+"_tbl_mhf' class='"+tableid+"'>"+renderSortOptions(col,sortkind)+"</th>";
					// 		mhvstr += "<th id='"+colname+"_"+tableid+"_tbl_mhv' class='"+tableid+"'>"+renderSortOptions(col,sortkind)+"</th>";
					// 	} else {
					// 		mhfstr += "<th id='"+colname+"_"+tableid+"_tbl_mhf' class='"+tableid+"'>"+renderSortOptions(col,-1)+"</th>";
					// 		mhvstr += "<th id='"+colname+"_"+tableid+"_tbl_mhv' class='"+tableid+"'>"+renderSortOptions(col,-1)+"</th>";
					// 	}
					// }
					if (col == sortcolumn) {
						str += "<th id='"+colname+"_"+tableid+"_tbl' class='"+tableid+"'>"+renderSortOptions(col,sortkind)+"</th>";
						mhstr += "<th id='"+colname+"_"+tableid+"_tbl_mh' class='"+tableid+"'>"+renderSortOptions(col,sortkind)+"</th>";
					} else {
						str += "<th id='"+colname+"_"+tableid+"_tbl' class='"+tableid+"'>"+renderSortOptions(col,-1)+"</th>";
						mhstr += "<th id='"+colname+"_"+tableid+"_tbl_mh' class='"+tableid+"'>"+renderSortOptions(col,-1)+"</th>";
					}
				} else {
					// if (colname <= freezePaneIndex) {
					// 	if (col == sortcolumn){
					// 		mhfstr += "<th id='"+cleancol+"_"+tableid+"_tbl_mhf' class='"+tableid+"'>"+col+"</th>";
					// 		mhvstr += "<th id='"+cleancol+"_"+tableid+"_tbl_mhv' class='"+tableid+"'>"+col+"</th>";
					// 	} else {
					// 		mhfstr += "<th id='"+cleancol+"_"+tableid+"_tbl_mhf' class='"+tableid+"'>"+col+"</th>";
					// 		mhvstr += "<th id='"+cleancol+"_"+tableid+"_tbl_mhv' class='"+tableid+"'>"+col+"</th>";
					// 	}
					// }
					if (colname != "move") {
						str += "<th id='"+colname+"_"+tableid+"_tbl' class='"+tableid+"'>"+col+"</th>";
						mhstr += "<th id='"+colname+"_"+tableid+"_tbl_mh' class='"+tableid+"'>"+col+"</th>";
					}
				}
			}
		}

		if (rowsumList.length > 0) {
			if (rowsumHeading == sortcolumn) {
				str += "<th id='"+rowsumHeading+"_"+tableid+"_tbl' class='"+tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,sortkind)+"</th>";
				mhstr += "<th id='"+rowsumHeading+"_"+tableid+"_tbl_mh' class='"+tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,sortkind)+"</th>";
			} else {
				str += "<th id='"+rowsumHeading+"_"+tableid+"_tbl' class='"+tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,-1)+"</th>";
				mhstr += "<th id='"+rowsumHeading+"_"+tableid+"_tbl_mh' class='"+tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,-1)+"</th>";
			}
		}

		str += "</tr></thead>";
		mhstr += "</tr></thead></table>";
		mhfstr += "</tr></thead></table>";

		// Render table body
		str += "<tbody id='"+tableid+"_body'>";
		mhvstr += "<tbody id='"+tableid+"_mhvbody'>";
		
		for (var i = 0; i < tbl.tblbody.length-1; i++) {
			var row = tbl.tblbody[i];
			
			if (rowFilter(row)) {
				// Keep row sum total here
				var rowsum = 0;

				str += "<tr id='"+tableid+"_"+i+"' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";
				mhvstr += "<tr id='"+tableid+"_"+i+"_mvh' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";

				result++;

				for (let colnamez in row) {

					//Counter for freeze here							
					// If we show this column...
					if (columnfilter[colnamez] != null) {
						// This condition is true if column is in summing list and in that case perform the sum like a BOSS
						if (colsumList.indexOf(colnamez) >- 1) {
							if (typeof(sumContent[colnamez]) == "undefined") sumContent[colnamez] = 0;
							sumContent[colnamez] += sumFunc(colnamez,col);
						}

						if (rowsumList.indexOf(colnamez) >- 1) {
							rowsum += sumFunc(colnamez,col);
						}

						let cellid = "r"+i+"_"+tableid+"_"+colnamez;
						str += "<td id='"+cellid+"' onclick='clickedInternal(event,this);' class='"+tableid+"-"+colnamez+"'>"+renderCell(colnamez,tbl.tblbody[i][colnamez],cellid)+"</td>";

						// if (colnamez <= freezePaneIndex) {
						// 	mhvstr+="<td id='"+cellid+"' >"+renderCell(col,colnamez,cellid)+"</td>";
						// }
					}
				}

				if (rowsumList.length > 0) {
					str += "<td>"+rowsum+"</td>";
				}

				str += "</tr>";
				mhvstr += "</tr>";
			}
		}

		str += "</tbody>";
		mhvstr += "</tbody>";

		if(tbl.tblfoot.length > 0) {
			str += "<tfoot style='border-top:2px solid #000'>";
			str += "<tr style='font-style:italic;'>";

			for (var colnamez in tbl.tblfoot) {
				// If we show this column...
				if (columnfilter.indexOf(colnamez) >- 1) {
					if (colsumList.indexOf(colnamez) >- 1) {
						// If writing sum - just write it
						str += "<td>"+sumContent[colnamez]+"</td>";
					} else {
						if (tbl.tblfoot[col] != "UNK") {
							str += "<td>"+colnamez+"</td>";
						} else {
							str += "<td>&nbsp;</td>";
						}
					}
				}
			}

			str+= "</tr></tfoot>";
		}

		str += "</table>";
		mhvstr+= "</table>";

		this.magicHeader();
	}

	this.toggleColumn = function(colname,col) {
		// Assign currently active table
		sortableTable.currentTable = this;

		if (columnfilter[colname] == null) {
			columnfilter[colname] = tbl.tblhead[colname];
		} else {
			columnfilter[colname] = null;
		}

		localStorage.setItem(tableid+"_filtercolnames", JSON.stringify(columnfilter));

		this.reRender();
	}

	this.toggleSortStatus = function(col,kind) {
		// Assign currently active table
		sortableTable.currentTable = this;

		sortcolumn = col;
		sortkind = kind;

		this.ascending = !this.ascending;

		// Sort the body of the table again
		tbl.tblbody.sort(sortableInternalSort);

		this.reRender();
	}

	this.getKeyByValue = function() {
	  	return Object.keys(tbl.tblhead).find(key => tbl.tblhead[key] === sortcolumn);
	}

    this.getSortcolumn = function() {
        return sortcolumn;
    }

    this.getSortcolumnNum = function() {
        //return tbl.tblhead[sortcolumn];
    }

    this.getSortkind = function() {
        return sortkind;
    } 

	this.magicHeader = function() {
		// Assign table and magic headings table(s)
		if (this.hasMagicHeadings) {					 
			document.getElementById(tableid).innerHTML = str+mhstr+mhvstr+mhfstr;
			document.getElementById(tableid+"_tbl_mh").style.width=document.getElementById(tableid+"_tbl").getBoundingClientRect().width+"px";
			document.getElementById(tableid+"_tbl_mh").style.boxSizing = "border-box";          
			children=document.getElementById(tableid+"_tbl").getElementsByTagName('TH');
			
			for (i = 0; i < children.length; i++) {
				document.getElementById(children[i].id+"_mh").style.width = children[i].getBoundingClientRect().width+"px";
				document.getElementById(children[i].id+"_mh").style.boxSizing = "border-box";          
			}

			document.getElementById(tableid+"_tbl_mhf").style.width = Math.round(document.getElementById(tableid+"_tbl_mhv").getBoundingClientRect().width)+"px";
			document.getElementById(tableid+"_tbl_mhf").style.boxSizing = "border-box";
			children=document.getElementById(tableid+"_tbl_mhv").getElementsByTagName('TH');
			
			for (i = 0; i < children.length; i++) {
				document.getElementById(children[i].id.slice(0, -1)+"f").style.width = children[i].getBoundingClientRect().width+"px";
				document.getElementById(children[i].id.slice(0, -1)+"f").style.boxSizing = "border-box";
			}
		} else {
			document.getElementById(tableid).innerHTML = str;
		}

		if (tableSort != null) {
			sortTable(tableSort, colSort, reverseSort);
		}
	} 
    
	// Simpler magic heading v. III
	setInterval(freezePaneHandler,30);

	function freezePaneHandler() {
		// Hide magic headings and find minimum overdraft
		for (var i = 0; i < sortableTable.sortableTables.length; i++) {
			let table = sortableTable.sortableTables[i];
			if (table.hasMagicHeadings) {
				if (document.getElementById(table.tableid+"_tbl") != null) {
					var thetab = document.getElementById(table.tableid+"_tbl").getBoundingClientRect();
					var thetabhead = document.getElementById(table.tableid+"_tblhead").getBoundingClientRect();
					// If top is negative and top+height is positive draw mh otherwise hide
					// Vertical
					if (thetabhead.top < 50 && thetab.bottom > 0) {
						document.getElementById(table.tableid+"_tbl_mh").style.left = thetab.left+"px";
						document.getElementById(table.tableid+"_tbl_mh").style.display = "table";
					}
					 else {
						document.getElementById(table.tableid+"_tbl_mh").style.display = "none";
					}
					// Horizontal
					if (thetab.left < 0 && thetab.right > 0) {
						document.getElementById(table.tableid+"_tbl_mhv").style.top = thetabhead.top+"px";
						document.getElementById(table.tableid+"_tbl_mhv").style.display = "table";
					}
					else {
						document.getElementById(table.tableid+"_tbl_mhv").style.display = "none";
					}

					// Fixed
					if (thetab.left < 0 && thetab.right > 0 && thetabhead.top < 0 && thetab.bottom > 0) {
						document.getElementById(table.tableid+"_tbl_mhf").style.display = "table";
					}
					else {
						document.getElementById(table.tableid+"_tbl_mhf").style.display = "none";
					}
				}
			}
		}
	}

    this.updateCell = function() {
    	alert("hej");
        console.log(sortableTable.edit_rowno,sortableTable.edit_columnno,sortableTable.edit_columnname,sortableTable.edit_tableid);
        tbl.tblbody[sortableTable.edit_rowno][sortableTable.edit_columnno] = updateCellCallback(sortableTable.edit_rowno,sortableTable.edit_columnno,sortableTable.edit_columnname,sortableTable.edit_tableid);
        this.renderTable();
    }
}

function showVariant(param){
    var variantId="#variantInfo" + param;
    var duggaId="#dugga" + param;
    var arrowId="#arrow" + param;
    var index = variant.indexOf(param);


    if (document.getElementById("variantInfo"+param) && document.getElementById("dugga"+param)) { // Check if dugga row and corresponding variant
        if(!isInArray(variant, param)){
             variant.push(param);
        }

        if($(duggaId).hasClass("selectedtr")){ // Add a class to dugga if it is not already set and hide/show variant based on class.
            $(variantId).hide();
            $(duggaId).removeClass("selectedtr");
            $(arrowId).html("&#9658;");
            if (index > -1) {
               variant.splice(index, 1);
            }

        } else {
            $(duggaId).addClass("selectedtr");
            $(variantId).slideDown();
            $(arrowId).html("&#x25BC;");
        }

        $(variantId).css("border-bottom", "1px solid gray");
    }
}
