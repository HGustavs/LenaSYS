// Keep track of Currently active Table and all sortable tables
var sortableTable = {
    currentTable:null,
    sortableTables:[],
    edit_rowno:-1,
    edit_rowid:null,
    edit_row:null,
    edit_columnno:-1,
    edit_columnname:null,
    edit_tableid:null,
}

var DELIMITER="___";

function byString(inpobj,paramstr){
		params=paramstr.split(".");
		return inpobj[params[1]];
}

function searchKeyUp(e)
{
	// look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13) {
        document.getElementById('searchbutton').click();
        return false;
    }
    return true;
}

function keypressHandler(event)
{
    if (event.keyCode == 13) {
        updateCellInternal();
    } else if(event.keyCode == 27) {
        clearUpdateCellInternal();
    }
}

function defaultRowFilter()
{
	return true;
}



// Global sorting function global
function sortableInternalSort(a,b)
{
    var ret = 0;
    //var colname = sortableTable.currentTable.getKeyByValue();
    var colname = sortableTable.currentTable.getSortcolumn();
    if ((sortableTable.currentTable.sortkind % 2)==0) {
      //alert("Compare: "+a+" "+b);
      ret = newCompare(a[colname],b[colname]);
    } else {
      //alert("Compare: "+b+" "+a);
      ret = newCompare(b[colname],a[colname]);
    }
    return ret;
}
// function sortableInternalSort(a,b)
// {
//     var ret = 0;
//     //var colname = sortableTable.currentTable.getKeyByValue();
//     var colname = sortableTable.currentTable.getSortcolumn();7
//     if ((sortableTable.currentTable.sortkind % 2)==0) {
//       //alert("Compare: "+a+" "+b);
//       ret = compare(a[colname],b[colname]);
//     } else {
//       //alert("Compare: "+b+" "+a);
//       ret = compare(b[colname],a[colname]);
//     }
//     return ret;
// }

function clearUpdateCellInternal()
{
    sortableTable.edit_rowno =- 1;
    sortableTable.edit_rowid =null;
    sortableTable.edit_columnno =- 1;
    sortableTable.edit_columnname = null;
    sortableTable.edit_tableid = null;
    sortableTable.edit_celldata = null;
    document.getElementById('editpopover').style.display = "none";
}

function updateCellInternal()
{
    for (var i = 0; i < sortableTable.sortableTables.length; i++) {
        if (sortableTable.sortableTables[i].tableid == sortableTable.edit_tableid) {
            sortableTable.sortableTables[i].updateCell();
        }
    }
    clearUpdateCellInternal();
}

// clickedInternal
function clickedInternal(event,clickdobj)
{
  let clickedTbl=event.target.closest("table").id.substring(0,event.target.closest("table").id.indexOf(DELIMITER+"tbl"));
  let active=null;
  for (let i=0;i<sortableTable.sortableTables.length;i++){
      if(sortableTable.sortableTables[i].tableid==clickedTbl){
          active=sortableTable.sortableTables[i];
          break;
      }
  }
  sortableTable.currentTable=active;

	if (sortableTable.currentTable.showEditCell != null) {
		var cellelement = event.target.closest("td");
    var rowelement = event.target.closest("tr");
    let regex=new RegExp("^r([0-9]+)"+DELIMITER+"([a-zA-Z0-9]+)"+DELIMITER+"(.*)")
    let match=cellelement.id.match(regex);
    var rowno = match[1];
    var columnno = null; // Not used anymore
    var tableid = match[2];
    var columnname=match[3]
    var str = "";
    var rowdata = sortableTable.currentTable.getRow(rowno);
    var coldata = rowdata[columnname];

    sortableTable.edit_rowno = rowno;
    sortableTable.edit_row = rowdata;
    sortableTable.edit_columnno = columnno;
    sortableTable.edit_columnname = columnname;
    sortableTable.edit_tableid = tableid;
    sortableTable.edit_celldata = coldata;
    var estr=sortableTable.currentTable.showEditCell(coldata,rowno,rowelement,cellelement,columnname,columnno,rowdata,coldata,tableid);
    if(estr!==false){
      str += "<div id='input-container' style='flex-grow:1'>";
      str += estr;
      str += "</div>";
      str += "<img id='popovertick' class='icon' src='../Shared/icons/Icon_Tick.svg' onclick='updateCellInternal();'>";
      str += "<img id='popovercross' class='icon' src='../Shared/icons/Icon_Cross.svg' onclick='clearUpdateCellInternal();'>";
      var lmnt = cellelement.getBoundingClientRect();
      var popoverelement = document.getElementById("editpopover");

      popoverelement.innerHTML = str;
      var popoveredit = document.getElementById("popoveredit");
      var xscroll = window.pageXOffset;
      var yscroll = window.pageYOffset;

      popoverelement.style.left = Math.round(lmnt.left+xscroll)+"px";
      popoverelement.style.top = Math.round(lmnt.top+yscroll)+"px";
      popoverelement.style.minHeight = (Math.round(lmnt.height)-5)+"px";
      popoverelement.style.maxWidth = "fit-content";
      popoverelement.style.display = "flex";
    }
	}
}

// We call all highlights in order to allow hover of non-active tables
function rowHighlightInternal(event,row)
{
    var arr = row.id.split(DELIMITER);
    var rowno = parseInt(arr[1]);
    var centerel = event.target.closest("td");
    for (var i = 0; i < sortableTable.sortableTables.length; i++) {
        if (sortableTable.sortableTables[i].highlightRow != null) {
            sortableTable.sortableTables[i].highlightRow(row.id,rowno,centerel.className,centerel);
        }
    }
}

// We call all deHighlights in order to allow hover of non-active tables
function rowDeHighlightInternal(event,row)
{
    var arr = row.id.split(DELIMITER);
  	var rowno = parseInt(arr[1]);
  	var centerel = event.target.closest("td");
  	for (var i = 0; i < sortableTable.sortableTables.length; i++) {
    		if (sortableTable.sortableTables[i].deHighlightRow != null) {
            sortableTable.sortableTables[i].deHighlightRow(row.id,rowno,centerel.className,centerel);
    		}
    }
}

// https://stackoverflow.com/questions/13708590/css-gradient-colour-stops-from-end-in-pixels

function defaultRowHighlightOn(rowid,rowno,colclass,centerel)
{
    rowid=rowid.replace(DELIMITER+"mhv","");
		rowElement=document.getElementById(rowid);
		// rowElement.style.backgroundImage="radial-gradient(RGBA(0,0,0,0),RGBA(0,0,0,0.2))";
    rowElement.style.backgroundImage="linear-gradient(to top,RGBA(255,220,80,1) 2px,RGBA(0,0,0,0.0) 3px, RGBA(0,0,0,0.0) calc(100% - 3px), RGBA(255,220,80,1) calc(100% - 3px))"
    if(this.hasMagicHeadings){
        mhvRowElement=document.getElementById(rowid+DELIMITER+"mhv");
        mhvRowElement.style.backgroundImage="linear-gradient(to top,RGBA(255,220,80,1) 2px,RGBA(0,0,0,0.0) 3px, RGBA(0,0,0,0.0) calc(100% - 3px), RGBA(255,220,80,1) calc(100% - 3px))"
    }

		colElements=document.getElementsByClassName(colclass);
		for (var i=0; i<colElements.length; i++) {
    		colElements[i].style.backgroundImage = "linear-gradient(to right,RGBA(255,220,80,1) 2px,RGBA(0,0,0,0.0) 3px, RGBA(0,0,0,0.0) calc(100% - 3px), RGBA(255,220,80,1) calc(100% - 2px))";
		}

		centerel.style.background="radial-gradient(RGBA(0,0,0,0),RGBA(0,0,0,0.2)),linear-gradient(to top,RGBA(255,220,80,1) 2px,RGBA(0,0,0,0.0) 3px, RGBA(0,0,0,0.0) calc(100% - 3px), RGBA(255,220,80,1) calc(100% - 3px)), linear-gradient(to right,RGBA(255,220,80,1) 2px,RGBA(0,0,0,0.0) 3px, RGBA(0,0,0,0.0) calc(100% - 3px), RGBA(255,220,80,1) calc(100% - 2px))";
}

function defaultRowHighlightOff(rowid,rowno,colclass,centerel)
{
    rowid=rowid.replace(DELIMITER+"mhv","");
		rowElement=document.getElementById(rowid);
		rowElement.style.backgroundImage="none";
    if(this.hasMagicHeadings){
        mhvRowElement=document.getElementById(rowid+DELIMITER+"mhv");
        mhvRowElement.style.backgroundImage="none";
    }

		colElements=document.getElementsByClassName(colclass);
		for (var i=0; i<colElements.length; i++) {
    		colElements[i].style.backgroundImage = "none";
		}

}

// Checks if parameter has been defined and returns default if not
function getparam(param,def)
{
    if(typeof param === "undefined"){
				return def;
		}
		return param;
}

function SortableTable(param)
{
		//------------==========########### Fenced paramters ###########==========------------

    var tbl = getparam(param.data,{tblhead:{},tblbody:[],tblfoot:{}});
    this.tableid = getparam(param.tableElementId,"UNK");
    var filterid = getparam(param.filterElementId,"UNK");
    var caption = getparam(param.tableCaption,"UNK");
    var renderCell = getparam(param.renderCellCallback,null);
    var exportCell = getparam(param.exportCellCallback,null);
    var exportColumnHeading = getparam(param.exportColumnHeadingCallback,null);
    var renderSortOptions = getparam(param.renderSortOptionsCallback,null);
    var renderColumnFilter = getparam(param.renderColumnFilterCallback,null);
    var rowFilter = getparam(param.rowFilterCallback,defaultRowFilter);
    var columnOrder = getparam(param.columnOrder,[]);
    var colsumList = getparam(param.columnSum,[]);
    var rowsumList = getparam(param.rowSum,[]);
  	var sumFunc = getparam(param.columnSumCallback,null);
    var freezePaneIndex = getparam(param.freezePaneIndex,-1);
    this.hasRowHighlight = getparam(param.hasRowHighlight,false);
    this.highlightRow = getparam(param.rowHighlightOnCallback,defaultRowHighlightOn);
    this.deHighlightRow = getparam(param.rowHighlightOffCallback,defaultRowHighlightOff);
		this.showEditCell = getparam(param.displayCellEditCallback,null);
    this.updateCell = getparam(param.updateCellCallback,null);
		this.hasMagicHeadings = getparam(param.hasMagicHeadings,false);
    this.hasCounter = getparam(param.hasCounterColumn,false);

		// Prepare head and order with columns from rowsum list
		for(let i=0;i<rowsumList.length;i++){
        tbl.tblhead[rowsumList[i][0]['id']]=rowsumList[i][0]['name'];
        columnOrder.push(rowsumList[i][0]['id']);
    }

    //------------==========########### Private member variables ###########==========------------
    var result = 0;
    var columnfilter = [];
    var sortcolumn = "UNK";
    var sortkind = -1;
    var windowWidth=window.innerWidth;

    // Keeps track of the last picked sorting order
    var tableSort;
    var colSort;
    var reverseSort;
    var freezePane = freezePane;
    var freezePaneArr = [];

    // Local variable that contains html code for main table and local variable that contains magic headings table
    var str = "";
    var mhstr = "";
    var mhvstr = "";
    var mhfstr = "";

    sortableTable.sortableTables.push(this);

    this.renderTable = function() {
        this.reRender();
    }

    this.getRow = function(rowno) {
        return tbl.tblbody[rowno];
    }

    this.reRender = function() {

    	this.rowIndex = 1;
    	// Local variable that contains html code for main table and local variable that contains magic headings table
    	str = "<table style='border-collapse: collapse;' id='"+this.tableid+DELIMITER+"tbl' class='list list--nomargin'>";
    	mhstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;top:0px;left:0px;z-index:2000;margin-top:0px;border-bottom:none;background-color:ffffff' class='list' id='"+this.tableid+DELIMITER+"tbl"+DELIMITER+"mh'>";
    	mhvstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;z-index:1000;background-color:ffffff' id='"+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhv'>";
    	mhfstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;top:0px;z-index:3000;background-color:ffffff' id='"+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf'>";

      // Local variable that contains summing array
    	var sumContent = [];

    	// Assign currently active table
    	sortableTable.currentTable = this;
      if(localStorage.getItem(this.tableid+DELIMITER+"filtercolnames")===null){
          columnfilter=[];
      }else{
          columnfilter = JSON.parse(localStorage.getItem(this.tableid+DELIMITER+"filtercolnames"));
      }
      var filterstr="";
      var columnOrderIdx;
      for (columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
          if(!(columnfilter[columnOrderIdx]===null||columnfilter[columnOrderIdx]===columnOrder[columnOrderIdx])){
              break;
          }
          if (renderColumnFilter != null) filterstr += renderColumnFilter(columnOrder[columnOrderIdx],columnfilter[columnOrderIdx],tbl.tblhead[columnOrder[columnOrderIdx]]);
      }

      for (;columnOrderIdx<columnOrder.length;columnOrderIdx++){
          columnfilter[columnOrderIdx]=columnOrder[columnOrderIdx];
          if (renderColumnFilter != null) filterstr += renderColumnFilter(columnOrder[columnOrderIdx],columnfilter[columnOrderIdx],tbl.tblhead[columnOrder[columnOrderIdx]]);
      }
      localStorage.setItem(this.tableid+DELIMITER+"filtercolnames",JSON.stringify(columnfilter));

			// Retrieve sort column from local storage if we have one
      if(localStorage.getItem(this.tableid+DELIMITER+"sortcol")!==null){
					var tmpsortcolumn = localStorage.getItem(this.tableid+DELIMITER+"sortcol");

					// Check that the sorting column is visible, if not, clear it.

					if(columnfilter.indexOf(tmpsortcolumn)>-1){
							sortcolumn=tmpsortcolumn;
							sortkind=parseInt(localStorage.getItem(this.tableid+DELIMITER+"sortkind"));
					}else{
							sortcolumn="UNK";
							sortkind=-1;
					}
      }

      // Sort the body of the table again
      if(columnfilter.indexOf(sortcolumn)!==-1){
          tbl.tblbody.sort(sortableInternalSort);
      }

      if (renderColumnFilter != null) {
    		  document.getElementById(filterid).innerHTML = filterstr;
    	}

      if(caption!=="UNK"){
          str += "<caption>"+caption+"</caption>";
      }

    	// Make headings Clean Contains headings using only A-Z a-z 0-9 ... move to function removes lines of code and removes redundant code/data!?
      str += "<thead class='listHeading' id='"+this.tableid+DELIMITER+"tblhead'><tr>";
      mhstr += "<thead class='listHeading' id='"+this.tableid+DELIMITER+"tblhead_mh'><tr>";
      // mhvstr += "<thead class='listHeading' id='"+this.tableid+DELIMITER+"tblhead_mhv'><tr>";
      mhfstr += "<thead class='listHeading' id='"+this.tableid+DELIMITER+"tblhead_mhf'><tr>";

    	//var freezePaneIndex = tbl.tblhead.indexOf(freezePane);

    	// Add Column for counter if the sortabletable should have a counter column.
    	if(this.hasCounter) {
          str += "<th style='white-space:nowrap;' id='counter"+DELIMITER+this.tableid+DELIMITER+"tbl' class='"+this.tableid+"'></th>";
          mhstr += "<th style='white-space:nowrap;' id='counter"+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mh' class='"+this.tableid+"'></th>";
          mhfstr += "<th style='white-space:nowrap;' id='counter"+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf' class='"+this.tableid+"'></th>";
      }
      for(var columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
      		var colname=columnOrder[columnOrderIdx];
          var col=tbl.tblhead[colname];

      		if (columnfilter[columnOrderIdx] !== null) {
        			if (renderSortOptions !== null) {
									if (columnOrderIdx < freezePaneIndex) {
												if (colname == sortcolumn){
														mhfstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
												} else {
														mhfstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
												}
									}
									if (colname == sortcolumn) {
												str += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
												mhstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mh' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
									} else {
												str += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
												mhstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mh' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
									}
        			} else {
          				if (columnOrderIdx < freezePaneIndex) {
          				 	if (colname == sortcolumn){
          				 		mhfstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf' class='"+this.tableid+"'>"+col+"</th>";
          				 	} else {
          				 		mhfstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf' class='"+this.tableid+"'>"+col+"</th>";
          				 		mhvstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mhv' class='"+this.tableid+"'>"+col+"</th>";
          				 	}
          				}
          				if (col != "move") {
          					str += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl' class='"+this.tableid+"'>"+col+"</th>";
          					mhstr += "<th style='white-space:nowrap;' id='"+colname+DELIMITER+this.tableid+DELIMITER+"tbl"+DELIMITER+"mh' class='"+this.tableid+"'>"+col+"</th>";
          				}
        			}
          }
    	}

    	str += "</tr></thead>";
    	mhstr += "</tr></thead></table>";
    	mhfstr += "</tr></thead></table>";

    	// Render table body
    	str += "<tbody id='"+this.tableid+DELIMITER+"body'>";
    	mhvstr += "<tbody id='"+this.tableid+DELIMITER+"mhvbody'>";
    	for (var i = 0; i < tbl.tblbody.length; i++) {
      		var row = tbl.tblbody[i];
      		if (rowFilter(row)) {
              str += "<tr id='"+this.tableid+DELIMITER+i+"'"
              if (this.hasRowHighlight)str+=" onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)'";

              //Check if row contains requestedpasswordchange & set styling accordingly
              if (row["requestedpasswordchange"] != null) {
				  obj = JSON.parse(row["requestedpasswordchange"])
				  if (obj.requested == 1) {
					  str+=" style='box-sizing:border-box; background-color: #ff3f4c'>";
				  } else {
					  str+=" style='box-sizing:border-box'>";
				  }
			  } else {
				  str+=" style='box-sizing:border-box'>";
			  }

              mhvstr += "<tr id='"+this.tableid+DELIMITER+i+DELIMITER+"mhv' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";

        			// Add Counter cell to the row. The class <tableid>_counter can be used to style the counterText
        			if(this.hasCounter) {
                  str += "<td style='white-space:nowrap;' onclick='clickedInternal(event,this);' class='" + this.tableid + DELIMITER+"counter'><span>"+ this.rowIndex +"</span></td>";
                  mhvstr += "<td style='white-space:nowrap;' onclick='clickedInternal(event,this);' class='" + this.tableid + DELIMITER+"counter'><span>"+ this.rowIndex++ +"</span></td>";
              }
        			result++;
              for(var columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
        				if (columnfilter[columnOrderIdx] !== null) {
                    // check if this column is a row-sum column
                    for (let j=0;j<rowsumList.length;j++){
                        if (columnOrder[columnOrderIdx].indexOf(rowsumList[j][0]['id'])>-1) {
                            tbl.tblbody[i][columnOrder[columnOrderIdx]]=0;
                            for(let k=1;k<rowsumList[j].length;k++){
                                if (typeof(tbl.tblbody[i][rowsumList[j][k].substring(0,rowsumList[j][k].indexOf('.'))])==='object'){
                                    tbl.tblbody[i][columnOrder[columnOrderIdx]]+=parseFloat(byString(tbl.tblbody[i][rowsumList[j][k].substring(0,rowsumList[j][k].indexOf('.'))],rowsumList[j][k]));
                                }else{
                                    tbl.tblbody[i][columnOrder[columnOrderIdx]]+=parseFloat(tbl.tblbody[i][rowsumList[j][k]]);
                                }

                            }
                        }
                    }

          					// This condition is true if column is in summing list and in that case perform the sum like a BOSS
          					if (colsumList.indexOf(columnOrder[columnOrderIdx]) >- 1) {
            						if (typeof(sumContent[columnOrder[columnOrderIdx]]) == "undefined") sumContent[columnOrder[columnOrderIdx]]=0;
            						sumContent[columnOrder[columnOrderIdx]]+=sumFunc(columnOrder[columnOrderIdx],tbl.tblbody[i][columnOrder[columnOrderIdx]],row);
          					}

                    var cellid = "r"+i+DELIMITER+this.tableid+DELIMITER+columnOrder[columnOrderIdx];

          					str += "<td style='white-space:nowrap;' id='"+cellid+"' onclick='clickedInternal(event,this);' class='"+this.tableid+"-"+columnOrder[columnOrderIdx]+"'>"+renderCell(columnOrder[columnOrderIdx],tbl.tblbody[i][columnOrder[columnOrderIdx]],cellid)+"</td>";


                    //Prints student name to mvh
                    if (columnOrderIdx <1) {
          					mhvstr += "<td style='white-space:nowrap;' id='"+cellid+DELIMITER+"mhv' onclick='clickedInternal(event,this);' class='"+this.tableid+"-"+columnOrder[columnOrderIdx]+"'>"+renderCell(columnOrder[columnOrderIdx],tbl.tblbody[i][columnOrder[columnOrderIdx]],cellid)+"</td>";
                    }
        				}
      			}
      			str += "</tr>";
      			mhvstr += "</tr>";
          }
    	}
    	str += "</tbody>";
      mhvstr += "</tbody>";
      mhvstr += "<tfoot style='border-top:2px solid #000'>";
      mhvstr += "<tr style='font-style:italic;'>";
      str += "<tfoot style='border-top:2px solid #000'>";
      str += "<tr style='font-style:italic;'>";

      if(this.hasCounter) {
          str += "<td>&nbsp;</td>";
          mhvstr += "<td>&nbsp;</td>";
      }
      for(var columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
          if (columnfilter[columnOrderIdx] !== null) {
              if (typeof(sumContent[columnOrder[columnOrderIdx]])!=='undefined') {
                  str += "<td style='whitespace:nowrap;'>"+sumContent[columnOrder[columnOrderIdx]]+"</td>";
                  if (columnOrderIdx < freezePaneIndex) {
                      mhvstr += "<td style='whitespace:nowrap;'>"+sumContent[columnOrder[columnOrderIdx]]+"</td>";
                  }
              }else{
                  str += "<td>&nbsp;</td>";
                  if (columnOrderIdx < freezePaneIndex) {
                      mhvstr += "<td>&nbsp;</td>";
                  }
              }
          }
      }

      str+= "</tr></tfoot>";
      mhvstr+= "</tr></tfoot>";
    	str += "</table>";
    	mhvstr+= "</table>";

    	this.magicHeader();
    	freezePaneHandler();
    }

    this.toggleColumn = function(colname,col) {
    	// Assign currently active table
    	sortableTable.currentTable = this;
      for(var idx=0;idx<columnOrder.length;idx++){
          if(columnOrder[idx]===colname){
              if(columnfilter[idx]){
                  columnfilter[idx]=null;
              }else{
                  columnfilter[idx]=columnOrder[idx];
              }
          }
      }
    	localStorage.setItem(this.tableid+DELIMITER+"filtercolnames", JSON.stringify(columnfilter));

    	this.reRender();
    }

    this.toggleSortStatus = function(col,kind) {
    	// Assign currently active table
    	sortableTable.currentTable = this;

			// Save column name to local storage!
			localStorage.setItem(this.tableid+DELIMITER+"sortcol",col);
			localStorage.setItem(this.tableid+DELIMITER+"sortkind",kind);

    	sortcolumn = col;
    	sortkind = kind;

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
      		document.getElementById(this.tableid).innerHTML = str+mhstr+mhvstr+mhfstr;
      		document.getElementById(this.tableid+DELIMITER+"tbl"+DELIMITER+"mh").style.width=document.getElementById(this.tableid+DELIMITER+"tbl").getBoundingClientRect().width+"px";
      		document.getElementById(this.tableid+DELIMITER+"tbl"+DELIMITER+"mh").style.boxSizing = "border-box";
      		children=document.getElementById(this.tableid+DELIMITER+"tbl").getElementsByTagName('TH');
      		for (i = 0; i < children.length; i++) {
        			document.getElementById(children[i].id+DELIMITER+"mh").style.width = children[i].getBoundingClientRect().width+"px";
        			document.getElementById(children[i].id+DELIMITER+"mh").style.boxSizing = "border-box";
      		}

      		document.getElementById(this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf").style.width = Math.round(document.getElementById(this.tableid+DELIMITER+"tbl"+DELIMITER+"mhv").getBoundingClientRect().width)+"px";
      		document.getElementById(this.tableid+DELIMITER+"tbl"+DELIMITER+"mhf").style.boxSizing = "border-box";
      		children=document.getElementById(this.tableid+DELIMITER+"tbl"+DELIMITER+"mhv").getElementsByTagName('TH');

      		for (i = 0; i < children.length; i++) {
        			document.getElementById(children[i].id.slice(0, -1)+"f").style.width = children[i].getBoundingClientRect().width+"px";
        			document.getElementById(children[i].id.slice(0, -1)+"f").style.boxSizing = "border-box";
      		}
          document.getElementById(this.tableid+DELIMITER+"tblhead_mh").style.height = Math.round(document.getElementById(this.tableid+DELIMITER+"tblhead").getBoundingClientRect().height)+"px";
          document.getElementById(this.tableid+DELIMITER+"tblhead_mhf").style.height = Math.round(document.getElementById(this.tableid+DELIMITER+"tblhead").getBoundingClientRect().height)+"px";
    	} else {
    		  document.getElementById(this.tableid).innerHTML = str;
    	}

    	if (tableSort != null) {
    		  sortTable(tableSort, colSort, reverseSort);
    	}
    }

    setInterval(freezePaneHandler,30);
    function freezePaneHandler() {
      	// Hide magic headings and find minimum overdraft
      	for (var i = 0; i < sortableTable.sortableTables.length; i++) {
        		var table = sortableTable.sortableTables[i];
        		if (table.hasMagicHeadings) {
                if (window.innerWidth != windowWidth){windowWidth=window.innerWidth;table.renderTable()}
          			if (document.getElementById(table.tableid+DELIMITER+"tbl") != null) {
            				var thetab = document.getElementById(table.tableid+DELIMITER+"tbl").getBoundingClientRect();
            				var thetabhead = document.getElementById(table.tableid+DELIMITER+"tblhead").getBoundingClientRect();
            				// If top is negative and top+height is positive draw mh otherwise hide

            				// Vertical
            				if (thetabhead.top < 50 && thetab.bottom > 0) {
              					document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mh").style.left = thetab.left+"px";
                        document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mh").style.top = 50+"px";
              					document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mh").style.display = "table";
            				}
            				 else {
                        document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mh").style.display = "none";
            				}
            				// Horizontal
            				if (thetab.left < 0 && thetab.right > 0) {
              					document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mhv").style.top = thetabhead.top+38+"px";
                                document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mhv").style.left = -1+"px";
              					document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mhv").style.display = "table";
            				}
            				else {
                        document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mhv").style.display = "none";
            				}

            				// Fixed
            				if (thetab.left < 0 && thetab.right > 0 && thetabhead.top < 0 && thetab.bottom > 0) {
                        document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mhf").style.display = "table";
            				}
            				else {
                        document.getElementById(table.tableid+DELIMITER+"tbl"+DELIMITER+"mhf").style.display = "none";
            				}
          			}
        		}
      	}
    }

    this.updateCell = function() {
        tbl.tblbody[sortableTable.edit_rowno][sortableTable.edit_columnname] = updateCellCallback(sortableTable.edit_rowno,null,sortableTable.edit_columnname,sortableTable.edit_tableid,null,sortableTable.edit_rowid);
        this.renderTable();
    }

    this.getColumnOrder=function(){
        return columnOrder;
    }

    this.reorderColumns=function(newOrderList){
        if(Array.isArray(newOrderList)){
            columnOrder=newOrderList;
            this.reRender();
        }
    }

    this.export=function(format,del)
    {
        var str="";

        if(del==="undefined"||del===null){
          del=",";
        }

				// Export visible columns
				var rendcnt=0;
        for(let columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
						var colname=columnOrder[columnOrderIdx];
						var col=tbl.tblhead[colname];
						if (columnfilter[columnOrderIdx] !== null) {
								if(rendcnt!==0)str+=del;
								str+=exportColumnHeading(format,tbl.tblhead[columnOrder[columnOrderIdx]],columnOrder[columnOrderIdx]);
								rendcnt++;
						}
        }
        str+="\n";

				// Export data for visible columns
        for(let i=0;i<tbl.tblbody.length; i++) {
            let row=tbl.tblbody[i];
						rendcnt=0;
						for(let columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
								var colname=columnOrder[columnOrderIdx];
								var col=tbl.tblhead[colname];
								if (columnfilter[columnOrderIdx] !== null) {
										if(rendcnt!==0)str+=del;
                		str+=exportCell(format,row[colname],colname);
										rendcnt++;
								}
						}
            str+="\n";
          }

        return str;
    }
}
function newCompare(firstCell,secoundCell)
{
    let col = sortableTable.currentTable.getSortcolumn(); // Get column name
    let status = sortableTable.currentTable.getSortkind(); // Get if the sort arrow is up or down.
    let val=0;
    let colOrder = sortableTable.currentTable.getColumnOrder(); // Get all the columns in the table.
    var firstCellTemp;
    var secoundCellTemp;

    console.log(firstCell);
    console.log(secoundCell);
    //Check if the cell is a valid cell in the table.
    if (colOrder.includes(col)) {
        //Check if the cells contains a date object.
        if(Date.parse(firstCell) && Date.parse(secoundCell)){
        firstCellTemp = firstCell;
        secoundCellTemp = secoundCell;
        }else{
          //Check if any cell is null.
            if(firstCell === null || secoundCell === null){
              firstCellTemp = firstCell;
              secoundCellTemp = secoundCell;
            }else{
              //Convert to json object
              if(JSON.stringify(firstCell) || JSON.stringify(secoundCell)){
                firstCellTemp = firstCell;
                secoundCellTemp = secoundCell;
              }else{
                firstCell=JSON.parse(firstCell);
                secoundCell=JSON.parse(secoundCell);
                //Get the first letter from the value.
                firstCellTemp = Object.values(firstCell)[0];
                secoundCellTemp = Object.values(secoundCell)[0];
            }
          }
       }

        firstCellTemp=$('<div/>').html(firstCellTemp).text();
        secoundCellTemp=$('<div/>').html(secoundCellTemp).text();
        if(status==0){
            val = secoundCellTemp.toLocaleUpperCase().localeCompare(firstCellTemp.toLocaleUpperCase());
        }else{
            val = firstCellTemp.toLocaleUpperCase().localeCompare(secoundCellTemp.toLocaleUpperCase());
        }
    }
    else{
        if((status%2)==0){
            val=firstCellTemp<secoundCell;
        }else{
            val=secoundCell<firstCellTemp;
        }
    }
    return val;
}
