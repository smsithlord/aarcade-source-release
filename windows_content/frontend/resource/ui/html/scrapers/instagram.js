arcadeHud.addScraper({
	"id": "instagram",
	"api_version": 0.1,
	"title": "Instagram",
	"summary": "People taking selfies.",
	"description": "Spawn images that you are viewing on Instagram.",
	"homepage": "https://www.instagram.com/",
	"search": "http://duckduckgo.com/?q=$TERM+instagram",
	"can_acquire": false,
	"allow_keywords": false,
	"rank": 21,
	"fields":
	{
		"all": 100,
		"reference": 100,
		"description": 90,
		"title": 100,
		"screen": 50,
		//"marquee": 100,
		"file": 100,
		"type": 100
	},
	"hasLogo": true,
	"quickTypes":
	{
	},
	"quickAllTypes":
	{
	},
	"run": function(url, field, doc)
	{
		var response = {};

		var isImage = false;
		var isVideo = false;

		//var imageContainerElems = doc.querySelectorAll("._4rbun");
		//for( var i = 0; i < imageContainerElems.length; i++ )
		//{
		//	if( imageContainerElems[i].style.cssText.indexOf("padding-bottom: ") >= 0)
			if( !!!doc.querySelector("#fb-root + div .videoSpritePlayButton") )
			{
				isImage = true;

				//var imageContainerElem = imageContainerElems[i];
				var imageElem = doc.querySelector("#fb-root + div *:not(header) > div[role='button'] img");// imageContainerElem.querySelector("img");

				// description
				var description = imageElem.getAttribute("alt");
				if( !!!description )
					description = "";

				// file
				var file = imageElem.src;

				var postId = url.substring(0, url.lastIndexOf("/"));
				postId = (postId.substring(postId.lastIndexOf("/")+1)).trim();

				// compose
				response.title = "Instagram: " + arcadeHud.getParameterByName("taken-by", url) + " - " + postId;
				response.description = description;
				response.file = file;
				response.reference = url;
				response.type = "images";
				//break;
			}
		//}

		if( !isImage )
		{
			// check for video now
			var videoElem;
			//var videoContainerElems = doc.querySelector("video");
			//for( var i = 0; i < videoContainerElems.length; i++ )
			//{
				videoElem = doc.querySelector("video");//videoContainerElems[i];
				if( videoElem.src.indexOf(".mp4") === videoElem.src.length-4 )
				{
					isVideo = true;

					// title
					var postId = url.substring(0, url.lastIndexOf("/"));
					postId = (postId.substring(postId.lastIndexOf("/")+1)).trim();
					var title = "Instagram Video: " + arcadeHud.getParameterByName("taken-by", url) + " - " + postId;

					// file
					var file = videoElem.src;

					// screen
					var screen = videoElem.getAttribute("poster");

					// description
					var description = "";
					var nextElem = videoElem;
					for( var j = 0; !!nextElem && j < 6; j++ )
						nextElem = nextElem.parentNode;

					if( !!nextElem )
					{
						nextElem = nextElem.nextSibling;

						if( !!nextElem )
						{
							var firstListItem = nextElem.querySelector("li");
							if( !!firstListItem )
							{
								var firstSpan = firstListItem.querySelector("span");
								if( firstSpan )
									description = firstSpan.innerText;
							}
						}
					}

					// compose
					response.title = title;
					response.description = description;
					response.file = file;
					response.reference = url;
					response.type = "videos";
					response.screen = screen;
					//break;
				}
			//}
		}

		return response;
	},
	"test": function(url, doc, callback)
	{
		var validForScrape = false;
		var redirect = false;

		//var imageElem = doc.querySelector("body > div:last-of-type *:not(header) > div[role='button'] img");
		var imageElem = doc.querySelector("#fb-root + div *:not(header) > div[role='button'] img");

		if( !!imageElem )
			validForScrape = true;
/*
		if( !validForScrape )
		{
			// check for video now
			var videoElem;
			var videoContainerElems = doc.querySelectorAll("video");
			for( var i = 0; i < videoContainerElems.length; i++ )
			{
				videoElem = videoContainerElems[i];
				if( videoElem.src.indexOf(".mp4") === videoElem.src.length-4 )
				{
					validForScrape = true;
					break;
				}
			}
		}
*/
		callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"testDelay": 2000,
	"runDelay": 0
});