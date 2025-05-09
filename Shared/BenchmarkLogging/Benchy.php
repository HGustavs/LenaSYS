<?php

// FPS Benchmarking Tool with User Agent Logging

// Version 1.0
// 		Basic Insert Only
// Version 2.0
// 		User Agent Parsing (mostly working for Windows Android Linux OSX Meego Maemo SunOS including versions in most)
//		Host Lookup
//
//    Testing is necessary to confirm that it works for more operating systems / browsers etc

		function versi($string,$sep,$adder)
		{
				$starts=strpos($string,$sep);
				return substr($string,$starts+$adder);
		}

		$UserID=substr($_POST['User'],0,20);
		$App=substr($_POST['App'],0,20);
		$Fps=$_POST['Fps'];
		$MaxFps=$_POST['MaxFps'];
		$Runtime=$_POST['RunTime'];
		$IP=$_SERVER['REMOTE_ADDR'];
		$UserAgent=substr($_SERVER['HTTP_USER_AGENT'],0,1020);

		$workstr=$UserAgent;
		
		$starts=strpos($workstr,"(");
		$ends=strpos($workstr,")");
		$ustr=substr($workstr,$starts+1,$ends-$starts-1);
		
		$host=gethostbyaddr($IP);
		
		$splitagent=explode(";",$ustr);
		
		$lstr=substr($workstr,$ends+2);
		$splitbrows=explode(" ",$lstr);
		
		$os="";
		$osvers="";
		
		foreach($splitagent as $sst){
				if(strpos($sst,"Mac OS X")!==false){
						$os="Mac OS X";
						$osvers=versi($sst,"Mac OS X",9);
						$osvers=str_replace("_",".",$osvers);
				}
				if(strpos($sst,"Windows NT")!==false){
						$os="Windows";
						$osvers=versi($sst,"Windows NT",11);
				}
				if(strpos($sst,"SunOS")!==false){
						$os="Solaris";
						$osvers=versi($sst,"SunOS",6);
				}
				if(strpos($sst,"Android")!==false){
						$os="Android";
						$osvers=versi($sst,"Android",7);
				}
				if(strpos($sst,"MeeGo")!==false){
						$os="MeeGo";
				}
				if(strpos($sst,"Maemo")!==false){
						$os="Maemo";
				}
				if(strpos($sst,"Ubuntu")!==false){
						$os="Ubuntu";
				}
		}
		
		if(strcmp($os,"")==0){
			foreach($splitagent as $sst){
					if(strpos($sst,"Linux")!==false){
							$os="Linux";
							$osvers=versi($sst,"Linux",5);
					}
			}
		}
		
		if(strcmp($os,"")!=0){
		}else{
				echo "<tr>";
				echo "<td>UNKNOWN OS</td>";	
				foreach($splitagent as $sst){
						echo "<td>".$sst."</td>";	
				}
				echo "</tr>";	
		}
		
		$browser="";
		$bversion="";
		
		foreach($splitagent as $sst){
				if(strpos($sst,"MSIE")!==false){
						$browser="Internet Explorer";
						$bversion=substr($sst,6);
				}
		}
		
		foreach($splitbrows as $sst){
				if(strpos($sst,"Chrome/")!==false){
						$browser="Chrome";
						$bversion=versi($sst,"/",1);
				}
				if(strpos($sst,"Safari/")!==false){
						if(strcmp($browser,"Chrome")!=0){
								$browser="Safari";
								$bversion=versi($sst,"/",1);
						}
				}		
				if(strpos($sst,"Firefox/")!==false){
						$browser="Firefox";
						$bversion=versi($sst,"/",1);
				}
				if(strpos($sst,"Version/")!==false){
						$browser="Opera";
						$bversion=versi($sst,"/",1);
				}
		}
		
		if(strcmp($browser,"")!=0){
		}else{
				echo "<tr>";
				echo "<td>UNKNOWN BROWSER</td>";	
				foreach($splitbrows as $sst){
						echo "<td>".$sst."</td>";	
				}
				echo "</tr>";	
		}
		
		$renderer="";
		$rversion="";
		
		foreach($splitagent as $sst){
				if(strpos($sst,"Trident/")!==false){
						$renderer="Trident";
						$rversion=versi($sst,"/",1);
				}
		}
		
		foreach($splitbrows as $sst){
				if(strpos($sst,"Gecko/")!==false){
						$renderer="Gecko";
						$rversion=versi($sst,"/",1);
				}
				if(strpos($sst,"Presto/")!==false){
						$renderer="Presto";
						$rversion=versi($sst,"/",1);
				}		
				if(strpos($sst,"AppleWebKit/")!==false){
						$renderer="WebKit";
						$rversion=versi($sst,"/",1);
				}
		}			
		
		if(strcmp($renderer,"")!=0){
		}else{
				echo "<tr>";
				echo "<td>UNKNOWN RENDERER</td>";	
				foreach($splitbrows as $sst){
						echo "<td>".$sst."</td>";	
				}
				echo "</tr>";	
		}

		$pdo = new PDO('mysql:dbname=benchy;host=localhost', 'dbsk', 'Tomten2009');

		$sql = 'INSERT INTO benchmark(userid,app,fps,maxfps,runtime,ip,useragent,ts,os,osversion,renderer,rversion,browser,bversion,host) VALUES(:userid,:app,:fps,:maxfps,:runtime,:ip,:useragent,NOW(),:os,:osversion,:renderer,:rversion,:browser,:bversion,:host);';

		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(':userid', $UserID);
		$stmt->bindParam(':app', $App);
		$stmt->bindParam(':fps', $Fps);
		$stmt->bindParam(':maxfps', $MaxFps);
		$stmt->bindParam(':runtime', $Runtime);
		$stmt->bindParam(':ip', $IP);
		$stmt->bindParam(':useragent', $UserAgent);
		$stmt->bindParam(':os', $os);
		$stmt->bindParam(':osversion', $osvers);
		$stmt->bindParam(':browser', $browser);
		$stmt->bindParam(':bversion', $bversion);
		$stmt->bindParam(':renderer', $renderer);
		$stmt->bindParam(':rversion', $rversion);
		$stmt->bindParam(':host', $host);

		try{ 
				$stmt->execute();		   				   
		}catch (PDOException $e){
				echo $e->getMessage();
		}

?>
