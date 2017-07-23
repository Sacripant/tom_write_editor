{
  "drop": {
    "articles": "<txp:permlink id='{{ id }}'><txp:title /></txp:permlink>",
    "images": "<txp:image id='{{ id }}' />",
    "files": "<txp:file_download_link id='{{ id }}'> \r\n    <txp:file_download_name />\n</txp:file_download_link>",
    "links": "<txp:link id='{{ id }}'/>"
  },
  "rightPanelDefaultSize" : "2",
  "path" : {
    "articles" : "?event=list",
  	"images" : "?event=image",
  	"files" : "?event=file",
  	"links" : "?event=link"
  },
  "bindKey" : {
    "articles" : {"win": "Command-Alt-a", "mac": "Ctrl-Alt-a"},
    "images" : {"win": "Command-Alt-i", "mac": "Ctrl-Alt-i"},
    "files" : {"win": "Command-Alt-f", "mac": "Ctrl-Alt-f"},
    "links" : {"win": "Command-Alt-l", "mac": "Ctrl-Alt-l"},
    "preview" : {"win": "Command-Alt-p", "mac": "Ctrl-Alt-p"},
    "shortcuts" : {"win": "Command-Alt-k", "mac": "Ctrl-Alt-k"},
    "snippets" : {"win": "Command-Alt-s", "mac": "Ctrl-Alt-s"}
  }
}