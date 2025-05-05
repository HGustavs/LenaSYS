<?php
header('Content-Type: application/json');

$debug = $_POST['debug'] ?? '';
$success = $_POST['success'] ?? false;
$status = $_POST['status'] ?? '';

$response = array(
  "debug" => $debug,
  "success" => $success,
  "status" => $status
);

echo json_encode($response);
