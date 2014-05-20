(function($) {
	pagination = new pagination();
	getItems(pagination);
	pagination.showContent();
})();

function pagination() {
	var items = [];
	// Amount of cells in a row
	var cells = 5;
	var show_per_page = 5;
	
	var number_of_items = 0;
	var number_of_pages = 0;
	
	var currentPage = 0;
	
	this.next = function() {
		this.currentPage++;
		this.clearRows();
		this.showContent();
	}
	
	this.previous = function() {
		if (this.currentPage > 0) {
			this.currentPage--;
			this.clearRows();
			this.showContent();
		}
	}

	this.showContent = function() {
		var table = document.getElementById("contentlist");
		// If there are any items to print
		if (pagination.number_of_items > 0) {
			// Print items currentPage * show_per_page to show_per_page * (currentPage + 1)
			for (i = (this.currentPage * this.show_per_page); i < (this.show_per_page * (this.currentPage + 1)); i++) {
				// If item is defined
				if (this.items.entries[i]) {
					// Insert row below <th>
					var row = table.insertRow(i + 1);
					
					if (parseInt(this.items.entries[i]["grade"]) >= 3) {
						row.className = "green";
					} else if (parseInt(this.items.entries[i]["grade"]) < 3) {
						row.className = "red";
					}
					for (j = 0; j < cells; j++) {
						var cell = row.insertCell(j);
						switch (j) {
							case 0:
								cell.innerHTML = this.items.entries[i]["coursename"];
								break;
							case 1:
								cell.innerHTML = this.items.entries[i]["coursecode"];
								break;
							case 2:
								cell.innerHTML = this.items.entries[i]["name"];
								break;
							case 3:
								cell.innerHTML = this.items.entries[i]["submitted"];
								break;
							case 4:
								if (parseInt(this.items.entries[i]["grade"]) >= 3) {
									cell.innerHTML = this.items.entries[i]["grade"];
								} else if (parseInt(this.items.entries[i]["grade"]) < 3) {
									cell.innerHTML = "U";
								}
								break;
						}
					}
				} else {
					// No more items to print
					break;
				}
			}
		} else {
			$('#content').empty();
			$('#content').append("<div class='no_results'>There are currently no results available</div>")
		}
	}

	this.clearRows = function() {
		var table = document.getElementById('contentlist');
		var tableRows = table.getElementsByTagName('tr');
		var rowCount = tableRows.length;

		for (var x = rowCount-1; x>0; x--) {
		   tableRows[x].remove();
		}
	}
}

function getItems(pagination) {
	$.ajax({
		dataType: 'json',
		async: false,
		url: 'ajax/user_results.php',
		method: 'post',
		data: {
			'courseid': 1,
		},
		success: function(data) {
			pagination.items = data;
			pagination.number_of_items = pagination.items.entries.length;
			pagination.number_of_pages = Math.ceil(pagination.number_of_items/pagination.show_per_page);
			pagination.cells = 5;
			pagination.show_per_page = 5;
			pagination.currentPage = 0;
		}
	});
}
