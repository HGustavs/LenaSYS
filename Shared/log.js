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

var currentSortColumnIndex = -1;
var currentSortAscending = true;

function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch, ascending;
  
    table = document.getElementsByTagName("table")[0];
    switching = true;
  
    // Determine the new sorting direction
    if (columnIndex === currentSortColumnIndex) {
      if (currentSortAscending) {
        ascending = false;
      } else {
        ascending = true;
      }
      currentSortAscending = ascending;
    } else {
      ascending = true;
      currentSortAscending = true;
      currentSortColumnIndex = columnIndex;
    }
  
    // Remove the sorting classes from all columns if table is not sorted
    if (currentSortColumnIndex === -1) {
      for (i = 0; i < table.rows[0].cells.length; i++) {
        table.rows[0].cells[i].classList.remove("sorted-ascending");
        table.rows[0].cells[i].classList.remove("sorted-descending");
      }
    }
  
    // Set the sorting class for the clicked column
    if (currentSortColumnIndex !== -1) {
      table.rows[0].cells[columnIndex].classList.add(ascending ? "sorted-ascending" : "sorted-descending");
    }
  
    // Loop through all rows except the first one (header)
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
  
        // Get the values of the current and next row for the clicked column
        x = rows[i].getElementsByTagName("td")[columnIndex];
        y = rows[i + 1].getElementsByTagName("td")[columnIndex];
  
        // Compare the values and determine if they should be switched
        if (columnIndex === 0) { // special case for id-column
          if (ascending ? parseInt(x.innerHTML) > parseInt(y.innerHTML) : parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else { // normal comparison for other columns
          if (ascending ? x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() : x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}