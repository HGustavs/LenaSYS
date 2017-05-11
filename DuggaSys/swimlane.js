var querystring = parseGet();
var swimlaneInformation;

function swimlaneSetup() {
  console.log("swimlaneSetup");
  AJAXService("GET", { cid : querystring['courseid'],vers : querystring['coursevers'] }, "SWIMLANE");
}

function swimlaneProcess() {
  console.log("swimlaneProcess");
}

function swimlaneDrawLanes() {
  console.log("swimlaneDrawLanes");
}

function returnedSwimlane(swimlaneData) {
	swimlaneInformation = swimlaneData;
  console.log(swimlaneInformation);
	swimlaneDrawLanes();
	swimlaneProcess();
}