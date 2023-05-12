<?

$dirname = "..&#47;courses&#47;1895&#47;Github&#47;Demo&#47;Code-example1&#47";
$query = $pdo->prepare("SELECT COUNT(*) FROM codeexample WHERE cid=:cid AND examplename=:examplename;");
					$query->bindParam(":cid", $courseid);
					$query->bindParam(":examplename",$dirname); // $parts[count($parts)-1]
					$query->exectue();

					$result = $query->fetch(PDO::FETCH_OBJ);
					$counted = $result->counted;
                    echo "<script> console.log('TESTING'.$counted.'');</script>";

?>