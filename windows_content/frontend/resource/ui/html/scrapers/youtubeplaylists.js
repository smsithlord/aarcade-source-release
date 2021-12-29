arcadeHud.addScraper({
	"id": "youtubeplaylists",
	"api_version": 0.1,
	"title": "YouTube Channel Playlist Collector",
	"summary": "All Playlists From A YouTube Channel",
	"description": "It gets all playlists from one youtuber, search for their channel, click on them and it shoud redirect you directly to the playlist overview, finally press the import button.",
	"homepage": "https://www.youtube.com/",
	"search": "https://www.youtube.com/results?sp=EgIQAg%253D%253D&search_query=$TERM",
	"can_acquire": false,
	"allow_keywords": false,
	"fields":
	{
		"all": 100,
		"marquee": 100,
		"screen": 100,
		"preview": 100,
		"description": 100,
		"reference": 100,
		"title": 100,
		"file": 1,
		"type": 80
	},
	"hasLogo": true,
	"quickTypes":
	{
		"videos": true
	},
	"rank": 100,
	"quickAllTypes":
	{
		"videos": true
	},
	"test": function(url, doc, callback)
	{
        var validForScrape = false;
        var redirect = "";
		//https://www.youtube.com/user/starwars
		//https://www.youtube.com/user/starwars/playlists
		//https://www.youtube.com/user/starwars/playlists?view=1&flow=grid

        // Check if we are on a user page, and if we are, give a redirect.
        // (as long as this doesn't bone us when not explictly choosing this wizard, we should be good.)
        if( url.indexOf("youtube.com") >= 0 )
        {
            var userIndex = url.indexOf("/user/");
            if( userIndex >= 0 )
            {
                var userName = url.substring(userIndex+6);
                var nextSlash = userName.indexOf("/");
                if( nextSlash == userName.length-1 )
                {
                    userName = userName.substring(0, userName.length-1);
                    nextSlash = userName.indexOf("/");
                }

                var endString = "?view=1&flow=grid";
                if( url.indexOf(endString) == url.length - endString.length )
                {
                    //console.log("SCRAPE THE SON OF BITCH!");
                    validForScrape = true;
                }
                else if( nextSlash < 0 )
                {
                    // we are on a user page and have a user ID
                    redirect = "https://www.youtube.com/user/" + userName + "/playlists?view=1&flow=grid";
                    validForScrape = false;
                }
            }
            else
            {
            	var channelIndex = url.indexOf("/channel/");
            	if( channelIndex >= 0 )
            	{
            		var channelId = url.substring(channelIndex + 9);
            		var nextSlash = channelId.indexOf("?");
            		if( nextSlash < 0 )
            			nextSlash = channelId.indexOf("/");
            		if( nextSlash < 0 )
            			nextSlash = channelId.indexOf("&");
            		if( nextSlash >= 0 )
            			channelId = channelId.substring(0, nextSlash);

            		var playlistsIndex = url.indexOf("/playlists");
            		if( playlistsIndex >= 0 )
            		{
            			aaapi.cmd("consoleCommand", "output_test_dom 1");
            			validForScrape = true;
            		}
            		else
            		{
                    	redirect = "http://www.youtube.com/channel/" + channelId + "/playlists";
            			validForScrape = false;
            		}
            	}
            }
        }

        callback({"validForScrape": validForScrape, "redirect": redirect});
	},
	"run": function(url, field, doc)
	{
		//getting the return variable ready
		responses = [];

		var response;

		var avatar = doc.querySelector(".appbar-nav-avatar").src;
		var channel = doc.querySelector("meta[name='title']").getAttribute("content");

		var entries = doc.querySelectorAll(".yt-lockup-content");
		for( var i = 0; i < entries.length; i++ )
		{
			response = {};
			response.type = "videos";
			//response.title = entries[i].getAttribute("title").trim();

			var anchor = entries[i].querySelector("a");
			response.title = anchor.getAttribute("title").trim();
            var playlistId = anchor.getAttribute("href");
            playlistId = playlistId.substring(playlistId.indexOf("?list=") + 6);

			response.reference = "http://www.youtube.com" + anchor.getAttribute("href");
			//response.preview = "http://www.youtube.com/" + titlecont.querySelector("a").getAttribute('href');
            //the description of the list is on another page, so scrapping for it is probably not possible
            //maybe i could write a scraper for it later that would completes it if someone wishes to do it
            response.description = "";

            var elems = doc.querySelectorAll(".yt-lockup-thumbnail a");
            for( var j = 0; j < elems.length; j++ )
            {
            	if( elems[j].getAttribute("href").indexOf("list=" + playlistId) >= 0 )
            	{
            		var img = elems[j].parentNode.querySelector("img");
            		response.screen = img.src;
            		response.screen = response.screen.replace(/^https:\/\//i, 'http://');
            		var questionid =  response.screen.indexOf("?");
            		if( questionid >= 0 )
            			response.screen = response.screen.substring(0, questionid);
            		break;
            	}
            }

            var videoId = response.screen;
            if( !!videoId && videoId !== "" )	// make sure it exists
            {
	            videoId = videoId.substring(videoId.indexOf("/vi/") + 4);
	            videoId = videoId.substring(0, videoId.indexOf("/"));
	        	response.file = "http://www.youtube.com/watch?v=" + videoId + "&list=" + playlistId;
	        }
	        else
	        	response.file = response.reference;

            response.preview = response.file;
            response.marquee = "";
            response.keywords =  channel + ", playlist, youtube";
            responses.push(response);
		}

		return responses;
	},
	"testDelay": 2500,
	"runDelay": 0
});