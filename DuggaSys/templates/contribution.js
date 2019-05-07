function setup()
{
	inParams = parseGet();
    var container = document.getElementById('frameContainer');
    var str = "<iframe style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none' onLoad='checkLeaveFrame(this)'";
    str += " src = 'contribution.php?cid="+inParams['cid']+"&coursevers="+inParams['coursevers']+"'>";
    console.log(str);
    container.innerHTML = str;
}

// If the user leaves contribution.php, leave the iframe
var contributionURL = null;
function checkLeaveFrame(frame) {
    if (contributionURL === null) {
        contributionURL = frame.contentWindow.location.href;
        document.body.style.overflow = "hidden";
    }
    if (contributionURL !== frame.contentWindow.location.href) {
        window.location.href = frame.contentWindow.location.href;
        frame.parentNode.removeChild(frame);
    }
}
