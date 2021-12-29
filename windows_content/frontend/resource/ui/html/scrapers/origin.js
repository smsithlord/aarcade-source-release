arcadeHud.addScraper({
	"id": "origin",
	"api_version": 0.1,
	"title": "Origin Store",
	"summary": "PC Games",
	"description": "The Origin Store is home to EA PC games.",
	"homepage": "http://www.origin.com/",
	"search": "http://www.origin.com/search?searchString=$TERM",
	"can_acquire": true,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"description": 100,
		"title": 100,
		"screen": 100,
		"marquee": 100,
		"preview": 100,
		"type": 99,
		"file": 1
	},
	"rank": 18,
	"hasLogo": true,
	"quickTypes":
	{
		"pc": true
	},
	"quickAllTypes":
	{
		"pc": true,
		"other": true
	},
	"keywords":
	{
		"trailer": true,
		"wallpaper": true,
		"screenshot": true,
		"boxart": true,
		"marquee": true,
		"poster": true
	},
	"run": function(url, field, doc)
	{
		var response = {};

		var title = doc.querySelector("meta[name='twitter:title']").getAttribute("content");
		var found = title.indexOf(" for PC | Origin");
		if( found > 0 )
			title = title.substring(0, found);
		var file = title;
		var description = doc.querySelector("meta[name='twitter:description']").getAttribute("content");
		var type = "pc";
		var screen = doc.querySelector("meta[name='twitter:image']").getAttribute("content");

		var reference = url;

		response.title = title;
		response.type = type;
		response.description = description;
		response.screen = screen;
		response.file = file;
		response.reference = reference;
		
		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;
		
		//var elem = doc.querySelector("origin-store-gdp-header");
		//if( !!elem && !!elem.firstElementChild && elem.firstElementChild.getAttribute("background") != "" )
		//	validForScrape = true;

		var title = doc.querySelector("meta[name='twitter:title']");
		if( !!title )
		{
			title = title.getAttribute("content");
			if( !!title )
			{
				var found = title.indexOf(" for PC | Origin");
				if( found > 0 )
					validForScrape = true;
			}
		}

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 2000,
	"runDelay": 0
});