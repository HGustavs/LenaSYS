function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementsByTagName("table")[0];
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) { // Start loop from 1 to exclude header row
        for (j = 0; j < tr[i].cells.length; j++) {
            td = tr[i].cells[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function filterTable() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementsByTagName("table")[0].innerHTML = this.responseText;
        }
    };
    var filter = document.getElementById("searchInput").value;
    var table = document.getElementById("tableID").value;
    xmlhttp.open("GET", "log.php?table=" + table + "&filter=" + filter, true);
    xmlhttp.send();
}


function sortTable(colIndex, dataType = 'string') {
    const table = document.getElementsByTagName("table")[0];
    const rows = Array.from(table.rows).slice(1); // exclude header row
    const sortFn = getSortFunction(dataType);
  
    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[colIndex].innerText;
      const cellB = rowB.cells[colIndex].innerText;
      return sortFn(cellA, cellB);
    });
  
    // remove all rows
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }
  
    // add sorted rows to table
    const header = table.createTHead();
    const newRow = header.insertRow();
    for (let i = 0; i < rows[0].cells.length; i++) {
      const newHeader = newRow.insertCell();
      newHeader.innerHTML = rows[0].cells[i].innerHTML;
    }
    rows.forEach(row => table.tBodies[0].appendChild(row));
  }
  
  function getSortFunction(dataType) {
    switch (dataType) {
      case 'number':
        return (a, b) => Number(a) - Number(b);
      case 'date':
        return (a, b) => Date.parse(a) - Date.parse(b);
      default:
        return (a, b) => a.localeCompare(b);
    }
  }
  