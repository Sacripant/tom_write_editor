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
  }
}