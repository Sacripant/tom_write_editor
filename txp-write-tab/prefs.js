{
  "drop": {
    "images": "<txp:image id='{{ id }}' />",
    "files": "<txp:file_download_link id='{{ id }}'> \r\n    <txp:file_download_name />\n</txp:file_download_link>",
    "links": "<txp:link id='{{ id }}'/>"
  },
  "path" : {
  	"images" : "/sacripant/trunk/textpattern/?event=image",
  	"files" : "/sacripant/trunk/textpattern/?event=file",
  	"links" : "/sacripant/trunk/textpattern/?event=link"
  }
}