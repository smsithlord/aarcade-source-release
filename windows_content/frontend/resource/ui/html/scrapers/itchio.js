arcadeHud.addScraper({
	"id": "itchio",
	"api_version": 0.1,
	"title": "Itch.io",
	"summary": "Indie Games",
	"description": "Itch.io has come cool HTML5 games that you can play on in-game screens.",
	"homepage": "https://itch.io/games/html5/",
	"search": "https://itch.io/search?q=$TERM",
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
	"rank": 200,
	"quickAllTypes":
	{
		"websites": true
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = "";

		var found = url.indexOf(".itch.io/");
		if( found > 0 )
		{
			var author = url.substring(0, found);
			var found2 = author.lastIndexOf("/");
			if( found2 > 0 )
			{
				author = author.substring(found2+1);

				var appId = url.substring(found + 9);
				var found3 = appId.indexOf("/");
				if( found3 > 0 )
					appId = appId.substring(0, found3);

				// yeah, probably something we can scrape.
				validForScrape = true;
			}

		}

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"run": function(url, field, doc)
	{
		var response = {};

		var found = url.indexOf(".itch.io/");
		if( found > 0 )
		{
			var author = url.substring(0, found);
			var found2 = author.lastIndexOf("/");
			if( found2 > 0 )
			{
				author = author.substring(found2+1);

				var appId = url.substring(found + 9);
				var found3 = appId.indexOf("/");
				if( found3 > 0 )
					appId = appId.substring(0, found3);

				// yeah, probably something we can scrape.
				var elem = doc.querySelector("meta[name='twitter:title']");
				if( !!elem )
					response.title = elem.getAttribute("content");

				elem = doc.querySelector("meta[name='twitter:url']")
				if( !!elem )
					response.file = elem.getAttribute("content");

				elem = doc.querySelector("meta[property='og:image']");
				if( !!elem )
					response.screen = elem.getAttribute("content");

				elem = doc.querySelector("meta[property='og:description']");
				if( !!elem )
					response.description = elem.getAttribute("content");

				response.type = "websites";

				if( !!response.title )
					response.title = appId + " by " + author;
			}

		}

		return response;
	}
});