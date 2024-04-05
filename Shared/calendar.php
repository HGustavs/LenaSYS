<?php
    // Start session
    session_start();
    
    // Include basic application services!
    include_once "../Shared/sessions.php";
    include_once "../Shared/basic.php";

    // Connect to database
    pdoConnect();

	$courseid = getOPG('courseid');
	$coursevers = getOPG('coursevers');

    $query = $pdo->prepare("SELECT lid, entryname, visible, deadline, qrelease FROM listentries LEFT OUTER JOIN quiz ON listentries.link = quiz.id WHERE deadline IS NOT NULL AND kind = 3 AND visible = 1 AND listentries.cid = :cid AND listentries.vers = :coursevers ORDER BY pos");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':coursevers', $coursevers);
	
    if(!$query->execute()) {
        echo "There was an error trying to gernerate a calendar for you. Please try again.";
    } else if($query->rowCount() < 1) {
		echo "The course you want to generate a calendar for does not have any duggas with deadlines.";
    } else {
        $icalBody = "";
        $rows = $query->fetchAll(PDO::FETCH_ASSOC);
        foreach($rows as $row) {
            // Format the timestamp to a ical format
            $deadline = DateTime::createFromFormat("Y-m-d H:i:s", $row['deadline'])->format('Ymd\THis\Z');
            $qrelease = DateTime::createFromFormat("Y-m-d H:i:s", $row['qrelease'])->format('Ymd\THis\Z');
            
            // Print out the calendar event
            $event =  "BEGIN:VEVENT".PHP_EOL;
            $event .= "DTSTAMP:".$qrelease.PHP_EOL;
            $event .= "UID:".$row['lid']."-".$courseid."-".$coursevers."@lenasys".PHP_EOL;
            $event .= "DTSTART:".$deadline.PHP_EOL;
            $event .= "DTEND:".$deadline.PHP_EOL;
            $event .= "STATUS:CONFIRMED".PHP_EOL;
            $event .= "CATEGORIES:LENASYSDEADLINE".PHP_EOL;
            $event .= "SUMMARY:Deadline ".$row['entryname'].PHP_EOL;
            $event .= "DESCRIPTION:Deadline for ".$row['entryname'].PHP_EOL;
            $event .= "LAST-MODIFIED:".$qrelease.PHP_EOL;
            $event .= "END:VEVENT";
        
            $icalBody = $icalBody . PHP_EOL . $event;
        }

        $icalHeader = "BEGIN:VCALENDAR".PHP_EOL;
        $icalHeader .= "VERSION:2.0".PHP_EOL;
        $icalHeader .= "PRODID:-//LenaSYS///NONSGML v1.0//EN";     
		$icalEnd = PHP_EOL."END:VCALENDAR";
        
        // Set the correct content-type-header for the file to be downloaded successfully
		header('Content-type: text/calendar; charset=utf-8');
		header('Content-Disposition: inline; filename=lenasys-'.$courseid.'-'.$coursevers.'-calendar.ics');
		
        // Print the ical contents
        echo $icalHeader.$icalBody.$icalEnd;
    }