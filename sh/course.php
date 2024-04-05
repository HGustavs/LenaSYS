<?php 

class Course{

	private $cid;
	private $coursename;
	private $courseserver;
	private $coursecode;

	public function __construct($cid, $coursename, $coursecode, $courseserver){
		$this->cid = $cid;
		$this->coursename = $coursename;
		$this->coursecode = $coursecode;
		$this->courseserver = $courseserver;
	}    
	public function getCid(){
		return $this->cid;
	}
	public function getCoursename(){
		return $this->coursename;
	}
	public function getCourseserver(){
		return $this->courseserver;
	}
	public function getCoursecode(){
		return $this->cid;
	}
	public function test(){
		echo $this->cid."|";
		echo $this->coursename."|";
		echo $this->courseserver."|";
		echo $this->coursecode."|<br>";
	}

}
?>