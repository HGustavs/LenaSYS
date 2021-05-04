var buttonsContainerElement;
var tableContainerElement;

var passwordBlockElement;
var sortBtnElement;

var phpData; // Data from resultedservice.php
var tableInfo;
var fullTableInfo; // original array. Unfiltered, unsorted
var tableHeadInfo = ["duggaName", "hash", "password", "submitted", "grade"]; // What the table contains
var tableHtml;

function returnedResults(data) {
    phpData = data;
    tableInfo = generateTableInfo();
    fullTableInfo = generateTableInfo();
    init();
}

function generateTableInfo() {
    var arr = [];
    for (var object of phpData) {
        for (var submission of object.tableInfo) {
            arr.push(submission);
        }
    }

    return arr;
}

function init() {
    buttonsContainerElement = document.getElementById("resultButtons");
    tableContainerElement = document.getElementById("resultTable2");

    generateTableButtons();
    sortBtnElement = document.querySelectorAll(".sortBtn");
    sortBtnHandler();
    init_table();
}

function init_table() {
    // Updates/creates/resets the table
    createTable();
    passwordBlockElement = document.querySelectorAll(".passwordBlock");
    passwordBlockHandler();
}

function resetTable() {
    // Resets the current table sorting/filters
    tableInfo = fullTableInfo;
    init_table();
}

function sort(item, order) {
    tableInfo = sortArray(item, order);
    init_table();
}

function filter(sortType, sortValue) {
    tableInfo = filterArray(sortType, sortValue);
    init_table();
}

function sortArray(item, order) {
    var arr = tableInfo;

    // ascending is set to base if no order is input
    var first = (order == "asc" || order == undefined) ? "a" : "b";
    var second = (order == "asc" || order == undefined) ? "b" : "a";

    //console.log(`first: ${first} - second: ${second} - item: ${item} - order: ${order}`)

    eval(`arr.sort((a, b) => (${first}.${item} > ${second}.${item}) ? 1 : -1)`);

    return arr;
}

function filterArray(sortType, sortValue) {
    var arr = fullTableInfo; // Get full array
    var newArr = [];

    for (var submission of arr) {
        for (var item in submission) {

            //console.log(`item: ${item} - submission: ${submission[item]} ==== sortType: ${sortType} - sortValue: ${sortValue}`)

            // Same item, etc duggaName, hash, password
            if (item == sortType) {

                // Items have same value
                if (submission[item] == sortValue)
                    newArr.push(submission);

            }
        }
    }

    return newArr;
}

function generateTableButtons() {

    var sortBtn = `<button class="sortBtn" data-sort-item="duggaName">Sort Dugga</button>`;
    var sortBtn2 = `<button class="sortBtn" data-sort-item="submitted">Sort Time</button>`;
    var filterBtns = generateFilterButtons();
    var resetBtn = `<button class="sortBtn" onclick="resetTable()">Reset</button>`;


    buttonsContainerElement.innerHTML = "";
    buttonsContainerElement.innerHTML += sortBtn;
    buttonsContainerElement.innerHTML += sortBtn2;
    buttonsContainerElement.innerHTML += filterBtns;
    buttonsContainerElement.innerHTML += resetBtn;
}

function generateFilterButtons() {
    var buttons = ``;

    // Get and store the name of all the duggas
    var arr = [];
    for (var submission of fullTableInfo) {
        var val = submission.duggaName
        if (!arr.includes(val))
            arr.push(val);
    }

    for (var nameOfDugga of arr) {
        buttons += `<button class="sortBtn" onclick="filter('duggaName', '${nameOfDugga}')">Filter ${nameOfDugga}</button>`;
    }

    return buttons;
}

function createTable() {
    tableContainerElement.innerHTML = "";

    var table = `
        <table>
        ${createTableHead()}
        ${createTableBody()}
        </table>
    `;

    tableContainerElement.innerHTML += table;
}

function createTableHead() {
    var tablehead = `<thead class="resultedTable">${generateThead()}</thead>`;
    return tablehead;


    function generateThead() {
        var thead = "<tr class='resultedTable'>";

        for (var item of tableHeadInfo) {
            var th = `<th class='resultedTable'>${item}</th>`;
            thead += th;
        }
        thead += "</tr>";

        return thead;
    }
}

function createTableBody() {
    var tablebody = `<tbody>${generateTbody()}</tbody>`;
    return tablebody;

    function generateTbody() {
        var tbody = "";

        for (var submission of tableInfo) {
            var tr = "<tr class='resultedTable'>";
            var td = "";

            for (var i = 0; i < tableHeadInfo.length; i++) {
                var item = tableHeadInfo[i];
                var value = submission[item];
                //console.log(`${item}: ${submission[item]}`)

                td += `<td class="resultedTable resultedTd">${value}`;
                if (item == "password") {
                    td += `<div class="passwordBlock"></div>`;
                }
                td += `</td>`;
            }
            tr += td;
            tr += "</tr>";

            tbody += tr;
        }

        return tbody;
    }
}

function passwordBlockHandler() {
    for (var element of passwordBlockElement) {
        element.addEventListener("click", function () {
            this.classList.toggle("togglePasswordBlock");
        });
    }
}

function sortBtnHandler() {
    for (var element of sortBtnElement) {
        element.addEventListener("click", function () {
            var item = this.dataset.sortItem ?? "error";
            var order = this.dataset.sortOrder ?? "asc"; // Set to asc if dataset is undefined

            if (order == "asc")
                this.dataset.sortOrder = "dec";
            else if (order == "dec")
                this.dataset.sortOrder = "asc";

            sort(item, order);
        });
    }
}


