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

function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch, ascending;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    ascending = true; // Default sort order is ascending
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[columnIndex];
        y = rows[i + 1].getElementsByTagName("td")[columnIndex];
        if (ascending) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      } else {
        // If no switching has been done and the sort order is ascending,
        // switch to descending and start again
        if (ascending) {
          ascending = false;
          switching = true;
        }
      }
    }
  }
  