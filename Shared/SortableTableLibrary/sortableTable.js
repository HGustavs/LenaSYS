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
    let colname = sortableTable.currentTable.getSortcolumnNum();

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
	var columnfilter = [];
	var sortcolumn = "UNK";
	var sortkind = -1;
	var tbl = tbl;
	var filterid = filterid;
	var caption = caption;
	var renderCell = renderCell;
	var renderSortOptions = renderSortOptions;
	var renderColumnFilter = renderColumnFilter;

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
		// columnfilter = JSON.parse(localStorage.getrow(tableid+"_filtercolnames"));
		columnfilter = tbl.tblhead;

		// Local variable that contains summing array
		var sumContent = [];

		let isFirstVisit = false;
		if (columnfilter == null) {
			isFirstVisit = true;
			columnfilter = [];
		}

		var filterstr = "";
		for (let colname in tbl.tblhead) {
				var col = tbl.tblhead[colname];
				if (isFirstVisit) {
					columnfilter.push(col);
				}
				if (renderColumnFilter != null) {
					filterstr += renderColumnFilter(col,columnfilter.indexOf(col) >- 1);
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
				if (this.renderSortOptions != null) {
					if (colname <= freezePaneIndex) {
						if (col == sortcolumn){
							mhfstr += "<th id='"+colname+"_"+tableid+"_tbl_mhf' class='"+tableid+"'>"+renderSortOptions(col,sortkind)+"</th>";
							mhvstr += "<th id='"+colname+"_"+tableid+"_tbl_mhv' class='"+tableid+"'>"+renderSortOptions(col,sortkind)+"</th>";
						} else {
							mhfstr += "<th id='"+colname+"_"+tableid+"_tbl_mhf' class='"+tableid+"'>"+renderSortOptions(col,-1)+"</th>";
							mhvstr += "<th id='"+colname+"_"+tableid+"_tbl_mhv' class='"+tableid+"'>"+renderSortOptions(col,-1)+"</th>";
						}
					}
					if (col == sortcolumn) {
						str += "<th id='"+colname+"_"+tableid+"_tbl' class='"+tableid+"'>"+renderSortOptions(col,sortkind);

						if (col != "" && col != null) {
							str += " <img id='"+colname+"_"+tableid+"_desc_sortdiricon' style='float:right;margin-top:5px;' class='hideTableArrow' src='../Shared/icons/desc_white.svg'>";
							str += " <img id='"+colname+"_"+tableid+"_asc_sortdiricon' style='float:right;margin-top:5px;'class='hideTableArrow' src='../Shared/icons/asc_white.svg'></th>";
						} else {
							str += "</th>";
						}

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
						str += "<th id='"+colname+"_"+tableid+"_tbl' class='"+tableid+"'>"+col;
						mhstr += "<th id='"+colname+"_"+tableid+"_tbl_mh' class='"+tableid+"'>"+col+"</th>";

						if (col != "" && col != null) {
							str += " <img id='"+colname+"_"+tableid+"_desc_sortdiricon' style='float:right;margin-top:5px;' class='hideTableArrow' src='../Shared/icons/desc_white.svg'>";
							str += " <img id='"+colname+"_"+tableid+"_asc_sortdiricon' style='float:right;margin-top:5px;' class='hideTableArrow' src='../Shared/icons/asc_white.svg'></th>";
						} else {
							str += "</th>";
						}
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
		for (let rowno in tbl.tblbody) {
			var row = tbl.tblbody[rowno];
			if (rowFilter(row)) {
				// Keep row sum total here
				var rowsum = 0;

				str += "<tr id='"+tableid+"_"+rowno+"' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";
				mhvstr += "<tr id='"+tableid+"_"+rowno+"_mvh' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";

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

						let cellid = "r"+rowno+"_"+tableid+"_"+colnamez;
						str += "<td id='"+cellid+"' onclick='clickedInternal(event,this);' class='"+tableid+"-"+colnamez+"'>"+renderCell(colnamez,tbl.tblbody[rowno][colnamez],cellid)+"</td>";

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

	this.toggleColumn = function(col) {
		// Assign currently active table
		sortableTable.currentTable = this;

		if (columnfilter.indexOf(col) == -1) {
			columnfilter.push(col);
		} else {
			columnfilter.splice(columnfilter.indexOf(col),1);
		}

		localStorage.setrow(tableid+"_filtercolnames", JSON.stringify(columnfilter));

		this.reRender();
	}

	this.toggleSortStatus = function(col,kind) {
		// Assign currently active table
		sortableTable.currentTable = this;

		sortcolumn = col;
		sortkind = kind;

		this.ascending =! this.ascending;

		// Sort the body of the table again
		tbl.tblbody.sort(sortableInternalSort);

		this.reRender();
	}

    this.getSortcolumn = function() {
        return sortcolumn;
    }

    this.getSortcolumnNum = function() {
        return tbl.tblhead.indexOf(sortcolumn);
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

    //---------------------------------------------------------------------------
	// makeAllSortable(parent) <- Makes all tables within given scope sortable.
	//---------------------------------------------------------------------------
	this.makeAllSortable = function(parent) {
		parent = parent || document.body;
		var t = parent.getElementsByTagName('table'), i = t.length;
		while (--i >= 0) makeSortable(t[i]);
	}

    //----------------------------------------------------------------
	// makeSortable(table) <- Makes a table sortable and also allows
	//						  the table to collapse when user double
	//						  clicks on table head.
	//----------------------------------------------------------------
	function makeSortable(table) {
		var DELAY = 200;
		var clicks = 0;
		var timer = null;
		var th = table.tHead, i;
		th && (th = th.rows[0]) && (th = th.cells);
		if (th) i = th.length;
		else return; // if no `<thead>` then do nothing
		while (--i >= 0) (function (i) {
			var dir = 1;
			th[i].addEventListener('click', function (e) {
				clicks++;
				if(clicks === 1) {
					timer = setTimeout(function () {
						sortTable(table, i, (dir = 1 - dir));
						clicks = 0;
	                }, DELAY);
	            } else {
	                clearTimeout(timer);
	                $(this).closest('table').find('tbody').fadeToggle(500,'linear'); //perform double-click action
	                if ($(this).closest('tr').find('.arrowRight').css('display') == 'none') {
	    	            $(this).closest('tr').find('.arrowRight').delay(200).slideToggle(300,'linear');
	    	            $(this).closest('tr').find('.arrowComp').slideToggle(300,'linear');
					} else if ($(this).closest('tr').find('.arrowComp').css('display') == 'none') {
						$(this).closest('tr').find('.arrowRight').slideToggle(300,'linear');
	    	            $(this).closest('tr').find('.arrowComp').delay(200).slideToggle(300,'linear');
					} else {
						$(this).closest('tr').find('.arrowRight').slideToggle(300,'linear'); 
						$(this).closest('tr').find('.arrowComp').slideToggle(300,'linear');
					}
	                clicks = 0; //after action performed, reset counter
	            }
	        });
	        th[i].addEventListener('dblclick', function(e) {
	            e.preventDefault();
	        })
	    }(i));
	}

	//-----------------------------------------------------------------
	// sortTable(table, col, reverse) <- Sorts table based on given
	//									 column and whether or not to
	//								     reverse the sorting.
	//-----------------------------------------------------------------
	function sortTable(table, col, reverse) {
	    var tb = document.getElementById(tableid + "_tbl").tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
	        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
	        th = document.getElementById(tableid + "_tbl").tHead,
	        childrenTR = th.children[0],
	        childrenTH = childrenTR.children[col],
	        imgDesc = childrenTH.children[0],
	        imgAsc = childrenTH.children[1],
	        i;

	    reverse = -((+reverse) || -1);
	    tr = tr.sort(function (a, b) { // sort rows
			return reverse // `-1 *` if want opposite order
			* (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
	            .localeCompare(b.cells[col].textContent.trim())
	        );
	    });

	    var lista1 = $(childrenTH).prevAll("th").children("img").addClass("hideTableArrow");
	    var lista2 = $(":nth-child(1)").nextAll("th").children("img").addClass("hideTableArrow");

	    if (reverse == 1) {
	    	imgDesc.classList.remove("hideTableArrow");
	    } else if (reverse == -1) {
	    	imgAsc.classList.remove("hideTableArrow");
	    }

	    //document.getElementById(tHead[col] + tableid + "_desc_sortdiricon").style.display = "block;"
	    for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
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