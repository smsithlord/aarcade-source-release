arcadeHud.addScraper({
	"id": "wallpapercave",
	"api_version": 0.1,
	"title": "Wallpaper Cave",
	"summary": "Wallpaper Cave",
	"description": "Cool fanart for pretty much everything.",
	"homepage": "http://duckduckgo.com/",
	"search": "http://wallpapercave.com/search?q=$TERM",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"screen": 100,
		"marquee": 100,
		"file": 100,
		"type": 100,
		"title": 100
	},
	"hasLogo": true,
	"rank": 20,
	"quickAllTypes":
	{
		"images": true,
		"other": true
	},
	"run": function(url, field, doc)
	{
		var response = {};

		// REFERENCE
		var goodUri = url;
		var index = goodUri.indexOf("?");
		if(index === -1)
			index = goodUri.indexOf("&");

		if(index === -1)
			index = goodUri.indexOf("#");

		if( index > 0 )
			goodUri = goodUri.substring(0, index);

		if( goodUri.toLowerCase().indexOf("https:") === 0 )
			goodUri = "http:" + goodUri.substring(6);

		response.reference = goodUri;

		// FILE
		var file = doc.querySelector("meta[property='og:image']").getAttribute("content");
		response.file = file;

		// SCREEN & MARQUEE (optional)
		// if the scraper is asking for a screen or marquee specifically, set it too.
		if( field === "screen" )
			response.screen = file;
		else if( field === "marquee" )
			response.marquee = file;

		// TITLE
		var title = doc.querySelector("meta[property='og:title']").getAttribute("content");
		response.title = title;

		// type
		response.type = "images";

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;
		
		if( url.toLowerCase().indexOf("wallpapercave") >= 0 )
		{
			if( !!doc.querySelector("meta[property='og:image']") )
				validForScrape = true;
		}

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 3000,
	"runDelay": 0
});