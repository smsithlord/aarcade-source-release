arcadeHud.addScraper({
	"id": "netflix",
	"api_version": 0.1,
	"title": "Netflix",
	"summary": "Movies & TV",
	"description": "Netflix is a subscription site with lots of movies, TV shows, & documentaries.<br /><br />This scraper is *not* useful for finding movie posters or trailers.  Note that you'll have to manually give your new shortcut a title after you spawn it.",
	"homepage": "http://www.netflix.com/",
	"search": "http://www.netflix.com/search/$TERM",
	"can_acquire": true,
	"allow_keywords": false,
	"rank": 23,
	"fields":
	{
		"all": 100,
		//"description": 100,
		"file": 90,
		"stream": 100,
		"title": 100,
		"type": 80
	},
	"hasLogo": true,
	"quickAllTypes":
	{
		"other": true
	},
	"test": function(url, doc, callback)
	{
		function getParameterByName(name, url)
		{
			// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
		    if (!url) url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		var validForScrape = false;
		var redirect = "";

		/*
		var elem = doc.querySelector(".content");
		if(!!elem)
			validForScrape = true;
		console.log(elem);
		*/

		var movieId = getParameterByName("jbv", url);
		/*
		if( !!!movieId )
		{
			var found = url.lastIndexOf("/");
			if( found > 0 )
			{
				movieId = url.substring(found+1);
				found = movieId.indexOf("?");
				if( found < 0 )
					found = movieId.indexOf("#");

				if( found > 0 )
					movieId = movieId.substring(0, found);
			}
		}
		*/

		if( url.indexOf("netflix.com/watch/") >= 0 || url.indexOf("netflix.com/title/") >= 0 || (!!movieId && movieId !== "") )
			validForScrape = true;

		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"run": function(url, field, doc)
	{
		function getParameterByName(name, url)
		{
			// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
		    if (!url) url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		var movieId = getParameterByName("jbv", url);
		if( !!!movieId )
		{
			var found = url.lastIndexOf("/");
			if( found > 0 )
			{
				movieId = url.substring(found+1);
				found = movieId.indexOf("?");
				if( found < 0 )
					found = movieId.indexOf("#");

				if( found > 0 )
					movieId = movieId.substring(0, found);
			}
		}

		// netflix is a special type of scraper that just looks at the URL instead of looking at the DOM.
		// marqueeBase: http://image.tmdb.org/t/p/original/
		var response = {};

		if( !!movieId && movieId !== "" )
		{
			if( field != "stream" )
				response.reference = "http://www.netflix.com/title/" + movieId;

			response.stream = "http://www.netflix.com/watch/" + movieId;
			response.file = response.stream;
		}
		else
		{
			// stream
			response.stream = url.substring(0, url.indexOf("?")).replace("https", "http");
			response.file = response.stream;//url.substring(0, url.indexOf("?")).replace("https", "http");//response.stream;
		}

		//var titleElem;// = doc.querySelector(".ellipsize-text");

		var titleElem = doc.querySelector(".title");
		if( !!!titleElem )
		{
			titleElem = doc.querySelector(".video-title");
			if( !!titleElem )
			{
				var testElem = doc.querySelector(".ellipsize-text");
				if( !!testElem )
					titleElem = testElem;
				else
					titleElem = titleElem.querySelector("h4");
			}
		}

		var openJawElem = doc.querySelector(".open");
		if( !!openJawElem && !!!titleElem )
		{
			openJawElem = openJawElem.querySelector(".jawbone-title-link");
			if( !!openJawElem )
				titleElem = openJawElem.querySelector(".image-fallback-text");
		}

		//if( !!!titleElem )
		//	titleElem = doc.querySelector(".image-fallback-text");

		var title = (!!titleElem) ? titleElem.innerText.trim() : "";
		if( title === "" )
		{
			if( !!movieId && movieId !== "" )
				title = "Untitled Netflix " + movieId;
			else
				title = "Untitled Netflix";
		}

		response.title = title;

		// title
		//var elem = doc.querySelector(".content");
		//response.title = elem.querySelector("h2").innerHTML;

		// type
		//if( url.indexOf("netflix.com/watch/") >= 0 )
			response.type = "movies";
		//else
		//	response.type = "tv";

		// description
		//var ps = elem.querySelectorAll("p");
		//ps = ps[ps.length-1];
		//response.description = ps.innerHTML;

		return response;
	},
	"testDelay": 4000,	// added in December to try and fix the search results page glitch when scraping.
	"runDelay": 0
});