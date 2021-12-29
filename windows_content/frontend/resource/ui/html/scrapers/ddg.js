arcadeHud.addScraper({
	"id": "ddg",
	"api_version": 0.1,
	"title": "DuckDuckGo",
	"summary": "Everything",
	"description": "DuckDuckGo will let you find anything you need.",
	"homepage": "http://duckduckgo.com/",
	"search": "http://duckduckgo.com/?q=$TERM",
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