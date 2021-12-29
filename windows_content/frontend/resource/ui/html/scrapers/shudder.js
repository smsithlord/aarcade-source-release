arcadeHud.addScraper({
	"id": "shudder",
	"api_version": 0.1,
	"title": "Shudder",
	"summary": "Movies",
	"description": "Horror movies.",
	"homepage": "http://www.shudder.com/",
	"search": "http://www.shudder.com/?$TERM",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"marquee": 100,
		"screen": 100,
		"description": 100,
		"reference": 100,
		"title": 100,
		"file": 100,
		"type": 100
	},
	"hasLogo": true,
	"quickTypes":
	{
		"movies": true
	},
	"keywords":
	{
		"trailer": true,
		"wallpaper": true,
		"screenshot": true,
		"boxart": true,
		"marquee": true,
		"poster": true,
		"grid": true
	},
	"rank": 50,
	"quickAllTypes":
	{
		"videos": true,
		"movies": true,
		"other": true
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = "";
		var elem = doc.querySelector("div .jw-title-primary");

		if( !!elem )
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"run": function(uri, field, doc)
	{
		var response = {
			"type": "movies"
		};

		// file
		response.file = uri;

		// title
		var title = doc.querySelector("div .jw-title-primary").innerText;
		response.title = title;

		// description
		var description = doc.querySelector("div .jw-title-secondary").innerText;
		response.description = description;

		// helper vars
		var movieId = uri;
		var found = movieId.indexOf("/play/");
		movieId = movieId.substring(found+6);
		found = movieId.indexOf("?");
		if( found < 0 )
			found = movieId.indexOf("#");
		if( found >= 0 )
			movieId = movieId.substring(0, found);

		var movieTitleSafe = doc.querySelector("style[media='screen']").nextSibling.src;
		found = movieTitleSafe.indexOf("%2Fwatch%2F");
		movieTitleSafe = movieTitleSafe.substring(found + 11);
		found = movieTitleSafe.indexOf("%2F");
		movieTitleSafe = movieTitleSafe.substring(0, found);

		// screen
		var screen = "https://res.cloudinary.com/amc-svod/image/upload/f_auto,w_1800,q_auto:best/v1/thumbs/" + movieId + ".masthead.jpg";
		response.screen = screen;

		// marquee
		var marquee = "https://res.cloudinary.com/amc-svod/image/upload/f_auto,w_600,q_auto:best/v1/thumbs/" + movieId + ".box_art.jpg";
		response.marquee = marquee;

		// database
		var database = "https://www.shudder.com/movies/watch/" + movieTitleSafe + "/" + movieId
		response.database = database;

		return response;
	},
	"testDelay": 4000,
	"runDelay": 0
});