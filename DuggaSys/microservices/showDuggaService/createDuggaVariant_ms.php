<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

//Get the necessary parameters from the request
$qid = getOP('qid');
$uid = getOP('uid');
$disabled = getOP('disabled');
$param = getOP('param');
$variantanswer = getOP('variananswer');


// - quizID
// - creator
// - disabled
// - param 
// - variantanswer

// INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES (:qid,:uid,:disabled,:param,:variantanswer)


### createDuggaVariant
// Uses service __insertIntoTablVariant__ to makes _inserts_ into the table __Variant__.




//////////////////////////////////////////
### loadDugga
// Get information based on __hash__.
// Uses service __selectFromTableUserAnswer__ to _get_ information it requires from __userAnswer__ and __variant__.
// <br>

// If _hash_ did not work, retrive all answeres for that __moment__. 
// Uses service __selectFromUserAnswer__ to _get_ information it requires from __userAnswer__ and __variant__.

// - hash: vid,variant.variantanswer __AS__ variantanswer,useranswer,param,cid,vers,quiz 
// ```sql
// SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash
// ```
// - moment: vid,variant.variantanswer __AS__ variantanswer,useranswer,param,cid,vers,quiz 
// ```sql
// SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE moment=:moment
// ```
?>