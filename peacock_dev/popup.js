// localStorage.clear(); // remove all values; todo move to initialization

// check if the handsontable data object (row) is empty
function isDataInRow(obj) {
	if (obj["id"]) {
		// console.log('returning true')
		return true
	}
	// console.log('returning false')
	return false
	// for (key in obj) {
	// 	if (key === "pref") {
	// 		for (pref in obj[key]) {
	// 			if (obj[key][pref]) {
	// 				return true
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		if (obj[key]) 
	// 			return true
	// 	}
	// }
	// return false
}

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

// http://stackoverflow.com/a/14636652/2069858
function test_integer(data) {
	if (typeof data==='number' && (data%1)===0)
		return true;
	return false
}

// http://stackoverflow.com/a/19892144/2069858
function same_el_arr(n, el) {
	return Array.apply(null, new Array(n)).map(function(){return el})
}

// -------------------------------------------------------------- //

function create_preambula() {
	// create an html for results
	var preambula = '<br> \
					<h1 id="results_h1"></h1> \
					<table id="results_table"> \
					</table>'
	var div = document.createElement('div');
	div.innerHTML = preambula;
	document.getElementById('dynamic').innerHTML = '';
	document.getElementById('dynamic').appendChild(div);
}

function create_table() {
	// create initial table
	var container = document.getElementById('table');
	var hot;
	hot = new Handsontable(container, {
		data: [],
		dataSchema: {id: null, pref: {first: null, sec: null, third: null}, skill: null},
		// startRows: 5,
		startCols: 4,
		colHeaders: ["Player", "Pref. 1", "Pref. 2", "Pref. 3", "Skill"],
		columns: [
		  {data: 'id'},
		  {data: 'pref.first'},
		  {data: 'pref.sec'},
		  {data: 'pref.third'},
		  {data: 'skill'}
		],
		rowHeaders: true,
		minSpareRows: 8,
		manualColumnResize: true,
		colWidths: [90, 60, 60, 60, 100],
		connect: "lower",
		afterChange: function (change, source) {
			// restore table after reload of a page
			if (source === "loadData") {
				// load data from local storage
				if (localStorage['data']) {
					var data = JSON.parse(localStorage['data'])
		    		var dataByFilled = data.filter(isDataInRow);
		    		this.loadData(dataByFilled);
		    		this.render();
		    		return
				}
				
			}
			else {
				// save all data to local storge if the edit happends
				localStorage['data'] = JSON.stringify(this.getData());

				return
			}
		}
	});

	return hot
}

function number_of_players() {
	var p = parseInt(document.getElementById("slider-players").innerHTML);
	if (test_integer(p) && p >= 1) {
		return p
	}
	else {
		alert("Please, insert valid number of people per team");
		return;
	}
}

function create_headers(p) {
	col_headers = ['Team']
	for (i=0;i<p;i++) {
		col_headers.push('Player ' + (i+1).toString())
	}
	return col_headers
}

function create_results_table() {
	var p = number_of_players();
	var col_headers = create_headers(p);
	
	var container = document.getElementById('results');
	var hot;
	hot = new Handsontable(container, {
		data: [same_el_arr(p+1, '')], // create an empty row
		colHeaders: col_headers,
		rowHeaders: true,
		minSpareRows: 1,
		afterChange: function (change, source) {
			// restore table after reload of a page
			if (source === "loadData") {
				// load data from local storage
				console.log(localStorage['results'])
				if (localStorage['results']) {
					var data = JSON.parse(localStorage['results']);
					if (!data[0][0])
						data = [same_el_arr(p+1, '')]
		    		// if (data.length === 0) // in case we removed everything from results table
		    		// 	data = [same_el_arr(p+1, '')]
		    		this.loadData(data);
		    		this.render();
		    		return
				}
				
			}
			else {
				// save all data to local storge if the edit happends
				localStorage['results'] = JSON.stringify(this.getData());
				return
			}
		}
	});
	return hot
}

function load_results(table, results) {
	var n_cols = table.countCols();
	for (i=0; i<results.length; i++) {
		for (j=0; j<results[i].length; j++) {
			if (j < n_cols)
				table.setDataAtCell(i,j,results[i][j]);
		}
	}
}
// make a vertical slider 
function create_slider() {
	var start = Math.floor(localStorage['tooltip-players']) || 2;
	$('#slider-range').noUiSlider({
		start: [ start ],
		step: 1,
		connect: "lower",
		orientation: "vertical",
		range: {
			'min': [ 1 ],
			'max': [ 10 ]
		}
	});
}
// make a tip near slider with the value of slider
function create_tooltip() {
	$('#slider-range').Link('lower').to('-inline-<div class="tooltip"></div>', function (value) {
		$(this).html(
			'<strong>  Players:  </strong>' + 
			'<span id="slider-players">' + Math.floor(value) + '</span>'
		);
	});
}
// change results table when slider is changed
function onSlide(hot, results_table) {
	$('#slider-range').on({
		slide: function() {
			console.log('onslide')
			localStorage['tooltip-players'] = Math.floor($('#slider-players').text());
			calculate_teams(hot, results_table);
		}
	})
}

function initialize_page() {
	create_slider();
	create_tooltip();
	create_preambula();
	var hot = create_table();
	var results = create_results_table();
	onSlide(hot, results);
	return [hot, results]

}
var tables = initialize_page();
var hot = tables[0]
var results_table = tables[1]

function assign_tasks_to_teams(T, tasks) {
	var teams2tasks = {};
	for (i=0; i<T; i++) {
		teams2tasks[i] = tasks[i%tasks.length] || "Random Team";
	}
	return teams2tasks
}

function calculate_teams(hot, results_table) {
	var p = number_of_players();
	var data = hot.getData();
	var cells = data.filter(isDataInRow);
	var names = [];
	var tasks = [];
	var N = 0;
	// calculate number of tasks
	for (i=0; i<cells.length; i++) {
		if (cells[i]["id"]) {
			names.push(cells[i]["id"]);
			N += 1;
			for (pref in cells[i]["pref"]) {
				var new_pref = cells[i]["pref"][pref];
				if (new_pref && tasks.indexOf(new_pref) === -1)
					tasks.push(new_pref)
			}
		}
	}
	var T = Math.floor(N/p); // number of teams
	if (N%p != 0)
		T += 1;
	var teams = {};
	for (i=0; i<T; i++) {
		teams[i] = [];
	}
	var teams2tasks = assign_tasks_to_teams(T, tasks);

	if (tasks.length === 0) {
		// if no tasks found, apply random algorithm
		names = shuffle(names)
		count = 0;
		for (i=0; i<names.length; i++) {
			team_number = count%T;
			teams[team_number].push(names[i]);
			count += 1;
		}
	}
	else {
		// create teams	
		var teams2skills = {}
		for (i=0; i<T; i++) {
			teams2skills[i] = [];
		}
		for (i=0; i<cells.length; i++) {
			if ("id" in cells[i]) { // if there is a name 
				// choose the best team
				var best_team = NaN;
				var best_team_score = -10000;
				for (var t in teams2tasks) {
					if (teams[t].length < p) {
						score = (cells[i]["pref"]["first"] === teams2tasks[t])*2 + (cells[i]["pref"]["sec"] === teams2tasks[t])*1.5 + (cells[i]["pref"]["third"] === teams2tasks[t])*1;
						// check is there is another player with the same skill
						if (cells[i]["skill"]) {
							for (j=0; j<teams2skills[t].length; j++) {
								if (teams2skills[t][j] === cells[i]["skill"]) {
									score -= 2;
									break;
								}
							}
						} 
						if (score > best_team_score) {
							best_team_score = score;
							best_team = t;
						}
					}
				}
				teams[best_team].push(cells[i]["id"]);
				teams2skills[best_team].push(cells[i]["skill"]);
			}
		}
	}
	show_results(teams, teams2tasks, results_table);
	return teams
}

// removes just cells' data, not the number of rows
function remove_data(results_table) {
	var n_cols = results_table.countCols();
	var n_rows = results_table.countRows();
	for (i=0; i<n_cols; i++) {
		results_table.spliceCol(i, 0, n_rows);
	}
}

function show_results(teams, teams2tasks, results_table) {
	remove_data(results_table);
	var p = number_of_players();
	var n_cols = results_table.countCols();
	if (p > n_cols - 1) {
		results_table.alter('insert_col', n_cols);
		var col_headers = create_headers(p+1); // create proper headers
		results_table.updateSettings({
			colHeaders: col_headers
		});
	}
	else {
		results_table.alter('remove_col', n_cols-1);
	}
	var row = 0
	for (t in teams2tasks) {
		// results_table.alter('insert_row');
		results_table.setDataAtCell(row, 0, teams2tasks[t]); // first column is for tasks
		for (j=0; j<teams[t].length; j++) {
			results_table.setDataAtCell(row, j+1, teams[t][j])
		}
		row = row + 1;
	}
	results_table.render();
}

// document.getElementById("calculate_teams").onclick = function() {
// 	calculate_teams(hot, results_table);
// }

