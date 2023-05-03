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

function sortTable(colIndex) {
    var table = document.getElementsByTagName("table")[0];
    var rows = Array.prototype.slice.call(table.rows, 1); // Convert NodeList to array and exclude header row
    var ascending = true;
    rows.sort(function(a, b) {
        var aValue = a.cells[colIndex].textContent || a.cells[colIndex].innerText;
        var bValue = b.cells[colIndex].textContent || b.cells[colIndex].innerText;
        if (colIndex === 5) { // Special case for timestamp column
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        } else if (!isNaN(parseFloat(aValue)) && isFinite(aValue) && !isNaN(parseFloat(bValue)) && isFinite(bValue)) { // Numeric sort for other columns
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        } else { // Alphabetic sort for other columns
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        if (aValue > bValue) {
            return ascending ? 1 : -1;
        } else if (aValue < bValue) {
            return ascending ? -1 : 1;
        } else {
            return 0;
        }
    });
    ascending = !ascending; // Reverse sort order for next click
    rows.forEach(function(row) {
        table.appendChild(row);
    });
}
