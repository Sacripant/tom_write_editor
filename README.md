# Tom Write Editor

Tom Write Editor is a texpattern plugin that adds a distraction free writing environment for the Textpattern write tab with some advanced features. It's an editor for geek writers!

## Install

1. Copy the `tom-WE` folder directly in the `textpattern` folder.
2. Install and activate the `tom_write_editor_v*.txt` plugin from the Textpattern plugin tab.

## Usage

For a new article, the best practice is to enter _Title_ and _Sort and display_ informations (section + category) of the article, select Draft as Status and Save.

Click on the button available nearby the _Body_ label to open the editor and start writing.

### Basic Ace editor features

Tom-WE uses Ace Editor (a Javascript Editor), synchronized with the body textarea. Ace editor offers some additional features to textarea such as:

* Tabs / indent.
* Simple textile syntaxic coloration.
* Duplicate / move lines or part of text.
* Find / replace
* Macros
* Snippets
* etc.

### Some specifics features for Textpattern

* Display directly from editor Article/images/files/links tab via keyboard shortcuts or buttons in a right panel.
* Insert a code snippet to editor via drag & drop from an opened Article/images/files/links tab
* Add custom Snippets.
* Save your article with `ctrl-S` `command-s`
* See a live preview of your article (the preview is automatically refreshed when you save).

### Change Editor prefs

Editor preferences are stored in a `prefs-default` json file. Please don't change this file. You risk to loose your changes after updated this plugin. A blank `prefs-user` json file is dedicated to fit your needs.

Just copy-paste preferences object you want to change and upadate values.

#### Example

You use _rah_knots_ plugin that already add a keyboard shortcuts to save your article. Just overwrite Editor save shortcut using `false` in the `prefs-user` file

	{
  		"bindKey" : {
    		"save" : false
  		}
	}

### Add custom snippets

Ace editor comes with some snippets. But you can add custom snippets in the `additional-snippets` json file.

#### Example

	[
		{
			"name" : "txp_img",
			"tabTrigger" : "timg",
			"content" : "<txp:image id='${1:id}' />"
		}
	]
