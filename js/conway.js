function $$(expr) { return document.querySelector(expr); }

function hasClass(ele,cls) {
	if(ele && ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'))) return true;
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}

function buildGrid(cols, rows) {

	var tableMarkup = "";

	for (x = 0; x < rows; x++) {
		tableMarkup += "<tr>";
		for (y = 0; y < cols; y++) {
			tableMarkup += "<td data-x='"+x+"' data-y='"+y+"'></td>";
		}
		tableMarkup += "</tr>";	
	}

	$("table").html(tableMarkup)
};

/*
A B C 
D x F
G H I
*/
function checkCase(x,y,alive,dead){
	var array = [hasClass($$("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']"), "living"),
			hasClass($$("[data-x='"+(x-1)+"'][data-y='"+(y)+"']"), "living"),
			hasClass($$("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']"), "living"),
			hasClass($$("[data-x='"+(x)+"'][data-y='"+(y-1)+"']"), "living"),
			hasClass($$("[data-x='"+(x)+"'][data-y='"+(y+1)+"']"), "living"),
			hasClass($$("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']"), "living"),
			hasClass($$("[data-x='"+(x+1)+"'][data-y='"+(y)+"']"), "living"),
			hasClass($$("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']"), "living")
		],
		result = countLiving(array);

 	if (result === 3){ 
 		alive.push(x,y);
 	} else if (result !== 2 && hasClass($$("[data-x='"+(x)+"'][data-y='"+(y)+"']"), "living")){
 		dead.push(x,y);
 	}; 
}

function countLiving(array){
	var count = 0;

	for (i=0; i<array.length; i=i+1){
		if (array[i] === true) count = count + 1;
	}
	return count;
}

function setAlive(array){
	for (i=0; i<array.length; i=i+2){
		addClass($$("[data-x='"+(array[i])+"'][data-y='"+(array[i+1])+"']"), "living");
	}
}

function setDead(array){
	for (i=0; i<array.length; i=i+2){
		removeClass($$("[data-x='"+(array[i])+"'][data-y='"+(array[i+1])+"']"), "living");
	}
}

function start(){
	window.timer = setInterval("doIt()", 5);
}

function stop(){
	clearTimeout(window.timer);
}

function reset(){
	$("td").removeClass("living");
	$("#generations").html(0);
}

function doIt(){
	var alive = [],
		dead = [];
	$("table").find("td").each(function(){
		checkCase($(this).data("x"), $(this).data("y"), alive, dead);
	});
	setAlive(alive);
	setDead(dead);
	//console.log(alive);
	//console.log(dead);
	//console.log(parseInt($("#generations").html()) + 1);

	if (alive.length === 0 && dead.length === 0){
		clearTimeout(window.timer);
	} else {
		$("#generations").html(parseInt($("#generations").html()) + 1);
	}
}

$(function() {
	
	// Variable Setup
	var cols = 30,
	    rows = 30,
	    mouseDownState;
	 
	// Inital Build of Table  
	buildGrid(cols, rows);
	
	// Drawing functionality
	$("table").delegate("td", "mousedown", function() {
    	$(this).toggleClass("living");
    	mouseDownState = true;
	}).delegate("td", "mouseenter", function() {
		if (mouseDownState) {
			$(this).toggleClass("living");
		}
	});
	$("html").bind("mouseup", function() {
		mouseDownState = false;
	});
});