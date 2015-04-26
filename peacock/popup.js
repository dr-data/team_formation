// localStorage.clear(); // remove all values; todo move to initialization

function initialize_page() {
	var preambula = '<table id="main_table"> \
					  <tr> \
					    <td>#</td> \
					    <td>Player</td> \
					    <td>Pref.1</td> \
					    <td>Pref.2</td> \
					    <td>Pref.3</td> \
					    <td>Skill</td> \
					  </tr> \
					</table> \
					<br> \
					<h1 id="results_h1"></h1> \
					<table id="results_table"> \
					</table>'
	var div = document.createElement('div');
	div.innerHTML = preambula;
	document.getElementById('dynamic').innerHTML = '';
	document.getElementById('dynamic').appendChild(div);
}
initialize_page();
// restore a table
if (localStorage["last_session"] === "true") {
	localStorage["use_storage"] = true;
	try {
		var cells = JSON.parse(localStorage["cells"]);
		var n = cells.length;
		var table = document.getElementById("main_table")
		for (i=0; i<n; i++) {
			var row = create_row();
			var cell = cells[i]
			for (var key in cell) {
				if (cell.hasOwnProperty(key)) {
					var col = parseInt(key);
					var val = cell[key];
					row.cells[col].childNodes[0].value = val;
				}
			}
		}
	} catch	(e) {
		console.log("Catched error");
		console.log(e);
	}
	if (localStorage["results"] === "true") {
		var teams = JSON.parse(localStorage["teams"]);
		show_results(teams);
	}
	localStorage['use_storage'] = false;
}


document.getElementById('initialize').onclick = (function () {
	localStorage.clear();
	initialize_page();
});

function create_row() {
  	localStorage["last_session"] = true;
	var table = document.getElementById("main_table");
	var n = table.rows.length;
	var m = table.rows[0].cells.length;
	var row = table.insertRow(n);
	if (!("use_storage" in localStorage) || (localStorage['use_storage'] === "false")) {
		if (n === 1) {
			localStorage["cells"] = JSON.stringify([{}]);
		}
		else if (n > 1) {
			var cells = JSON.parse(localStorage["cells"]);
			cells.push({});
			localStorage["cells"] = JSON.stringify(cells);
		}
	}

	var cell = row.insertCell(0);
	cell.innerHTML = n;
	for (j=1; j<m; j++) {
		create_cell(n-1, j, row);
	}
	create_minus(n-1, m, row);
	return row
}

function create_minus(i, j, row) {
	var cell = row.insertCell(j);
	cell.innerHTML = '<img class="clickable" src="icons/minus16_24.png" id="mark_row' + i + '">';
	document.getElementById('mark_row' + i).onclick = function () {
		remove_row(row.rowIndex);
		var table = document.getElementById("main_table");
		var n = table.rows.length;
		// change the very first column accordingly
		for (i=1; i<n; i++) {
			table.rows[i].cells[0].innerHTML = i;
		}
	}
}

function create_cell(i, j, row){
	var cell = row.insertCell(j);
	if (j == 1) {
		cell.innerHTML = "<input size=10>";
	}
	else {
		cell.innerHTML = "<input size=4>";
	}
	cell.addEventListener("change", function () {
		var cells = JSON.parse(localStorage["cells"]);
    	cells[i.toString()][j.toString()] = cell.childNodes[0].value;
    	localStorage["cells"] = JSON.stringify(cells);
	})
}

document.getElementById('create_row').onclick = create_row;

function remove_row(i) {
    var table = document.getElementById("main_table")
    if (table.rows.length > 1) {
    	table.deleteRow(i);
    	var cells = JSON.parse(localStorage["cells"]);
    	cells.splice(i-1, 1);
    	localStorage["cells"] = JSON.stringify(cells);
    }
}
// document.getElementById('remove_row').onclick = remove_row;

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

// for random selection
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

// for preferred selection
function show_results2(teams, teams2tasks) {
	document.getElementById("results_h1").innerHTML = "Results:"
	var table = document.getElementById("results_table");
	table.innerHTML = "";
	for (t in teams2tasks) {
		var n = table.rows.length;
		var row = table.insertRow(n);
		var cell = row.insertCell(0)
		cell.innerHTML = teams2tasks[t] + ":";
		for (j=0; j<teams[t].length; j++) {
			var cell = row.insertCell(j+1);
			cell.innerHTML = teams[t][j];
		}
	}
	localStorage["results"] = true;
}

// http://stackoverflow.com/a/14636652/2069858
function test_integer(data) {
	if (typeof data==='number' && (data%1)===0)
		return true;
	return false
}

function calculate_teams() {
	var m = parseInt(document.getElementById("players").value);
	var table = document.getElementById("main_table");
	var names = [];
	var N = 0;
	for (i=0; i<cells.length; i++) {
		if ("1" in cells[i]) {
			names.push(cells[i]["1"]);
			N += 1;
		}
	}
	var T = Math.floor(N/m);
	if (N%m != 0)
		T += 1;
	var teams = new Array(T);
	for (i=0; i<T; i++) {
		teams[i] = [];
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
	localStorage["teams"] = JSON.stringify(teams);
	return teams;
}

function assign_tasks_to_teams(T, tasks) {
	var teams2tasks = {};
	for (i=0; i<T; i++) {
		teams2tasks[i.toString()] = tasks[i%tasks.length] || "Random Team";
	}
	return teams2tasks
}

function calculate_teams2() {
	var p = parseInt(document.getElementById("players").value);
	if (test_integer(p) && p >= 1) {
		m = parseInt(document.getElementById("players").value);
	}
	else {
		alert("Please, insert valid number of people per team");
		return;
	}
	var cells = JSON.parse(localStorage["cells"]);
	var names = [];
	var tasks = [];
	var N = 0;
	// calculate number of tasks
	for (i=0; i<cells.length; i++) {
		if ("1" in cells[i]) {
			names.push(cells[i]["1"]);
			N += 1;
			for (j=2; j<5; j++) {
				col = j.toString();
				if (col in cells[i] && tasks.indexOf(cells[i][col]) === -1) {
					tasks.push(cells[i][col]);
				}
			}
		}
	}
	// if no tasks, apply random algorithm
	if (tasks.length === 0) {
		teams = calculate_teams();
		return teams
	}
	var T = Math.floor(N/m);
	if (N%m != 0)
		T += 1;

	var teams = {};
	for (i=0; i<T; i++) {
		teams[i.toString()] = [];
	}
	var teams2skills = {}
	for (i=0; i<T; i++) {
		teams2skills[i.toString()] = [];
	}
	var teams2tasks = assign_tasks_to_teams(T, tasks);

	// names to skill
	names2skils = {}
	for (i=0; i<cells.length; i++) {
		if ("1" in cells[i]) { // if there is a name 
			names2skils[cells[i]["1"]] = cells[i]["5"];
		}
	}

	// main logic
	// assign players to team
	for (i=0; i<cells.length; i++) {
		if ("1" in cells[i]) { // if there is a name 
			// choose the best team
			var best_team = NaN;
			var best_team_score = -10000;
			for (var t in teams2tasks) {
				if (teams[t].length < m) {
					score = (cells[i]["2"] === teams2tasks[t])*2 + (cells[i]["3"] === teams2tasks[t])*1.5 + (cells[i]["4"] === teams2tasks[t])*1;
					// check is there is another player with the same skill
					if (cells[i]["5"]) {
						for (j=0; j<teams2skills[t].length; j++) {
							if (teams2skills[t][j] === cells[i]["5"]) {
								score -= 2;
								break;
							}
						}
					} 
					// console.log(i, score)
					if (score > best_team_score) {
						best_team_score = score;
						best_team = t;
					}
				}
			}
			teams[best_team].push(cells[i]["1"]);
			teams2skills[best_team].push(cells[i]["5"]);
		}
	}
	show_results2(teams, teams2tasks);
	localStorage["teams"] = JSON.stringify(teams);
	return teams
}
document.getElementById("calculate_teams").onclick = calculate_teams2;

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