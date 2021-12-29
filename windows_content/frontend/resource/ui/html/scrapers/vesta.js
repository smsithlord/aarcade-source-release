arcadeHud.addScraper({
	"id": "vesta",
	"api_version": 0.1,
	"title": "VESTA",
	"summary": "3D Web-Based Worlds",
	"description": "Vestas is a metaverse community..",
	"homepage": "https://vesta.janusvr.com/",
	"search": "https://vesta.janusvr.com/search/$TERM/1",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"file": 100,
		"preview": 100,
		//"stream": 100,
		"screen": 100,
		//"marquee": 100,
		"title": 100,
		"description": 100,
		"type": 100//,
		//"keywords": 80
	},
	"hasLogo": true,
	"rank": 1,
	"quickAllTypes":
	{
		//"videos": true,
		//"tv": true,
		"websites": true,
		"other": true
	},
	"run": function(url, field, doc)
	{		
		var response = {};

		/*
		var dummyElem;
		var fullVideoTitle = "";

		// get the simple fields...
		// REFERENCE
		response.reference = url;

		// FILE
		response.file = url;

		// STREAM
		response.stream = url;

		// TYPE
		response.type = "tv";

		// MARQUEE
		dummyElem = doc.querySelector("meta[property='og:image']");
		if( !!dummyElem )
		{
			response.marquee = "http:" + dummyElem.getAttribute("content");
			if( response.marquee == "http:" )
				delete response.marquee;
		}

		if( !!!doc.querySelector(".now-playing") && !!doc.querySelector(".show") )
		{
			// is a show
			dummyElem = doc.querySelector(".show");

			var thumbImageElem = dummyElem.querySelector("img");
			if( !!thumbImageElem )
			{
				// only if we have a thumbImageElem...

				// SCREEN
				var dummyVal = thumbImageElem.src;
				var foundAt = dummyVal.indexOf("?");
				if( foundAt < 0 )
					foundAt = dummyVal.indexOf("#");
				if( foundAt > 0 )
					dummyVal = dummyVal.substring(0, foundAt);
				dummyVal += "?size=1280x720";
				response.screen = dummyVal;

				// TITLE
				response.title = thumbImageElem.alt;
			}

			// DESCRIPTION
			dummyElem = doc.querySelector("meta[name='description']");
			if( !!dummyElem )
			{
				response.description = dummyElem.getAttribute("content").trim();
				if( response.description == "" )
					delete response.description;
			}

		}
		else if( !!!doc.querySelector(".show") && !!doc.querySelector(".now-playing") )
		{
			// is an episode

			// DESCRIPTION
			dummyElem = doc.querySelector(".description");
			if( !!dummyElem )
			{
				response.description = doc.querySelector(".description").innerText.trim();
				if( response.description == "")
					delete response.description;
			}

			// get the thumb elem
			dummyElem = doc.querySelector(".now-playing");
			if( !!dummyElem && !!dummyElem.parentNode && !!dummyElem.parentNode.parentNode )
			{
				var thumbElem = dummyElem.parentNode.parentNode.querySelector(".thumbnail");
				// only if we have a thumbElem...

				// get the thumbImageElem
				var thumbImageElem = thumbElem.querySelector("img");
				if( !!thumbImageElem )
				{
					// only if we have a thumbImageElem...
					// SCREEN
					var dummyVal = thumbImageElem.src;
					var foundAt = dummyVal.indexOf("?");
					if( foundAt < 0 )
						foundAt = dummyVal.indexOf("#");
					if( foundAt > 0 )
						dummyVal = dummyVal.substring(0, foundAt);
					dummyVal += "?size=1280x720";
					response.screen = dummyVal;

					// full video title, in case we can't get a better title...
					fullVideoTitle = thumbImageElem.alt;
				}

				var showTitle = "";
				dummyElem = doc.querySelector(".show-title");
				if( !!dummyElem )
				{
					showTitle = dummyElem.innerText.trim();

					// KEYWORDS
					if( showTitle != "" )
						response.keywords = showTitle;
				}

				var episodeTitle = "";
				dummyElem = doc.querySelector(".episode-title");
				if( !!dummyElem )
					episodeTitle = dummyElem.innerText.trim();

				// try to get episode info
				var episodeNumber = -1;
				var seasonNumber = -1;
				dummyElem = thumbElem.querySelector(".title");
				if( !!dummyElem )
				{
					var episodeInfos = dummyElem.innerText.trim().split(", ");
					if( episodeInfos.length === 2 )
					{
						// from https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
						function isInt(value){
						  return !isNaN(value) && 
						         parseInt(Number(value)) == value && 
						         !isNaN(parseInt(value, 10));
						}

						seasonNumber = episodeInfos[0][episodeInfos[0].length-1];
						if( !isInt(seasonNumber) )
							seasonNumber = -1;
						else
							seasonNumber = parseInt(seasonNumber);

						episodeNumber = episodeInfos[1][episodeInfos[1].length-1];
						if( !isInt(episodeNumber) )
							episodeNumber = -1;
						else
							episodeNumber = parseInt(episodeNumber);
					}
				}

				// determine the best title possible
				// TITLE FORMATS
				// 1:	SHOW_TITLE - (S#SEASONE#EPISODE) EPISODE_TITLE
				// 2:	SHOW_TITLE - EPISODE_TITLE
				// 3:	EPISODE_TITLE
				// 4:	SHOW_TITLE

				function padTVNumber(num)
				{
					return ("0" + num).slice(-2);
				}

				// TITLE
				if( episodeTitle != "" )
				{
					if( showTitle != "" )
					{
						if( seasonNumber >= 0 && episodeNumber >= 0 )
							response.title = showTitle + " - (S" + padTVNumber(seasonNumber) + "E" + padTVNumber(episodeNumber) + ") " + episodeTitle;
						else
							response.title = showTitle + " - " + episodeTitle;
					}
					else
						response.title = episodeTitle;
				}
				else if( showTitle != "" )
					response.title = showTitle;
				else if( fullVideoTitle != "" )
					response.title = fullVideoTitle;
			}
		}
		else
			console.log("CRITICAL ERROR IN WIZARD!");
*/
		var dummyElem;

		// screen
		dummyElem = doc.querySelector("meta[property='og:image']");
		response.screen = dummyElem.getAttribute("content");

		// title
		dummyElem = doc.querySelector("meta[property='og:title']");
		response.title = dummyElem.getAttribute("content");

		// description
		dummyElem = doc.querySelector("meta[property='og:description']");
		response.description = dummyElem.getAttribute("content");

		// file
		dummyElem = doc.querySelector("meta[property='og:url']");
		response.file = dummyElem.getAttribute("content");
		response.reference = response.file;

		// type
		response.type = "websites";

		// preview
		//var preview = 'https://vesta.janusvr.com/widget?url=';
		//preview += encodeURIComponent(response.file) + '&image=' + encodeURIComponent(response.screen) + '&description&title&autoplay=true';
		//response.preview = preview;

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;
		var dummyElem;

		// file
		dummyElem = doc.querySelector("meta[property='og:url']");
		if( !!dummyElem )
		{
			var dummyContent = dummyElem.getAttribute("content");
			if( !!dummyContent )
			{
				dummyContent = dummyContent.toLowerCase();
				if( dummyContent.indexOf('https://vesta.janusvr.com/') == 0 || dummyContent.indexOf('http://vesta.janusvr.com/') == 0 )
				{
					dummyContent = dummyContent.substring(26);
					if( dummyContent.indexOf('/') >= 0 )
					validForScrape = true;
				}

			}
		}

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 2000//,
	//"runDelay": 0
});