arcadeHud.addScraper({
	"id": "dcuniverse",
	"api_version": 0.1,
	"title": "DC Universe",
	"summary": "DC TV, Movies, & Comics",
	"description": "It's like the Netflix of DC.",
	"homepage": "https://www.dcuniverse.com/",
	"search": "https://www.dcuniverse.com/search?q=$TERM",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"file": 100,
		//"preview": 100,
		"stream": 100,
		//"screen": 100,
		"marquee": 100,
		"title": 100,
		"description": 100,
		"type": 70,
		"keywords": 100
	},
	"hasLogo": true,
	"rank": 7,
	"quickAllTypes":
	{
		"videos": true,
		"movies": true,
		"tv": true,
		"comics": true//,
		//"websites": true,
		//"other": true
	},
	"run": function(url, field, doc)
	{		
		var response = {};

		if( url.toLowerCase().indexOf("dcuniverse.com/videos/watch/") >= 0 )
		{
			response.keywords = doc.querySelector("meta[name='keywords']").getAttribute("content");
			response.title = doc.querySelector("meta[property='og:title']").getAttribute("content");
			response.description = doc.querySelector("meta[property='og:description']").getAttribute("content");
			response.marquee = doc.querySelector("meta[property='og:image']").getAttribute("content");
			response.file = doc.querySelector("meta[property='og:url']").getAttribute("content");
			response.stream = response.file;

			/*var elem = doc.querySelector(".watch-detail__title");
			if( !!elem )
			{
				elem = elem.parentNode.parentNode;
				if( !!elem )
					response.reference = "https://www.dcuniverse.com" + elem.href;
			}*/

			//if( !!!response.reference )
				response.reference = response.file;

			response.type = "videos";
		}

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;

		if( url.toLowerCase().indexOf("dcuniverse.com/videos/watch/") >= 0 )
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	}//,
	//"testDelay": 2000//,
	//"runDelay": 0
});