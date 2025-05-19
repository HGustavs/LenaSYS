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
    if(stepSelected>=7) {
        stepSelected = 7;
    }
}
function breadCrumbDecr() {
    stepSelected -= 1;
    if(stepSelected<=1) {
        stepSelected = 1;
    }
}
