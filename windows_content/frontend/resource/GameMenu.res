"GameMenu"
{
	"1"
	{
		"label" "#GameUI_GameMenu_ResumeGame"
		"command" "ResumeGame"
		"OnlyInGame" "1"
	}
	"2"
	{
		"label" "#GameUI_GameMenu_Disconnect"
		"command" "Disconnect"
		"OnlyInGame" "1"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"3"
	{
		"label" "#GameUI_GameMenu_PlayerList"
		"command" "OpenPlayerListDialog"
		"OnlyInGame" "1"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"4"
	{
		"label" ""
		"command" ""
		"OnlyInGame" "1"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"5"
	{
		"label" "#GameUI_GameMenu_FindServers"
		"command" "OpenServerBrowser"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"6"
	{
		"label" "#GameUI_GameMenu_CreateServer"
		"command" "OpenCreateMultiplayerGameDialog"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"7"
	{
		"label" "#GameUI_GameMenu_ActivateVR"
		"command" "engine vr_activate"
		"InGameOrder" "40"
		"OnlyWhenVREnabled" "1"
		"OnlyWhenVRInactive" "1"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"8"
	{
		"label" "#GameUI_GameMenu_DeactivateVR"
		"command" "engine vr_deactivate"
		"InGameOrder" "40"
		"OnlyWhenVREnabled" "1"
		"OnlyWhenVRActive" "1"
		
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"10"
	{
		"label" "Main Menu"
		"command" "engine main_menu"
		"notsingle" "1"
		"notmulti" "1"
	}
	"11"
	{
		"label" "Debug Info"
		"command" "engine debug_info"
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"12"
	{
		"label" "Run Libretro"
		"command" "engine run_embedded_libretro"
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"13"
	{
		"label" "Run Steam Browser"
		"command" "engine run_embedded_steam_browser"
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"14"
	{
		"label" "Run Awesomium Browser"
		"command" "engine run_embedded_awesomium_browser"
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"419"
	{
		"label" "Options"
		"command" "OpenOptionsDialog"
		"OnlyInGame" "1"
		"notsingle" "1"
		"notmulti" "1"
	}
	"420"
	{
		"label" "Quit"
		"command" "Quit"
	}
}

