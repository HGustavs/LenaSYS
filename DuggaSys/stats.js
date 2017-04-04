/**
 * Created by a15andau on 2017-04-04.
 */

/********************************************************************************

 Globals

 *********************************************************************************/
var sessionkind=0;
var querystring=parseGet();
var filez;
var duggaPages;

AJAXService("GET",{cid:querystring['cid'],coursevers:querystring['coursevers']},"STATS");

$(function() {
    $("#release").datepicker({
        dateFormat: "yy-mm-dd",
        minDate: 0,
        onSelect: function(date){
            var newDate = $('#release').datepicker('getDate');
            $('#deadline').datepicker("option","minDate", newDate);

        }
    });
    $('#deadline').datepicker({
        dateFormat: "yy-mm-dd"
    });
});

function returnedAnalysis(data){

}