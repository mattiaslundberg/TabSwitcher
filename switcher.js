function open_tab(/* Tab */ tab) {
	chrome.tabs.update(tab.id, {active: true});
	chrome.windows.update(tab.windowId, {focused: true});
	window.close()
}

function update_list(/* String */ search) {
	var table = document.getElementById("current-hits");
	for (var i = 0; i < table.children.length; i++) {
		row = table.children[i];
		tab = row.firstChild.firstChild.tab;
		if (matching(search, tab.title)) {
			row.style["display"] = "";
		} else {
			row.style["display"] = "none";
			if (row.classList.contains("selected"))
				move_selection_down();
		}
	};
}

function on_search_change(event) {
	if (event.charCode === 13) { // Enter
		var table = document.getElementById("current-hits");
		for (var i = 0; i < table.children.length; i++) {
			row = table.children[i];
			if (row.classList.contains("selected")) {
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
	a.tabIndex = -1;
	a.onclick = function() { open_tab(tab); };
	a.tab = tab;
	a.innerHTML = tab.title;
	
	if (table.children.length === 0)
		tr.classList.add("selected");
	
	td.appendChild(a);
	tr.appendChild(td);
	table.appendChild(tr);
}

function move_selection_up() {
	var table = document.getElementById("current-hits");
	var moved = false;
	
	for (var i = table.children.length - 1; i >= 0 ; --i) {
		row = table.children[i];
		if (!moved && row.classList.contains("selected")) {
			row.classList.remove("selected");
			moved = true;
			continue;
		}
		if (moved && row.style["display"] !== "none") {
			row.classList.add("selected");
			return;
		}
	};
	for (var i = table.children.length - 1; i >= 0 ; --i) {
		row = table.children[i];
		if (row.style["display"] !== "none") {
			row.classList.add("selected");
			return;
		}
	};
}

function move_selection_down() {
	var table = document.getElementById("current-hits");
	var moved = false;
	
	for (var i = 0; i < table.children.length; i++) {
		row = table.children[i];
		if (!moved && row.classList.contains("selected")) {
			row.classList.remove("selected");
			moved = true;
			continue;
		}
		if (moved && row.style["display"] !== "none") {
			row.classList.add("selected");
			return;
		}
	};
	for (var i = 0; i < table.children.length; i++) {
		row = table.children[i];
		if (row.style["display"] !== "none") {
			row.classList.add("selected");
			return;
		}
	};
}

chrome.tabs.query({}, function(tabs) {
	chrome.tabs.getCurrent(function (current) {
		for (var i = 0; i < tabs.length; i++) {
			var tab = tabs[i];
			if (tab.id === current.id && tab.windowId === current.windowId)
				continue;
			add_tab_to_list(tab);
		};
	});
});

document.body.onkeyup = function(event) {
	if (event.keyCode === 27) // ESC
		window.close();
	if (event.keyCode === 38)
		move_selection_up();
	if (event.keyCode === 40)
		move_selection_down();
	if (!event.shiftKey && event.keyCode === 9)
		move_selection_down(); // TODO: Prevent default
	if (event.shiftKey && event.keyCode === 9)
		move_selection_up(); // TODO: Prevent default
};

document.querySelector("#search").addEventListener("keyup", on_search_change);
document.getElementById("search").focus();
