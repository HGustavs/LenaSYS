<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../Shared/basic.php";

$course = end(explode("/", $_SERVER['REQUEST_URI']));

switch($course) {
	case Databaskonstruktion:
	case DBK: 
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
		exit();
	case ExamensarbeteWebbprogrammering:
	case EWP:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=4&coursevers=82452");
		exit();
	case ProjektSoftwareEngineering:
	case PSE:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=17&coursename=Projekt%20i%20software%20engineering&coursevers=92641");
		exit();
	case Shaderprogrammering:
	case SP:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=16&coursename=Shaderprogrammering&coursevers=92622");
		exit();
	case Webbprogrammering: 
	case WP:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=7&coursename=Webbprogrammering&coursevers=2020lp5");
		exit();
	case WebbutvecklingContentManagement:
	case WCM:
	case ContentManagement:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=5&coursename=Webbutveckling%20-%20content%20management%20och%20drift&coursevers=84261");
		exit();
	case WebbutvecklingDatorgrafik:
	case WD:
	case Datorgrafik:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=3&coursename=Webbutveckling%20-%20datorgrafik%20&coursevers=81508");
		exit();
	case WebbutvecklingForskningOchUtveckling:
	case WFU:
	case ForskningOchUtveckling:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=8&coursename=Webbutveckling%20-%20Forskning%20och%20Utveckling&coursevers=2020lp5");
		exit();
	case WebbutvecklingMobilapplikationsdesign:
	case WMAD:
	case Mobilapplikationsdesign:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=1&coursename=Webbutveckling%20-%20Programmering%20av%20mobila%20applikationer&coursevers=92642");
		exit();
	case WebbutvecklingProgrammeringAvMobilaApplikationer:
	case WPM:
	case ProgrammeringAvMobilaApplikationer:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=1&coursename=Webbutveckling%20-%20Programmering%20av%20mobila%20applikationer&coursevers=92642");
		exit();
	case WebbutvecklingWebbplatsdesign:
	case WW:
	case Webbplatsdesign:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=14&coursename=Webbutveckling%20-%20Webbplatsdesign&coursevers=91428");
		exit();
	case XMLAPI:
	case XML:
		header("Location: https://dugga.iit.his.se/DuggaSys/sectioned.php?courseid=13&coursename=XML%20API&coursevers=2021lp2");
		exit();
}

echo "404 Course/Assignment does not exist!";
