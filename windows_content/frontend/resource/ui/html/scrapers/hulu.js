arcadeHud.addScraper({
	"id": "hulu",
	"api_version": 0.1,
	"title": "Hulu",
	"summary": "TV Shows & Some Originals",
	"description": "Hulu is like an on-demand internet TV channel.",
	"homepage": "http://www.hulu.com/",
	"search": "https://www.hulu.com/",//search?q=$TERM
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"file": 100,
		"stream": 100,
		"screen": 100,
		"marquee": 100,
		"title": 100,
		"description": 100,
		"type": 100,
		"keywords": 80
	},
	"hasLogo": true,
	"rank": 7,
	"quickAllTypes":
	{
		"videos": true,
		"tv": true,
		"other": true
	},
	"run": function(url, field, doc)
	{		
		var response = {};

		var title = doc.querySelector(".Masthead__title").innerText.trim();
		var type = "videos";

		var elem = doc.querySelector(".Background__art");
		if( !!elem )
		{
			elem = elem.getAttribute("style");//elem.style.backgroundImage;
			elem = elem.substring(elem.indexOf('url("')+5);
			elem = elem.substring(0, elem.indexOf('")'));
			response.screen = elem;
		}

		elem = doc.querySelector(".Masthead__artwork");
		if( !!elem )
			response.marquee = elem.src;

		var description = doc.querySelector(".Masthead__description");
		if( !!description )
		{
			description = description.innerText.trim();
			response.description = description;
		}

		response.title = title;
		response.type = type;
		response.file = url;// + '#';
		response.stream = url;// + '#';
		response.reference = url;

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;

		if( !!doc.querySelector(".Masthead__title") )
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 2000//,
	//"runDelay": 0
});