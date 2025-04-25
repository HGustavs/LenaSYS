<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status'=>'error','message'=>'Only POST allowed']);
    exit;
}

if (!isset($_POST['cid'])) {
    echo json_encode(['status'=>'error','message'=>'Missing cid']);
    exit;
}
$cid = $_POST['cid'];

try {
    $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("DELETE FROM gitFiles WHERE cid = :cid");
    $query->bindParam(':cid', $cid);
    if (!$query->execute()) {
        $e = $query->errorInfo();
        throw new Exception($e[2] ?? 'Unknown error');
    }
} catch (Exception $ex) {
    echo json_encode(['status'=>'error','message'=>$ex->getMessage()]);
    exit;
}

echo json_encode([
    'status'  => 'success',
    'message' => "Cleared gitFiles for cid {$cid}"
]);
exit;