var current_window;

function show_switcher() {
	chrome.windows.create({
		url: "switcher.html",
		type: "popup",
		focused: true,
		height: window.screen.height - 200,
		width: Math.round(window.screen.width / 3),
		top: 50,
		left: Math.round(window.screen.width / 4)
	}, function (window) {
		current_window = window;
	});
}


chrome.commands.onCommand.addListener(function(command) {
	if (command === "open-tab-man") {
		if (current_window !== undefined) {
			chrome.windows.getAll({}, function(windows) {
				var present = false;
				for (var i = 0; i < windows.length; i++) {
					var window = windows[i];
					if (window.id === current_window.id)
						present = true;
				};
				if (!present) // Only open if not already shown
					show_switcher();
			});
		} else {
			show_switcher();
		}
	}
});
