function create_row() {
    var table = document.getElementById("main_table");
    var n = table.rows.length;
    var m = table.rows[0].cells.length;
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    cell.innerHTML = n;
    var cell = row.insertCell(1);
    cell.innerHTML = "<input size=10>";
    for (i=2; i<m; i++) {
	    var cell = row.insertCell(i);
	    cell.innerHTML = "<input size=4>";
    }
    console.log(document.body.innerHTML);
}
document.getElementById('create_row').onclick = create_row;

function remove_row() {
    document.getElementById("main_table").deleteRow(-1);
}
document.getElementById('remove_row').onclick = remove_row;

// solution found here
// http://stackoverflow.com/a/18120786/2069858
function remove_element(el) {
	Element.prototype.remove = function() {
	    this.parentElement.removeChild(this);
	}
	NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	    for(var i = 0, len = this.length; i < len; i++) {
	        if(this[i] && this[i].parentElement) {
	            this[i].parentElement.removeChild(this[i]);
	        }
	    }
	}
	el.remove();
}

function show_results(teams) {
	document.getElementById("results_h1").innerHTML = "Results:"
	var table = document.getElementById("results_table");
	table.innerHTML = "";
	for (i=0; i<teams.length; i++) {
		var n = table.rows.length;
		var row = table.insertRow(n);
		var cell = row.insertCell(0)
		cell.innerHTML = i.toString();
		var team = teams[i];
		for (j=0; j<team.length; j++) {
			var cell = row.insertCell(j+1);
			cell.innerHTML = team[j];
		}
	}
	localStorage["results"] = true;
}

function calculate_teams() {
	var m = parseInt(document.getElementById("players").value);
	var table = document.getElementById("main_table");
	var N = table.rows.length - 1;
	var T = Math.floor(N/m);
	if (N%m != 0)
		T += 1;
	// console.log(N, m, T);
	var teams = new Array(T);
	for (i=0; i<T; i++) {
		teams[i] = [];
	}
	var names = [];
	for (i=1; i<table.rows.length; i++) {
		names.push(table.rows[i].cells[1].childNodes[0].value);
	}
	names = shuffle(names);
	var count = 0;
	var team_number;
	for (i=0; i<names.length; i++) {
		team_number = count%T;
		teams[team_number].push(names[i]);
		count += 1;
	}
	show_results(teams);
	return teams;
}
document.getElementById("calculate_teams").onclick = calculate_teams;

// shuffle array 
// found here: http://stackoverflow.com/a/2450976/2069858
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}