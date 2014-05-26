function pagination() {
	this.items = [];
	this.show_per_page = 10;
	
	this.number_of_items = 0;
	this.number_of_pages = 0;
	
	this.max_pages = 5;
	
	this.currentPage = 0;
	
	this.renderPages = function() {
		$('#pages').empty();
		if (pagination.number_of_pages > 1) {
			var minRange = 1;
			var maxRange = this.max_pages;
			
			if (this.currentPage + 2 >= this.max_pages) {
				var diff = (this.currentPage + 2) - this.max_pages;
				minRange += diff;
				maxRange += diff;
			}
			
			if (this.currentPage + 1 >= this.max_pages) {
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
			if (this.max_pages < this.number_of_pages && this.currentPage + 1 != this.number_of_pages) {
				$('#pages').append("<div class='page' onClick='pagination.goToPage("+(this.number_of_pages-1)+")'>Last page</div>");
			}
		}
	}
	
	this.goToPage = function(page) {
		this.currentPage = page;
		this.clearRows();
		this.showContent($("#searchbox").val());
		this.renderPages($("#searchbox").val());
	}
	
	this.next = function() {
		if (this.currentPage + 1 < this.number_of_pages) {
			this.goToPage(this.currentPage + 1);
		}
	}
	
	this.previous = function() {
		if (this.currentPage > 0) {
			this.goToPage(this.currentPage - 1);
		}
	}

	this.showContent = function(data) {
		data = data || null;
		// If there are any items to print
		if (this.number_of_items > 0) {
			// Print items currentPage * show_per_page to show_per_page * (currentPage + 1)
			var n = (this.currentPage * this.show_per_page);
			var output = "";
			for (i = n; i < (this.show_per_page * (this.currentPage + 1));) {
				// If item is defined
				if (this.items.entries[n]) {
					if (data == null || this.items.entries[n]['username'].toLowerCase().indexOf(data.toLowerCase()) > -1) {
						if (this.items.entries[n]['access'] == 'R') {
							access='Student';
						}
						else {
							access='Teacher';
						}
						
						if (sessName!=this.username) {

							output += "<tr><td>"+this.items.entries[n]['username']+"</td>";
							output += "<td>"+(this.items.entries[n]['firstname'] != null ? this.items.entries[n]['firstname']: '')+"</td>";
							output += "<td>"+(this.items.entries[n]['lastname'] != null ? this.items.entries[n]['lastname']: '')+"</td>";
							output += "<td>"+access+"</td>";
							output += "<td>";
							output += "<form id='accesschange'>";
							output += "<input type='hidden' name='username' value='" + this.items.entries[n]['username'] + "'>";
							output += "<input type='hidden' name='uid' value='" + this.items.entries[n]['uid'] + "'>";
							output += "<select id='access' name='access' onChange='updateDb(this);'>";
							output += "<option " + ((this.items.entries[n]['access'] == 'W') ? 'selected' : '') + " value='W'>Teacher</option>";
							output += "<option " + ((this.items.entries[n]['access'] == 'R') ? 'selected' : '') + " value='R'>Student</option>";
							output += "</select>";
							output += "</form>";
							output += "</td>";
							output += "<td id='deletebox1'><input type='checkbox' name='checkbox[]' value='"+this.items.entries[n]['uid']+"'/></td>";
							output += "<td id='resetbox1'><input type='button' class='submit-button' id='reset_pw_btn' onclick='warningBox(\"Confirm removal\", \"Are you sure you want to reset the password for this user?\", 0, resetPassword," + this.items.entries[n]['uid'] + ")' value='Reset'></inut></td></tr>";
						}
						i++;
					}
				} else {
					// No more items to print
					break;
				}
				n++;
			}
			this.clearRows();
			$("table.list tbody").append(output);
		} else {
			$('#content').empty();
			$('#content').append("<div class='no_results'>There is currently no content available in the database</div>");
			page.title("No content");
		}
	}

	this.clearRows = function() {
		$("table.list tbody").empty();
	}
	
	this.calculatePages = function(data) {
		data = data || null;
		if (data != null && data != "") {
			var count = 0;
			for (i = 0; i < this.number_of_items; i++) {
				if (this.items.entries[i]['username'].toLowerCase().indexOf(data.toLowerCase()) > -1) {
					count++;
				}
			}
			this.setPages(count);
		} else {
			this.setPages(this.number_of_items);
		}
		this.currentPage = 0;
	}
	
	this.setPages = function(items) {
		this.number_of_pages = Math.ceil(items/pagination.show_per_page);
	}
}

function getResults(pagination) {
	$.ajax({
		dataType: 'json',
		async: false,
		url: "./ajax/getstudent_ajax.php",
		method: 'post',
		data: {
			'courseid': courseid,
		},
		success: function(data) {
			pagination.items = data;
			pagination.number_of_items = pagination.items.entries.length;
			pagination.calculatePages();
			if (pagination.number_of_pages > 1) {
				$('#content').append("<div id='pages'></div>");
				pagination.renderPages();
			}
		},
		error: function() {
			alert("Could not retrieve students");			
		}
	});
}

function updateDb(o) {
	console.log($(o).parent().serialize());
	$.ajax({
	type: "POST",
	url: "./ajax/updateAccess.php", 
	data: $(o).parent().serialize() + "&courseid=" + courseid,
	dataType: "JSON",
	success: function(data){
		if(data.success == true) {
			successBox('Updated user successfully', 'The user has been updated with the selected access');
			pagination.items = data;
			if ($("#searchbox").val().length > 0) {
				pagination.showContent($("#searchbox").val());
				pagination.renderPages($("#searchbox").val());
				pagination.calculatePages($("#searchbox").val());
			} else {
				pagination.showContent();
				pagination.renderPages();
				pagination.calculatePages()
			}
		} else {
			dangerBox('Failed to update user', 'Failed to update the user to the permission you selected');
		}
	},
	error: function() {
		alert("Could not retrieve students");	
	}
  });
}
