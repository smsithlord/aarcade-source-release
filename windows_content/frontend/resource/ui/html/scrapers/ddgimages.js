arcadeHud.addScraper({
	"id": "ddgimages",
	"api_version": 0.1,
	"title": "DuckDuckGo Images",
	"summary": "DuckDuckGo Search",
	"description": "Great for finding boxart, posters, screenshots, etc.",
	"homepage": "http://duckduckgo.com/",
	"search": "http://duckduckgo.com/?q=$TERM&iax=images&ia=images",
	"can_acquire": false,
	"allow_keywords": true,
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
	"rank": 1,
	"quickAllTypes":
	{
		"images": true,
		"other": true
	},
	"run": function(url, field, doc)
	{
		var response = {};

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

		var imageEndings = ["jpg", "jpeg", "gif", "png"];
		var extension = goodUri.substring(goodUri.lastIndexOf(".")+1).toLowerCase();
		if( imageEndings.indexOf(extension) >= 0)
		{
			response.file = goodUri;
			response.screen = goodUri;
			response.marquee = goodUri;
		}

		// type
		response.type = "images";

		// title
		var buf = url;
		var found = buf.indexOf("?");
		if( found === -1 )
			found = buf.indexOf("&");
		if( found === -1 )
			found = buf.indexOf("#");

		if( found > 0 )
			buf = buf.substring(0, found);

		found = buf.lastIndexOf("/");
		if( found === -1 )
			found = buf.lastIndexOf("\\");

		if( found > 0 )
			buf = buf.substring(found+1);

		found = buf.lastIndexOf(".");
		if( found > 0 )
			buf = buf.substring(0, found);

		if( buf.length < 1 )
			buf = "Untitled Image";
		else if( buf.length <= 3 )
			buf = "Image: " + buf;

		response.title = buf;
		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;
		
		var goodUri = url;

		var index = goodUri.indexOf("?");
		if(index === -1)
			index = goodUri.indexOf("&");

		if(index === -1)
			index = goodUri.indexOf("#");

		if( index > 0 )
			goodUri = goodUri.substring(0, index);

		var imageEndings = ["jpg", "jpeg", "gif", "png"];
		var extension = goodUri.substring(goodUri.lastIndexOf(".")+1).toLowerCase();
		if( imageEndings.indexOf(extension) >= 0)
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 2000,
	"runDelay": 0
});