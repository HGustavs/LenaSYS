function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[columnIndex];
        y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
        if (columnIndex === currentSortColumnIndex) {
          if (currentSortOrder === "asc") {
            if (+x.innerHTML.toLowerCase() < +y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if (currentSortOrder === "desc") {
            if (+x.innerHTML.toLowerCase() > +y.innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          }
        } else {
          if (+x.innerHTML.toLowerCase() > +y.innerHTML.toLowerCase()) {
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
    if (currentSortOrder === "asc") {
      currentSortOrder = "desc";
    } else {
      currentSortOrder = "asc";
    }
    currentSortColumnIndex = columnIndex;
  }
  