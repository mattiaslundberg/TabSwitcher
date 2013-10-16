function open_tab(/* Tab */ tab) {
	chrome.tabs.update(tab.id, {active: true});
	chrome.windows.update(tab.windowId, {focused: true});
	window.close()
}

function check_match(search, target) {
	// TODO: Implement a matcher to determine if two strings matches or not.
	// Return true if match else false.
	return true;
}

function update_list(/* String */ search) {
	var table = document.getElementById("current-hits");
	for (var i = 0; i < table.children.length; i++) {
		row = table.children[i];
		tab = row.firstChild.firstChild.tab;
		if (check_match(search, tab.title)) {
			row.style["display"] = "";
		} else {
			row.style["display"] = "none";
		}
	};
}

function on_search_change(event) {
	if (event.charCode === 13) { // Enter
		var table = document.getElementById("current-hits");
		for (var i = 0; i < table.children.length; i++) {
			row = table.children[i];
			if (row.style["display"] !== "none") {
				row.firstChild.firstChild.click();
				return;
			}
		};
	} else if (event.ctrlKey && event.charCode === 17) { // Ctrl+Q
		window.close();
	} else {
		var search = document.getElementById("search");
		update_list(search.value);
	}
}

function add_tab_to_list(/* Tab */ tab) {
	var table = document.getElementById("current-hits");
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	var a = document.createElement("a");
	a.href = "#";
	a.onclick = function() { open_tab(tab); };
	a.tab = tab;
	a.innerHTML = tab.title;
	td.appendChild(a);
	tr.appendChild(td);
	
	table.appendChild(tr);
}

chrome.tabs.query({}, function(tabs) {
	chrome.tabs.getCurrent(function (current) {
		for (var i = 0; i < tabs.length; i++) {
			var tab = tabs[i];
			if (tab.id === current.id && tab.windowId === current.windowId)
				continue;
			// TODO: Close other tab switchers. How to do this in a robust way?
			add_tab_to_list(tab);
		};
	});
});

document.body.onkeyup = function(event) {
	if (event.keyCode === 27) // ESC
		window.close();
	// TODO: Navigate tabs with arrow keys.
}

document.querySelector("#search").addEventListener("keypress", on_search_change);
document.getElementById("search").focus();
