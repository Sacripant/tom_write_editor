# Tom Write Editor

Tom Write Editor is a texpattern plugin that add a distraction free writing environment for Textpattern write tab whith some advanced features. It's a editor for geek writers!

## Install

1. Copy @tomWE@ folder directly in @textpatter@ folder.
2. Install and active @tom_write_editor_v*.txt@ plugin since Textpattern plugin tab.

## Usage

For a new article, the best practice is to enter _Title_ and _Sort and display_ informations (section + category) of the article, select Draft as Status and Save.

Click on the button available nearby Body label to open the editor and start writing.

### Basic Ace editor features

TomWE use Ace Editor (a Javascript Editor), synchronized with the body textarea. Ace editor offer some feature compared to textarea:

* Tabs / indent.
* Simple textile syntaxic coloration.
* Duplicate / move lines or part of text.
* Find / replace
* Macros
* Snippets
* etc.

### Some specifics features for Textpattern

* Display directly since editor Article/images/files/links tab via keyboard shortcuts or buttons in a right panel.
* Insert a code snippet to editor via drag & drop since open Article/images/files/links tab
* Add custom Snippets.
* Save your article with @ctrl-S@ @command-s@
* See a live preview of your article (the preview is automatically refreshed when you save).

### Change Editor prefs

Editor preferencies are stored in a @prefs-default@ json file. Please don't change this file. You risk to loose your changes after update this plugin. A blank @prefs-user@ json file is dedicated for adapte your needs.

Just copy-past preferencies object you want to change and change value.

#### Example

You use _rah_knots_ plugin that allready add a keyboard shortcuts for save your article. Just overwrite Editor save shortcut to @false@ to @prefs-user@ file

	{
  		"bindKey" : {
    		"save" : false
  		}
	}

### Add custom snippets

Ace editor comes with some snippets. But you can add custom snippets in @additional-snippets@ json file.

#### Example

	[
		{
			"name" : "txp_img",
			"tabTrigger" : "timg",
			"content" : "<txp:image id='${1:id}' />"
		}
	]


