chrome.commands.onCommand.addListener(function(command) {
	if (command === "open-tab-man") {
		chrome.windows.create({
			url: "switcher.html",
			type: "popup",
			focused: true,
			height: window.screen.height - 200,
			width: Math.round(window.screen.width / 3),
			top: 50,
			left: Math.round(window.screen.width / 4)
		});
	}
});
