<html>
<head>
<?php
			date_default_timezone_set("Europe/Stockholm");
			
			// Include basic application services!
			include_once "../Shared/basic.php";
			include_once "../Shared/sessions.php";
			
			session_start();

			// Connect to database and start session
			pdoConnect();
			
			$cid=getOP('cid');
			$vers=getOP('coursevers');
			$kind=getOP('kind');
			$link=getOP('link');
			$selectedfile=getOP('selectedfile');

			$error=false;
					
			if(isset($_SESSION['uid'])){
					$userid=$_SESSION['uid'];
			}else{
					$userid="UNK";		
			} 	
			$ha = (checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid)));
			
			echo "<pre>";
			if($ha){					
					// Handle files! One by one  -- if all is ok add file name to fieldarray
			 		$storefile=false;
					// Start at the "root-level"
					chdir('../');
			 		$currcvd=getcwd();
			 		if($kind=="LINK"&&$link!="UNK"){
			 				// Store Link
			 				echo "STORING LINK!";

							$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND UPPER(filename)=UPPER(:filename);" ); 
							$query->bindParam(':filename', $link);
							$query->bindParam(':cid', $cid);
							$query->execute(); 
							$norows = $query->fetchColumn(); 

							if($norows==0){
									$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid) VALUES(:linkval,'1',:cid);");
									$query->bindParam(':cid', $cid);
									$query->bindParam(':linkval', $link);
							
									if(!$query->execute()) {
										$error=$query->errorInfo();
										echo "Error updating entries".$error[2];
									}			 				
							}
			 		}else if($kind=="GFILE"){
							if(!file_exists ("/templates/".$_FILES['name'])){
									
										$storefile=mkdir($currcvd."/templates/".$_FILES['name']);
									
									$storefile=true;
							}else{
									$storefile=true;							
							}
							// Check if added file name exists.
							if($selectedfile!="UNK"){
									if(file_exists ($currcvd."/templates/".$_FILES['name'])){
											$storefile=true;
									}else{
											$storefile=false;									
									}
							}
			 		}else if($kind=="LFILE"||$kind=="MFILE"){
							if(!file_exists ($currcvd."/courses/".$cid)){
									$storefile=mkdir($currcvd."/courses/".$cid);
							}else{
									$storefile=true;
							}
							if($kind=="LFILE"){
									if(!file_exists ($currcvd."/courses/".$cid)){
											$storefile=mkdir($currcvd."/courses/".$cid);
									}else{
											$storefile=true;
									}
							}
							if($kind=="MFILE"){
									// Check if added file name exists.
									if($selectedfile!="UNK"){
											if(!file_exists ($currcvd."/courses/".$cid)){
													$storefile=mkdir($currcvd."/courses/".$cid);
											}else{
													$storefile=true;									
											}
									}							
							}
			 		}	
			 		
			 		
			 		if($storefile){
							// Check if upload folder exists if not, create!
							
							$allowedT = array("application/pdf", "image/gif", "image/jpeg", "image/jpg","image/png","image/x-png","application/x-rar-compressed","application/zip","text/html");
							$allowedX = array("pdf","gif", "jpeg", "jpg", "png","zip","rar","html");
					
							foreach ($_FILES as $key => $filea){
									
									if($selectedfile!="NONE"&&($kind=="GFILE"||$kind=="MFILE")){
											// Store link to existing file
											if($kind=="GFILE"){
													$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND UPPER(filename)=UPPER(:filename) AND KIND=2;" );
											}else if($kind=="MFILE"){
													$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND UPPER(filename)=UPPER(:filename) AND KIND=3;" );
											}
											
											$query->bindParam(':filename', $selectedfile);
											$query->bindParam(':cid', $cid);
											$query->execute(); 
											$norows = $query->fetchColumn(); 
											
											echo $norows;
											
										if($norows==0&&($kind=="GFILE"||$kind=="MFILE")){
													if($kind=="GFILE"){
															$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,isGlobal) VALUES(:linkval,'2',:cid,'1');");
													}else if($kind=="MFILE"){
															$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid) VALUES(:linkval,'3',:cid);");
													}

													$query->bindParam(':cid', $cid);
													$query->bindParam(':linkval', $selectedfile);
											
													if(!$query->execute()) {
														$error=$query->errorInfo();
														echo "Error updating file entries".$error[2];
													}			 				
											}
								
									}
											if($filea["name"]!=""){
												
													$temp = explode(".", $filea["name"]);
													$extension = end($temp);
									
													if(in_array($extension, $allowedX)&&in_array($filea['type'], $allowedT)){
									
															$fname=$filea['name'];
				
															// Remove white space and non ascii characters
															$fname=preg_replace('/[[:^print:]]/', '', $fname);
															$fname = preg_replace('/\s+/', '', $fname);
				
															if($kind=="LFILE"){
																	$movname=$currcvd."/courses/".$cid."/".$fname;											
															}else if($kind=="MFILE"){
																	$movname=$currcvd."/courses/".$cid."/".$fname;;											
															}else{
																	$movname=$currcvd."/templates/".$fname;											
															}
				
															if(move_uploaded_file($filea["tmp_name"],$movname)){
																	// 1=Link 2=Global 3=Course Global 4=Local
																	if($kind=="LFILE"){
																			$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=4;" );
																	}else if($kind=="MFILE"){
																			$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=3;" );
																	}else{					
																			$query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=2;" );
																		
																	}
																	
																	$query->bindParam(':filename', $fname);
																	$query->bindParam(':cid', $cid);
																	$query->execute(); 
																	$norows = $query->fetchColumn(); 
																	
																	if($norows==0){
																			if($kind=="LFILE"){
																					$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid) VALUES(:linkval,'4',:cid);");
																			}else if($kind=="MFILE"){
																					$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid) VALUES(:linkval,'3',:cid);");
																			}else if($kind=="GFILE"){
																					$query = $pdo->prepare("INSERT INTO fileLink(filename,kind,cid,isGlobal) VALUES(:linkval,'2',:cid,'1');");
																			}
				
																			$query->bindParam(':cid', $cid);
																			$query->bindParam(':linkval', $fname);
																	
																			if(!$query->execute()) {
																				$error=$query->errorInfo();
																				echo "Error updating file entries".$error[2];
																			}			 				
																	}
															}else{
																	echo "Error moving file ".$movname;
																	$error=true;
															}
				
													}else{
														if(!in_array($extension, $allowedX)) echo "Extension ".$extension." not allowed.\n";
														if(!in_array($filea['type'], $allowedT)) echo "Type ".$filea['type']." not allowed.\n";
														$error=true;
													}
											}
																
							}			
			 		}else{
			 				echo "No Store File\n";
			 				$error=true;
			 		}
					
			}
	
			if(!$error){
					echo "<meta http-equiv='refresh' content='0;URL=fileed.php?cid=".$cid."&coursevers=".$vers."' />"; 
			}

?>
</head>
<body>
<?php
				echo "<script>window.location.replace('fileed.php?cid=".$cid."&coursevers=".$vers."');</script>";
?>
</body>
</html>
