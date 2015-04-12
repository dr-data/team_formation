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
    
}
document.getElementById('create_row').onclick = create_row;

function remove_row() {
    document.getElementById("main_table").deleteRow(-1);
}
document.getElementById('remove_row').onclick = remove_row;