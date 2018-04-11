// Keep track of Currently active Table and all sortable tables
var sortableTable = {
    currentTable:null,
    sortableTables:[],
    edit_rowno:-1,
    edit_columnno:-1,
    edit_columnname:null,
    edit_tableid:null,
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

var searchterm = "";

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

	// Publick Callback Declarations
	this.highlightRow = highlightRow;
	this.deHighlightRow = deHighlightRow;
	this.showEditCell = showEditCell;
	this.updateCell = updateCell;
	this.ascending = false;
	this.tableid = tableid;
  	this.hasMagicHeadings = hasmagic;
	
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
		if(searchterm != null) {
			console.log(searchterm);
		}

		// Assign currently active table
		sortableTable.currentTable = this;

		// Private array that contains names of filtered columns
//		columnfilter = JSON.parse(localStorage.getrow(tableid+"_filtercolnames"));
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

		// Local variable that contains html code for main table and local variable that contains magic headings table
		var str = "<table style='border-collapse: collapse;' id='"+tableid+"_tbl' class='list list--nomargin'>";
		var	mhstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;top:0px;left:0px;z-index:2000;' id='"+tableid+"_tbl_mh'>";
		var mhvstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;z-index:1000;' id='"+tableid+"_tbl_mhv'>";
		var mhfstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;top:0px;z-index:3000;' id='"+tableid+"_tbl_mhf'>";

		str += "<caption>"+caption+"</caption>";

		// Make headings Clean Contains headings using only A-Z a-z 0-9 ... move to function removes lines of code and removes redundant code/data!?
	    str += "<thead id='"+tableid+"_tblhead'><tr>";
	    mhstr += "<thead id='"+tableid+"_tblhead_mh'><tr>";
	    mhvstr += "<thead id='"+tableid+"_tblhead_mhv'><tr>";
	    mhfstr += "<thead id='"+tableid+"_tblhead_mhf'><tr>";
		
	    if (tableid == "quiz") {
	    	str += "<th></th><th class='name'>Name</th>";
	    }

		//var freezePaneIndex = tbl.tblhead.indexOf(freezePane);
//for (var key in arr_jq_TabContents) {
//    console.log(arr_jq_TabContents[key]);
		for(var colname in tbl.tblhead) {
		// for (let colname = 0; colname < tbl.tblhead.length; colname++) {
			var col = tbl.tblhead[colname];
			//var cleancol = tbl.cleanHead[colname];
			
			// If column is visible
			

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

		if (tableid == "fileLink") {
			str += "<th class='last'><input class='submit-button fileed-button' type='button' value='Add Link' onclick='createLink();'/></th></tr>";
			mhstr += "<th class='last'><input class='submit-button fileed-button' type='button' value='Add Link' onclick='createLink();'/></th></tr>";
			mhfstr += "<th class='last'><input class='submit-button fileed-button' type='button' value='Add Link' onclick='createLink();'/></th></tr>";
		} else if (tableid == "quiz") {
			str += "<th></th><th></th>";
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

				if (tableid == "quiz") {
      				str += "<td id='arrowz' onclick='showVariant("+rowno+")'><span class='arrow' id='arrow"+rowno+"'>&#9658;</span></td>";
					str += "<td><input type='text' id='duggav"+result+"' style='font-size:14px;border: 0;border-width:0px;width:100%' onchange='changename("+row['did']+","+result+")' placeholder='"+row['name']+"' /></td>";
				}

				result++;

				for (let colnamez in row) {
					// col = row[colnamez];
  			// 		cleancol = tbl.cleanHead[col];
														
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

				if (rowno != "move" && tableid == "fileLink") {
					str+="<td style='padding:4px;'>";
					str+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					str+=" onclick='deleteFile(\""+row['fileid']+"\",\""+row['filename']+"\");' >";
					str+="</td>";

					mhvstr+="<td style='padding:4px;'>";
					mhvstr+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					mhvstr+=" onclick='deleteFile(\""+row['fileid']+"\",\""+row['filename']+"\");' >";
					mhvstr+="</td>";
				}else if(rowno != "move" && tableid == "user"){
					      // Create cogwheel
					str+="<td><img id='dorf' style='float:none; margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
					str+=" onclick='selectUser(\""+row['uid']+"\",\""+row['username']+"\",\""+row['ssn']+"\",\""+row['firstname']+"\",\""+row['lastname']+"\",\""+row['access']+"\",\""+row['class']+"\");'></td>";
					str+="<td><input class='submit-button' type='button' value='Reset PW' onclick='if(confirm(\"Reset Password for "+row['username']+" ?\")) resetPw(\""+row['uid']+"\",\""+row['username']+"\"); return false;' style='float:none;'></td>";
					str+="</tr>";

					mhvstr+="<td><img id='dorf' style='float:none; margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
					mhvstr+=" onclick='selectUser(\""+row['uid']+"\",\""+row['username']+"\",\""+row['ssn']+"\",\""+row['firstname']+"\",\""+row['lastname']+"\",\""+row['access']+"\",\""+row['class']+"\");'></td>";
					mhvstr+="<td><input class='submit-button' type='button' value='Reset PW' onclick='if(confirm(\"Reset Password for "+row['username']+" ?\")) resetPw(\""+row['uid']+"\",\""+row['username']+"\"); return false;' style='float:none;'></td>";
					mhvstr+="</tr>";
				}else if(rowno != "move" && tableid == "quiz"){
					      // Create cogwheel
					str+="<td style='padding:4px;'>";
					str+="<img id='plorf' style='float:left;margin-right:4px;' src='../Shared/icons/PlusU.svg' ";
					str+=" onclick=' showVariantz("+rowno+"); addVariant(\""+querystring['cid']+"\",\""+row['did']+"\");'>";
					str+="</td>";
					str+="<td style='padding:4px;'>";
					str+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
					str+=" onclick='selectDugga(\""+row['did']+"\",\""+row['name']+"\",\""+row['autograde']+"\",\""+row['gradesystem']+"\",\""+row['template']+"\",\""+row['qstart']+"\",\""+row['deadline']+"\",\""+row['release']+"\");' >";
					str+="</td>";

					mhvstr+="<td style='padding:4px;'>";
					mhvstr+="<img id='plorf' style='float:left;margin-right:4px;' src='../Shared/icons/PlusU.svg' ";
					mhvstr+=" onclick=' showVariantz("+rowno+"); addVariant(\""+querystring['cid']+"\",\""+row['did']+"\");'>";
					mhvstr+="</td>";
					mhvstr+="<td style='padding:4px;'>";
					mhvstr+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Cogwheel.svg' ";
					mhvstr+=" onclick='selectDugga(\""+row['did']+"\",\""+row['name']+"\",\""+row['autograde']+"\",\""+row['gradesystem']+"\",\""+row['template']+"\",\""+row['qstart']+"\",\""+row['deadline']+"\",\""+row['release']+"\");' >";
					mhvstr+="</td>";


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

		// Assign table and magic headings table(s)
		if (this.hasMagicHeadings) {					 
			document.getElementById(tableid).innerHTML = str+mhstr+mhvstr+mhfstr;
			document.getElementById(tableid+"_tbl_mh").style.width=document.getElementById(tableid+"_tbl").getBoundingClientRect().width+"px";
			document.getElementById(tableid+"_tbl_mh").style.boxSizing = "border-box";          
			children=document.getElementById(tableid+"_tbl").getElementsByTagName('TH');
			
			for (i = 0; i < children.length; i++) {
				document.getElementById(children[i].id+"_mh").style.width = children[i].getBoundingClientRect().width;
				document.getElementById(children[i].id+"_mh").style.boxSizing = "border-box";          
			}

			document.getElementById(tableid+"_tbl_mhf").style.width = Math.round(document.getElementById(tableid+"_tbl_mhv").getBoundingClientRect().width)+"px";
			document.getElementById(tableid+"_tbl_mhf").style.boxSizing = "border-box";
			children=document.getElementById(tableid+"_tbl_mhv").getElementsByTagName('TH');
			
			for (i = 0; i < children.length; i++) {
				document.getElementById(children[i].id.slice(0, -1)+"f").style.width = children[i].getBoundingClientRect().width;
				document.getElementById(children[i].id.slice(0, -1)+"f").style.boxSizing = "border-box";
			}
		} else {
			document.getElementById(tableid).innerHTML = str;
		}

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
					if (thetabhead.top < 0 && thetab.bottom > 0) {
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