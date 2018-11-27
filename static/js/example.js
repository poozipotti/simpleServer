$(document).ready(function(){
	getExampleNumber();
    $("#exampleButton").click(()=>{postExample()});
});


function postExample(){
	console.log("posting example");
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log('posted new example')
	    	getExampleNumber();
	    }else{
	    	console.log(this.status);
	    }
	};
	xhttp.open("Post", "http://localhost:4000/examples", true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	//just to give examples a random id
	xhttp.send(JSON.stringify({"id":Math.floor(Math.random()*100000000000)}));
}

function getExampleNumber(){
	console.log("retreiving example");
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	console.log(this.responseText);
	    	setExampleText(this.responseText);
	    }else{
	    	console.log("error getting a example number");
	    	setExampleText('[]');
	    }
	};
	xhttp.open("GET", "http://localhost:4000/examples", true);
	xhttp.send();
}

async function setExampleText(data){
	console.log('parsing data' + data);
	if(data){
		data = JSON.parse(data);
		$("#numberOfExamples").text(data.length);
	}else{
		$("#numberOfExamples").text('ERROR');
	}

}