arcadeHud.addScraper({
	"id": "bing",
	"api_version": 0.1,
	"title": "Bing",
	"summary": "Everything",
	"description": "Bing will let you find just about anything you need.",
	"homepage": "http://www.bing.com/",
	"search": "http://www.bing.com/search?q=$TERM",
	"can_acquire": true,
	"allow_keywords": true,
	"rank": 21,
	"fields":
	{
		"file": 100
	},
	"hasLogo": true,
	"quickTypes":
	{
	},
	"quickAllTypes":
	{
	},
	"run": function(url, field, doc)
	{
		return {};
	},
	"test": function(url, doc, callback)
	{
		callback({"validForScrape": false, "redirect": false});
	},
	"testDelay": 4000,
	"runDelay": 0
});