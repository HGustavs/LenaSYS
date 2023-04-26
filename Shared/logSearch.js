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

function initSort() {
    const headers = document.querySelectorAll('th a');
    headers.forEach(header => {
        header.addEventListener('click', function(event) {
            event.preventDefault();
            const column = this.getAttribute('data-column');
            const currentSort = this.getAttribute('data-sort');
            const newSort = currentSort === 'asc' ? 'desc' : 'asc';
            const sortParam = `${column} ${newSort}`;
            const url = `log.php?name=serviceLogEntries&sort=${sortParam}`;
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    document.querySelector('table').innerHTML = data;
                    this.setAttribute('data-sort', newSort);
                })
                .catch(error => console.error(error));
        });
    });
}
