function pagination() {
	var items = [];
	// Amount of cells in a row
	var cells = 5;
	var show_per_page = 5;
	
	var number_of_items = 0;
	var number_of_pages = 0;
	
	var max_pages = 5;
	
	var currentPage = 0;
	
	this.renderPages = function() {
		$('#pages').empty();
		var minRange = 1;
		var maxRange = this.max_pages;
		
		if (this.currentPage + 2 >= this.max_pages) {
			var diff = (this.currentPage + 2) - this.max_pages;
			minRange += diff;
			maxRange += diff;
		}
		
		if (this.currentPage + 1 == this.number_of_pages) {
			$('#pages').append("<div class='page' onClick='pagination.goToPage("+0+")'>First page</div>");
		}
		$('#pages').append("<div class='page' onClick='pagination.previous()'>Previous</div>");
		
		for (i = minRange; i <= maxRange; i++) {
			if (i <= this.number_of_pages) {
				if (this.currentPage + 1 == i) {
					$('#pages').append("<div class='page selected' onClick='pagination.goToPage("+(i-1)+")'>"+i+"</div>");
				} else {
					$('#pages').append("<div class='page' onClick='pagination.goToPage("+(i-1)+")'>"+i+"</div>");
				}
			} else {
				break;
			}
		}
		$('#pages').append("<div class='page' onClick='pagination.next()'>Next</div>");
		if (this.max_pages < this.number_of_pages) {
			$('#pages').append("<div class='page' onClick='pagination.goToPage("+(this.number_of_pages-1)+")'>Last page</div>");
		}
	}
	
	this.goToPage = function(page) {
		this.currentPage = page;
		this.clearRows();
		this.showContent();
		this.renderPages();
	}
	
	this.next = function() {
		if (((this.currentPage + 1) * this.show_per_page) < this.number_of_items) {
			this.goToPage(this.currentPage + 1);
		}
	}
	
	this.previous = function() {
		if (this.currentPage > 0) {
			this.goToPage(this.currentPage - 1);
		}
	}

	this.showContent = function() {
		var table = document.getElementById("contentlist");
		// If there are any items to print
		if (this.number_of_items > 0) {
			// Print items currentPage * show_per_page to show_per_page * (currentPage + 1)
			for (i = (this.currentPage * this.show_per_page); i < (this.show_per_page * (this.currentPage + 1)); i++) {
				// If item is defined
				if (this.items.entries[i]) {
					// Insert row below <th>
					var row = table.insertRow(i % this.show_per_page + 1);
					
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
			$('#content').append("<div class='no_results'>There is currently no content available in the database</div>");
			page.title("No content");
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

function getResults(pagination) {
	$.ajax({
		dataType: 'json',
		async: false,
		url: 'ajax/user_results.php',
		method: 'post',
		data: {
			'courseid': 1,
		},
		success: function(data) {
			if (data == "No access") {
				changeURL('noid');
			} else {
				pagination.items = data;
				pagination.number_of_items = pagination.items.entries.length;
				pagination.cells = 5;
				pagination.max_pages = 5;
				pagination.show_per_page = 5;
				pagination.currentPage = 0;
				pagination.number_of_pages = Math.ceil(pagination.number_of_items/pagination.show_per_page);
				if (pagination.number_of_pages > 1) {
					$('#content').append("<div id='pages' style='display:inline-block;float:right;'></div>");
				}
				pagination.renderPages();
			}
		}
	});
}