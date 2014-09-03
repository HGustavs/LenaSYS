
function parseGet(){

    var tmp = [];
    var result=[];
    location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        result [tmp[0]] = decodeURIComponent(tmp[1]);
        // alert(item+" "+tmp[0]+" "+tmp[1]);
    });

    return result;
}

