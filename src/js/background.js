browser.action.onClicked.addListener(function () {
	console.log("Action Button clicked!");
	var creating = browser.tabs.create({
	  url:"pages/index.html"
	});
	creating.then(onCreated, onError);
  });