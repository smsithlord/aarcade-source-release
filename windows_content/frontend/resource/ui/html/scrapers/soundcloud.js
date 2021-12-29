arcadeHud.addScraper({
	"id": "soundcloud",
	"api_version": 0.1,
	"title": "Soundcloud",
	"summary": "Music",
	"description": "A lot of music.",
	"homepage": "https://soundcloud.com/",
	"search": "https://soundcloud.com/search?q=$TERM",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"file": 100,
		//"preview": 100,
		//"stream": 100,
		//"screen": 100,
		"marquee": 100,
		"title": 100,
		"description": 100,
		"type": 100//,
		//"keywords": 80
	},
	"hasLogo": true,
	"rank": 7,
	"quickAllTypes":
	{
		//"videos": true,
		//"tv": true,
		"music": true//,
		//"other": true
	},
	"run": function(url, field, doc)
	{		
		var response = {};

		var elem = doc.querySelector(".fullHero__artwork");
		if( !!elem )
		{
			elem = elem.querySelector(".image__full");
			elem = elem.style.backgroundImage;
			elem = elem.substring(elem.indexOf('url("') + 5);
			elem = elem.substring(0, elem.length - 1);
			response.marquee = elem;

			elem = doc.querySelector(".soundTitle__title");
			if( elem )
				response.title = elem.innerText.trim();

			elem = doc.querySelector(".soundTitle__username");
			if( elem )
				response.description = "By " + elem.innerText.trim();

			response.file = url;
			response.reference = response.file;
			response.stream = response.file;
			response.type = "music";
		}

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;

		if( !!doc.querySelector(".fullHero__artwork") && !!doc.querySelector(".soundTitle__title") && !!doc.querySelector(".soundTitle__username") )
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 500//,
	//"runDelay": 0
});