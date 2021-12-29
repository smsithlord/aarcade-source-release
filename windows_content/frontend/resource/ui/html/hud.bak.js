function ArcadeHud()
{
	//this.selectedItem;
	this.pageTitle = "Untitled";
	this.platformId = "-KJvcne3IKMZQTaG7lPo";
	this.url = "";
	this.selectedWebTab = null;
	this.libretroHudButtonElem;
	this.pinHudButtonElem;
	this.returnHudButtonElem;
	this.isFullscreen = true;
	this.oldIsMapLoaded;
	//this.closeContentButtonElem;
	//this.hudHeaderContainerElem;
	this.clickThruElem;
	this.cursorElem;
	this.cursorPreviewImageElem;
	this.cursorImageElem;
	this.helpElem;
	this.overlayId = "";
	this.coreOverlayId = "";
	//this.metaScrapeElem;
	//this.hudMetaScrapeContainer;
	this.startupLoadingMessagesContainer;
	this.hudLoadingMessagesContainer;
	this.hudLoadingMessages = {};
	this.DOMReady = false;
	this.addressElem;
	this.DOMParser;
	this.lastMousePassThru = false;
	this.fileBrowseHandles = {};
	this.metaScrapeHandles = {};
	this.activeScraper = null;
	this.activeScraperId = "";
	this.libretroOverlay = null;
	this.libretroOverlayContainer = null;
	this.activeScraperItemId = "";
	this.activeScraperField = "";
	this.embeddedInstanceType = "";
	this.badMapFiles = ["beefcaike.bsp", "sm_anarchy.bsp", "ge_transition.bsp"];

	this.favorites = localStorage.getItem("myBackpack");
	if( !!this.favorites )
		this.favorites = JSON.parse(this.favorites);
	else
		this.favorites = [];

	this.hiddenItems = localStorage.getItem("hiddenItems");
	if( !!this.hiddenItems )
		this.hiddenItems = JSON.parse(this.hiddenItems);
	else
		this.hiddenItems = {};

	this.lists = localStorage.getItem("lists");
	if( !!this.lists )
		this.lists = JSON.parse(this.lists);
	else
		this.lists = {};

	this.npcs = [
		"f1a7d6be",
		"bce27344",
		"60e34fe7",
		"29e1df46",
		"7146d903",
		"8fb118d9",
		"8558b212",
		"1479e19e",
		"f8f5ae94",
		"93bb1053",
		"74926ebb",
		"471fb75c",
		"5a482b8c",
		"6ffc8085",
		"693073ca",
		"4b8e5eaa"
	];

	/*{
		"f1a7d6be": false,
		"bce27344": false,
		"60e34fe7": false,
		"29e1df46": false,
		"7146d903": false,
		"8fb118d9": false,
		"8558b212": false,
		"1479e19e": false,
		"f8f5ae94": false,
		"93bb1053": false,
		"74926ebb": false,
		"471fb75c": false,
		"5a482b8c": false,
		"6ffc8085": false,
		"693073ca": false,
		"4b8e5eaa": false
	};*/

	this.defaultModels = [
		"1b2a372b", // beer
		"a070d2ce", // big_speaker
		"1b69f4a7", // bowl_lamp
		"7fe41f36", // candycane
		"bd0c10c5", // card_table
		"d2ed2aac", // cash_cart
		"8c55dd04", // ceilingprojector
		"81575858", // change_machine
		"5ade1e88", // colorcube
		"c5376386", // colorrectangle
		"0a0d9e03", // colorsquare
		"1764630b", // dancepad
		"f15edfd9", // floorprojector
		"34637ab1", // floorsign_games
		"684da468", // giftbox
		"d1e5f306", // jacklight
		"c8e6894b", // lightstrobe
		"94648289", // lightsyrin
		"e80d600d", // longbar
		"26df7f41", // newton_toy
		"8edd1a60", // party_hat
		"848f413c", // room_divider
		"7c6a44cb", // roulette_light
		"fd5bc894", // service_trolly
		"f40e3015", // sith_sphynx
		"d1e1e1d7", // skeeball
		"bba30057", // spooky_tree
		"7d249c15", // studiolight_floor_alwayson
		"f6d75ba4",	// table
		"dbe95eba", // tombstone
		"a6793e2b",	// villa_chair
		"4002c8f5", // villa_couch
		"81c88ade", // walltubelight
		"d2c23ae2", // walltubelight_rainbow
		"07cf6ee9", // weight_set
		"79fd6ecd", // wood_shelf
		"2ceebcce", // xmasbell
		"98a83831" // xmastree
	];
	
	this.letters = [
		"447d0768", // flurolight_a
		"9f6aafff", // flurolight_b
		"d667c872", // flurolight_c
		"2d84e366", // flurolight_d
		"648984eb", // flurolight_e
		"bf9e2c7c", // flurolight_f
		"f6934bf1", // flurolight_g
		"4c9967e3", // flurolight_h
		"0594006e", // flurolight_i
		"de83a8f9", // flurolight_j
		"978ecf74", // flurolight_k
		"6c6de460", // flurolight_l
		"256083ed", // flurolight_m
		"fe772b7a", // flurolight_n
		"b77a4cf7", // flurolight_o
		"8ea26ee9", // flurolight_p
		"c7af0964", // flurolight_q
		"1cb8a1f3", // flurolight_r
		"55b5c67e", // flurolight_s
		"ae56ed6a", // flurolight_t
		"e75b8ae7", // flurolight_u
		"3c4c2270", // flurolight_v
		"754145fd", // flurolight_w
		"cf4b69ef", // flurolight_x
		"86460e62", // flurolight_y
		"5d51a6f5" // flurolight_z
	];
	
	this.scrapers = {
		"importSteamGames":
		{
			"id": "importSteamGames",
			"title": "Import Steam Games",
			"search": "http://www.google.com/search?q=$TERM",	// should never be used. this is an abnormal scraper only called when importing games from a user's Steam profile.
			"fields": {
				"all": 100
			},
			"run": function(url, field, doc)
			{
				//console.log("run it.");
				var rawGames = doc;
				var numRawGames = rawGames.length;
				var steamItems = [];
				var i, steamItem;
				for( i = 0; i < numRawGames; i++ )
				{
					//console.log(rawGames[i].name_escaped);
					//steamItems.push(rawGames[i].name_escaped);
					steamItems.push(rawGames[i].name + "");
					steamItems.push(rawGames[i].appid + "");
				}

				console.log("There are " + (steamItems.length / 2) + " Steam items to return to AArcade.");
				return steamItems;
			},
			"test": function(url, doc, callback)
			{
				var validForScrape = false;
				var redirect = false;
				
				//console.log("test it.");

				if( Array.isArray(doc) )
					validForScrape = true;

				/*
				var rawGames = doc;
				var numRawGames = rawGames.length;
				var steamItems = [];
				var i, steamItem;
				for( i = 0; i < numRawGames; i++ )
				{
					steamItem = {
						"name": rawGames[i].name_escaped,
						"appid": rawGames[i].appid
					};

					steamItems.push(steamitem);
				}

				aaapi.cmdEx("importSteamGames", steamItems);
				*/
				callback({"validForScrape": validForScrape, "redirect": redirect});
			},
			"testDelay": 2000,
			"runDelay": 0
		}/*,
		"currenturi": 	// SHOULD USE GOOGLE AS ITS "HOMEPAGE"
		{
			"id": "currenturi",
			"title": "Use Current Address",
			"fields":
			{
				"marquee": 100,
				"screen": 100,
				"preview": 100,
				"file": 100,
				"reference": 100,
				"download": 100,
				"stream": 100
			},
			"run": function(url, doc)
			{
				// marqueeBase: http://image.tmdb.org/t/p/original/
				var response = {};
				response.marquee = url;
				response.screen = url;
				response.preview = url;
				response.file = url;
				response.reference = url;
				response.download = url;
				response.stream = url;
				return response;
			}
		}*/
	};

	this.onDOMReady().then(function()
	{
		//console.log("DOM ready on " + document.location.href);
		this.DOMParser = new DOMParser();

		/*
		 * DOMParser HTML extension
		 * 2012-09-04
		 * 
		 * By Eli Grey, http://eligrey.com
		 * Public domain.
		 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
		 */

		/*! @source https://gist.github.com/1129031 */
		/*global document, DOMParser*/
		this.DOMParser.parseFromString = function(markup, type) {
			"use strict";
				if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
					var
					  doc = document.implementation.createHTMLDocument("")
					;
			      		if (markup.toLowerCase().indexOf('<!doctype') > -1) {
		        			doc.documentElement.innerHTML = markup;
		      			}
		      			else {
		        			doc.body.innerHTML = markup;
		      			}
					return doc;
				} else {
					return nativeParse.apply(this, arguments);
				}
			};

		this.DOMReady = true;

		var aaTabs = document.querySelectorAll(".aaTab");
		if( aaTabs.length > 0 )
		{
			var aaTabContent;
			var aaTabContents = document.querySelectorAll(".aaTabContent");
			for( var i = 0; i < aaTabContents.length; i++ )
			{
				aaTabContent = aaTabContents[i];
				//aaTabContent.style.display = "none";
			}

			var activeTab;
			var aaTab;
			for( var i = 0; i < aaTabs.length; i++ )
			{
				aaTab = aaTabs[i];
				if( aaTab.getAttribute("activetab") == 1 )
					activeTab = aaTab;

				// update z-indexes
				aaTab.style.zIndex = aaTabs.length - i;

				aaTab.addEventListener("click", function(e)
				{
					arcadeHud.activateMenuTab(this);
				}.bind(aaTab), true);
			}

			// if no selected tab is given, then just select the 1st tab.
			if( !!!activeTab )
				activeTab = aaTabs[0];

			this.activateMenuTab(activeTab);
		}

		// inject the browser menu
		//var bodyElem = document.body;

		// top-level container for the browser menu
		//var browserMenuElem = document.createElement("div");
		//browserMenuElem.className = "hudHeaderContainer";

		var iconSize = arcadeHud.themeSizes.IconSize;
		var browserMenuElem = document.querySelector(".hudHeaderContainer");
		if( browserMenuElem )
		{
			// TABS


			// browser tabs container table
			var topTabsTableElem = document.createElement("div");
			topTabsTableElem.className = "hudHeaderContainerTable";

			// browser tabs container row
			var topTabsRowElem = document.createElement("tr");
			topTabsRowElem.className = "hudHeaderContainerRow";

			// blank browser tab container cell
			var blankBrowserTabsCell = document.createElement("div");
			blankBrowserTabsCell.className = "hudHeaderContainerCell";

			// aarcade browser tab container cell
			var aarcadeBrowserTabsCell = document.createElement("div");
			aarcadeBrowserTabsCell.className = "hudHeaderContainerCell";

			// aarcade browser tab
			var aarcadeBrowserTabElem = document.createElement("div");
			aarcadeBrowserTabElem.className = "hudHeaderButtonContainer";

			// aarcade tab label
			var aarcadeTabLabelElem = document.createElement("div");
			aarcadeTabLabelElem.className = "topLabel hudHeaderButton hudHeaderButtonOn helpNote aaThemeColorOneLowHoverBackgroundColor";
			aarcadeTabLabelElem.setAttribute("help", "Expand the address bar.");
			aarcadeTabLabelElem.innerHTML = "AArcade";
			aarcadeTabLabelElem.addEventListener("click", function()
			{
				this.expandAddressMenu();
			}.bind(this), true);

			// other browser tab container cell
			var otherBrowserTabsCell = document.createElement("div");
			otherBrowserTabsCell.className = "hudHeaderContainerCell";

			// unpin browser tab
			var unpinBrowserTabElem = document.createElement("div");
			unpinBrowserTabElem.className = "hudHeaderButtonContainer";
			unpinBrowserTabElem.style.right = "20%";
			unpinBrowserTabElem.id = "returnHudButton";

			// unpin tab label
			var unpinTabLabelElem = document.createElement("div");
			unpinTabLabelElem.className = "hudHeaderButton hudHeaderButtonOn helpNote";
			unpinTabLabelElem.setAttribute("help", "Unpin the HUD.");
			unpinTabLabelElem.innerHTML = "&nbsp;<img src=\"asset://ui/pinicon.png\" />&nbsp;";
			unpinTabLabelElem.addEventListener("click", function()
			{
				aaapi.cmd("deactivateInputMode");
			}.bind(this), true);

			// libretro browser tab
			var libretroBrowserTabElem = document.createElement("div");
			libretroBrowserTabElem.className = "hudHeaderButtonContainer";
			libretroBrowserTabElem.id = "libretroHudButton";

			// libretro tab label
			var libretroTabLabelElem = document.createElement("div");
			libretroTabLabelElem.style.cssText = "display: none;";
			libretroTabLabelElem.className = "hudHeaderButton hudHeaderButtonOn helpNote aaThemeColorOneLowHoverBackgroundColor";
			libretroTabLabelElem.setAttribute("help", "Libretro Menu");
			libretroTabLabelElem.innerHTML = "&nbsp;<img src=\"asset://ui/runicon.png\" />&nbsp;";
			libretroTabLabelElem.addEventListener("click", function()
			{
				window.location = "asset://ui/libretro.html";
			}.bind(this), true);

			// pin browser tab
			var pinBrowserTabElem = document.createElement("div");
			pinBrowserTabElem.className = "hudHeaderButtonContainer";
			pinBrowserTabElem.style.right = "20%";
			pinBrowserTabElem.id = "pinHudButton";

			// pin tab label
			var pinTabLabelElem = document.createElement("div");
			pinTabLabelElem.className = "hudHeaderButton helpNote";
			pinTabLabelElem.setAttribute("help", "Pin the HUD to stay open.");
			pinTabLabelElem.innerHTML = "&nbsp;<img src=\"asset://ui/pinicon.png\" />&nbsp;";
			pinTabLabelElem.addEventListener("click", function()
			{
				aaapi.cmd("forceInputMode");
				this.pinHudButtonElem.style.display = 'none';
				this.returnHudButtonElem.style.display = 'inline-block';
			}.bind(this), true);

			// STEAMWORKSBROWSER navigation container
			var navigationElem = document.createElement("div");
			navigationElem.setAttribute("frameworkName", "SteamworksBrowser");
			navigationElem.className = "hudHeaderNavigationContainer aaThemeColorOneShadedBackground";
			navigationElem.style.cssText = "display: none; text-align: center; font-size: 20px; font-family: Arial;";

			// address form
			var addressFormElem = document.createElement("form");
			addressFormElem.style.cssText = "display: inline-block;";

			addressFormElem.addEventListener("submit", function(e)
			{
				e.preventDefault();
				arcadeHud.navigateToURI(arcadeHud.addressElem.value);
				//return false;
			}, true);

			// adressLabel
			var adressLabelElem = document.createElement("div");
			adressLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHighShadedBackground aaThemeColorOneShadedBorderColor";
			adressLabelElem.setAttribute("help", "The URL of the website you are currently viewing.");
			this.assignHelp(adressLabelElem);
			adressLabelElem.style.cssText = "margin: 2px; margin-left: 20px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			adressLabelElem.innerHTML = "Address:";
			navigationElem.appendChild(adressLabelElem);

			// address
			this.addressElem = document.createElement("input");
			this.addressElem.className = "helpNote aaTitleTextSizeFontSize";
			this.addressElem.setAttribute("help", "The URL of the website you are currently viewing.");
			this.assignHelp(this.addressElem);
			this.addressElem.style.cssText= "margin: 2px; width: 600px; font-family: Arial;";
			this.addressElem.addEventListener("focus", function()
			{
				arcadeHud.addressElem.select();
			}, true);
			
			addressFormElem.appendChild(this.addressElem);
			navigationElem.appendChild(addressFormElem);

			// back label
			var backLabelElem = document.createElement("div");
			backLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("goBack");
			}.bind(backLabelElem), true);
			backLabelElem.className = "helpNote navArrowButton navArrowButtonBack aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			backLabelElem.setAttribute("help", "Go back.");
			this.assignHelp(backLabelElem);
			backLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			backLabelElem.innerHTML = "&#x25C4;";
			navigationElem.appendChild(backLabelElem);

			// reload label
			var reloadLabelElem = document.createElement("div");
			reloadLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("reload");
			}.bind(reloadLabelElem), true);
			reloadLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			reloadLabelElem.setAttribute("help", "Reload this web page.");
			this.assignHelp(reloadLabelElem);
			reloadLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			reloadLabelElem.innerHTML = "&#x21bb;";
			navigationElem.appendChild(reloadLabelElem);

			// foward label
			var fowardLabelElem = document.createElement("div");
			fowardLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("goForward");
			}.bind(fowardLabelElem), true);
			fowardLabelElem.className = "helpNote navArrowButton navArrowButtonForward aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			fowardLabelElem.setAttribute("help", "Go forward.");
			this.assignHelp(fowardLabelElem);
			fowardLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			fowardLabelElem.innerHTML = "&#x25BA;";
			navigationElem.appendChild(fowardLabelElem);

			var homeIconHTML = arcadeHud.generateIconHTML("homeicon.png", iconSize, iconSize, "aaTextColorOneColor");

			// home label
			var homeLabelElem = document.createElement("div");
			homeLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("goHome");
				arcadeHud.expandAddressMenu();
			}.bind(homeLabelElem), true);
			homeLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			homeLabelElem.setAttribute("help", "Go to your home page URL.");
			this.assignHelp(homeLabelElem);
			homeLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			homeLabelElem.innerHTML = homeIconHTML + "<div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			navigationElem.appendChild(homeLabelElem);

			var newIconHTML = arcadeHud.generateIconHTML("newicon.png", iconSize, iconSize, "aaTextColorOneColor");

			// new label
			var newLabelElem = document.createElement("div");
			newLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			newLabelElem.setAttribute("help", "Spawn the current page as a NEW item.");
			this.assignHelp(newLabelElem);
			newLabelElem.style.cssText = "margin: 2px; margin-right: 20px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			newLabelElem.innerHTML = newIconHTML + "<div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			newLabelElem.addEventListener("click", function(e)
			{
				//console.log("yaaaaaaaaaar");

				/*
					1. DOM gets fetched
					2. DOM gets returned
					3. ALL scrapers attempt TEST logic.
					4. Highest priority match gets used!
					5. Scrape & victory bowl.
				*/
				arcadeHud.fetchDOM();
			}, true);
			navigationElem.appendChild(newLabelElem);

			/*
			var scrapeIconHTML = arcadeHud.generateIconHTML("scrapeicon.png", iconSize, iconSize, "aaTextColorOneColor");

			// scrape label
			var scrapeLabelElem = document.createElement("div");
			scrapeLabelElem.className = "helpNote aaTitleTextSizeFontSize aaDisabled aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			scrapeLabelElem.setAttribute("help", "Scrape info off of the current page and apply it to the selected item.");
			this.assignHelp(scrapeLabelElem);
			scrapeLabelElem.style.cssText = "margin: 2px; margin-right: 20px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			scrapeLabelElem.innerHTML = scrapeIconHTML + "<div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			navigationElem.appendChild(scrapeLabelElem);
			*/

			// compose
			/*
			aarcadeBrowserTabsCell.appendChild(aarcadeBrowserTabElem);
			aarcadeBrowserTabElem.appendChild(aarcadeTabLabelElem);

			unpinBrowserTabElem.appendChild(unpinTabLabelElem);
			pinBrowserTabElem.appendChild(pinTabLabelElem);
			libretroBrowserTabElem.appendChild(libretroTabLabelElem);
			otherBrowserTabsCell.appendChild(unpinBrowserTabElem);
			otherBrowserTabsCell.appendChild(pinBrowserTabElem);
			otherBrowserTabsCell.appendChild(libretroBrowserTabElem);

			topTabsRowElem.appendChild(blankBrowserTabsCell);
			topTabsRowElem.appendChild(aarcadeBrowserTabsCell);
			topTabsRowElem.appendChild(otherBrowserTabsCell);

			topTabsTableElem.appendChild(topTabsRowElem);
*/
			browserMenuElem.appendChild(navigationElem);
			//browserMenuElem.appendChild(topTabsTableElem);


			// LIBRETRO navigation container
			var navigationElem = document.createElement("div");
			navigationElem.setAttribute("frameworkName", "Libretro");//SteamworksBrowser");
			navigationElem.className = "hudHeaderNavigationContainer aaThemeColorOneShadedBackground";
			navigationElem.style.cssText = "display: none; text-align: center; font-size: 20px; font-family: Arial;";
/*
			// address form
			var addressFormElem = document.createElement("form");
			addressFormElem.style.cssText = "display: inline-block;";

			addressFormElem.addEventListener("submit", function(e)
			{
				e.preventDefault();
				arcadeHud.navigateToURI(arcadeHud.addressElem.value);
				//return false;
			}, true);
*/
/*
			// back label
			var backLabelElem = document.createElement("div");
			backLabelElem.className = "aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneShadedBorderColor";
			backLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			backLabelElem.innerHTML = "&#x25C4;";
			navigationElem.appendChild(backLabelElem);

			// foward label
			var fowardLabelElem = document.createElement("div");
			fowardLabelElem.className = "aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneShadedBorderColor";
			fowardLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			fowardLabelElem.innerHTML = "&#x25BA;";
			navigationElem.appendChild(fowardLabelElem);
*/
/*
			// address
			this.addressElem = document.createElement("input");
			this.addressElem.className = "aaTitleTextSizeFontSize";
			this.addressElem.style.cssText= "margin: 2px; width: 600px; font-family: Arial;";
			this.addressElem.addEventListener("focus", function()
			{
				arcadeHud.addressElem.select();
			}, true);
			
			addressFormElem.appendChild(this.addressElem);
			navigationElem.appendChild(addressFormElem);
*/

			//var iconSize = arcadeHud.themeSizes.IconSize;

			// fileLabel
			var fileLabelElem = document.createElement("div");
			fileLabelElem.setAttribute("help", "The file that is currently being ran by the Libretro core.");
			fileLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHighShadedBackground aaThemeColorOneShadedBorderColor";
			fileLabelElem.style.cssText = "margin: 2px; margin-left: 20px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			fileLabelElem.innerHTML = "File:";
			navigationElem.appendChild(fileLabelElem);

			// file
			//var pauseIconHTML = arcadeHud.generateIconHTML("scrapeicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var fileInputElem = document.createElement("input");
			fileInputElem.setAttribute("help", "The file that is currently being ran by the Libretro core.");
			fileInputElem.className = "helpNote aaLibretroTopInput aaLibretroTopInputFile aaTitleTextSizeFontSize";
			fileInputElem.size = 40;
			//fileInputElem.placeholder = "video_file.avi";
			fileInputElem.style.cssText= "margin: 2px; font-family: Arial; margin-right: 20px;";// margin-right: 20px;
			navigationElem.appendChild(fileInputElem);


			// coreLabel
			var coreLabelElem = document.createElement("div");
			coreLabelElem.setAttribute("help", "The currently running Libretro core.");
			coreLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHighShadedBackground aaThemeColorOneShadedBorderColor";
			coreLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			coreLabelElem.innerHTML = "Core:";
			navigationElem.appendChild(coreLabelElem);

			// core
			var coreInputElem = document.createElement("input");
			coreInputElem.setAttribute("help", "The currently running Libretro core.");
			coreInputElem.className = "helpNote aaLibretroTopInput aaLibretroTopInputCore aaTitleTextSizeFontSize";
			coreInputElem.size = 20;
			//coreInputElem.placeholder = "ffmpeg.dll";
			coreInputElem.style.cssText= "margin: 2px; font-family: Arial;";
			navigationElem.appendChild(coreInputElem);

			// pause label
			var pauseIconHTML = arcadeHud.generateIconHTML("pauseicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var pauseLabelElem = document.createElement("div");
			pauseLabelElem.setAttribute("help", "PAUSE the Libretro core.");
			pauseLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("libretroPause");

				if( !this.classList.contains("aaDepressed") )
					this.classList.add("aaDepressed");
				else
					this.classList.remove("aaDepressed");
			}.bind(pauseLabelElem), true);
			pauseLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			pauseLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			pauseLabelElem.innerHTML = "<div style='display: inline; position: relative; top: -3px;'>" + pauseIconHTML + "</div><div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			navigationElem.appendChild(pauseLabelElem);

			// reset label
			var resetLabelElem = document.createElement("div");
			resetLabelElem.setAttribute("help", "RESET the Libretro core.");
			resetLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("libretroReset");
			}.bind(resetLabelElem), true);
			resetLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			resetLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			resetLabelElem.innerHTML = "&#x21bb;";
			navigationElem.appendChild(resetLabelElem);
/*
			// guigamepad label
			var guiGamepadIconHTML = arcadeHud.generateIconHTML("runicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var guiGamepadLabelElem = document.createElement("div");
			guiGamepadLabelElem.addEventListener("click", function(e)
			{
				//aaapi.cmd("setLibretroGUIGamepadEnabled");	// no param means "toggle"

				var elem;
				var elems = document.querySelectorAll(".libretroGUIGamepad");
				for( var i = 0; i < elems.length; i++ )
				{
					elem = elems[i];
					if( elem.style.display !== "block" )
						elem.style.display = "block";
					else
						elem.style.display = "none";
				}

				if( !this.classList.contains("aaDepressed") )
				{
					this.classList.add("aaDepressed");
					aaapi.cmd("setLibretroGUIGamepadEnabled", true);
				}
				else
				{
					this.classList.remove("aaDepressed");
					aaapi.cmd("setLibretroGUIGamepadEnabled", false);
				}
			}.bind(guiGamepadLabelElem), true);
			guiGamepadLabelElem.className = "aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			guiGamepadLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			guiGamepadLabelElem.innerHTML = guiGamepadIconHTML + "<div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			navigationElem.appendChild(guiGamepadLabelElem);
			*/


			// input settings label
			var inputSettingsIconHTML = arcadeHud.generateIconHTML("runicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var inputSettingsLabelElem = document.createElement("div");
			inputSettingsLabelElem.setAttribute("help", "INPUT settings for Libretro.");
			inputSettingsLabelElem.addEventListener("click", function(e)
			{
				window.location = 'asset://ui/libretroInputMenu.html';
				/*
				aaapi.cmd("libretroPause");

				if( !this.classList.contains("aaDepressed") )
					this.classList.add("aaDepressed");
				else
					this.classList.remove("aaDepressed");
				*/
			}.bind(inputSettingsLabelElem), true);
			inputSettingsLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			inputSettingsLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			inputSettingsLabelElem.innerHTML = "<div style='display: inline; position: relative; top: -3px;'>" + inputSettingsIconHTML + "</div><div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			navigationElem.appendChild(inputSettingsLabelElem);


			// core settings label
			var coreSettingsIconHTML = arcadeHud.generateIconHTML("cogicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var coreSettingsLabelElem = document.createElement("div");
			coreSettingsLabelElem.setAttribute("help", "CORE & GAME settings for Libretro.");
			coreSettingsLabelElem.addEventListener("click", function(e)
			{
				window.location = 'asset://ui/libretroCoreMenu.html';
				/*
				aaapi.cmd("libretroPause");

				if( !this.classList.contains("aaDepressed") )
					this.classList.add("aaDepressed");
				else
					this.classList.remove("aaDepressed");
				*/
			}.bind(coreSettingsLabelElem), true);
			coreSettingsLabelElem.className = "helpNote aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			coreSettingsLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			coreSettingsLabelElem.innerHTML = "<div style='display: inline; position: relative; top: -3px;'>" + coreSettingsIconHTML + "</div><div style='display: inline; letter-spacing: -1.0em;'>&nbsp;</div>";
			navigationElem.appendChild(coreSettingsLabelElem);


			// volumeContainer
			var volumeIconHTML = arcadeHud.generateIconHTML("volumeicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var muteIconHTML = arcadeHud.generateIconHTML("muteicon.png", iconSize, iconSize, "aaTextColorOneColor");

			var volumeContainerElem = document.createElement("div");
			volumeContainerElem.className = "aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHighShadedBackground aaThemeColorOneHoverShadedBorderColor";
			volumeContainerElem.style.cssText = "margin: 2px; margin-left: 20px; margin-right: 20px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 24px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";

/*
			var volumeIconContainer = document.createElement("div");
			volumeIconContainer.innerHTML = volumeIconHTML;
			volumeIconContainer.style.cssText = "display: inline-block;";
			volumeContainerElem.appendChild(volumeIconContainer);
			*/

			var volumeIconContainerElem = document.createElement("div");
			volumeIconContainerElem.className = "helpNote";
			volumeIconContainerElem.setAttribute("help", "Mute Libretro's volume. (toggle)");
			volumeIconContainerElem.style.cssText = "display: inline-block; vertical-align: middle; position: relative; top: -2px;";
			var oldVol = parseFloat(aaapi.cmdEx("getConVarValue", "libretro_volume"));
			if( oldVol > 0 )
			{
				volumeIconContainerElem.innerHTML = volumeIconHTML;
				volumeIconContainerElem.isMuted = false;
				volumeIconContainerElem.oldVolume = oldVol;
			}
			else
			{
				volumeIconContainerElem.innerHTML = muteIconHTML;
				volumeIconContainerElem.isMuted = true;
				volumeIconContainerElem.oldVolume = parseFloat(aaapi.cmdEx("getConVarValue", "old_libretro_volume"));
			}
			volumeContainerElem.appendChild(volumeIconContainerElem);

			var blankSpaceNode = document.createTextNode(" ");
			volumeContainerElem.appendChild(blankSpaceNode);


			//volumeContainerElem.innerHTML = "<div style=''>" + volumeIconHTML + "</div> <div class='' style=''></div>";

			volumeIconContainerElem.addEventListener("click", function(e)
			{
				var inputElem = this.parentNode.querySelector("input[type='range']");

				if( !this.isMuted )
				{
					this.oldVolume = inputElem.value;
					aaapi.cmd("consoleCommand", "set_libretro_volume 0; old_libretro_volume " + this.oldVolume + ";");
					inputElem.value = 0.0;
					this.innerHTML = muteIconHTML;
					this.isMuted = true;
				}
				else
				{
					aaapi.cmd("consoleCommand", "set_libretro_volume " + this.oldVolume + ";");
					inputElem.value = this.oldVolume;
					this.innerHTML = volumeIconHTML;
					this.isMuted = false;
				}
			}.bind(volumeIconContainerElem), true);

			var volumeInputElem = document.createElement("input");
			volumeInputElem.setAttribute("help", "Adjust Libretro's volume level.");

			volumeInputElem.type = "range";
			volumeInputElem.min = 0.0;

			var volumeMultiplyerLabelElem = document.createElement("div");	// not added until later tho
			volumeMultiplyerLabelElem.className = "volMulti helpNote";
			volumeMultiplyerLabelElem.setAttribute("help", "Amplify the volume slider's range by x3. (toggle)");
			volumeMultiplyerLabelElem.style.cssText = "display: inline-block; margin-right: 10px;";

			var ampOffIconHTML = arcadeHud.generateIconHTML("ampofficon.png", iconSize, iconSize, "aaTextColorOneColor");
			var ampOnIconHTML = arcadeHud.generateIconHTML("amponicon.png", iconSize, iconSize, "aaTextColorOneColor");
			var curVolume = parseFloat(aaapi.cmdEx("getConVarValue", "libretro_volume"));
			var maxVolume = 1.0;
			volumeMultiplyerLabelElem.isAmped = false;
			if( curVolume > maxVolume )
			{
				maxVolume = 3.0;
				volumeMultiplyerLabelElem.isAmped = true;
				volumeMultiplyerLabelElem.innerHTML = ampOnIconHTML;
			}
			else
			{
				volumeMultiplyerLabelElem.innerHTML = ampOffIconHTML;
			}

			volumeMultiplyerLabelElem.addEventListener("click", function(e)
			{
				var inputElem = this.parentNode.querySelector("input[type='range']");

				var elem = this.parentNode.querySelector(".volMulti");
				if( !this.isAmped )
				{
					elem.innerHTML = ampOnIconHTML;
					inputElem.max = 3.0;
					this.isAmped = true;
				}
				else
				{
					elem.innerHTML = ampOffIconHTML;

					if( inputElem.value > 1.0 )
					{
						aaapi.cmd("consoleCommand", "set_libretro_volume 1.0");
						inputElem.value = 1.0;
					}

					inputElem.max = 1.0;
					this.isAmped = false;
				}
			}.bind(volumeMultiplyerLabelElem), true);

			volumeInputElem.max = maxVolume;
			volumeInputElem.step = 0.1;
			volumeInputElem.value = curVolume;
			volumeInputElem.style.cssText = "width: 150px; margin-right: 10px; position: relative; top: -2px;";
			volumeInputElem.className = "aaRangeSlider helpNote";
			volumeInputElem.addEventListener("change", function(e)
			{
				aaapi.cmd("consoleCommand", "set_libretro_volume " + this.value);
			}.bind(volumeInputElem), true);

			volumeContainerElem.appendChild(volumeInputElem);

			//volumeContainerElem.innerHTML = volumeIconHTML + " <input type='range' width='20' class='aaRangeSlider' style='margin-right: 10px; position: relative; top: -2px;' />";
			navigationElem.appendChild(volumeContainerElem);

			volumeContainerElem.appendChild(volumeMultiplyerLabelElem);

/*
			// x2volume label
			var x2volumeLabelElem = document.createElement("div");
			x2volumeLabelElem.addEventListener("click", function(e)
			{
				aaapi.cmd("libretroPause");
			}.bind(x2volumeLabelElem), true);
			x2volumeLabelElem.className = "aaTitleTextSizeFontSize aaTextColorOneColor aaThemeColorOneHoverShadedBackground aaThemeColorOneHoverShadedBorderColor";
			x2volumeLabelElem.style.cssText = "margin: 2px; display: inline-block; border-width: 2px; border-style: solid; border-radius: 2px; padding: 1px; padding-left: 5px; padding-right: 5px; text-shadow: 2px 2px 2px #000; font-weight: bold;";
			x2volumeLabelElem.innerHTML = "<div style='display: inline-block; vertical-align: middle; position: relative; top: -2px;'>" + volumeIconHTML + "</div> x2";
			navigationElem.appendChild(x2volumeLabelElem);
*/



			// compose
			browserMenuElem.appendChild(navigationElem);



			// Now compose the tabs...
			aarcadeBrowserTabsCell.appendChild(aarcadeBrowserTabElem);
			aarcadeBrowserTabElem.appendChild(aarcadeTabLabelElem);

			unpinBrowserTabElem.appendChild(unpinTabLabelElem);
			pinBrowserTabElem.appendChild(pinTabLabelElem);
			libretroBrowserTabElem.appendChild(libretroTabLabelElem);
			otherBrowserTabsCell.appendChild(unpinBrowserTabElem);
			otherBrowserTabsCell.appendChild(pinBrowserTabElem);
			otherBrowserTabsCell.appendChild(libretroBrowserTabElem);

			topTabsRowElem.appendChild(blankBrowserTabsCell);
			topTabsRowElem.appendChild(aarcadeBrowserTabsCell);
			topTabsRowElem.appendChild(otherBrowserTabsCell);

			topTabsTableElem.appendChild(topTabsRowElem);
			browserMenuElem.appendChild(topTabsTableElem);
		}

		this.startupLoadingMessagesContainer = document.querySelector("#startupLoadingMessagesContainer");	// usually undefined

		this.pinHudButtonElem = document.querySelector("#pinHudButton");
		this.libretroHudButtonElem = document.querySelector("#libretroHudButton");
		this.returnHudButtonElem = document.querySelector("#returnHudButton");
		this.addressTabElem = document.querySelector("#addressTab");
		this.hudHeaderContainerElem = document.querySelector(".hudHeaderContainer");
		//this.hudMetaScrapeContainerElem = document.querySelector("#hudMetaScrapeContainer");
//		this.closeContentButtonElem = document.querySelector(".hudContentHeaderCell:nth-of-type(3) .hudContentHeaderButton");
		
		//aaapi.cmd("requestActivateInputMode");

		this.helpElem = document.querySelector(".aaHelpContainer");

		var needsHelpAdded = false;
		if( !!!this.helpElem )
		{
			needsHelpAdded = true;
			this.helpElem = document.createElement("div");
			this.helpElem.className = "helpContainer";
		}

		this.hudLoadingMessagesContainer = document.querySelector(".hudLoadingMessagesContainer");
		if( !!!this.hudLoadingMessagesContainer )
		{
			this.hudLoadingMessagesContainer = document.createElement("div");
			this.hudLoadingMessagesContainer.className = "hudLoadingMessagesContainer";
			this.helpElem.appendChild(this.hudLoadingMessagesContainer);
		}

		if( needsHelpAdded && !!document.body )
			document.body.appendChild(this.helpElem);

		if( document.location.href === "asset://ui/startup.html" )//|| document.location.href.indexOf("asset://ui/loading.html") === 0 )
		{
			if( !!document.body )
			{
				var startupWallpaper = localStorage.getItem("aaStartupWallpaper");
				if( !!startupWallpaper )
				{
					// replace all \ with / so that it can be used in CSS background URL syntax
					var wallpaperSrc = startupWallpaper.replace(/\\/g, "/");

					if( wallpaperSrc.indexOf(":") === 1 )
						wallpaperSrc = "asset://local/" + wallpaperSrc;

					document.body.style.background = "transparent url('" + wallpaperSrc + "') center";
					document.body.style.backgroundSize = "cover";
				}
			}
		}
		else if( document.location.href !== "asset://ui/imageLoader.html" )
		{
			//console.log("Requesting activate input mode from " + document.location.href);
			aaapi.cmd("requestActivateInputMode");	// gets called needlessly when an object is de-selected, but fuck it.
		}

		/*
		this.metaScrapeElem = document.createElement("div");
		this.metaScrapeElem.className = "metaScrapeContainer";
		this.metaScrapeElem.addEventListener("click", function()
		{
			arcadeHud.metaScrape(this.scraperId, this.field, function(scrapedData)
			{
				console.log("Scraped data is: ");
				console.log(scrapedData);
				var usedFields = [];
				var args = [];
				var x, field;
				for( x in scrapedData)
				{
					field = scrapedData[x];
					//if( field === "" || (this.field !== "all" && this.field !== x))
					if( this.field !== "all" && this.field !== x)
						continue;

					if( x === "type" )
					{
						var allTypes = aaapi.cmdEx("getAllLibraryTypes");
						var y;
						for( y in allTypes )
						{
							console.log(allTypes[y].title);
							if( allTypes[y].title === field )
							{
								field = allTypes[y].info.id;
								break;
							}
						}
					}
					
					var inputs = document.querySelectorAll("input, select");
					var i;
					for( i = 0; i < inputs.length; i++ )
					{
						if( inputs[i].field === x )
						{
							//inputs[i].focus();
							inputs[i].value = field;
							break;
						}
					}

					args.push(x);
					args.push(field);
					usedFields.push(x);
				}

				var success = aaapi.cmdEx("updateItem", this.itemId, args);

				if( success )
				{
					console.log("Item updated!");

					var container = document.querySelector(".metaScrapeContainer");
					container.style.display = "none";

					aaapi.cmd("autoInspect", this.itemId);
					aaapi.cmd("deactivateInputMode");
				}
				else
					console.log("Item update rejected!");
			}.bind(this));
		}.bind(this.metaScrapeElem), true);
		this.hudMetaScrapeContainer = document.createElement("div");
		this.hudMetaScrapeContainer.className = "hudScrapeButton";//hudMetaScrapeContainer";
		//this.hudMetaScrapeContainer.style = "";
		this.hudMetaScrapeContainer.innerHTML = "<img src='scrapeicon.png' style='vertical-align: middle;' /><div class='buttonText'> Meta Scrape</div>";
		this.metaScrapeElem.appendChild(this.hudMetaScrapeContainer);
		document.body.appendChild(this.metaScrapeElem);
		*/

/*
		document.body.addEventListener("dblclick", function(e)
		{
			console.log("dblclicked: " + (e.target === document.body));
		}, true);
*/

		if( !!document.body )
		{
			document.body.addEventListener("mousedown", function(e)
			{
				//console.log("mouse down: " + (e.target === document.body));

				this.lastMousePassThru = (e.target === document.body);
				if(this.lastMousePassThru)
				{
					var buttonCode = 0;
					if( e.button === 1 )
						buttonCode = 1;
					else if( e.button === 2 )
						buttonCode = 2;
					aaapi.cmd("hudMouseDown", buttonCode, (this.lastMousePassThru));
				}
			}.bind(this), true);

			document.body.addEventListener("mouseup", function(e)
			{
				if( e.button === 2 )
				{
					if( !arcadeHud.isFullscreen )
					{
						document.body.style.display = "none";
						//console.log("Do resume!!!");
						aaapi.cmd("resumeMainMenu");
					}

					return;
				}

				if(this.lastMousePassThru)
				{
					var buttonCode = 0;
					if( e.button === 1 )
						buttonCode = 1;
					else if( e.button === 2 )
						buttonCode = 2;
					aaapi.cmd("hudMouseUp", buttonCode, (this.lastMousePassThru));
				}
			}.bind(this), true);

			document.body.addEventListener("selectstart", function(e)
			{
				e.preventDefault();
				return false;
			}, true);
		}

/*
		document.body.addEventListener("click", function(e)
		{
			//console.log("clicked: " + (e.target === document.body));
			if( (e.target === document.body) )
				aaapi.cmd("hud")
		}, true);
*/

		this.cursorElem = document.createElement("div");
		this.cursorElem.id = "cursor";

		this.cursorImageElem = document.createElement("img");
		this.cursorImageElem.className = "cursorImage";
		this.cursorImageElem.src = "cursors/hippie_default.png";

		//if( document.body.offsetWidth > 1280 )
			//this.cursorImageElem.style.width = this.cursorImageElem.offsetWidth * 2.0 + "px";

		if( !!document.body )
		{
			this.cursorElem.style.left = (document.body.offsetWidth / 2) + "px";
			this.cursorElem.style.top = (document.body.offsetHeight / 2) + "px";
		}

		this.cursorPreviewImageElem = document.createElement("img");
		this.cursorPreviewImageElem.style.cssText = "border: 3px solid #000; display: none; margin-top: 35px; max-width: 40%; max-height: 40%; vertical-align: top;";
		this.cursorPreviewImageElem.backupUri = "";
		this.cursorPreviewImageElem.addEventListener("load", function(e)
		{
			var elem = e.srcElement;
			elem.style.display = "inline-block";
		}, true);
		this.cursorPreviewImageElem.addEventListener("error", function(e)
		{
			var elem = e.srcElement;
			if( elem.backupUri !== "" && elem.backupUri !== elem.src )
				elem.src = elem.backupUri;
		}, true);

		this.cursorElem.appendChild(this.cursorImageElem);
		this.cursorElem.appendChild(this.cursorPreviewImageElem);

		if( !!document.body )
			document.body.appendChild(this.cursorElem);

		document.addEventListener("mousemove", function(e)
		{
			this.cursorElem.style.display = "block";
			this.cursorElem.style.left = e.clientX + "px";
			this.cursorElem.style.top = e.clientY + "px";
		}.bind(this), true);

		// prep all of the help notes
		var elems = document.querySelectorAll(".helpNote");
		var i, elem;
		var numElems = elems.length;
		for( i = 0; i < numElems; i++ )
		{
			elem = elems[i];
			this.assignHelp(elem);
		}

		// dispatch messages we may have gotten before the DOM was ready
		this.dispatchHudLoadingMessages();


		if( document.location.href === "asset://ui/imageLoader.html" || document.location.href === "asset://ui/hud.html" || document.location.href === "asset://ui/network.html" )
			aaapi.cmd("specialReady");
	}.bind(this));

	// sizes
	// default
	this.themeSizes = {
		"TextSize": "20px",
		"IconSize": "24px",
		"TitleTextSize": "28px",
		"BigIconSize": "32px"
	};

	this.themes = {};
	this.themes["redBaron"] = {
		"ThemeColorOne":
		{
			"defaultValue": "rgb(200, 40, 40)",
			"highValue": "rgb(255, 100, 100)",
			"lowValue": "rgb(150, 30, 30)"
		},
		"TextColorOne":
		{
			"defaultValue": "rgb(250, 250, 250)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"ThemeColorTwo":
		{
			"defaultValue": "rgb(240, 240, 240)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"TextColorTwo":
		{
			"defaultValue": "rgb(10, 10, 10)",
			"highValue": "rgb(150, 150, 150)",
			"lowValue": "rgb(0, 0, 0)"
		},
		"ActiveColor":
		{
			"defaultValue": "rgb(25, 150, 25)",
			"highValue": "rgb(50, 200, 50)",
			"lowValue": "rgb(10, 100, 10)"
		}
	};

	this.themes["redBaronDark"] = {
		"ThemeColorOne":
		{
			"defaultValue": "rgb(200, 40, 40)",
			"highValue": "rgb(255, 100, 100)",
			"lowValue": "rgb(150, 30, 30)"
		},
		"TextColorOne":
		{
			"defaultValue": "rgb(250, 250, 250)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"ThemeColorTwo":
		{
			"defaultValue": "rgb(20, 20, 20)",
			"highValue": "rgb(30, 30, 30)",
			"lowValue": "rgb(0, 0, 0)"
		},
		"TextColorTwo":
		{
			"defaultValue": "rgb(240, 240, 240)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		}
	};
	
	this.themes["fiftyShadesDark"] = {
		"ThemeColorOne":
		{
			"defaultValue": "rgb(40, 40, 40)",
			"highValue": "rgb(60, 60, 60)",
			"lowValue": "rgb(30, 30, 30)"
		},
		"TextColorOne":
		{
			"defaultValue": "rgb(250, 250, 250)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"ThemeColorTwo":
		{
			"defaultValue": "rgb(20, 20, 20)",
			"highValue": "rgb(30, 30, 30)",
			"lowValue": "rgb(0, 0, 0)"
		},
		"TextColorTwo":
		{
			"defaultValue": "rgb(170, 170, 170)",
			"highValue": "rgb(200, 200, 200)",
			"lowValue": "rgb(140, 140, 140)"
		}
	};

	this.themes["fiftyShades"] = {
		"ThemeColorOne":
		{
			"defaultValue": "rgb(40, 40, 40)",
			"highValue": "rgb(60, 60, 60)",
			"lowValue": "rgb(30, 30, 30)"
		},
		"TextColorOne":
		{
			"defaultValue": "rgb(250, 250, 250)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"ThemeColorTwo":
		{
			"defaultValue": "rgb(240, 240, 240)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"TextColorTwo":
		{
			"defaultValue": "rgb(10, 10, 10)",
			"highValue": "rgb(150, 150, 150)",
			"lowValue": "rgb(0, 0, 0)"
		},
		"ActiveColor":
		{
			"defaultValue": "rgb(25, 150, 25)",
			"highValue": "rgb(50, 200, 50)",
			"lowValue": "rgb(10, 100, 10)"
		}
	};

	this.themes["windowsWannabe"] = {
		"ThemeColorOne":
		{
			"defaultValue": "rgb(24, 131, 215)",
			"highValue": "rgb(78, 172, 255)",
			"lowValue": "rgb(19, 97, 159)"
		},
		"TextColorOne":
		{
			"defaultValue": "rgb(250, 250, 250)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"ThemeColorTwo":
		{
			"defaultValue": "rgb(240, 240, 240)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"TextColorTwo":
		{
			"defaultValue": "rgb(10, 10, 10)",
			"highValue": "rgb(150, 150, 150)",
			"lowValue": "rgb(0, 0, 0)"
		},
		"ActiveColor":
		{
			"defaultValue": "rgb(25, 150, 25)",
			"highValue": "rgb(50, 200, 50)",
			"lowValue": "rgb(10, 100, 10)"
		}
	};

	this.themes["windowsWannabeDark"] = {
		"ThemeColorOne":
		{
			"defaultValue": "rgb(24, 131, 215)",
			"highValue": "rgb(78, 172, 255)",
			"lowValue": "rgb(19, 97, 159)"
		},
		"TextColorOne":
		{
			"defaultValue": "rgb(250, 250, 250)",
			"highValue": "rgb(255, 255, 255)",
			"lowValue": "rgb(220, 220, 220)"
		},
		"ThemeColorTwo":
		{
			"defaultValue": "rgb(20, 20, 20)",
			"highValue": "rgb(30, 30, 30)",
			"lowValue": "rgb(0, 0, 0)"
		},
		"TextColorTwo":
		{
			"defaultValue": "rgb(170, 170, 170)",
			"highValue": "rgb(200, 200, 200)",
			"lowValue": "rgb(140, 140, 140)"
		}
	};

	var themeName = localStorage.getItem("aaColorThemeName");
	if( !!!themeName || !!!this.themes[themeName] )
	{
		themeName = "windowsWannabe";
		localStorage.setItem("aaColorThemeName", themeName);
	}

	this.themeColors = this.themes[themeName];
	this.addCSSRules.call(this);
}

ArcadeHud.prototype.dropListener = function(files)
{
	if( typeof window.dropListener === "function" )
		dropListener.call(null, files);
}

ArcadeHud.prototype.updateLists = function()
{
	localStorage.setItem("lists", JSON.stringify(this.lists));
}

ArcadeHud.prototype.displayLibretroOverlay = function(overlay)
{
	this.libretroOverlay = document.querySelector("#aaLibretroOverlayImage");
	if( overlay.overlayId !== "none" )
	{
		if( overlay.overlayId === "" )
			overlay.overlayId = this.coreOverlayId;

		if( !!!this.libretroOverlay )
		{
			/*
			this.libretroOverlay = document.createElement("img");
			this.libretroOverlay.id = "aaLibretroOverlayImage";
			this.libretroOverlay.style.cssText = "position: fixed; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none; margin-left: auto; margin-right: auto; height: 100%;";
			document.body.insertBefore(this.libretroOverlay, document.body.firstChild);
		}
		this.libretroOverlay.src = "overlays/" + overlay.overlayId + ".png";
		*/
			this.libretroOverlayContainer = document.createElement("table");
			this.libretroOverlayContainer.border = "0";
			this.libretroOverlayContainer.cellSpacing = "0";
			this.libretroOverlayContainer.cellPadding = "0";
			this.libretroOverlayContainer.id = "aaLibretroOverlayImageContainer";
			this.libretroOverlayContainer.style.cssText = "display: none; border-collapse: separate; empty-cells: show; position: fixed; pointer-events: none; left: 0; top: 0; height: 100%; width: 100%;";

			var tr = document.createElement("tr");
			var td = document.createElement("td");
			td.style.width = "30%";
			//td.className = "aaThemeColorOneShadedBackground";
			td.style.backgroundColor = "#000";
			tr.appendChild(td);

			td = document.createElement("td");
			td.style.width = "1%";
			td.align = "center";
			this.libretroOverlay = document.createElement("img");
			this.libretroOverlay.addEventListener("load", function(e)
			{
				this.parentNode.style.width = this.offsetWidth + "px";
				this.parentNode.parentNode.parentNode.style.display = "table";
			}.bind(this.libretroOverlay), true);
			this.libretroOverlay.id = "aaLibretroOverlayImage";
			this.libretroOverlay.style.cssText = "display: none; pointer-events: none; height: 1080px; max-width: 1920px;";
			td.appendChild(this.libretroOverlay);
			tr.appendChild(td);

			td = document.createElement("td");
			td.style.width = "30%";
			//td.className = "aaThemeColorOneShadedBackground";
			td.style.backgroundColor = "#000";
			tr.appendChild(td);

			this.libretroOverlayContainer.appendChild(tr);
			document.body.insertBefore(this.libretroOverlayContainer, document.body.firstChild);
		}
		this.libretroOverlay.src = "overlays/" + overlay.overlayId + ".png";

		this.libretroOverlay.style.display = "block";
	}
	else
	{
		this.hideLibretroOverlay();
	}
};

ArcadeHud.prototype.hideLibretroOverlay = function()
{
	//this.libretroOverlay = document.querySelector("#aaLibretroOverlayImage");
	if( !!this.libretroOverlay )
	{
		//this.libretroOverlay.style.display = "none";
		this.libretroOverlay.parentNode.removeChild(this.libretroOverlay);
		this.libretroOverlay = null;
		this.overlayId = "";
	}
};

ArcadeHud.prototype.navigateToURI = function(uri)
{
	if( uri !== "" )
		aaapi.cmd("navigateToURI", uri);
};

ArcadeHud.prototype.play = function(itemId)
{
	if( !!!itemId )
	{
		var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
		if( item )
			itemId = item.info.id;
	}

	if( !!itemId )
	{
		if(localStorage.getItem("coinDrop") !== "no")
			aaapi.cmd("playSound", "ambient/coininsert.mp3");

		var item = aaapi.cmdEx("getLibraryItem", itemId);

		var twitchConfig = aaapi.cmdEx("getTwitchConfig");
		if( twitchConfig.username !== "" && twitchConfig.token !== "" && twitchConfig.channel !== "" && aaapi.cmdEx("getConVarValue", "twitch_enabled") === "1" && aaapi.cmdEx("isTwitchBotEnabled") )
			aaapi.cmd("sendTwitchChat", "", "!game " + item.title);

		window.location='asset://ui/launchItem.html?id=' + encodeURIComponent(itemId);
	}
};

ArcadeHud.prototype.edit = function()
{
	/*
	var goodId;
	if( !!itemId && itemId != "" )
		goodId = itemId;
	else
	{
		*/
		var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
	//}

	if( item )
		window.location='asset://ui/editItem.html?id=' + encodeURIComponent(item.info.id);
};

ArcadeHud.prototype.objectEdit = function()
{
	//var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
	//if( item )
	//	window.location='asset://ui/editItem.html?id=' + encodeURIComponent(item.info.id);
	window.location = 'asset://ui/editObject.html';
};

ArcadeHud.prototype.expandAddressMenu = function()
{
	var elem = document.body.querySelector(".hudHeaderContainer");

	if( elem.style.top != "0px" )
		elem.style.top = "0px";
	else
		elem.style.top = "-65px";
};

ArcadeHud.prototype.getURL = function()
{
	return this.url;
};

//ArcadeHud.prototype.onURLChanged = function(url)
ArcadeHud.prototype.onURLChanged = function(url, scraperId, itemId, field)
{
	this.url = url;
	this.activeScraperId = scraperId;	// this is not the ONLY place this is set.  it's also set at the OnSomethingSeomthingRequestState method too. :S

	if( !!this.addressElem && this.addressElem.value !== this.url )
	{
		//aaapi.cmd("requestActivateInputMode");	// FIXME: this gets called needlessly when an object gets DEselected
		
		this.addressElem.value = this.url;

		//console.log("URL changed to " + url + " and we are " + document.location.href);
		if( scraperId !== "" )
			this.onBrowserFinishedRequest(url, scraperId, itemId, field);
	}

	if( this.activeScraperId === "importSteamGames" )
	{
		var headerContainerElem = document.querySelector(".hudHeaderContainer");
		headerContainerElem.style.visibility = "hidden";
		headerContainerElem.style.pointerEvents = "none";
	}
};

ArcadeHud.prototype.onActivateInputMode = function(
		isFullscreen,
		isHudPinned,
		isMapLoaded,
		isObjectSelected,
		isItemSelected,
		isMainMenu,
		url,
		isSelectedObject,
		embeddedInstanceType,
		canStream,
		canPreview,
		canGoForward,
		canGoBack,
		libretroCore,
		libretroFile,
		libretroCanRun,
		libretroOverlayX,
		libretroOverlayY,
		libretroOverlayWidth,
		libretroOverlayHeight,
		libretroOverlayId,
		activeScraperId,
		connectedToUniverse,
		isHost,
		isGamepadInput
	)
{
	//console.log("onActivateInputMode received.");
	isGamepadInput = parseInt(isGamepadInput);
	isFullscreen = parseInt(isFullscreen);
	isHudPinned = parseInt(isHudPinned);
	isMapLoaded = parseInt(isMapLoaded);
	isObjectSelected = parseInt(isObjectSelected);
	isItemSelected = parseInt(isItemSelected);
	isMainMenu = parseInt(isMainMenu);
	isSelectedObject = parseInt(isSelectedObject);	// it is THE selected object
	canStream = (canStream == "1") ? true : false;
	canPreview = (canPreview == "1") ? true : false;
	libretroCanRun = (libretroCanRun == "1") ? true : false;
	connectedToUniverse = (connectedToUniverse == "1") ? true : false;
	isHost = (isHost == "1") ? true : false;

	if( this.isFullscreen != isFullscreen )
	{
		if( embeddedInstanceType !== "AwesomiumBrowser" )
		{
			if( isFullscreen )
			{
				var noteElem = document.querySelector("#aaFullscreenNoteElem");
				if( !!!noteElem )
				{
					noteElem = document.createElement("div");
					noteElem.id = "aaFullscreenNoteElem";
					noteElem.innerHTML = "<img src='aaicon.png' style='vertical-align: middle; margin-right: 12px;' />Press <b><u>ESC</u></b> to exit fullscreen.";
					document.body.appendChild(noteElem);

					noteElem.offsetHeight;

					noteElem.style.opacity = 1.0;

					noteElem.handle = setTimeout(function()
					{
						this.style.top = "-100px";
						this.handle = setTimeout(function()
						{
							this.parentNode.removeChild(this);
							delete this.handle;
						}.bind(this), 500);
					}.bind(noteElem), 4000);
				}
			}
			else
			{
				var noteElem = document.querySelector("#aaFullscreenNoteElem");
				if( !!noteElem )
				{
					clearTimeout(noteElem.handle);
					delete this.handle;
					noteElem.parentNode.removeChild(noteElem);
				}
			}
		}

		this.isFullscreen = isFullscreen;
	}

	if( this.activeScraperId === "importSteamGames" )
	{
		var headerContainerElem = document.querySelector(".hudHeaderContainer");
		headerContainerElem.style.visibility = "hidden";
		headerContainerElem.style.pointerEvents = "none";
	}

	if( !!!activeScraperId )
		activeScraperId = "";

	// should we set active scraper ID for the arcadeHud here? (probably, why not.)
	this.activeScraperId = activeScraperId;

	// handle all aaOnlyIfNeedsSave elems
	var needsSave = aaapi.cmdEx("getNeedsSave");
	var elems = document.querySelectorAll(".aaOnlyIfNeedsSave");
	var num = elems.length;
	var i;
	for( i = 0; i < num; i++ )
		elems[i].style.display = (needsSave) ? "initial" : "none";

	// handle all aaOnlyIfMapLoaded elems
	if( !isMapLoaded )
	{
		var elems = document.querySelectorAll(".aaOnlyIfMapLoaded");
		var num = elems.length;
		var i;
		for( i = 0; i < num; i++ )
			elems[i].style.display = "none";//(isMapLoaded) ? "initial" : "none";
	}

	// handle all aaOnlyIfNoMapLoaded elems
	if( isMapLoaded )
	{
		var elems = document.querySelectorAll(".aaOnlyIfNoMapLoaded");
		var num = elems.length;
		var i;
		for( i = 0; i < num; i++ )
			elems[i].style.display = "none";//(!isMapLoaded) ? "initial" : "none";
	}

	if( this.oldIsMapLoaded !== isMapLoaded )
	{
		this.oldIsMapLoaded = isMapLoaded;
		if(typeof window.onIsMapLoaded === "function")
			window.onIsMapLoaded(isMapLoaded);
	}

	// handle all aaOnlyIfUniverseConnected elems
	if( !connectedToUniverse )
	{
		var elems = document.querySelectorAll(".aaOnlyIfUniverseConnected");
		var num = elems.length;
		var i;
		for( i = 0; i < num; i++ )
			elems[i].style.display = "none";//(connectedToUniverse) ? "initial" : "none";
	}

	// handle all aaOnlyIfHost & aaOnlyIfNotHost elems
	if(!isHost)
	{
		var elems = document.querySelectorAll(".aaOnlyIfHost");
		var num = elems.length;
		var i;
		for( i = 0; i < num; i++ )
			elems[i].style.display = "none";//(!connectedToUniverse || isHost) ? "initial" : "none";
	}
	else if(connectedToUniverse)	// FIXME: Shouldn't matter if we are connected to universe or not, but this might impact many different menus if changed.
	{
		var elems = document.querySelectorAll(".aaOnlyIfNotHost");
		var num = elems.length;
		var i;
		for( i = 0; i < num; i++ )
			elems[i].style.display = "none";//(!connectedToUniverse || isHost) ? "initial" : "none";
	}

	// handle all aaOnlyIfUniverseNotConnected elems
	if(connectedToUniverse)
	{
		var elems = document.querySelectorAll(".aaOnlyIfUniverseNotConnected");
		var num = elems.length;
		var i;
		for( i = 0; i < num; i++ )
			elems[i].style.display = "none";//(!connectedToUniverse) ? "initial" : "none";
	}


//this.addressTabElem
//console.log("Is object selected: " + isObjectSelected);
///*
	if( isItemSelected )
	{
		var elems = document.body.querySelectorAll(".hudSideContainerButton");
		var i;
		for( i = 0; i < elems.length; i++ )
		{
			if( elems[i].id === "metaSearchButton" )
				continue;
			
			elems[i].style.display = "inline-block";
		}
	}
	//*/
/*
	if( isMainMenu )
		this.hudHeaderContainerElem.style.display = "none";
	else
		this.hudHeaderContainerElem.style.display = "block";
	*/

	if( isMapLoaded )
	{
		if( isFullscreen )
		{
			//if( !!this.pinHudButtonElem )
			//	this.pinHudButtonElem.style.display = "none";

			//if( !!this.returnHudButtonElem )
			//	this.returnHudButtonElem.style.display = "none";
		}
		else
		{
			if( isHudPinned )
			{
				//if( !!this.pinHudButtonElem )
				//	this.pinHudButtonElem.style.display = "none";

				//if( !!this.returnHudButtonElem )
				//	this.returnHudButtonElem.style.display = "inline-block";
			}
			else
			{
				//if( !!this.returnHudButtonElem )
				//	this.returnHudButtonElem.style.display = "none";
				
				if( isMapLoaded )
				{
				//	if( !!this.pinHudButtonElem )
				//		this.pinHudButtonElem.style.display = "inline-block";
				}
				else
				{
				//	if( !!this.pinHudButtonElem )
				//		this.pinHudButtonElem.style.display = "none";
				}
			}
		}

		//if( !!this.closeContentButtonElem )
		//	this.closeContentButtonElem.style.display = "block";
	}
	else
	{
		//if( !!this.pinHudButtonElem )
		//	this.pinHudButtonElem.style.display = "none";

		//if( !!this.returnHudButtonElem )
		//	this.returnHudButtonElem.style.display = "none";

		////if( !!this.closeContentButtonElem )
		////	this.closeContentButtonElem.style.display = "none";
	}

	if( isFullscreen && !isGamepadInput )
	{
		this.cursorImageElem.style.display = "none";
		this.displayLibretroOverlay({
			"x": Number(libretroOverlayX),
			"y": Number(libretroOverlayY),
			"width": Number(libretroOverlayWidth),
			"height": Number(libretroOverlayHeight),
			"overlayId": libretroOverlayId
		});
		this.overlayId = libretroOverlayId;
	}
	else
	{
		this.cursorImageElem.style.display = "block";

		if( !isFullscreen )
			this.hideLibretroOverlay();
	}

	var elem = document.querySelector("#objectMenu");
	//console.log("Is selected object: " + isSelectedObject + " and " + (isSelectedObject === 1));
	if( isSelectedObject === 1 && !!elem )
		elem.style.display = "block";
	
	var elems = document.body.querySelectorAll(".aaOnlyIfCanStream");
	var i;
	for( i = 0; i < elems.length; i++ )
		elems[i].style.display = (canStream) ? "inline-block" : "none";

	var elems = document.body.querySelectorAll(".aaOnlyIfLibretroCanRun");
	var i;
	for( i = 0; i < elems.length; i++ )
		elems[i].style.display = (libretroCanRun) ? "inline-block" : "none";

	var elems = document.body.querySelectorAll(".aaOnlyIfCanPreview");
	var i;
	for( i = 0; i < elems.length; i++ )
		elems[i].style.display = (canPreview) ? "inline-block" : "none";

/*
	var selectedWebTab = aaapi.cmdEx("getSelectedWebTab");
	if( selectedWebTab && (!this.selectedWebTab || selectedWebTab.id !== this.selectedWebTab.id) )
	{
		if( !selectedWebTab || selectedWebTab.id === "hud" )
			document.body.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
		else
			document.body.style.backgroundColor = "transparent";

		if( isHudPinned )
			this.pinHudButtonElem.style.display = "none";
		else
			this.pinHudButtonElem.style.display = "table-cell";

		this.selectedWebTab = selectedWebTab;
	}
	*/

//	document.body.style.backgroundColor = "transparent";
	if( !!this.libretroHudButtonElem )
	{
		if( embeddedInstanceType === "Libretro" )
			this.libretroHudButtonElem.style.display = "inline-block";
		else
			this.libretroHudButtonElem.style.display = "none";
	}

	// if there's no map loaded, show the startup wallpaper
	if( !isMapLoaded )
	{
		var startupWallpaper = localStorage.getItem("aaStartupWallpaper");
		if( !!startupWallpaper )
		{
			// replace all \ with / so that it can be used in CSS background URL syntax
			var wallpaperSrc = startupWallpaper.replace(/\\/g, "/");

			if( wallpaperSrc.indexOf(":") === 1 )
				wallpaperSrc = "asset://local/" + wallpaperSrc;

			document.body.style.background = "transparent url('" + wallpaperSrc + "') center";
			document.body.style.backgroundSize = "cover";
		}
	}

//window["aaOnActivateInputMode"]({"tester": false});
	// call any callback on the page, if one exists.
	//console.log("PRIOR: " + activeScraperId);
	if( typeof window["aaOnActivateInputMode"] === "function" )
		window["aaOnActivateInputMode"]({
			"fullscreen": isFullscreen,
			"hudPinned": isHudPinned,
			"mapLoaded": isMapLoaded,
			"objectSelected": isObjectSelected,
			"itemSelected": isItemSelected,
			"mainMenu": isMainMenu,
			"url": url,
			"selectedObject": isSelectedObject,
			"embeddedInstanceType": embeddedInstanceType,
			"canStream": canStream,
			"canPreview": canPreview,
			"canGoForward": canGoForward,
			"canGoBack": canGoBack,
			"libretroCore": libretroCore,
			"libretroFile": libretroFile,
			"libretroCanRun": libretroCanRun,
			"libretroOverlayX": libretroOverlayX,
			"libretroOverlayY": libretroOverlayY,
			"libretroOverlayWidth": libretroOverlayWidth,
			"libretroOverlayHeight": libretroOverlayHeight,
			"libretroOverlayId": libretroOverlayId,
			"activeScraperId": activeScraperId
		});

	var embeddedLabel = "AArcade";
	if( embeddedInstanceType === "SteamworksBrowser" )
	{
		//if( activeScraperId === "")
			embeddedLabel = "Web Browser";
		//else
		//	embeddedLabel = "Scrape Mode";
	}
	else if( embeddedInstanceType === "AwesomiumBrowser" )
		embeddedLabel = "Awesomium";
	else if( embeddedInstanceType === "Libretro" )
		embeddedLabel = "Libretro";
	
	//document.querySelector("#topLabel").innerHTML = embeddedLabel;
	var titleElems = document.querySelectorAll(".topLabel");
	for( var i = 0; i < titleElems.length; i++ )
	{
		titleElems[i].innerHTML = embeddedLabel;
		if( embeddedInstanceType === "Libretro" )
			titleElems[i].setAttribute("help", "Expand the Libretro top menu.");
		else if( embeddedInstanceType === "SteamworksBrowser" )
			titleElems[i].setAttribute("help", "Expand the web browser top menu.");
	}

	var navElems = document.querySelectorAll(".hudHeaderNavigationContainer");
	for( var i = 0; i < navElems.length; i++ )
	{
		if( navElems[i].getAttribute("frameworkName") === embeddedInstanceType )
			navElems[i].style.display = "table";
		else
			navElems[i].style.display = "none";
	}

	this.embeddedInstanceType = embeddedInstanceType;
	if( embeddedInstanceType === "Libretro" )
	{
		// unhide the GUI Gamepad, if needed
		var GUIGamepadElem = document.querySelector("#GUIGamepad");
		if( !!GUIGamepadElem && aaapi.cmdEx("getLibretroGUIGamepadEnabled") )
			GUIGamepadElem.style.display = "block";
	}

	// steamworks back/forward buttons
	var navButtons = document.querySelectorAll(".navArrowButton");
	for( var i = 0; i < navButtons.length; i++ )
	{
		if( navButtons[i].classList.contains("navArrowButtonBack") )
		{
			if( canGoBack == "1" )
				navButtons[i].classList.remove("aaDisabled");
			else
				navButtons[i].classList.add("aaDisabled");
		}
		else if( navButtons[i].classList.contains("navArrowButtonForward") )
		{
			if( canGoForward == "1" )
				navButtons[i].classList.remove("aaDisabled");
			else
				navButtons[i].classList.add("aaDisabled");
		}
	}

	var libretroCoreElem = document.querySelector(".aaLibretroTopInputCore");
	if( !!libretroCoreElem )
	{
		var coreValue = libretroCore;
		var foundAt = coreValue.lastIndexOf("\\");
		if( foundAt < 0 )
			foundAt = coreValue.lastIndexOf("/");

		if( foundAt >= 0 )
			coreValue = coreValue.substring(foundAt+1);

		libretroCoreElem.value = coreValue;
	}

	var libretroFileElem = document.querySelector(".aaLibretroTopInputFile");
	if( !!libretroFileElem )
	{
		var fileValue = libretroFile;
		var foundAt = fileValue.lastIndexOf("\\");
		if( foundAt < 0 )
			foundAt = fileValue.lastIndexOf("/");

		if( foundAt >= 0 )
			fileValue = fileValue.substring(foundAt+1);

		libretroFileElem.value = fileValue;
	}

	this.onURLChanged(url);
};

ArcadeHud.prototype.setHudTitle = function(text)
{
	/*
	this.title = text;
	this.titleNode.nodeValue = this.title;
	*/
};

ArcadeHud.prototype.addHudLoadingMessage = function(type, text, title, id, min, max, current, callbackMethod)
{
	var myMessage = {
		"type": type,
		"text": text,
		"title": title,
		"id": id,
		"min": min,
		"max": max,
		"current": current,
		"callbackMethod": callbackMethod	// always in the system sub-object
	};

	//var keys = Object.keys(this.hudLoadingMessages);
	//console.log(JSON.stringify(keys));

	if( !!!this.hudLoadingMessages[id] )
	{
		//console.log("Checkpoint A: " + id);
		this.hudLoadingMessages[id] = {
			"message": myMessage
		};
	}
	else
	{
		if( !!!this.hudLoadingMessages[id].message )
		{
			this.hudLoadingMessages[id].message = {};
			//console.log("Checkpoint B" + id);
		}

		var x;
		for( x in myMessage )
		{
			this.hudLoadingMessages[id].message[x] = myMessage[x];
		}
	}

	if( this.hudLoadingMessages[id].message.text === "" )
		this.hudLoadingMessages[id].message.text = this.hudLoadingMessages[id].message.title;


//console.log(JSON.stringify(this.hudLoadingMessages[id]));

	if( this.DOMReady )
		this.dispatchHudLoadingMessages();

	if( myMessage.id === "spawningobjects" && this.DOMReady && !!document.querySelector("#shouldShowLoadingImages") )
	{
		var goodCurrent;
		if( myMessage.current[0] === "+" )
		{
			var delta = (myMessage.current.length === 1) ? 1 : parseInt(myMessage.current.substring(1));

			var messageObject = this.hudLoadingMessages[myMessage.id];
			if( !!!messageObject.container.previousCurrent )
				goodCurrent = delta;
			else
				goodCurrent = messageObject.container.previousCurrent + delta;

			goodCurrent = goodCurrent.toString();
		}
		else
			goodCurrent = myMessage.current;

		if( parseInt(goodCurrent) === parseInt(max) + 1 )
		{
			var myFakeMessage = {
				"type": "progress",
				"text": "",
				"title": "Initializing Images...",
				"id": "loadingimages",
				"min": "",
				"max": "",
				"current": "",
				"callbackMethod": ""
			};

			this.addHudLoadingMessage(myFakeMessage.type, myFakeMessage.text, myFakeMessage.title, myFakeMessage.id, myFakeMessage.min, myFakeMessage.max, myFakeMessage.current, myFakeMessage.callbackMethod);
		}
	}
};

ArcadeHud.prototype.dispatchHudLoadingMessages = function()
{
	/*
	var startupIds = [
		"locallibrarytypes",
		"locallibrarymodels",
		"locallibraryapps",
		"locallibraryitems",
		"mounts",
		"workfetch",
		"detectmaps",
		"workshoplibrarymodels",
		"workshoplibraryitems",
		"skiplegacyworkshops",
		"mountworkshops",
		"oldlibrarymodels",
		"oldlibraryitems"
		];
	*/

	//var bStartupHandled = false;

	var isNewMsg = false;
	var empty = true;
	var x, message, messageObject, className, progressText, percent;
	var hudLoadingMessageKeys = Object.keys(this.hudLoadingMessages);
	//for( x in this.hudLoadingMessages )
	for( var i = 0; i < hudLoadingMessageKeys.length; i++ )
	{
		messageObject = this.hudLoadingMessages[hudLoadingMessageKeys[i]];

		if( !!!messageObject.message )
			continue;

		//if( !!messageObject.message && !!this.startupLoadingMessagesContainer )// && startupIds.indexOf(messageObject.message.id) >= 0 )
		//	bStartupHandled = true;

		if( !!!messageObject.container )
		{
			isNewMsg = true;

			messageObject.container = document.createElement("div");
			//if( !!this.startupLoadingMessagesContainer )
			//	messageObject.container.className = "hudLoadingMessageContainer aaTextSizeFontSize aaTextColorOneColor aaThemeColorOneShadedBorderColor";
			//else
				messageObject.container.className = "hudLoadingMessageContainer aaTextSizeFontSize aaTextColorOneColor aaThemeColorOneShadedBorderColor";

			if( !!this.startupLoadingMessagesContainer )
				this.startupLoadingMessagesContainer.appendChild(messageObject.container);
			else
				this.hudLoadingMessagesContainer.appendChild(messageObject.container);
		}
		else
		{
			//if( !!!messageObject.message )
			//	continue;

			// empty out the container
			var firstChild = messageObject.container.firstChild;
			while( firstChild )
			{
				messageObject.container.removeChild(firstChild);
				firstChild = messageObject.container.firstChild;
			}
		}

		empty = false;

		if( messageObject.message.type === "progress" )
		{
			var goodCurrent;
			if( messageObject.message.current[0] === "+" )
			{
				var delta = (messageObject.message.current.length === 1) ? 1 : parseInt(messageObject.message.current.substring(1));

				if( !!!messageObject.container.previousCurrent )
					messageObject.container.previousCurrent = delta;
				else
					messageObject.container.previousCurrent += delta;

				goodCurrent = messageObject.container.previousCurrent.toString();
			}
			else
				goodCurrent = messageObject.message.current;

			progressText = "";
			if( goodCurrent !== "" )
			{
				if( messageObject.message.max !== "" )
					progressText += " (" + goodCurrent + "/" + messageObject.message.max + ")";
				else
					progressText = " (" + goodCurrent + ")";
			}

			//className = "hudLoadingMessageContainer progress";
			messageObject.container.classList.add("progress");

			percent = 0;
			if( messageObject.message.max === "0" || messageObject.message.max === "" )
				percent = 100;
			else if( progressText !== "" )
			{
				if( messageObject.message.max === goodCurrent )
					percent = 100;

				percent = Math.floor((parseInt(goodCurrent) / parseInt(messageObject.message.max)) * 100);

				/*
				if( percent === 100 )
				{
					setTimeout(function()
					{
						this.container.parentNode.removeChild(this.container);
					}.bind(messageObject), 500);
				}
				*/
			}

			messageObject.container.style.backgroundImage = "-webkit-linear-gradient(left, " + this.themeColors.ThemeColorOne.defaultValue + ", " + this.themeColors.ThemeColorOne.defaultValue + " " + percent + "%, " + this.themeColors.ThemeColorOne.lowValue + " " + percent + "%, " + this.themeColors.ThemeColorOne.lowValue + " 100%)";
			//messageObject.container.innerHTML = "<div style='border: 2px solid pink;'>" + messageObject.message.title + progressText + "</span>";
			messageObject.container.innerText = messageObject.message.title + progressText;
		}
		else
		{
			messageObject.container.classList.add("aaThemeColorOneBackgroundColor");
			//className = "hudLoadingMessageContainer";
			//messageObject.container.innerHTML = "<div style='border: 2px solid pink;'>" + messageObject.message.title + progressText + "</span>";
			messageObject.container.innerText = messageObject.message.text;
		}

		if(  messageObject.message.callbackMethod !== "" )
		{
			//if( !!aaapi.callbacks[messageObject.message.callbackMethod] )
			//{
				messageObject.container.callbackMethod = messageObject.message.callbackMethod;
				setTimeout(function()
				{
					aaapi.cmd(this.callbackMethod);
					//this.parentNode.removeChild(this);
				}.bind(messageObject.container), 1);
			//}
		}

		//messageObject.container.className = className;
		//delete messageObject.message;
		delete this.hudLoadingMessages[hudLoadingMessageKeys[i]].message;
	}

	if( !empty )
	{
		/*
		if( !bStartupHandled )
		{
			if( isNewMsg )
				this.hudLoadingMessagesContainer.scrollTop = this.hudLoadingMessagesContainer.scrollHeight;

			this.helpElem.style.display = "block";
		}
		else
		{
			*/
			if( isNewMsg && !!this.startupLoadingMessagesContainer )
				this.startupLoadingMessagesContainer.parentNode.scrollTop = this.startupLoadingMessagesContainer.parentNode.scrollHeight;
		//}
	}
};

ArcadeHud.prototype.showCursorPreviewImage = function(uri, backupUri)
{
	var goodUri;
	var goodBackupUri;

	if( uri !== "" )
	{
		goodUri = uri;
		goodBackupUri = backupUri;
	}
	else if( goodBackupUri !== "" )
	{
		goodUri = backupUri;
		goodBackupUri = "";
	}

	if( this.cursorPreviewImageElem.src === goodUri )
		this.cursorPreviewImageElem.style.display = "inline-block";
	else
	{
		this.cursorPreviewImageElem.style.display = "none";

		this.cursorPreviewImageElem.backupUri = goodBackupUri;
		this.cursorPreviewImageElem.src = goodUri;
	}
};

ArcadeHud.prototype.hideCursorPreviewImage = function(uri)
{
	this.cursorPreviewImageElem.style.display = "none";
};

ArcadeHud.prototype.showScraperPopupMenu = function(popupId, x, y, width, height, itemHeight, fontSize, selectedItem, rightAligned, callback)
{
	console.log("Popup is: " + popupId);
	var popup = {
		"popupId": popupId,
		"x": parseInt(x),
		"y": parseInt(y),
		"width": parseInt(width),
		"height": parseInt(height),
		"itemHeight": parseInt(itemHeight),
		"fontSize": parseFloat(fontSize),
		"selectedItem": parseInt(selectedItem),
		"rightAligned": (rightAligned !== "0"),
		"callback": callback,
		"items": new Array()
	};

	var argIndex = 10;
	var numArguments = arguments.length;
	var popupItem;
	while( argIndex <= arguments.length - 8)
	{
		popupItem = {
			"type": arguments[argIndex],
			"label": arguments[argIndex+1],
			"tooltip": arguments[argIndex+2],
			"action": arguments[argIndex+3],	// a string for generic popups.
			"right_to_left": (arguments[argIndex+4] !== "0"),
			"has_directional_override": (arguments[argIndex+5] !== "0"),
			"enabled": (arguments[argIndex+6] !== "0"),
			"checked": (arguments[argIndex+7] !== "0")
		};

		popup.items.push(popupItem);
		argIndex += 8;
	}

	var blackout = document.createElement("div");
	blackout.style.cssText = "background-color: transparent; position: fixed; top: 0; left: 0; bottom: 0; right: 0;";
	blackout.popup = popup;

	blackout.addEventListener("mousedown", function(e)
	{
		var elem = e.srcElement;
		// make sure the blackout elem is what got clicked
		if( !!!elem.popup )
			return;

		elem.parentNode.removeChild(elem);
	}, true);

	var container = document.createElement("div");
	container.className = "popupMenuContainer";
	container.style.left = popup.x - 2 + "px";
	container.style.top = popup.y + popup.height + "px";
	container.style.width = popup.width - 2 + "px";
	//container.style.height = popup.height + "px";

	var popupMenuItems = document.createElement("div");
	popupMenuItems.className = "popupMenuItems";

	var i, option, optionTextNode;
	var numItems = popup.items.length;
	for( i = 0; i < numItems; i++ )
	{
		option = document.createElement("div");
		option.className = "popupMenuItem";
		option.style.fontSize = Math.round(popup.fontSize) + "px";
//		if( popup.selectedItem === i )
//			option.className += " selectedPopupMenuItem";

		option.blackout = blackout;		
		option.popupItem = popup.items[i];
		option.addEventListener("click", function(e)
		{
			var elem = e.srcElement;
			if( !!!elem.blackout )
				return;

			//aaapi.cmdEx("didSelectPopupMenuItem", elem.blackout.popup.popupId, elem.blackout.popup.items.indexOf(elem.popupItem));

			//elem.blackout.popup.callback(elem.blackout.popup.action);
			elem.blackout.popup.callback(elem.popupItem.action);
			elem.blackout.parentNode.removeChild(elem.blackout);
		}, true);

		optionTextNode = document.createTextNode(popup.items[i].label);
		option.appendChild(optionTextNode);
		popupMenuItems.appendChild(option);
	}

	var optionSearchContainer = document.createElement("div");
	optionSearchContainer.className = "popupMenuItemSearch";

	var optionSearchForm = document.createElement("form");
	optionSearchForm.addEventListener("submit", function(e)
	{
		console.log("FIRST ONE");
		//console.log(e.srcElement.firstChild.popupMenuItems.childNodes);
		var elem = e.srcElement.firstChild;

		var i;
		var count = 0;
		var firstIndex = -1;
		var numNodes = elem.popupMenuItems.childNodes.length;
		for( i = 0; i < numNodes && count < 2; i++ )
		{
			if( elem.popupMenuItems.childNodes[i].style.display !== "none" )
			{
				if( count === 0 )
					firstIndex = i;

				count++;
			}
		}

		if( count > 0 )//count === 1 )
		{
			var optionElem = elem.popupMenuItems.childNodes[firstIndex];
			//aaapi.cmdEx("didSelectPopupMenuItem", optionElem.blackout.popup.popupId, optionElem.blackout.popup.items.indexOf(optionElem.popupItem));
			optionElem.blackout.parentNode.removeChild(optionElem.blackout);
		}

		e.preventDefault();
		return false;
	}, true);

	var optionSearch = document.createElement("input");
	optionSearch.popupMenuItems = popupMenuItems;
	optionSearch.type = "text";
	optionSearch.placeholder = "Search...";
	optionSearch.changeTimeout = null;

	optionSearch.addEventListener("input", function(e)
	{
		var elem = e.srcElement;
		if( elem.changeTimeout )
			clearTimeout(elem.changeTimeout);

		elem.changeTimeout = setTimeout(function()
		{
			// step through all options and set display mode accordingly
			var searchText = this.value.toLowerCase();

			var i, popupMenuItem;
			var numPopupMenuItems = this.popupMenuItems.childNodes.length;
			for( i = 0; i < numPopupMenuItems; i++ )
			{
				popupMenuItem = this.popupMenuItems.childNodes[i];
				if( popupMenuItem.popupItem.label.toLowerCase().indexOf(searchText) >= 0 )
					popupMenuItem.style.display = "block";
				else
					popupMenuItem.style.display = "none";
			}

			//console.log(this.value);
			changeTimeout = null;
		}.bind(elem), 300);
	}, true);

	optionSearchForm.appendChild(optionSearch);
	optionSearchContainer.appendChild(optionSearchForm);

	container.appendChild(popupMenuItems);
	container.appendChild(optionSearchContainer);

	blackout.appendChild(container);
	document.body.insertBefore(blackout, this.cursorElem);

	optionSearch.focus();
};

ArcadeHud.prototype.spawnItem = function(mode, itemId, searchText, filterText)
{
	if( !!!searchText )
		searchText = "";

	if( !!!filterText )
		filterText = "";

	var oldTransform = localStorage.getItem("trans" + itemId);

	if( !!!oldTransform )
		oldTransform = {};
	else
		oldTransform = JSON.parse(oldTransform);

	var modelId = oldTransform.modelId;
	if( typeof modelId === 'undefined' )
		modelId = "";

	var scale = oldTransform.scale;
	if( typeof scale === 'undefined' )
		scale = "1.0";

	var pitch = oldTransform.pitch;
	if( typeof pitch === 'undefined' )
		pitch = "0";

	var yaw = oldTransform.yaw;
	if( typeof yaw === 'undefined' )
		yaw = "0";
	
	var roll = oldTransform.roll;
	if( typeof roll === 'undefined' )
		roll = "0";
	
	var offX = oldTransform.offX;
	if( typeof offX === 'undefined' )
		offX = "0";
	
	var offY = oldTransform.offY;
	if( typeof offY === 'undefined' )
		offY = "0";
	
	var offZ = oldTransform.offZ;
	if( typeof offZ === 'undefined' )
		offZ = "0";

	//if(!givenTabId || givenTabId === "tasks")
	//	aaapi.cmd("consoleCommand", "ignore_next_tab_up 1");

	//var mode = document.querySelector(".activeModeButton").getAttribute("modeName");

	if( mode === "models" )
		modelId = "";

	if( mode === "items" )
	{
		aaapi.cmd("statAction", "aa_items_spawned", 1);
		aaapi.cmd("setLibraryBrowserContext", "items", itemId, searchText, filterText);
		aaapi.cmd("spawnEntry", mode, itemId, searchText, filterText, modelId, scale, pitch, yaw, roll, offX, offY, offZ);
	}
	else if( mode === "models" )
	{
		if( this.npcs.hasOwnProperty(itemId) )
		{
			aaapi.cmd("statAction", "aa_npcs_spawned", 1);
			aaapi.cmd("statAction", "aa_npcs_used", 1, itemId);
		}
		else if( this.letters.indexOf(itemId) >= 0 )
		{
			aaapi.cmd("statAction", "aa_letters_spawned", 1);
			aaapi.cmd("statAction", "aa_letters_used", 1, itemId);
		}
		else if( this.defaultModels.indexOf(itemId) >= 0 )
		{
			aaapi.cmd("statAction", "aa_props_spawned", 1);
			aaapi.cmd("statAction", "aa_props_used", 1, itemId);
		}
		else
			aaapi.cmd("statAction", "aa_props_spawned", 1);

		aaapi.cmd("setLibraryBrowserContext", "models", itemId, searchText, filterText);
		aaapi.cmd("spawnEntry", mode, itemId, searchText, filterText, modelId, scale, pitch, yaw, roll, offX, offY, offZ);
	}
};

ArcadeHud.prototype.isFavorite = function(property, id)
{
	for( var i = 0; i < arcadeHud.favorites.length; i++ )
	{
		if( !!arcadeHud.favorites[i][property] && arcadeHud.favorites[i][property] === id )
			return true;
	}

	return false;
};

ArcadeHud.prototype.unfavorite = function(mode, itemId)
{
	if( mode === "items" )
	{
		var alreadyExists = false;
		for( var i = 0; i < arcadeHud.favorites.length; i++ )
		{
			if( arcadeHud.favorites[i].item === itemId )
			{
				alreadyExists = true;

				// Remove this entry
				arcadeHud.favorites.splice(i, 1);
				localStorage.setItem("myBackpack", JSON.stringify(arcadeHud.favorites));
				aaapi.cmd("addToastMessage", "Removed Item From Favorites");
				return;
			}
		}
	}
	else
	{
		var alreadyExists = false;
		for( var i = 0; i < arcadeHud.favorites.length; i++ )
		{
			if( arcadeHud.favorites[i].model === itemId )
			{
				alreadyExists = true;

				// Remove this entry
				arcadeHud.favorites.splice(i, 1);
				localStorage.setItem("myBackpack", JSON.stringify(arcadeHud.favorites));
				aaapi.cmd("addToastMessage", "Removed Item From Favorites");
				return;
			}
		}
	}
};

ArcadeHud.prototype.doHideItem = function(mode, itemId)
{
	if( mode === "items" )
	{
		arcadeHud.hiddenItems[itemId] = "1";
		localStorage.setItem("hiddenItems", JSON.stringify(arcadeHud.hiddenItems));
	}
	else
	{
		arcadeHud.hiddenItems[itemId] = "1";
		localStorage.setItem("hiddenItems", JSON.stringify(arcadeHud.hiddenItems));
	}
};

ArcadeHud.prototype.favorite = function(mode, itemId)
{
	if( mode === "items" )
	{
		for( var i = 0; i < arcadeHud.favorites.length; i++ )
		{
			if( arcadeHud.favorites[i].item === itemId )
				return;
		}

		// Remove this entry
		arcadeHud.favorites.push({"item": itemId});
		localStorage.setItem("myBackpack", JSON.stringify(arcadeHud.favorites));
		aaapi.cmd("addToastMessage", "Added Item To Favorites");
	}
	else
	{
		for( var i = 0; i < arcadeHud.favorites.length; i++ )
		{
			if( arcadeHud.favorites[i].model === itemId )
				return;
		}

		// Remove this entry
		arcadeHud.favorites.push({"model": itemId});
		localStorage.setItem("myBackpack", JSON.stringify(arcadeHud.favorites));
		aaapi.cmd("addToastMessage", "Added Item To Favorites");
	}
};

ArcadeHud.prototype.createTile = function(item, tilesContainer, mode, searchText, clickCallback, size)
{
	if( !!!item )
		return;

	var isAutoplay = false;
	if( !!!mode )
		mode = "items";
	else if( mode === "autoplay" )
	{
		mode = "items";
		isAutoplay = true;
	}
	//var mode = document.querySelector(".activeModeButton").getAttribute("modeName");

	var dummy = document.createElement("div");

	var itemId = item.info.id;
	var tile;
	var tileImage;
	var buttonsContainer;
	var unfavoriteButtonContainer, unfavoriteButton, favoriteButtonContainer, favoriteButton, hideButtonContainer, hideButton, editButtonContainer, editButton;

	var favoriteIconHTML = arcadeHud.generateIconHTML("favoriteicon.png", 24, 24, "aaThemeColorOneColor");
	var unfavoriteIconHTML = arcadeHud.generateIconHTML("unfavoriteicon.png", 24, 24, "aaThemeColorOneColor");
	var hideIconHTML = arcadeHud.generateIconHTML("eye.png", 24, 24, "aaThemeColorOneColor");
	var editIconHTML = arcadeHud.generateIconHTML("editicon.png", 24, 24, "aaThemeColorOneColor");

	tile = document.createElement("div");
	if( this.isFavorite(mode.substring(0, mode.length - 1), itemId) )//(mode.substring(0, mode.length - 1), itemId) )
		tile.className = "helpNote aaTile aaFavoriteTile";
	else
		tile.className = "helpNote aaTile";

	if( !!size )
		size = parseInt(size);

	if( size > 0 )
	{
		tile.style.width = size + "px";
		tile.style.height = size + "px";
	}

	dummy.innerHTML = "";
	dummy.appendChild(document.createTextNode(item.title));

	tile.setAttribute("help", dummy.innerHTML);
	tile.itemId = itemId;
	tile.searchText = searchText;
	tile.mode = mode;
	tile.clickCallback = clickCallback;
	tile.addEventListener("click", function(e)
	{
		if( !!!this.searchText )
		{
			if( document.querySelector("#searchTermBox") )
				this.searchText = document.querySelector("#searchTermBox").value;
			else
				this.searchText = "";
		}

		if( typeof this.clickCallback === "function" )
			this.clickCallback(this);
		else
			arcadeHud.spawnItem(this.mode, this.itemId, this.searchText);
	}.bind(tile), false);


	if( mode === "items" )
	{
		var buttonsContainerOuter = document.createElement("div");
		buttonsContainerOuter.style.position = "relative";

		buttonsContainer = document.createElement("div");
		buttonsContainer.className = "aaInstancesButtonContainer";
		buttonsContainer.style.cssText = "position: absolute; z-index: 10;";



		unfavoriteButtonContainer = document.createElement("div");
		unfavoriteButtonContainer.className = "helpNote aaUnfavoriteButton";
		unfavoriteButtonContainer.setAttribute("help", "Remove this item from your favorites.");
		//unfavoriteButtonContainer.style.cssText = "display: inline-block;";

		unfavoriteButton = document.createElement("div");
		unfavoriteButton.itemId = itemId;
		unfavoriteButton.tile = tile;
		unfavoriteButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			arcadeHud.unfavorite("items", this.itemId);
			this.tile.parentNode.removeChild(this.tile);
		}.bind(unfavoriteButton), true);
		unfavoriteButton.innerHTML = unfavoriteIconHTML;
		unfavoriteButtonContainer.appendChild(unfavoriteButton);
		buttonsContainer.appendChild(unfavoriteButtonContainer);

		arcadeHud.assignHelp(unfavoriteButtonContainer);

		favoriteButtonContainer = document.createElement("div");
		favoriteButtonContainer.className = "helpNote aaFavoriteButton";
		favoriteButtonContainer.setAttribute("help", "Add this item to your favorites.");
		//favoriteButtonContainer.style.cssText = "display: inline-block;";

		favoriteButton = document.createElement("div");
		favoriteButton.itemId = itemId;
		favoriteButton.tile = tile;
		favoriteButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			this.tile.classList.add("aaFavoriteTile");
			arcadeHud.favorite("items", this.itemId);
			//window.location.reload();
		}.bind(favoriteButton), true);
		favoriteButton.innerHTML = favoriteIconHTML;
		favoriteButtonContainer.appendChild(favoriteButton);
		buttonsContainer.appendChild(favoriteButtonContainer);

		arcadeHud.assignHelp(favoriteButtonContainer);



		editButtonContainer = document.createElement("div");
		editButtonContainer.className = "helpNote aaHideTileButton";
		editButtonContainer.setAttribute("help", "Edit this items's properties.");

		editButton = document.createElement("div");
		editButton.itemId = itemId;
		editButton.tile = tile;
		editButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			window.location='asset://ui/editItem.html?id=' + encodeURIComponent(itemId);// + "&uiback=" + encodeURIComponent("window.location='asset://ui/libraryBrowserEZ.html';");;
			//arcadeHud.doHideItem("items", this.itemId);
			//this.tile.style.display = "none";
			return false;
		}.bind(editButton), true);
		editButton.innerHTML = editIconHTML;
		editButtonContainer.appendChild(editButton);
		buttonsContainer.appendChild(editButtonContainer);

		arcadeHud.assignHelp(editButtonContainer);




		tile.appendChild(buttonsContainer);



		if( !isAutoplay )
		{
			hideButtonContainer = document.createElement("div");
			hideButtonContainer.className = "helpNote aaHideTileButton";
			hideButtonContainer.setAttribute("help", "Hide this item on all item lists.");

			hideButton = document.createElement("div");
			hideButton.itemId = itemId;
			hideButton.tile = tile;
			hideButton.addEventListener("click", function(e)
			{
				e.stopImmediatePropagation();
				arcadeHud.doHideItem("items", this.itemId);
				this.tile.style.display = "none";
			}.bind(hideButton), true);
			hideButton.innerHTML = hideIconHTML;
			hideButtonContainer.appendChild(hideButton);
			buttonsContainer.appendChild(hideButtonContainer);

			arcadeHud.assignHelp(hideButtonContainer);
		}


		buttonsContainerOuter.appendChild(buttonsContainer);
		tile.appendChild(buttonsContainerOuter);
	}
	else
	{
		if( !!item.screen && item.screen !== "" )
		{
			if( item.screen.indexOf(":") === 1 )
			{
				var imageSrc = "asset://local/" + item.screen;
				imageSrc = imageSrc.replace(/\\/g, "/");
				item.screen = imageSrc;
			}
			else if( item.screen.toLowerCase().indexOf("http://") === 0 || item.screen.toLowerCase().indexOf("https://") === 0 || item.screen.toLowerCase().indexOf("www.") === 0 )
				item.screen = item.screen;
		}
		else
		{
			var modelName = item.platforms[arcadeHud.platformId].file;
			var found = modelName.lastIndexOf("\\");
			if( found >= 0 )
				modelName = modelName.substring(found+1);
			else
			{
				found = modelName.lastIndexOf("/");
				if( found >= 0 )
					modelName = modelName.substring(found+1);
			}

			if( found >= 0 )
			{
				found = modelName.lastIndexOf(".");
				if( found >= 0 )
				{
					modelName = modelName.substring(0, found);
					item.screen = "props/" + modelName + ".png";
				}
			}
		}


		var buttonsContainerOuter = document.createElement("div");
		buttonsContainerOuter.style.position = "relative";

		buttonsContainer = document.createElement("div");
		buttonsContainer.className = "aaInstancesButtonContainer";
		buttonsContainer.style.cssText = "position: absolute; z-index: 10;";



		unfavoriteButtonContainer = document.createElement("div");
		unfavoriteButtonContainer.className = "helpNote aaUnfavoriteButton";
		unfavoriteButtonContainer.setAttribute("help", "Remove this item from your favorites.");
		//unfavoriteButtonContainer.style.cssText = "display: inline-block;";

		unfavoriteButton = document.createElement("div");
		unfavoriteButton.itemId = itemId;
		unfavoriteButton.tile = tile;
		unfavoriteButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			arcadeHud.unfavorite("models", this.itemId);
			this.tile.parentNode.removeChild(this.tile);
		}.bind(unfavoriteButton), true);
		unfavoriteButton.innerHTML = unfavoriteIconHTML;
		unfavoriteButtonContainer.appendChild(unfavoriteButton);
		buttonsContainer.appendChild(unfavoriteButtonContainer);

		arcadeHud.assignHelp(unfavoriteButtonContainer);

		favoriteButtonContainer = document.createElement("div");
		favoriteButtonContainer.className = "helpNote aaFavoriteButton";
		favoriteButtonContainer.setAttribute("help", "Add this item to your favorites.");
		//favoriteButtonContainer.style.cssText = "display: inline-block;";

		favoriteButton = document.createElement("div");
		favoriteButton.itemId = itemId;
		favoriteButton.tile = tile;
		favoriteButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			this.tile.classList.add("aaFavoriteTile");
			arcadeHud.favorite("models", this.itemId);
			//window.location.reload();
		}.bind(favoriteButton), true);
		favoriteButton.innerHTML = favoriteIconHTML;
		favoriteButtonContainer.appendChild(favoriteButton);
		buttonsContainer.appendChild(favoriteButtonContainer);

		arcadeHud.assignHelp(favoriteButtonContainer);






		editButtonContainer = document.createElement("div");
		editButtonContainer.className = "helpNote aaHideTileButton";
		editButtonContainer.setAttribute("help", "Edit this entry's properties.");

		editButton = document.createElement("div");
		editButton.itemId = itemId;
		editButton.tile = tile;
		editButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			window.location='asset://ui/editModel.html?id=' + encodeURIComponent(itemId);// + "&uiback=" + encodeURIComponent("window.location='asset://ui/libraryBrowserEZ.html';");;
			//arcadeHud.doHideItem("items", this.itemId);
			//this.tile.style.display = "none";
			return false;
		}.bind(editButton), true);
		editButton.innerHTML = editIconHTML;
		editButtonContainer.appendChild(editButton);
		buttonsContainer.appendChild(editButtonContainer);

		arcadeHud.assignHelp(editButtonContainer);





		tile.appendChild(buttonsContainer);



		hideButtonContainer = document.createElement("div");
		hideButtonContainer.className = "helpNote aaHideTileButton";
		hideButtonContainer.setAttribute("help", "Hide this item on all item lists.");

		hideButton = document.createElement("div");
		hideButton.itemId = itemId;
		hideButton.tile = tile;
		hideButton.addEventListener("click", function(e)
		{
			e.stopImmediatePropagation();
			arcadeHud.doHideItem("models", this.itemId);
			this.tile.style.display = "none";
		}.bind(hideButton), true);
		hideButton.innerHTML = hideIconHTML;
		hideButtonContainer.appendChild(hideButton);
		buttonsContainer.appendChild(hideButtonContainer);

		arcadeHud.assignHelp(hideButtonContainer);


		buttonsContainerOuter.appendChild(buttonsContainer);
		tile.appendChild(buttonsContainerOuter);
	}


	var modelFile;
	var modelThumbnail;
	//&& (!!!item.screen || item.screen.indexOf(".") < 0)
	if( false && !!item && arcadeHud.npcs.indexOf(item.info.id) < 0 && arcadeHud.defaultModels.indexOf(item.info.id) < 0 && arcadeHud.letters.indexOf(item.info.id) < 0 && !!item.platforms && !!item.platforms[arcadeHud.platformId] && !!item.platforms[arcadeHud.platformId].file && item.platforms[arcadeHud.platformId].file.indexOf(".mdl") === item.platforms[arcadeHud.platformId].file.length-4 )
	{
		modelFile = item.platforms[arcadeHud.platformId].file;
		modelFile = modelFile.replace(/\\/g, "/");
		modelThumbnail = aaapi.cmdEx("generateModelThumbnail", modelFile);
	}

	if( !!modelThumbnail )
		tileImage = document.createElement("div");
	else
		tileImage = document.createElement("img");

	tileImage.className = "aaTileImage";

	if( size > 0 )
		tileImage.style.height = size + Math.round(size * 0.2) + "px";

	tileImage.style.display = "none";

	if( !!!modelThumbnail )
	{
		tileImage.timerHandle = setTimeout(function()
		{
			//var mode = document.querySelector(".activeModeButton").getAttribute("modeName");
			if( g_imageTilesOnly && mode === "items")
			{
				this.parentNode.style.opacity = "0";
				this.timerHandle = setTimeout(function()
				{
					this.parentNode.style.display = "none";
					delete this.timerHandle;

					if( maxResultsFound )
						searchHandle = setTimeout(nextSearch, 10);
				}.bind(this), 550);
			}
			else
			{
				delete this.timerHandle;
				this.parentNode.style.backgroundImage = "none";
	/*
				var modelName = item.platforms[arcadeHud.platformId].file;
				var found = modelName.lastIndexOf("\\");
				if( found >= 0 )
					modelName = modelName.substring(found+1);
				else
				{
					found = modelName.lastIndexOf("/");
					if( found >= 0 )
						modelName = modelName.substring(found+1);
				}

				found = modelName.lastIndexOf(".");
				if( found >= 0 )
					modelName = modelName.substring(0, found);

				console.log(modelName);
				this.src = "props/" + modelName + ".png";
				*/
	/*
				if( !!item.screen && item.screen !== "" )
				{
					this.src = "asset://local/" + item.screen;
				}
				else
					this.src = "noimageicon.png";
				*/
				this.src = "noimageicon.png";
				this.style.display = "block";
			}
		}.bind(tileImage), 2000);

		//tileImage.parentNode.style.backgroundImage = "url('loading.gif')";
		arcadeHud.loadItemBestImage(tileImage, item, function()
		{
			//var mode = document.querySelector(".activeModeButton").getAttribute("modeName");
			clearTimeout(this.timerHandle);

			this.style.display = "block";
			if( window.hasOwnProperty("g_imageTilesOnly") && g_imageTilesOnly && mode === "items" )
				this.parentNode.style.opacity = "1";

			this.parentNode.style.backgroundImage = "none";
		}.bind(tileImage));
	}
	else
	{
		function loadModelTGA()
		{
			tga.open(modelThumbnail, function()
			{
				var elem = tga.getCanvas();
				elem.style.cssText = "width: 100px; height: 120px;";
	//fieldValue = arcadeHud.generateCRC(fieldValue);
				tileImage.appendChild(elem);

				tileImage.style.display = "block";
				if( window.hasOwnProperty("g_imageTilesOnly") && g_imageTilesOnly && mode === "items" )
					tileImage.parentNode.style.opacity = "1";

				tileImage.parentNode.style.backgroundImage = "none";
			   //document.querySelector("#mapImageContainer").appendChild(mapImage);
			});
		}

		var tga = new TGA();
		if( modelThumbnail.indexOf("-caching-") < 0 )
			loadModelTGA();
		else
		{
			setTimeout(function()
			{
				modelThumbnail = aaapi.cmdEx("generateModelThumbnail", modelFile);
				if( !!modelThumbnail && modelThumbnail.indexOf("-caching-") < 0 )
					loadModelTGA();
			}, 1000);
		}
	}

	tile.appendChild(tileImage);
	if( !!tilesContainer )
		tilesContainer.appendChild(tile);

	arcadeHud.assignHelp(tile);
	return tile;

	//tile.offsetWidth;
	//tile.style.opacity = "1.0";
};

ArcadeHud.prototype.showPopupMenu = function(popupId, x, y, width, height, itemHeight, fontSize, selectedItem, rightAligned)
{
	//console.log("Popup is: " + popupId);
	//console.log(JSON.stringify(arguments));
	var popup = {
		"popupId": popupId,
		"x": parseInt(x),
		"y": parseInt(y),
		"width": parseInt(width),
		"height": parseInt(height),
		"itemHeight": parseInt(itemHeight),
		"fontSize": parseFloat(fontSize),
		"selectedItem": parseInt(selectedItem),
		"rightAligned": (rightAligned !== "0"),
		"items": new Array()
	};

	var argIndex = 9;
	var numArguments = arguments.length;
	var popupItem;
	while( argIndex <= arguments.length - 8)
	{
		popupItem = {
			"type": arguments[argIndex],
			"label": arguments[argIndex+1],
			"tooltip": arguments[argIndex+2],
			"action": parseInt(arguments[argIndex+3]),
			"right_to_left": (arguments[argIndex+4] !== "0"),
			"has_directional_override": (arguments[argIndex+5] !== "0"),
			"enabled": (arguments[argIndex+6] !== "0"),
			"checked": (arguments[argIndex+7] !== "0")
		};

		popup.items.push(popupItem);
		argIndex += 8;
	}

	var blackout = document.createElement("div");
	blackout.style.cssText = "background-color: transparent; position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 9000000;";
	blackout.id = "aaPopupBlackout";
	blackout.popup = popup;

	blackout.addEventListener("mousedown", function(e)
	{
		var elem = e.srcElement;
		// make sure the blackout elem is what got clicked
		if( !!!elem.popup )
			return;

		aaapi.cmdEx("didCancelPopupMenu", elem.popup.popupId);
		elem.parentNode.removeChild(elem);
	}, true);

	var container = document.createElement("div");
	container.className = "popupMenuContainer aaThemeColorTwoBackgroundColor aaTextColorTwoColor aaThemeColorTwoLowBorderColor";
	container.style.left = popup.x - 0 + "px";
	container.style.top = popup.y + popup.height + "px";
	container.style.width = popup.width - 2 + "px";
	//container.style.height = popup.height + "px";

	var popupMenuItems = document.createElement("div");
	popupMenuItems.className = "popupMenuItems";

	var i, option, optionTextNode;
	var numItems = popup.items.length;
	for( i = 0; i < numItems; i++ )
	{
		option = document.createElement("div");
		option.className = "popupMenuItem aaThemeColorTwoHighHoverBackgroundColor";
		option.style.fontSize = Math.round(popup.fontSize) + "px";
//		if( popup.selectedItem === i )
//			option.className += " selectedPopupMenuItem";

		option.blackout = blackout;		
		option.popupItem = popup.items[i];
		option.addEventListener("mouseup", function(e)
		{
			var elem = e.srcElement;
			if( !!!elem.blackout )
				return;

			aaapi.cmdEx("didSelectPopupMenuItem", elem.blackout.popup.popupId, elem.blackout.popup.items.indexOf(elem.popupItem));
			elem.blackout.parentNode.removeChild(elem.blackout);
		}, true);

		optionTextNode = document.createTextNode(popup.items[i].label);
		option.appendChild(optionTextNode);
		popupMenuItems.appendChild(option);
	}

	var optionSearchContainer = document.createElement("div");
	optionSearchContainer.className = "popupMenuItemSearch";

	var optionSearchForm = document.createElement("form");
	optionSearchForm.addEventListener("submit", function(e)
	{
		//console.log("SECOND ONE");
		//console.log(e.srcElement.firstChild.popupMenuItems.childNodes);
		var elem = e.srcElement.firstChild;

		var i;
		var count = 0;
		var firstIndex = -1;
		var numNodes = elem.popupMenuItems.childNodes.length;
		for( i = 0; i < numNodes && count < 2; i++ )
		{
			if( elem.popupMenuItems.childNodes[i].style.display !== "none" )
			{
				if( count === 0 )
					firstIndex = i;

				count++;
			}
		}

		if( count > 0 )// === 1 )
		{
			var optionElem = elem.popupMenuItems.childNodes[firstIndex];
			aaapi.cmdEx("didSelectPopupMenuItem", optionElem.blackout.popup.popupId, optionElem.blackout.popup.items.indexOf(optionElem.popupItem));
			optionElem.blackout.parentNode.removeChild(optionElem.blackout);
		}

		e.preventDefault();
		return false;
	}, true);

	var optionSearch = document.createElement("input");
	//optionSearch.className = "aaThemeColorTwoLowBackgroundColor aaTextColorTwoColor";//aaThemeColorTwoShadedBackground";
	optionSearch.style.cssText = "background: none; margin: 0; padding: 0; color: #000; background-color: #fff; font-weight: bold;";
	optionSearch.popupMenuItems = popupMenuItems;
	optionSearch.type = "text";
	optionSearch.placeholder = "Search...";
	optionSearch.changeTimeout = null;

	optionSearch.addEventListener("input", function(e)
	{
		var elem = e.srcElement;
		if( elem.changeTimeout )
			clearTimeout(elem.changeTimeout);

		elem.changeTimeout = setTimeout(function()
		{
			// step through all options and set display mode accordingly
			var searchText = this.value.toLowerCase();

			var i, popupMenuItem;
			var numPopupMenuItems = this.popupMenuItems.childNodes.length;
			for( i = 0; i < numPopupMenuItems; i++ )
			{
				popupMenuItem = this.popupMenuItems.childNodes[i];
				if( popupMenuItem.popupItem.label.toLowerCase().indexOf(searchText) >= 0 )
					popupMenuItem.style.display = "block";
				else
					popupMenuItem.style.display = "none";
			}

			//console.log(this.value);
			changeTimeout = null;
		}.bind(elem), 300);
	}, true);

	optionSearchForm.appendChild(optionSearch);
	optionSearchContainer.appendChild(optionSearchForm);

	container.appendChild(popupMenuItems);
	container.appendChild(optionSearchContainer);

//container.style.top = popup.y + popup.height + "px";
	blackout.appendChild(container);
	document.body.insertBefore(blackout, this.cursorElem);

	var offsetHeight = container.offsetHeight;
	console.log(parseInt(container.style.top));
	if( parseInt(container.style.top) + offsetHeight > window.innerHeight )
		container.style.top = parseInt(container.style.top) - popup.height - offsetHeight + "px";

	optionSearch.focus();

	//document.body.appendChild(container);
/*
	for( var i = 0; i < arguments.length; i++ )
	{
		console.log("arg: " + arguments[i]);
	}
*/
};

ArcadeHud.prototype.assignHelp = function(elem)
{
	elem.addEventListener("mouseover", function(e)
	{
		arcadeHud.addHelpMessage(this.getAttribute("help"));
	}.bind(elem), true);

	elem.addEventListener("mouseout", function(e)
	{
		arcadeHud.removeHelp();
	}.bind(elem), true);
};

ArcadeHud.prototype.removeHelp = function()
{
	var tagName = this.helpElem.tagName;
	var allOfTagName = document.querySelectorAll(".aaWindow " + tagName);
	var isInAAWindow = false;
	for( var i = 0; i < allOfTagName.length; i++ )
	{
		if( allOfTagName[i] === this.helpElem )
		{
			isInAAWindow = true;
			break;
		}
	}
	
	if( isInAAWindow )
	{
		this.helpElem.innerHTML = "";
		var helpParent = this.helpElem.parentNode;
		helpParent.style.display = "none";
		//helpParent.style.height = "0";
		//helpParent.style.webkitTransition = "height 0.5s ease-in-out 0.5s";
	}
	else
	{
		// empty out messages
		var firstChild = this.helpElem.firstChild;
		while( firstChild )
		{
			if( firstChild.className.search(/\bhudLoadingMessagesContainer\b/) >= 0 )
				break;

			this.helpElem.removeChild(firstChild);
			firstChild = this.helpElem.firstChild;
		}

		// if there are no loading messages, hide the message slate
		if( !firstChild || !!!firstChild.firstChild )
			this.helpElem.style.display = "none";
	}
};

ArcadeHud.prototype.addHelpMessage = function(text)
{
	var tagName = this.helpElem.tagName;
	var allOfTagName = document.querySelectorAll(".aaWindow " + tagName);
	var isInAAWindow = false;
	for( var i = 0; i < allOfTagName.length; i++ )
	{
		if( allOfTagName[i] === this.helpElem )
		{
			isInAAWindow = true;
			break;
		}
	}

	if( isInAAWindow )
	{
		this.helpElem.innerHTML = text;

		var helpParent = this.helpElem.parentNode;
		helpParent.style.display = "block";
		//helpParent.style.height = "initial";
		//helpParent.style.webkitTransition = "height 0.5s ease-in-out 0s";
	}
	else
	{
		// empty out messages
		var firstChild = this.helpElem.firstChild;
		while( firstChild )
		{
			if( firstChild.classList.contains("hudLoadingMessagesContainer") ) //firstChild.className.search(/\bhudLoadingMessagesContainer\b/) >= 0 )
				break;

			this.helpElem.removeChild(firstChild);
			firstChild = this.helpElem.firstChild;
		}

		var helpText = document.createElement("div");
		helpText.className = "helpMessage";

		if( this.helpElem.getAttribute("allowMarkup") == "yes" )
			helpText.innerHTML = text;
		else
		{
			var helpTextNode = document.createTextNode(text);
			helpText.appendChild(helpTextNode);
		}

		this.helpElem.insertBefore(helpText, this.helpElem.firstChild);
		this.helpElem.style.display = "block";
	}
};

//ArcadeHud.prototype.metaSearch = function(scraperId, callback)
//aaapi.cmd("metaSearch", id, elem.field, query);

ArcadeHud.prototype.metaSearchEasy = function(id, backCode)
{
	//console.log("Scooby do!");
	//console.log(this.scraper);

	if( !!!id )
	{
		var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
		if( item )
			id = item.info.id;
	}

	if( !!id )
	{
		var url = 'asset://ui/metaSearch.html?id=' + encodeURIComponent(id);

		if( !!backCode )
			url += '&uiback=' + encodeURIComponent(backCode);

		window.location = url;
	}
};

ArcadeHud.prototype.metaSearch = function(itemId, field, scraperId, term)
{
	var scraper = this.scrapers[scraperId];
	if( !!scraper && !!scraper.search && ((field === "acquire") || (term === "" || scraper.search.indexOf("$TERM") >= 0)) )
	{
		var query = (term !== "") ? scraper.search.replace("$TERM", term) : scraper.homepage;

		// set this as the active scraper so it can handle page loaded events with scraper logic
		//console.log("set active scraper");
		//this.activeScraper = scraper;

		//this.metaSearchHandles[id] = {"scraper": scraper, "callback": callback};
		aaapi.cmd("metaSearch", scraperId, itemId, field, query);
	}
	else
		console.log("ERROR: Invalid or unsupported scraper ID received.");
};

ArcadeHud.prototype.metaScrapeCurrent = function()
{
	this.metaScrape(this.activeScraper.id, this.activeScraperField, function(scrapedData)
	{
		if( this.activeScraper.id === "importSteamGames" )
		{
			//console.log("Time to send " + (scrapedData.length / 2) + " Steam items to AArcade...");

			console.log("Attempt to scrape...");
			var success = aaapi.cmdEx("importSteamGames", scrapedData);

			if( success )
			{
				//console.log("Steam games imported!");
				//aaapi.cmd("deactivateInputMode", true);
				window.location = "asset://ui/importSteamGamesProgress.html";
			}
			else
				console.log("Import rejected!");
		}
		else
		{	
			//console.log("Scraped data is: ");
			//console.log(JSON.stringify(scrapedData));

			if( this.activeScraperItemId !== "" )
			{
				// Figure in field weights...
				// Need to get the existing item to do that...
				var item = aaapi.cmdEx("getLibraryItem", this.activeScraperItemId);

				if( item )
				{
					for( x in this.activeScraper.fields )
					{
						if( !!scrapedData[x] && this.activeScraper.fields[x] < 50 && item[x] !== "" )
							delete scrapedData[x];
					}
				}
			}

			var usedFields = [];
			var args = [];
			var x, field;
			for( x in scrapedData)
			{
				field = scrapedData[x];
				//if( field === "" || (this.activeScraperField !== "all" && this.activeScraperField !== x))
				//console.log(this.activeScraperField);
				if( this.activeScraperField !== "all" && this.activeScraperField !== x)
					continue;

				if( x === "type" )
				{
					var allTypes = aaapi.cmdEx("getAllLibraryTypes");
					var y;
					for( y in allTypes )
					{
						//console.log(allTypes[y].title);
						if( allTypes[y].title === field )
						{
							field = allTypes[y].info.id;
							break;
						}
					}
				}
				
				/*
				var inputs = document.querySelectorAll("input, select");
				var i;
				for( i = 0; i < inputs.length; i++ )
				{
					if( inputs[i].field === x )
					{
						//inputs[i].focus();
						inputs[i].value = field;
						break;
					}
				}
				*/

				args.push(x);
				args.push(field);
				usedFields.push(x);
			}

			if( this.activeScraperItemId !== "" )
			{
				var success = aaapi.cmdEx("updateItem", this.activeScraperItemId, args);				

				if( success )
				{
					console.log("Item updated!");
					aaapi.cmd("statAction", "aa_wizards_applied", 1);
					aaapi.cmd("addToastMessage", "Item Updated");
					aaapi.cmd("sendEntryUpdate", "Item", this.activeScraperItemId);

					var shouldDeactivate = false;

					var taskResponse = aaapi.cmdEx("getAllTasks", true);	// param is supposed to update thumbnails, doesn't work yet. No thumbnails for tasks yet.
					var tasks = taskResponse.tasks;
					var task;
					for( var i = 0; i < tasks.length; i++ )
					{
						task = tasks[i];
						if( !!task.item && !!task.item.info && task.item.info.id === this.activeScraperItemId )
						{
							shouldDeactivate = true;
							break;
						}
					}

					if( shouldDeactivate )
					{
						// we are the currently selected item, so inspect it.
						aaapi.cmd("autoInspect", this.activeScraperItemId);
						aaapi.cmd("deactivateInputMode");
					}
					else
					{
						// otherwise, the item is NOT spawned yet, so show it in the library instead.
						//window.location = "libraryBrowserEZ.html?item=" + encodeURIComponent(this.activeScraperItemId);
						aaapi.cmd("reactivateInputMode", "asset://ui/libraryBrowserEZ.html?item=" + encodeURIComponent(this.activeScraperItemId));
					}
				}
				else
					console.log("Item update rejected!");
			}
			else
			{
				// first, check if an item that matches this one already exists...
	 			var item = aaapi.cmdEx("findLibraryItem", "file", scrapedData.file);
	 			if( !item && !!scrapedData.reference && scrapedData.reference !== "" )
	 				item = aaapi.cmdEx("findLibraryItem", "reference", scrapedData.reference);

	 			if( item )
	 			{
	 				//console.log("ybi A");
	 				aaapi.cmd("setLibraryBrowserContext", "items", item.info.id, "", "");
	 				aaapi.cmd("spawnItem", item.info.id);
					aaapi.cmd("statAction", "aa_wizards_applied", 1);
	 			}
	 			else
	 			{
	 				//// make sure the item has all fields
	 				//var vitalFields = ["title", "type", "app", "file", "reference", "download", "stream", "preview", "screen", "marquee", "description"];
	 				//for( var w = 0; w < vitalFields.length; w++ )
	 				//	if( !!!item[vitalFields[w]] )
	 				//		item[vitalFields[w]] = "";
	 					
					var createdItemId = aaapi.cmdEx("saveItem", this.activeScraperItemId, args);	// the response is actually the item ID or FALSE
					if( createdItemId )
					{
						aaapi.cmd("setLibraryBrowserContext", "items", createdItemId, "", "");
						aaapi.cmd("spawnItem", createdItemId);
						aaapi.cmd("statAction", "aa_wizards_applied", 1);
					}
				}
			}
		}
	}.bind(this));
};

ArcadeHud.prototype.metaScrape = function(scraperId, field, callback)
{
	var id = "meta" + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString();
	//var id = "run";
	var scraper = this.scrapers[scraperId];
	if( !!scraper )
	{
		var dummy = new Object();
		dummy.scraper = scraper;
		dummy.callback = callback;
		dummy.field = field;
		//this.metaScrapeHandles[id] = {"scraper": scraper, "callback": callback};

		var scraperObject = {"scraper": scraper, "callback": function(callId, url, doc)
		{
			// clear the a active scraper
			//console.log("clear active scraper");
			//arcadeHud.activeScraper = null;

			var results = this.scraper.run(url, this.field, doc);

			if( Array.isArray(results) )
			{
				//aaapi.cmdEx("importSteamGames", steamItems);	// do this on what ever is calling run.
				console.log("Array of results returned from wizard!");
				// should do the same logic as below, but in a loop for each item.
			}
			else
			{
				// strip everything out of the response except what was asked for.
				if( this.field !== "all" )
				{
					var shitList = [];

					var x;
					for( x in results )
					{
						if( dummy.field !== x )
							shitList.push(x);
					}

					var i;
					var max = shitList.length;
					for( i = 0; i < max; i++ )
						delete results[shitList[i]];
				}

				// strip out things that the scraper isn't sure about if we have better values
				//if( !!results.title && )

				// eliminate duplicates intellegently
				if( !!results.file && results.file !== "" )
				{
					// if there is a file, do not use duplicates on anything else
					if( results.file === results.reference )
						results.reference = "";
						//delete results["reference"];

					if( results.file === results.preview )
						results.preview = "";
	//					delete results["preview"];

					//if( results.file === results.stream )
					//	results.stream = "";
						//delete results["stream"];

					if( results.file === results.download )
						results.download = "";
						//delete results["download"];

				//	if( results.file === results.screen )
				//		results.screen = "";
						//delete results["screen"];

				//	if( results.file === results.marquee )
				//		results.marquee = "";
						//delete results["marquee"];
				}

				if( !!results.stream && results.stream !== "" )
				{
					// if there is a stream, do not use duplicates on anything
					if( results.stream === results.preview )
						results.preview = "";
						//delete results["preview"];

					if( results.stream === results.download )
						results.download = "";
						//delete results["download"];
				}

				if( !!results.preview && results.preview !== "" )
				{
					// if there is a preview, do not use duplicates on anything
					if( results.preview === results.download )
						results.download = "";
						//delete results["download"];

					if( results.file === results.screen )
						results.screen = "";
						//delete results["screen"];

					if( results.file === results.marquee )
						results.marquee = "";
						//delete results["marquee"];
				}

				if( !!results.download && results.download !== "" )
				{
					// if there is a download, do not use duplicates on anything
					if( results.download === results.screen )
						results.screen = "";
						//delete results["screen"];

					if( results.download === results.marquee )
						results.marquee = "";
						//delete results["marquee"];
				}

				if( !!results.screen && results.screen !== "" )
				{
					// if there is a screen, do not use duplicates on anything
					if( results.screen === results.marquee )
						results.marquee = "";
						//delete results["marquee"];
				}

				if( !!!results.file && results.file === "" )
					results.file = results.title;
			}

			this.callback(results);
		}.bind(dummy)};

		if( scraper.id === "netflix" )
		{
			var content = "<html><title>" + this.pageTitle + "</title></html>";
			var doc = arcadeHud.DOMParser.parseFromString(content, "text/html");
			scraperObject.callback.call(dummy, id, this.url, doc);
		}
		else
		{
			this.metaScrapeHandles[id] = scraperObject;
			aaapi.cmd("getDOM", id, scraperId);
		}
	}
	else
		console.log("ERROR: Invalid scraper ID received.");
};

ArcadeHud.prototype.browseForFile = function(callback)
{
	var browseId = "browse" + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString();
	this.fileBrowseHandles[browseId] = {"callback": callback};
	aaapi.cmd("fileBrowse", browseId);
};

ArcadeHud.prototype.onBrowseFileSelected = function(browseId, response)
{
	var browseInfo = this.fileBrowseHandles[browseId];
	var callback = browseInfo.callback;

	delete this.fileBrowseHandles[browseId];

	callback(response);
};

ArcadeHud.prototype.fetchDOM = function()
{
	var id = "metatest" + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString();
	aaapi.cmd("getDOM", id, "");	// catch the "metatest[...]" ID in the onDOMGot method.
};

ArcadeHud.prototype.onBrowserFinishedRequest = function(url, scraperId, itemId, field)
{
	console.log("Finished a request " + scraperId + ": " + url);
	var scraper = this.scrapers[scraperId];
	if( !!scraper )
	{
		console.log(typeof scraper.test);
		if(typeof scraper.test === "function")
		{
			//scraper.test();
			var id = "meta" + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString();
			//var id = "test";

			var dummy = new Object();
			dummy.scraper = scraper;
			dummy.itemId = itemId;
			dummy.field = field;
//			dummy.callback = callback;

			if( this.metaScrapeHandles[id] )
				console.log("WARNING: handle already exists for this scraper!  Should probably abort, but not aborting right now.");

			this.metaScrapeHandles[id] = {"scraper": scraper, "callback": function(callId, url, doc)
			{
				console.log("run test logic");
				this.scraper.test(url, doc, function(response)
				{
					var container = document.querySelector("#hudSideScrapeContainer");
					if(container)
					{
						if( response.validForScrape )
						{
							var scrapeButtonElem = document.querySelector("#hudMetaScrapeButton");

							//console.log("Display the 'scrape field' prompt for " + this.scraper.title + "'s " + this.field + " for item " + this.itemId);
							var regex = /steamcommunity.com\/id\/.*\/games\?tab=all/g;
							if( regex.test(url) )
							{
								//var headerContainerElem = document.querySelector(".hudHeaderContainer");
								//headerContainerElem.style.visibility = "hidden";
								//headerContainerElem.style.pointerEvents = "none";

								document.querySelector("#dynamicScrapeButton").innerHTML = "IMPORT STEAM GAMES";
								scrapeButtonElem.setAttribute("help", "Import all of these games into your Anarchy Arcade library.");

								var shouldSpeak = localStorage.getItem("shouldSpeak");
								if( !shouldSpeak || shouldSpeak === "yes" )
									aaapi.cmd("playSound", "hudvocals/importsteamgames.mp3");
							}

							container.style.display = "block";
							container.style.left = -container.offsetWidth + "px";
							container.style.display = "none";
							container.offsetWidth;
							//setTimeout(function()
							//{
								//var container = document.querySelector("#hudSideScrapeContainer");
								container.style.display = "block";
								container.offsetWidth;
								container.style.left = "0px";

								setInterval(function()
								{
									if( this.classList.contains("aaThemeColorOneHoverBackgroundColor") )
									{
										this.classList.remove("aaThemeColorOneHoverBackgroundColor");
										this.classList.add("aaThemeColorOneHighHoverBackgroundColor");
									}
									else
									{
										this.classList.remove("aaThemeColorOneHighHoverBackgroundColor");
										this.classList.add("aaThemeColorOneHoverBackgroundColor");
									}
								}.bind(scrapeButtonElem), 1000);
							//}, 1000);

							container.scraperId = this.scraper.id;
							container.itemId = this.itemId;
							container.field = this.field;
							return;
						}
						else
							container.style.display = "none";
					}

					if( !response.validForScrape && !!response.redirect && response.redirect !== "")
					{
						//var dummy3 = {"scraper": this.scraper, ""};
						aaapi.cmd("metaSearch", this.scraper.id, this.itemId, this.field, response.redirect);
					}
				}.bind(this));
			}.bind(dummy)};

			var delay = scraper.testDelay;
			if( !!!delay )
				delay = 0;

			//if( scraperId === "importSteamGames" )
			//	delay = 1000;

			var dummy2 = {"id": id, "scraper": scraper};
			setTimeout(function()
			{
				//console.log("Get that DOM: " + this.id);

				// don't get the DOM of Netflix, just check the URL.
				// TODO: Add a standard way for scrapers to do this.
				if( this.scraper.id === "netflix" )
				{
					this.scraper.test(url, null, function(response)
					{
						var container = document.querySelector("#hudSideScrapeContainer");
						if(container)
						{
							if( response.validForScrape )
							{
								//console.log("Display the 'scrape field' prompt for " + this.scraper.title + "'s " + this.field + " for item " + this.itemId);
								container.style.display = "block";
								container.scraperId = this.scraper.id;
								container.itemId = this.itemId;
								container.field = this.field;
								return;
							}
							else
								container.style.display = "none";
						}

						if( !response.validForScrape && !!response.redirect && response.redirect !== "")
						{
							//var dummy3 = {"scraper": this.scraper, ""};
							aaapi.cmd("metaSearch", this.scraper.id, this.itemId, this.field, response.redirect);
						}
					}.bind(this));
				}
				else
					aaapi.cmd("getDOM", this.id, this.scraper.id);
			}.bind(dummy2), delay);
		}

		this.activeScraper = scraper;
		this.activeScraperItemId = itemId;
		this.activeScraperField = field;
	}
	//console.log("yar yar yar");
	//console.log(this.activeScraper);
	//if( this.activeScraper )
	//{
//		console.log("twat teh funnuck");
	//}
	//console.log("Main frame just finished loading " + url);
	//console.log("Should any scrapers analyze the newly loaded page?");
};

ArcadeHud.prototype.getParameterByName = function(name, url)
{
	// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

ArcadeHud.prototype.isImageExtension = function(url)
{
	var lowerURL = url.toLowerCase();
	if( lowerURL.indexOf("http://") || lowerURL.indexOf("https://") )
		return true;

	var re = /(.bmp|.ico|.gif|.jpg|.jpeg|.jpe|.jp2|.pcx|.pic|.png|.pix|.raw|.tga|.tif|.vtf|.tbn|.webp)$/i;

	if( url.match(re) || url.indexOf("cdn.steamcommunity") > -1 )
		return true;
	else
		return false;
};

ArcadeHud.prototype.loadItemBestImage = function(imageElem, item, callback, failCallback, potentials)
{
	var bestImagePayload = {
		"imageElem": imageElem,
		"item": item,
		"potentials":
		{
			"marquee": true,
			"screen": true,
			"preview": true,
			"file": true
		},
		"re": /(.bmp|.ico|.gif|.jpg|.jpeg|.jpe|.jp2|.pcx|.pic|.png|.pix|.raw|.tga|.tif|.vtf|.tbn)$/i
	};

	if( !!potentials )
		bestImagePayload.potentials = potentials;
	imageElem.bestImagePayload = bestImagePayload;

	function getNextPotential()
	{
		var bestImagePayload = this;
		
		var i;
		var keys = Object.keys(bestImagePayload.potentials);
		var potential;
		for( i = 0; i < keys.length; i++ )
		{
			potential = keys[i];

			if( !!bestImagePayload.item[potential] && (bestImagePayload.item[potential].match(bestImagePayload.re) || bestImagePayload.item[potential].indexOf("travel.html?") === 0) )
				return potential;
			else
				delete bestImagePayload.potentials[potential];
		}
	}

	function tryPotential()
	{
		var bestImagePayload = this;

		var potential = getNextPotential.call(bestImagePayload);
		if( !!potential )
		{
			var potentialSrc = bestImagePayload.item[potential];
			if( !!potentialSrc && potentialSrc.indexOf("travel.html?") === 0 )
			{
				var screenshotId = arcadeHud.getParameterByName("screenshot", potentialSrc);
				potentialSrc = "asset://shots/" + screenshotId + ".jpg";
			}
			bestImagePayload.imageElem.src = potentialSrc;
		}
		else if( Object.keys(bestImagePayload.potentials).length === 0 )
		{
//			console.log("complete failure.");

			var imageElem = bestImagePayload.imageElem;
			imageElem.removeEventListener("error", errorImage, false);
			imageElem.removeEventListener("load", loadedImage, false);
			delete imageElem.bestImagePayload;

			if( typeof failCallback === "function" )
				failCallback.call(null, imageElem);
		}
	}

	function errorImage(e)
	{
		var bestImagePayload = e.target.bestImagePayload;
		// remove the failed potential
		var potential = getNextPotential.call(bestImagePayload);
		if( !!potential )
			delete bestImagePayload.potentials[potential];

		tryPotential.call(bestImagePayload);
	}

	function loadedImage(e)
	{
		var imageElem = e.target;
		var bestImagePayload = imageElem.bestImagePayload;

		if( !!bestImagePayload )
		{
			delete bestImagePayload.imageElem.bestImagePayload;
			imageElem.removeEventListener("error", errorImage, false);
			imageElem.removeEventListener("load", loadedImage, false);
		}

		if( !!callback )
			callback.call(null, imageElem);
		else
			imageElem.style.display = "block";
	}

	imageElem.addEventListener("error", errorImage, false);
	imageElem.addEventListener("load", loadedImage, false);
	tryPotential.call(bestImagePayload);
};

ArcadeHud.prototype.loadItemMarqueeImage = function(imageElem, item)
{
	imageElem.src = item.marquee;
};

ArcadeHud.prototype.loadItemScreenImage = function(imageElem, item)
{
	imageElem.src = item.screen;
};

ArcadeHud.prototype.loadItemFileImage = function(imageElem, item)
{
	imageElem.src = item.file;
};

ArcadeHud.prototype.viewStream = function()
{
	var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
	if( item )
		aaapi.cmd("viewStream", item.info.id);
};

ArcadeHud.prototype.autoInspect = function()
{
	var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
	if( item )
	{
		aaapi.cmd("autoInspect", item.info.id);
	}
};

ArcadeHud.prototype.viewPreview = function()
{
	var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
	var previewURL = item.preview;

	var youTubeId = this.extractYouTubeId(previewURL);
	var youTubePlaylistId = this.extractYouTubePlaylistId(previewURL);
	if( !!youTubePlaylistId )
		previewURL = "http://www.anarchyarcade.com/youtube_player.php?id=" + youTubeId + "&list=" + youTubePlaylistId + "&autoplay=0";
	else if( !!youTubeId )
		previewURL = "http://www.anarchyarcade.com/youtube_player.php?id=" + youTubeId + "&autoplay=0";

	if( item )
		aaapi.cmd("viewPreview", item.info.id, previewURL);
};

ArcadeHud.prototype.runLibretro = function()
{
	var item = aaapi.cmdEx("getSelectedLibraryItem");	// FIXME: This is probably overkill if all we want is the ID!
	if( item )
		aaapi.cmd("runLibretro", item.info.id);
};

function AArcadeFakeEvent(options)
{
	this.allowed = options.allowed;
	this.pseudo = false;
	this.target = options.target;
	this.targetTabId = options.targetTabId;
};

AArcadeFakeEvent.prototype.preventDefault = function()
{
	this.allowed = false;
};

AArcadeFakeEvent.prototype.setPseudo = function()
{
	this.pseudo = true;
};

ArcadeHud.prototype.activateMenuTab = function(activeTab)
{
	var isPseudo = false;
	if( typeof window[activeTab.getAttribute("onchangehandlername")] === "function" )
	{

		var fakeEvent = new AArcadeFakeEvent({"allowed": true, "target": activeTab, "targetTabId": activeTab.getAttribute("tabid")});

		window[activeTab.getAttribute("onchangehandlername")](fakeEvent);
		if( !fakeEvent.allowed )
			return;

		isPseudo = fakeEvent.pseudo;
	}

	var aaTabs = document.querySelectorAll(".aaTab");

	var aaTab;
	var aaTabContent;
	for( var i = 0; i < aaTabs.length; i++ )
	{
		aaTab = aaTabs[i];
		if( aaTab === activeTab )
		{
			if( !aaTab.classList.contains("aaTabActive") )
				aaTab.classList.add("aaTabActive");

			if( aaTab.classList.contains("aaThemeColorTwoHoverShadedBackground") )
				aaTab.classList.remove("aaThemeColorTwoHoverShadedBackground");

			if( !aaTab.classList.contains("aaThemeColorTwoHighBackgroundColor") )
				aaTab.classList.add("aaThemeColorTwoHighBackgroundColor");

			if( !isPseudo )
			{
				aaTabContent = document.querySelector(".aaTabContent[tabid='" + aaTab.getAttribute("tabid") + "']");
				if( !!aaTabContent )
					aaTabContent.style.display = "block";
			}
		}
		else
		{
			if( aaTab.classList.contains("aaTabActive") )
				aaTab.classList.remove("aaTabActive");

			if( !aaTab.classList.contains("aaThemeColorTwoHoverShadedBackground") )
				aaTab.classList.add("aaThemeColorTwoHoverShadedBackground");

			if( aaTab.classList.contains("aaThemeColorTwoHighBackgroundColor") )
				aaTab.classList.remove("aaThemeColorTwoHighBackgroundColor");

			if( !isPseudo )
			{
				aaTabContent = document.querySelector(".aaTabContent[tabid='" + aaTab.getAttribute("tabid") + "']");
				if( !!aaTabContent )			
					aaTabContent.style.display = "none";
			}
		}
	}

	// TODO: This should return the fake event, so the callback can know if it was pseudo or not, etc.
	if( typeof window[activeTab.getAttribute("onChangeCallbackName")] === "function" )
		window[activeTab.getAttribute("onChangeCallbackName")](activeTab.getAttribute("tabid"));
};

ArcadeHud.prototype.generateWindowFooterHTML = function()
{
	//return "</div>";

	var iconSize = parseInt(arcadeHud.themeSizes.IconSize);
	var html = "";
	html += '\
		</td></tr>\
		<tr style="padding: 0;">\
			<td style="padding: 0; height: 4px; background-color: transparent;">\
				<div style="position: relative;">\
					<div class="aaThemeColorOneShadedBorderColor" style="display: none; overflow-y: hidden; border-style: solid; border-width: 2px; position: absolute; right: 8px; left: 8px; margin-top: 5px; box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); border-top: 0; border-radius: 4px; border-top-left-radius: 0; border-top-right-radius: 0;">\
						<div class="aaHelpContainer aaThemeColorOneBackgroundColor aaTextColorOneFontColor aaTextSizeFontSize" style="padding: 10px;"></div>\
					</div>\
				</div>\
				<div class="aaCornerGripContainer">\
					<div class="aaCornerGrip" style="left: -' + iconSize + 'px; top: -' + iconSize + 'px; opacity: 0.2;" onmousedown="arcadeHud.gripListener(this);">\
						' + this.generateIconHTML("cornerGrip.png", iconSize, iconSize, "aaTextColorTwoColor") + '\
					</div>\
				</div>\
			</td>\
		</tr>\
	</table>';

	return html;	
};

ArcadeHud.prototype.generateWindowTabsHeaderHTML = function(options)
{
	if( !!!options.onChangeCallbackName )
		options.onChangeCallbackName = "";


	if( !!!options.onChangeHandlerName )
		options.onChangeHandlerName = "";

	var html = '\
		<table class="aaTabs aaThemeColorTwoDarkBackgroundColor" cellspacing="0" style="width: 100%;">\
			<tr><td style="-webkit-transform: scale(1, -1); padding-left: 5px; padding-right: 8px;">\
	';

	var tabs = options.tabs;
	var tab;
	var activeTabValue;
	var tabClass;
	for( var i = 0; i < tabs.length; i++ )
	{
		tab = tabs[i];
		activeTabValue = (options.activeTabId === tab.id) ? "1" : "0";
		tabClass = (!!tab.class) ? tab.class : "";
		html += '\
			<div class="aaTab aaTextSizeFontSize aaThemeColorTwoHoverShadedBackground aaTextColorTwoColor aaThemeColorTwoLowBorderColor ' + tabClass + '" style="-webkit-transform: scale(1, -1);" tabid="' + tab.id + '" onchangehandlername="' + options.onChangeHandlerName + '" onchangecallbackname="' + options.onChangeCallbackName + '" activetab="' + activeTabValue + '">\
				' + tab.title + '\
			</div>\
		';
	}

	html += '\
		</td></tr>\
		<tr><td>\
	';

	return html;
};

ArcadeHud.prototype.generateWindowTabsFooterHTML = function()
{
	var html = "";
	html += '\
			</td></tr>\
		</table>\
	';

	return html;
};

ArcadeHud.prototype.dragListener = function(titleBarElem)
{
	var windowElem = titleBarElem.parentNode.parentNode.parentNode.parentNode;
	var rect = windowElem.getBoundingClientRect();

	windowElem.style.position = "absolute";
	windowElem.style.top = rect.top;
	windowElem.style.left = rect.left;

	var noResizeX = false;//(windowElem.getAttribute("noresizex") == 1) ? true : false;
	var noResizeY = false;//(windowElem.getAttribute("noresizey") == 1) ? true : false;

	var previous;

	function mouseMoveListener(e)
	{
		var oldY;
		var oldX;

		if( !!!previous )
		{
			oldY = rect.top;
			oldX = rect.left;

			previous = {
				"x": e.clientX,
				"y": e.clientY
			};
		}
		else
		{
			oldY = parseInt(windowElem.style.top);
			oldX = parseInt(windowElem.style.left);
		}

		var delta = {
			"x": e.clientX - previous.x,
			"y": e.clientY - previous.y
		};


		if( !noResizeY )
			windowElem.style.top = oldY + delta.y + "px";

		if( !noResizeX )
			windowElem.style.left = oldX + delta.x + "px";

		previous.x = e.clientX;
		previous.y = e.clientY;
	}

	document.addEventListener("mouseup", function(e)
	{
		e.preventDefault();
		document.removeEventListener("mousemove", mouseMoveListener, false);
		document.removeEventListener("mouseup", arguments.callee, true);
	}, true);

	document.addEventListener("mousemove", mouseMoveListener, false);
};

ArcadeHud.prototype.gripListener = function(titleBarElem)
{
	// 1 more .parentNode than dragListener
	var windowElem = titleBarElem.parentNode.parentNode.parentNode.parentNode.parentNode;
	var noResizeX = (windowElem.getAttribute("noresizex") == 1) ? true : false;
	var noResizeY = (windowElem.getAttribute("noresizey") == 1) ? true : false;

	var rect = windowElem.getBoundingClientRect();

	// break out of dock mode when resizing
	if( false )
	{
		windowElem.style.position = "absolute";
		windowElem.style.top = rect.top;
		windowElem.style.left = rect.left;
		if( !noResizeY )
			windowElem.style.height = rect.height;
		if( !noResizeX )
			windowElem.style.width = rect.width;
	}
	// done breaking out

	var previous;
	function mouseMoveListener(e)
	{
		var oldY;
		var oldX;

		if( !!!previous )
		{
			oldY = rect.height;
			oldX = rect.width;

			previous = {
				"x": e.clientX,
				"y": e.clientY
			};
		}
		else
		{
			oldY = parseInt(windowElem.style.height);
			oldX = parseInt(windowElem.style.width);
		}

		var delta = {
			"x": e.clientX - previous.x,
			"y": e.clientY - previous.y
		};

		if( windowElem.style.position !== "absolute" )
		{
			delta.x *= 2;
			delta.y *= 2;
		}


		if( !noResizeY )
		{
			windowElem.style.height = oldY + delta.y + "px";

			if( windowElem.style.position !== "absolute" )
				windowElem.style.top = parseInt(parseInt(windowElem.style.top) - (delta.y / 2)) + "px";
		}

		if( !noResizeX )
			windowElem.style.width = oldX + delta.x + "px";

		previous.x = e.clientX;
		previous.y = e.clientY;
	}

	document.addEventListener("mouseup", function(e)
	{
		e.preventDefault();
		document.removeEventListener("mousemove", mouseMoveListener, false);
		document.removeEventListener("mouseup", arguments.callee, true);
	}, true);

	document.addEventListener("mousemove", mouseMoveListener, false);
};

ArcadeHud.prototype.addCSSRules = function()
{
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	var stylesheet = style.sheet;

	var themeSizes = this.themeSizes;
	var themeColors = this.themeColors;

	for( var className in themeSizes )
	{
		stylesheet.insertRule(".aa" + className + "FontSize { font-size: " + themeSizes[className] + "; }");
		stylesheet.insertRule(".aa" + className + "Size { width: " + themeSizes[className] + "; height: " + themeSizes[className] + "; }");
		stylesheet.insertRule(".aa" + className + "MinSize { min-width: " + themeSizes[className] + "; min-height: " + themeSizes[className] + "; }");
		stylesheet.insertRule(".aa" + className + "Width { width: " + themeSizes[className] + "; }");
		stylesheet.insertRule(".aa" + className + "Height { height: " + themeSizes[className] + "; }");
	}

	var alphaColor;
	var defaultValue, highValue, lowValue;
	for( var className in themeColors )
	{
		defaultValue = themeColors[className].defaultValue;
		highValue = themeColors[className].highValue;
		lowValue = themeColors[className].lowValue;

		/* Defaults */
		stylesheet.insertRule(".aa" + className + "Color, .aa" + className + "HoverColor { color: " + defaultValue + "; }");
		stylesheet.insertRule(".aa" + className + "BackgroundColor, .aa" + className + "HoverBackgroundColor { background-color: " + defaultValue + "; }");
		stylesheet.insertRule(".aa" + className + "BorderColor, .aa" + className + "HoverBorderColor { border-color: " + defaultValue + "; }");
		stylesheet.insertRule(".aa" + className + "ShadedBorderColor { border-top-color: " + highValue + "; border-left-color: " + highValue + "; border-bottom-color: " + lowValue + "; border-right-color: " + lowValue + "; }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBorderColor { border-top-color: " + lowValue + "; border-left-color: " + lowValue + "; border-bottom-color: " + lowValue + "; border-right-color: " + lowValue + "; }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBorderColor.aaDepressed { border-top-color: " + lowValue + "; border-left-color: " + lowValue + "; border-bottom-color: " + highValue + "; border-right-color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBorderColor:not(.aaDisabled) { border-top-color: " + highValue + "; border-left-color: " + highValue + "; border-bottom-color: " + lowValue + "; border-right-color: " + lowValue + "; }");
		stylesheet.insertRule(".aa" + className + "InverseShadedBorderColor { border-top-color: " + lowValue + "; border-left-color: " + lowValue + "; border-bottom-color: " + highValue + "; border-right-color: " + highValue + "; }");
		//stylesheet.insertRule(".aa" + className + "ShadedBackground, .aa" + className + "HoverShadedBackground { background: -webkit-linear-gradient(-70deg, " + highValue + ", " + lowValue + "); }");
		stylesheet.insertRule(".aa" + className + "ShadedBackground { background: -webkit-linear-gradient(-70deg, " + highValue + ", " + lowValue + "); }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBackground { pointer-events: none; background: -webkit-linear-gradient(-70deg, " + lowValue + ", " + lowValue + "); }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBackground.aaDepressed { background: -webkit-linear-gradient(-70deg, " + lowValue + ", " + lowValue + "); }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBackground:not(.aaDisabled) { pointer-events: all; background: -webkit-linear-gradient(-70deg, " + highValue + ", " + lowValue + "); }");
		stylesheet.insertRule(".aa" + className + "HoverColor:hover { color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HoverBorderColor:hover { border-color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HoverBackgroundColor:hover { background-color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBackground:hover:not(.aaDisabled) { background: -webkit-linear-gradient(-70deg, " + highValue + ", " + defaultValue + "); }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBackground:hover:active:not(.aaDisabled) { background: -webkit-linear-gradient(-70deg, " + defaultValue + ", " + lowValue + "); }");
		stylesheet.insertRule(".aa" + className + "HoverShadedBorderColor:hover:active:not(.aaDisabled) { border-top-color: " + lowValue + "; border-left-color: " + lowValue + "; border-bottom-color: " + highValue + "; border-right-color: " + highValue + "; }");

		/* Highs */
		stylesheet.insertRule(".aa" + className + "HighColor, .aa" + className + "HighHoverColor { color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HighBorderColor { border-color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HighBackgroundColor, .aa" + className + "HighHoverBackgroundColor { background-color: " + highValue + "; }");
		stylesheet.insertRule(".aa" + className + "HighHoverColor:hover { color: " + defaultValue + "; }");
		stylesheet.insertRule(".aa" + className + "HighHoverBackgroundColor:hover { background-color: " + defaultValue + "; }");

		/* Lows */
		stylesheet.insertRule(".aa" + className + "LowColor, .aa" + className + "LowHoverColor { color: " + lowValue + "; }");
		stylesheet.insertRule(".aa" + className + "LowBorderColor { border-color: " + lowValue + "; }");
		stylesheet.insertRule(".aa" + className + "LowBackgroundColor, .aa" + className + "LowHoverBackgroundColor { background-color: " + lowValue + "; }");
		stylesheet.insertRule(".aa" + className + "LowHoverColor:hover { color: " + defaultValue + "; }");
		stylesheet.insertRule(".aa" + className + "LowHoverBackgroundColor:hover { background-color: " + defaultValue + "; }");

		/* scrollbars that use theme colors */
		stylesheet.insertRule(".aa" + className + "ScrollBars::-webkit-scrollbar { width: 15px; height: 15px; }");
		stylesheet.insertRule(".aa" + className + "ScrollBars::-webkit-scrollbar-track { background-color: " + lowValue + "; border-radius: 10px; -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.7); }");
		stylesheet.insertRule(".aa" + className + "ScrollBars::-webkit-scrollbar-thumb { background-color: " + highValue + "; border-radius: 10px; border-color: " + lowValue + "; border-style: solid; border-width: 2px; }");

		alphaColor = defaultValue;	// NOTE: alphaColor assumes the color is given in rgb() format and ends with a ")"
		alphaColor = alphaColor.substring(alphaColor.indexOf("(") + 1);
		alphaColor = alphaColor.substring(0, alphaColor.indexOf(")"));

		stylesheet.insertRule(".aa" + className + "FadeBackground { background: -webkit-linear-gradient(left,  rgba(" + alphaColor + ", 0) 0%,rgba(" + alphaColor + ", 0.5) 25%,rgba("+ alphaColor + ", 0.9) 75%,rgba("+ alphaColor + ", 0.9) 100%); }");
		//stylesheet.insertRule(".aa" + className + "FadedBackgroundColor { background-color: rgba(" + alphaColor + ", 0.9); }");
		stylesheet.insertRule(".aa" + className + "FadedBorderColor { border-color: rgba(" + alphaColor + ", 0.9); }");
	}
};

ArcadeHud.prototype.createNewApp = function(appFile, backURL)
{
	var foundLastSlash = appFile.lastIndexOf("/");
	if( foundLastSlash === -1 )
		foundLastSlash = appFile.lastIndexOf("\\");
	if( foundLastSlash !== -1 )
		appTitle = appFile.substring(foundLastSlash+1);

	var foundLastDot = appTitle.lastIndexOf(".");
	if( foundLastDot !== -1 )
		appTitle = appTitle.substring(0, foundLastDot);

	// first, check if an app that matches this one already exists...
	var app = aaapi.cmdEx("findLibraryApp", "file", appFile);
	//if( !app )
	//	app = aaapi.cmdEx("findLibraryApp", "title", appTitle);

	if( !!app )
		console.log("App already exists!!");
	else
		app = aaapi.cmdEx("createApp", "title", appTitle, "file", appFile);

	if( !!app )
	{
		var url = "asset://ui/editApp.html?id=" + encodeURIComponent(app.info.id);
		if( !!backURL && backURL !== "" )
			url += "&uiback=" + encodeURIComponent(backURL);
		window.location = url;
	}
};

ArcadeHud.prototype.createNewType = function(typeTitle, backURL, shouldRedirect)
{
	if( typeof shouldRedirect === undefined )
		shouldRedirect = true;

	// first, check if a type that matches this one already exists...
	var type = aaapi.cmdEx("findLibraryType", "title", typeTitle);

	if( !!type )
		console.log("Type already exists!!");
	else
		type = aaapi.cmdEx("createType", "title", typeTitle);

	if( shouldRedirect && !!type )
	{
		var url = "asset://ui/editType.html?id=" + encodeURIComponent(type.info.id);
		if( !!backURL && backURL !== "" )
			url += "&uiback=" + encodeURIComponent(backURL);
		window.location = url;
		return type;
	}
	else
		return (!!type) ? type : undefined;
};

ArcadeHud.prototype.generateIconHTML = function(iconImage, width, height, cssClass, colorOverride)
{
	var bgColors;
	if( !!!colorOverride )
	{
		var dummyElem = document.createElement("div");
		dummyElem.className = cssClass;
		document.head.appendChild(dummyElem);
		var dummyStyle = window.getComputedStyle(dummyElem);
		var dummyBackgroundColor = dummyStyle.getPropertyValue('color');
		dummyElem.parentNode.removeChild(dummyElem);

		bgColors = dummyBackgroundColor.split("(")[1].split(")")[0].split(",");
		bgColors.forEach(function(element, index, array)
		{
			element = parseFloat(element);
			if( index < 3 )
				element = element / 255.0;
			array[index] = element;
		});
	}
	else
		bgColors = colorOverride;

	if( bgColors.length < 4 )
		bgColors.push(1);

	var filterId = "filter" + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString() + Math.round(Math.random() * 10.0).toString();

	var html = "";
	html += '\
		<svg width="' + width + '" height="' + height + '" style="vertical-align: middle;">\
		<filter id="' + filterId + '">\
			<feColorMatrix type="matrix" values="' + bgColors[0] + ' 0 0 0 0\
			0 ' + bgColors[1] + ' 0 0 0\
			0 0 ' + bgColors[2] + ' 0 0\
			0 0 0 ' + bgColors[3] + ' 0" />\
		</filter>\
		<image filter="url(#' + filterId + ')" width="' + width + '" height="' + height + '" perserveAspectRatio="xMinYMin slice" xlink:href="' + iconImage + '" />\
	</svg>';

	return html;
};

ArcadeHud.prototype.generateWindowHeaderHTML = function(title, cssText, noresizex, noresizey, backCallbackText, closeCallbackText)
{
	//return "<div style='background-color: pink;'>";
	var noResizeX = (noresizex == 1) ? "1" : "0";
	var noResizeY = (noresizey == 1) ? "1" : "0";

	var backButtonDisplay = (!!backCallbackText) ? "initial" : "none";
	var closeButtonDisplay = (!!closeCallbackText) ? "initial" : "none";

	var html = "";
	html += '\
		<table class="aaWindow aaThemeColorTwoShadedBackground aaThemeColorOneShadedBorderColor" noresizex="' + noResizeX + '" noresizey="' + noResizeY + '" cellspacing="0" cellpadding="0" style="' + cssText + '">\
			<tr><td class="aaBigIconSizeHeight">\
				<table class="aaTitleBar" onmousedown="arcadeHud.dragListener(this);">\
					<thead>\
						<tr>\
							<td class="aaThemeColorOneBackgroundColor aaTitleBarIcon" style="width: 1%;">\
								<img src="aaicon.png" class="aaBigIconSizeSize" style="-webkit-filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.8));" />\
							</td>\
							<td class="aaThemeColorOneBackgroundColor" style="text-align: left;">\
								<div class="aaTextColorOneColor aaTitleText aaTitleTextSizeFontSize">\
									' + title + '\
								</div>\
							</td>\
							<td style="display:' + backButtonDisplay + ';" class="aaThemeColorOneHoverBackgroundColor aaTitleBarIcon aaIconSizeSize aaIconSizeMinSize" onclick="' + backCallbackText + '">\
								' + arcadeHud.generateIconHTML("barrow.png", parseInt(arcadeHud.themeSizes.IconSize), parseInt(arcadeHud.themeSizes.IconSize), "aaTextColorOneColor") + '\
							</td>';

	if( title === "Library" )
	{
		html += '\
							<td style="display:' + closeButtonDisplay + ';" class="aaThemeColorOneHoverBackgroundColor aaTitleBarIcon aaIconSizeSize aaIconSizeMinSize helpNote" help="Switch to EZ Mode." onclick="localStorage.setItem(\'ezmode\', \'1\'); window.location=\'libraryBrowserEZ.html\';">\
								' + arcadeHud.generateIconHTML("switchicon.png", parseInt(arcadeHud.themeSizes.IconSize), parseInt(arcadeHud.themeSizes.IconSize), "aaTextColorOneColor") + '\
							</td>\
		';
	}
	else if( title === "Context Menu" )
	{
		html += '\
							<td id="aaSwitchButtonEZ" style="display: none;" class="aaThemeColorOneHoverBackgroundColor aaTitleBarIcon aaIconSizeSize aaIconSizeMinSize helpNote" help="Switch to EZ Mode." onclick="localStorage.setItem(\'ezmode\', \'1\'); window.location=\'libraryBrowserEZ.html?entity=' + this.getParameterByName("entity") + '\';">\
								' + arcadeHud.generateIconHTML("switchicon.png", parseInt(arcadeHud.themeSizes.IconSize), parseInt(arcadeHud.themeSizes.IconSize), "aaTextColorOneColor") + '\
							</td>\
		';
	}

	html += '\
							<td style="display:' + closeButtonDisplay + ';" class="aaThemeColorOneHoverBackgroundColor aaTitleBarIcon aaIconSizeSize aaIconSizeMinSize" onclick="' + closeCallbackText + '">\
								' + arcadeHud.generateIconHTML("close.png", parseInt(arcadeHud.themeSizes.IconSize), parseInt(arcadeHud.themeSizes.IconSize), "aaTextColorOneColor") + '\
							</td>\
						</tr>\
					</thead>\
				</table>\
			</td></tr>\
			</td></tr>\
			<tr><td class="aaWindowPane" valign="top">\
	';

    return html;
};

// Originally from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
ArcadeHud.prototype.encodeRFC5987ValueChars = function(str){
    return encodeURIComponent(str).
        // Note that although RFC3986 reserves "!", RFC5987 does not,
        // so we do not need to escape it
        replace(/['()]/g, escape). // i.e., %27 %28 %29
        replace(/\*/g, '%2A').
            // The following are not required for percent-encoding per RFC5987, 
            // so we can allow for a little better readability over the wire: |`^
            replace(/%(?:7C|60|5E)/g, unescape);
};

// kodi crc code originally from: http://forum.kodi.tv/showthread.php?tid=58389
ArcadeHud.prototype.generateCRC = function(data_in)
{
	var data = data_in.toLowerCase();
	data = data.replace(/\//g,"\\");

    var CRC = 0xffffffff;
    data = data.toLowerCase();
    for ( var j = 0; j < data.length; j++) {
        var c = data.charCodeAt(j);
        CRC ^= c << 24;
        for ( var i = 0; i < 8; i++) {
            if (CRC.unsign(8) & 0x80000000) {
                CRC = (CRC << 1) ^ 0x04C11DB7;
            } else {
                CRC <<= 1;
            }
        }
    }
    if (CRC < 0)
        CRC = CRC >>> 0;
    var CRC_str = CRC.toString(16);
    while (CRC_str.length < 8) {
        CRC_str = '0' + CRC_str;
    }

    return CRC_str;
};

ArcadeHud.prototype.generateYouTubeImageURL = function(youtubeid)
{
	//var url = "http://i.ytimg.com/vi/" + youtubeid + "/hqdefault.jpg";
	var url = "http://img.youtube.com/vi/" + youtubeid + "/0.jpg";
	return url;
};

ArcadeHud.prototype.extractYouTubePlaylistId = function(trailerURL)
{
	if( typeof trailerURL === "undefined" )
		return trailerURL;

	var playlist = this.getParameterByName("list", trailerURL);
	return playlist;
};

ArcadeHud.prototype.extractYouTubeId = function(trailerURL)
{
	if( typeof trailerURL === "undefined" )
		return trailerURL;
//console.log("extracting YT ID from URL " + trailerURL.indexOf("http://www.anarchyarcade.com/youtube_player.php"));
	var youtubeid;
	if( trailerURL.indexOf("http://www.anarchyarcade.com/youtube_player.php") === 0 )
	{
		//console.log("here.");
		//http://www.anarchyarcade.com/youtube_player.php?id=j3sPW0uIgs8&autoplay=0
		var testerId = this.getParameterByName("id", trailerURL);
		if( !!testerId )
			testerId = decodeURIComponent(testerId);
		
		youtubeid = testerId;
	}
	else if( trailerURL.indexOf("youtube") != -1 && trailerURL.indexOf("v=") != -1 )
	{
		youtubeid = trailerURL.substr(trailerURL.indexOf("v=")+2);

		var found = youtubeid.indexOf("&");
		if( found > -1 )
		{
			youtubeid = youtubeid.substring(0, found);
		}
	}
	else
	{
		var found = trailerURL.indexOf("youtu.be/");
		if( found != -1 )
		{
			youtubeid = trailerURL.substring(found+9);

			found = youtubeid.indexOf("&");
			if( found != -1 )
			{
				youtubeid = youtubeid.substring(0, found);
			}
		}
	}

	if( !!youtubeid && youtubeid.length > 0 )
	{
		var foundEnd = youtubeid.indexOf("?");
		if( foundEnd < 0 )
			foundEnd = youtubeid.indexOf("#");

		if( foundEnd > 0 )
			youtubeid = youtubeid.substring(0, foundEnd);
	}

	return youtubeid;
};

ArcadeHud.prototype.onTitleChanged = function(taskId, title, isSelf)
{
	isSelf = (isSelf === "isSelf");

	if( isSelf )
		this.pageTitle = title;

	var aaTaskBar = document.querySelector("#aaTaskBar");
	if( !!aaTaskBar )
	{
		var aaTaskLabel = aaTaskBar.querySelector(".aaTaskBarTask[taskId='" + taskId + "'] .aaTaskBarTaskLabel");
		if( aaTaskLabel )
		{
			aaTaskLabel.innerHTML = "";
			aaTaskLabel.appendChild(document.createTextNode(title));
		}
	}

	if( title.length > 18 && title.indexOf(" - YouTube (ended)") === title.length-18 )
	{
		var targetTasks = aaapi.cmdEx("getAutoCameraTargetTask");
		console.log(JSON.stringify(targetTasks));
		if( !!targetTasks )
		{
			for( var i = 0; i < targetTasks.length; i++ )
			{
				if( targetTasks[i].id === taskId)
				{
					aaapi.cmd("selectNextOrPrev");
					return;
				}
			}
		}
		
		this.playNearestYouTube(taskId, "next");
	}
};

ArcadeHud.prototype.playMapNow = function(testMapName)
{
	// generate a map list, if we need to.
	var maps;
	if( !!window.maps && Array.isArray(window.maps) )
		maps = window.maps;
	else
	{
		maps = new Array();
		var mapz = aaapi.cmdEx("getAllMaps");
		for( var y in mapz )
		{
			if( mapz[y].title.indexOf("background") !== 0 &&  mapz[y].title !== "blank" && this.badMapFiles.indexOf(mapz[y].platforms[this.platformId].file.toLowerCase()) === -1 )
				maps.push(mapz[y]);
		}
	}

	// generate the map history, if we need to.
	var mapHistory;
	if( !!window.mapHistory )
		mapHistory = window.mapHistory;
	else
		mapHistory = (localStorage.getItem("mapHistory")) ? JSON.parse(localStorage.getItem("mapHistory")) : {};

	// grab a context off the page, if we need to (and it exists) TODO: Phase this out.
	if( !!!testMapName && !!window.worldContextContainer && !!window.worldContextContainer.mapFileShort )
		testMapName = worldContextContainer.mapFileShort.toLowerCase() + ".bsp";

	var map;
	for( var i = 0; i < maps.length; i++ )
	{
		if( testMapName === maps[i].platforms[this.platformId].file.toLowerCase() )
		{
			map = maps[i];
			break;
		}
	}
	
	if( !!map )
	{
		// try to find an entry for us in the mapHistory
		var hasInstanceToLoad = false;
		var mapHistoryEntry = mapHistory[map.info.id];
		var mapInstances;
		if( !!mapHistoryEntry )
		{
			if( mapHistoryEntry.instanceId === "" )
			{
				mapInstances = aaapi.cmdEx("getMapInstances", map.info.id);
				
				if( mapInstances.length > 0 )
					mapHistoryEntry.instanceId = mapInstances[0].id;
			}

			if( mapHistoryEntry.instanceId !== "" )
			{
				mapHistoryEntry.timestamp = new Date().getTime();

				// save the mapHistory out
				localStorage.setItem("mapHistory", JSON.stringify(mapHistory));
				hasInstanceToLoad = true;
			}
		}

		if( hasInstanceToLoad )
		{
			// if we are NOT the host and are in a universe, time to disc.
			var universeInfo = aaapi.cmdEx("getConnectedSession");
			if( !!universeInfo && universeInfo.connected && !universeInfo.isHost )
				aaapi.cmd("disconnectSession");

			window.location = "asset://ui/loading.html?map=" + mapHistoryEntry.mapId + "&instance=" + mapHistoryEntry.instanceId + "&pos=" + mapHistoryEntry.position + "&rot=" + mapHistoryEntry.rotation + "&screenshot=" + mapHistoryEntry.screenshotId;
		}
		else
		{
			// are there any instances at all?
			if( !!!mapInstances )
				mapInstances = aaapi.cmdEx("getMapInstances", map.info.id);

			if( mapInstances.length > 0 )
				window.location = "asset://ui/playInstance.html?id=" + map.info.id;
			else
			{
				// create our mapHistory entry
				var mapHistoryEntry = {
					"mapId": map.info.id,
					"instanceId": "",
					"position": "",
					"rotation": "",
					"screenshotId": "",
					"timestamp": new Date().getTime()
				};

				// add our entry to the mapHistory
				mapHistory[map.info.id] = mapHistoryEntry;

				// save the mapHistory out
				localStorage.setItem("mapHistory", JSON.stringify(mapHistory));

				// if we are NOT the host and are in a universe, time to disc.
				var universeInfo = aaapi.cmdEx("getConnectedSession");
				if( !!universeInfo && universeInfo.connected && !universeInfo.isHost )
					aaapi.cmd("disconnectSession");
			
				window.location = "asset://ui/loading.html?map=" + map.info.id + "&instance=" + "" + "&pos=" + "" + "&rot=" + "" + "&screenshot=" + "";
			}
		}
	}
};

ArcadeHud.prototype.playPreviousYouTube = function(taskId)
{
	var taskInfo = aaapi.cmdEx("getTaskInfo", taskId);

	var ytAutoPlay = sessionStorage.getItem("ytAutoPlay");
	if( !!!ytAutoPlay )
		ytAutoPlay = {};
	else
		ytAutoPlay = JSON.parse(ytAutoPlay);

	var ytObjectEntry = ytAutoPlay[taskInfo.objectId];
	if( !!ytObjectEntry && !!ytObjectEntry.previousId && ytObjectEntry.previousId !== "")
	{
		var previousId = ytObjectEntry.previousId;
		var previousObject = aaapi.cmdEx("getObject", previousId);
		if( !!previousObject )
		{
			ytObjectEntry.previousId = "";
			ytObjectEntry.currentId = previousId;

			ytAutoPlay[previousId] = ytObjectEntry;
			sessionStorage.setItem("ytAutoPlay", JSON.stringify(ytAutoPlay));

			delete ytAutoPlay[taskInfo.objectId];

			aaapi.cmd("closeTask", taskInfo.id, true);

			console.log(JSON.stringify(previousObject));
			aaapi.cmd("consoleCommand", "quick_remember " + previousObject.entity + " \"autoinspect\"");

			if( typeof window.onYouTubeEnded === "function" )
				window.onYouTubeEnded();
		}
	}
};

ArcadeHud.prototype.jumpToYouTube = function(objectId, taskId)
{
	var taskInfo = aaapi.cmdEx("getTaskInfo", taskId);
	var ytAutoPlay = sessionStorage.getItem("ytAutoPlay");
	if( !!!ytAutoPlay )
		ytAutoPlay = {};
	else
		ytAutoPlay = JSON.parse(ytAutoPlay);

	if( !!taskInfo )
	{
		var ytObjectEntry = ytAutoPlay[taskInfo.objectId];
		if( !!!ytObjectEntry )
		{
			ytObjectEntry = {
				"originalId": taskInfo.objectId//,
				//"currentId": ""
			};
		}

		delete ytAutoPlay[taskInfo.objectId];
	}

	var object = aaapi.cmdEx("getObject", objectId);
	if( !!object )
	{
		if( !!taskInfo )
		{
			aaapi.cmd("closeTask", taskInfo.id, true);
			//ytObjectEntry.currentId = object.id;

			if( ytObjectEntry.originalId !== object.id )
				ytAutoPlay[object.id] = ytObjectEntry;
			sessionStorage.setItem("ytAutoPlay", JSON.stringify(ytAutoPlay));
		}

		// 6. Select it and auto-play it.
		aaapi.cmd("consoleCommand", "quick_remember " + object.entity + " \"autoinspect\"");

		if( typeof window.onYouTubeEnded === "function" )
			window.onYouTubeEnded();
	}
	else
		sessionStorage.setItem("ytAutoPlay", JSON.stringify(ytAutoPlay));
};

ArcadeHud.prototype.autoplayYouTubeTask = function(taskInfo, mode)
{
	var ytAutoPlay = sessionStorage.getItem("ytAutoPlay");
	if( !!!ytAutoPlay )
		ytAutoPlay = {};
	else
		ytAutoPlay = JSON.parse(ytAutoPlay);

	var ytObjectEntry = ytAutoPlay[taskInfo.objectId];
	if( !!!ytObjectEntry )
	{
		ytObjectEntry = {
			"originalId": taskInfo.objectId//,
			//"currentId": ""
		};
	}
	//else if( mode === "previous" && taskInfo.objectId !== ytObjectEntry.originalId )
	//ytObjectEntry.currentId = taskInfo.objectId;

	delete ytAutoPlay[taskInfo.objectId];
//console.log(ytObjectEntry.currentId);

	var otherId = (taskInfo.objectId == ytObjectEntry.originalId && mode === "previous") ? "" : taskInfo.objectId;
	var nearestObject = aaapi.cmdEx("getNearestObjectToObject", mode, ytObjectEntry.originalId, otherId, true);
	//console.log(JSON.stringify(nearestObject));
	if( !!nearestObject )
	{
		var object = aaapi.cmdEx("getObject", nearestObject);
		if( !!object )
		{
			aaapi.cmd("closeTask", taskInfo.id, true);
			//ytObjectEntry.currentId = object.id;

			if( ytObjectEntry.originalId !== object.id )
				ytAutoPlay[object.id] = ytObjectEntry;
			sessionStorage.setItem("ytAutoPlay", JSON.stringify(ytAutoPlay));

			// 6. Select it and auto-play it.
			aaapi.cmd("consoleCommand", "quick_remember " + object.entity + " \"autoinspect\"");

			if( typeof window.onYouTubeEnded === "function" )
				window.onYouTubeEnded();
		}
		else
			sessionStorage.setItem("ytAutoPlay", JSON.stringify(ytAutoPlay));
	}
	else
		sessionStorage.setItem("ytAutoPlay", JSON.stringify(ytAutoPlay));
};

ArcadeHud.prototype.playNearestYouTube = function(taskId, mode)
{
	var taskInfo = aaapi.cmdEx("getTaskInfo", taskId);
	var ytEndBehavior = aaapi.cmdEx("getConVarValue", "youtube_end_behavior");
	if( !!!taskInfo || ytEndBehavior == "default" )
		return;
	else if( ytEndBehavior == "close" )
	{
		aaapi.cmd("closeTask", taskInfo.id, true);
	}
	else if( ytEndBehavior == "near" )
	{
		this.autoplayYouTubeTask(taskInfo, mode);
	}
};

ArcadeHud.prototype.onGameSchemaFetched = function()
{
	var achievements = [];

	var achievement;
	for( var i = 0; i < arguments.length; i += 3 )
	{
		achievement = {
			"name": arguments[i],
			"displayName": arguments[i+1],
			"icon": arguments[i+2]
		};
		achievements.push(achievement);
	}

	if( typeof window.onGameSchemaFetched === "function" )
		window.onGameSchemaFetched(achievements);
};

ArcadeHud.prototype.onDOMGot = function(url, response)
{
/*
	var totalSource = response;
	var partialSource;
	while( totalSource.length > 0 )
	{
		partialSource = totalSource.substring(0, 1000);
		totalSource = totalSource.substring(1000);
		console.log(partialSource);
	}
*/
	//console.log("onDOMGot");
	var index = response.indexOf("AAAPICALL");
	var callId = response.substring(0, index);
	if( callId.indexOf("metatest") === 0 )
	{
		var content = response.substring(index + 9);
		content = "<html>" + decodeURIComponent(content) + "</html>";

		var doc = arcadeHud.DOMParser.parseFromString(content, "text/html");

		//console.log("BOLLOX!");

		// 1. Loop through ALL scrapers
		// 2. Apply test logic
		// 3. Remember highest certainty hits

		//scraper.test(url, doc, callback)	// note that callback is passed a response that should have response.validForScrape set to TRUE
		//we can treat any "redirect" responses as FAIL, because we are not searching, just scraping.

		var bestScraper = null;
		var bestCertainty = 1;

		var scraper;
		var scraperKeys = Object.keys(this.scrapers);
		for( var i = 0; i < scraperKeys.length; i++ )
		{
			scraper = this.scrapers[scraperKeys[i]];

			// NOTE: The callback gets called synchronously
			scraper.test(url, doc, function(response)
			{
				if( response.validForScrape && (!!!response.redirect || response.redirect === "") )
				{

					if( scraper.fields.all >= bestCertainty )
					{
						console.log("Valid scraper found: " + scraper.title + " w/ certainty " + scraper.fields.all);
						bestScraper = scraper;
						bestCertainty = scraper.fields.all;
					}
				}
			}.bind(this));
		}

		if( !bestScraper )
		{
			// no scraper could be found.
			// just spawn this as a generic item.
			
			// createNewItemWizard
			// now's the time to swap out the AArcade YouTube player URLs with real YT URLs
			var ytid = this.extractYouTubeId(this.url);
			var ytplaylist = this.extractYouTubePlaylistId(this.url);

			var goodTitle = this.pageTitle;
			var goodTypeText = "websites";
			var goodUrl = this.url;
			if( !!ytid )
			{
				// if this is a YT ID, then these get determined on the other side
				goodTitle = "";
				goodTypeText = "";

				if( !!ytplaylist )
					goodUrl = "http://www.youtube.com/watch?v=" + ytid + "&index=1&list=" + ytplaylist;
				else
					goodUrl = "http://www.youtube.com/watch?v=" + ytid;
			}

			var item = aaapi.cmdEx("findLibraryItem", "file", goodUrl);
 			if( !item )
 				item = aaapi.cmdEx("findLibraryItem", "reference", goodUrl);

 			if( item )
 			{
 				console.log("Found item already in library for this URL!");
				aaapi.cmd("setLibraryBrowserContext", "items", item.info.id, "", "");
		 		aaapi.cmd("spawnItem", item.info.id);
 			}
 			else
				document.location = "asset://ui/createItem.html?fileLocation=" + encodeURIComponent(goodUrl) + "&title=" + encodeURIComponent(goodTitle) + "&typetext=" + encodeURIComponent(goodTypeText);
		}
		else
		{
			// use the scraper
			// x1. Trim the fat from the scrapped results (ie. duplicate fields)
			// x2. Build the args array for the update/create item API call.
			// x3. Check if an item already exists for this URL.
			// x4. If an item already exists, update it WHILE respecting certainties.
			// x5. Otherwise, create a NEW item.
			// x6. Spawn the item.

			var results = bestScraper.run(url, "all", doc);//this.field

			if( !Array.isArray(results) )	// importing SteamGames returns an array here, so lets NOT handle that bug right now. (going through the Import menu is the RIGHT way to import Steam games, after all.)
			{
				// eliminate duplicates intellegently
				// FIXME: THIS IS USED IN 2 PLACES NOW, SHOULD BE A METHOD!

				if( !!results.file && results.file !== "" )
				{
					// if there is a file, do not use duplicates on anything else
					if( results.file === results.reference )
						results.reference = "";

					if( results.file === results.preview )
						results.preview = "";

					if( results.file === results.download )
						results.download = "";
				}

				if( !!results.stream && results.stream !== "" )
				{
					// if there is a stream, do not use duplicates on anything
					if( results.stream === results.preview )
						results.preview = "";

					if( results.stream === results.download )
						results.download = "";
				}

				if( !!results.preview && results.preview !== "" )
				{
					// if there is a preview, do not use duplicates on anything
					if( results.preview === results.download )
						results.download = "";

					if( results.file === results.screen )
						results.screen = "";

					if( results.file === results.marquee )
						results.marquee = "";
				}

				if( !!results.download && results.download !== "" )
				{
					// if there is a download, do not use duplicates on anything
					if( results.download === results.screen )
						results.screen = "";

					if( results.download === results.marquee )
						results.marquee = "";
				}

				if( !!results.screen && results.screen !== "" )
				{
					// if there is a screen, do not use duplicates on anything
					if( results.screen === results.marquee )
						results.marquee = "";
				}
			}

			var usedFields = [];
			var args = [];
			var x, field;
			for( x in results)
			{
				field = results[x];

				if( x === "type" )
				{
					var allTypes = aaapi.cmdEx("getAllLibraryTypes");
					var y;
					for( y in allTypes )
					{
						if( allTypes[y].title === field )
						{
							field = allTypes[y].info.id;
							break;
						}
					}
				}

				args.push(x);
				args.push(field);
				usedFields.push(x);
			}

			// does an item already exist?
 			var item = aaapi.cmdEx("findLibraryItem", "file", results.file);
 			if( !item && !!results.reference && results.reference !== "" )
 				item = aaapi.cmdEx("findLibraryItem", "reference", results.reference);

 			if( item )
 			{
 				console.log("Item found within user library for this URL!");

				var success = aaapi.cmdEx("updateItem", item.info.id, args);
				if( success )
				{
					console.log("Item updated!");

					aaapi.cmd("statAction", "aa_wizards_applied", 1);

					aaapi.cmd("setLibraryBrowserContext", "items", item.info.id, "", "");
		 			aaapi.cmd("spawnItem", item.info.id);
		 			//aaapi.cmd("goHome");
					//aaapi.cmd("deactivateInputMode");
					//aaapi.cmd("autoInspect", this.activeScraperItemId);
				}
				else
					console.log("Item update rejected!");
 			}
 			else
 			{
 				console.log("This is a brand-new item we need to create!");
				var createdItemId = aaapi.cmdEx("saveItem", "", args);	// the response is actually the item ID or FALSE
				if( createdItemId )
				{
					console.log("Item created!");

					aaapi.cmd("statAction", "aa_wizards_applied", 1);

					aaapi.cmd("setLibraryBrowserContext", "items", createdItemId, "", "");
					aaapi.cmd("spawnItem", createdItemId);
					//aaapi.cmd("goHome");
					//aaapi.cmd("deactivateInputMode");
					//arcadeHud.expandAddressMenu();
				}
 			}
		}

		return;
	}

	if( !!this.metaScrapeHandles[callId] )
	{
		var scraper = this.metaScrapeHandles[callId].scraper;
		var callback = this.metaScrapeHandles[callId].callback;

		var doc;
		var content = response.substring(index + 9);
		if( scraper.id === "importSteamGames")
		{
			doc = JSON.parse(decodeURIComponent(content));
		}
		else
		{
//			var crap = decodeURIComponent(content);
			content = "<html>" + decodeURIComponent(content) + "</html>";
			doc = arcadeHud.DOMParser.parseFromString(content, "text/html");
/*
					if( false || content.indexOf("id=\"page\"") >= 0 )
					{
						var elemm = document.createElement("textarea");
						elemm.value = crap;
						elemm.style.cssText = "position: absolute; width: 80%; height: 80%; top: 20px; left: 20px;";
						document.body.appendChild(elemm);
						elemm.focus();
						elemm.select();
					}*/
		}

		//var scraper = this.metaScrapeHandles[callId].scraper;
		//var callback = this.metaScrapeHandles[callId].callback;
		delete this.metaScrapeHandles[callId];

		// FIXME: WHEN DOES THE BROWSER INSTANCE CLEAR ITS ACTIVE SCRAPER????? It doesn't, but it needs to. (POSSIBLY FIXED ALREADY)
		//var results = scraper[callId](url, doc);
		//callback(results);
		callback(callId, url, doc);
	}
	else
		console.log("ERROR: DOM received with no matching scrape handle.");
};

ArcadeHud.prototype.onDOMReady = function()
{
	// Async
	return {
			"then": function(DOMReadyCallback)
			{
				if( document.readyState === "interactive" || document.readyState === "complete" )
					DOMReadyCallback();
				else
				{
					function readyWatch(DOMEvent)
					{
						DOMReadyCallback();
					}

					document.addEventListener("DOMContentLoaded", readyWatch.bind(this), true);
				}
			}.bind(this)
		};
};

ArcadeHud.prototype.loadHeadScript = function(scriptName)
{
	// load all scrapers before the body loads
	var xhrObj = new XMLHttpRequest();
	xhrObj.open('GET', scriptName, false);
	xhrObj.send('');

	var se = document.createElement('script');
	se.type = "text/javascript";
	se.text = xhrObj.responseText;

	document.getElementsByTagName('head')[0].appendChild(se);
};

ArcadeHud.prototype.addScraper = function(scraper)
{
	this.scrapers[scraper.id] = scraper;
};

ArcadeHud.prototype.init = function()
{
	this.loadHeadScript("scrapers.js");
};

// kodi crc code originally from: http://forum.kodi.tv/showthread.php?tid=58389
Number.prototype.unsign = function(bytes)
{
	return this >= 0 ? this : Math.pow(256, bytes || 4) + this;
};

var arcadeHud = new ArcadeHud();
arcadeHud.init();