var stepSelected = 1;

function breadCrumbActive() {
    var breadcrumbs = document.getElementsByClassName("breadcrumb");
    for(breadcrumb of breadcrumbs) {
        breadcrumb.classList.remove("breadcrumb-selected");
    }
    document.getElementById('bcStep'+stepSelected).classList.add("breadcrumb-selected");
}

function breadCrumbInc() {
    stepSelected += 1;
    if(stepSelected>=6) {
        stepSelected = 6;
    }
}
function breadCrumbDecr() {
    stepSelected -= 1;
    if(stepSelected<=1) {
        stepSelected = 1;
    }
}