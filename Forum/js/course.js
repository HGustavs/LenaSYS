function getThreads(courseID)
{
	console.log(courseID);
	var course = courseID;
	
	AJAXService("collectThreads",{cid:querystring['cid'],newusers:newusers},"ACCESS");
}