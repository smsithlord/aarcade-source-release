arcadeHud.addScraper({
	"id": "sketchfab",
	"api_version": 0.1,
	"title": "Sketchfab",
	"summary": "3D Models (in-screen)",
	"description": "Sketchfab has amazing 3D artwork by aritsts from around the world.",
	"homepage": "http://www.sketchfab.com/",
	"search": "https://sketchfab.com/search?q=$TERM",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"file": 100,
		"description": 100,
		"title": 100,
		"screen": 100,
		"type": 100
	},
	"hasLogo": true,
	"quickTypes":
	{
		"websites": true
	},
	"rank": 100,
	"quickAllTypes":
	{
		"websites": true
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = "";

		var elem = doc.querySelector(".owner[id='data-author']");
		if( !!elem && !!elem.querySelector("meta[itemprop='image']") )
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"run": function(uri, field, doc)
	{
		var response = {};

		var title = doc.querySelector("meta[property='og:title']").getAttribute("content");
		var screen = doc.querySelector("meta[property='og:image']").getAttribute("content");
		var description = doc.querySelector("meta[name='description']").getAttribute("content");
		var file = doc.querySelector("link[rel='canonical']").getAttribute("href");
		var preview = doc.querySelector("meta[property='og:video:url']").getAttribute("content");
		//var marquee = doc.querySelector(".owner[id='data-author']").querySelector("meta[itemprop='image']").getAttribute("content");
		// no marquee cuz that makes it not show what you expect while browsing your library.
		var type = "websites";

		response.title = title;
		response.screen = screen;
		response.description = description;
		response.file = file;
		response.preview = preview;
		//response.marquee = marquee;
		response.type = type;

		return response;
	}
});