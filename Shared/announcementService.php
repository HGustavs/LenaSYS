<?php
include_once ("../Shared/database.php");
pdoConnect();

session_start();

$courseid = $_SESSION["courseid"];
$coursevers = $_SESSION["coursevers"];
$coursename = $_SESSION["coursename"];
$title = $_POST['title'];
$message = $_POST['announcementMsg'];

$query = $pdo->prepare("INSERT INTO announcement(courseid, courseversion, coursename, title, message) VALUES (:courseid,:courseversion, :coursename, :title, :message);");

$query->bindParam(':courseid', $courseid);
$query->bindParam(':courseversion', $coursevers);
$query->bindParam(':coursename', $coursename);
$query->bindParam(':title', $title);
$query->bindParam(':message', $message);

$query->execute(); 

header("Location: ../DuggaSys/sectioned.php?courseid=".$_SESSION['courseid']."&coursename=".$_SESSION['coursename']."&coursevers=".$_SESSION['coursevers']."");

?>