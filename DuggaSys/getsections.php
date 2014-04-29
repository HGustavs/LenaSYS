<?php
include_once "../../coursesyspw.php";
include_once "../Shared/database.php";

dbConnect();

$pos = 3;
// Locate all the sections in the listentries table
$r = mysql_query("SELECT pos FROM listentries WHERE kind=1 ORDER BY pos");

if($r && mysql_num_rows($r) > 0) {
	$positions = array();

	// Fetch all positions for sections
	while(($position = mysql_fetch_array($r, MYSQL_NUM)) != null) {
		array_push($positions, $position[0]);
	}

	// add the current position into the array and sort
	array_push($positions, $pos);
	sort($positions, SORT_NUMERIC);

	$offset = array_search($pos, $positions);

	// Remember to check offsets and set the previous and next section
	// position.
	if($offset-1 > 0) {
		$previuous = $positions[$offset-1];
	} else {
		$previuous = 0;
	}
	if($offset+1 < count($positions)) {
		$next = $positions[$offset+1];
	} else {
		$next = false;
	}
} else {
	die("Something went horribly wrong." . mysql_error());
}

// SELECT code_id FROM listentries WHERE code_id IS NOT NULL pos < 5 AND pos > 1
$prev_ex = mysql_query(
	sprintf("SELECT code_id FROM listentries WHERE code_id IS NOT NULL and pos < %d AND pos > %d",
		mysql_real_escape_string($pos),
		mysql_real_escape_string($previuous)
	)
);

$nextquery = sprintf("SELECT code_id FROM listentries WHERE code_id IS NOT NULL and pos > %d",
	mysql_real_escape_string($pos)
);

if($next !== false) {
	$nextquery .= sprintf(" AND pos < %d", mysql_real_escape_string($next));
}

$next_ex = mysql_query($nextquery);


// Fetch examples before
$backward_examples = array();
while(($example = mysql_fetch_array($prev_ex, MYSQL_NUM)) != null) {
	array_push($backward_examples, $example[0]);
}

// Fetch examples after
$forward_examples = array();
while(($example = mysql_fetch_array($next_ex, MYSQL_NUM)) != null) {
	array_push($forward_examples, $example[0]);
}

print_r($backward_examples);
print_r($forward_examples);
?>
