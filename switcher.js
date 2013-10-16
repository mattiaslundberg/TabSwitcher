function open_tab(/* Tab */ tab) {
	chrome.tabs.update(tab.id, {active: true});
	chrome.windows.update(tab.windowId, {focused: true});
	window.close()
}

function clear_tab_list() {
	// Not needed?
}

function update_list(/* String */ search) {
	var table = document.getElementById("current-hits");
	for (var i = 0; i < table.children.length; i++) {
		var row = table.children[i];
		console.log(row);
	};
}

function on_search_change(event) {
	if (event.charCode === 13) { // Enter
		// TODO: Get topmost tab
		// TODO: Open the tab
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
	a.innerHTML = tab.title;
	td.appendChild(a);
	tr.appendChild(td);
	
	table.appendChild(tr);
}

chrome.tabs.query({}, function(tabs) {
	for (var i = 0; i < tabs.length; i++) {
		var tab = tabs[i];
		add_tab_to_list(tab);
	};
});

document.querySelector('#search').addEventListener('keypress', on_search_change);
