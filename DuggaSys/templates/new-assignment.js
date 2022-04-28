function striketxt(a,b){
	if(document.getElementById(a).className=="unchecked"){
		document.getElementById(a).classList.remove("unchecked");
		document.getElementById(b).className="stroked";
	}else{
		document.getElementById(b).classList.remove("stroked");
		document.getElementById(a).className="unchecked";
	}
}