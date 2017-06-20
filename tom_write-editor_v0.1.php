<?php

// This is a PLUGIN TEMPLATE for Textpattern CMS.

// Copy this file to a new name like abc_myplugin.php.  Edit the code, then
// run this file at the command line to produce a plugin for distribution:
// $ php abc_myplugin.php > abc_myplugin-0.1.txt

// Plugin name is optional.  If unset, it will be extracted from the current
// file name. Plugin names should start with a three letter prefix which is
// unique and reserved for each plugin author ("abc" is just an example).
// Uncomment and edit this line to override:
$plugin['name'] = 'tom_write-editor';

// Allow raw HTML help, as opposed to Textile.
// 0 = Plugin help is in Textile format, no raw HTML allowed (default).
// 1 = Plugin help is in raw HTML.  Not recommended.
# $plugin['allow_html_help'] = 1;

$plugin['version'] = '0.1';
$plugin['author'] = 'Thomas JUND';
$plugin['author_uri'] = 'http://sacripant.fr';
$plugin['description'] = 'Text editor for geek writers';

// Plugin load order:
// The default value of 5 would fit most plugins, while for instance comment
// spam evaluators or URL redirectors would probably want to run earlier
// (1...4) to prepare the environment for everything else that follows.
// Values 6...9 should be considered for plugins which would work late.
// This order is user-overrideable.
$plugin['order'] = '5';

// Plugin 'type' defines where the plugin is loaded
// 0 = public              : only on the public side of the website (default)
// 1 = public+admin        : on both the public and admin side
// 2 = library             : only when include_plugin() or require_plugin() is called
// 3 = admin               : only on the admin side (no AJAX)
// 4 = admin+ajax          : only on the admin side (AJAX supported)
// 5 = public+admin+ajax   : on both the public and admin side (AJAX supported)
$plugin['type'] = '3';

// Plugin "flags" signal the presence of optional capabilities to the core plugin loader.
// Use an appropriately OR-ed combination of these flags.
// The four high-order bits 0xf000 are available for this plugin's private use
if (!defined('PLUGIN_HAS_PREFS')) define('PLUGIN_HAS_PREFS', 0x0001); // This plugin wants to receive "plugin_prefs.{$plugin['name']}" events
if (!defined('PLUGIN_LIFECYCLE_NOTIFY')) define('PLUGIN_LIFECYCLE_NOTIFY', 0x0002); // This plugin wants to receive "plugin_lifecycle.{$plugin['name']}" events

$plugin['flags'] = '0';

// Plugin 'textpack' is optional. It provides i18n strings to be used in conjunction with gTxt().
// Syntax:
// ## arbitrary comment
// #@event
// #@language ISO-LANGUAGE-CODE
// abc_string_name => Localized String

/** Uncomment me, if you need a textpack
$plugin['textpack'] = <<< EOT
#@admin
#@language en-gb
abc_sample_string => Sample String
abc_one_more => One more
#@language de-de
abc_sample_string => Beispieltext
abc_one_more => Noch einer
EOT;
**/
// End of textpack

if (!defined('txpinterface'))
    @include_once('zem_tpl.php');

# --- BEGIN PLUGIN CODE ---
if (@txpinterface == 'admin') {
    // register_callback( 'abc_add_text', 'article_ui', 'extend_col_1');

    register_callback('tom_we', 'admin_side', 'body_end');
    // register_callback('abc_add_text', 'article');
}

/*
 *   Editor markup
 */
function tom_we_markup() {
    $out = <<<HTML

        <!-- 
            TOM WRITE EDITOR MARKUP 
        -->
        <div id="ace-fullscreen">
            <div class="ace-menu">
                <!-- left BTNS -->
                <div class="ace-menu-right">
                    <button type="button" id="ace-save-btn" class="ace-save-btn">
                        save <kbd>ctrl+s</kbd>
                    </button>
                    <button type="button" id="ace-hide-btn" class="ace-hide-btn">    
                        close <kbd>esc</kbd>                              
                    </button>
                </div>
                <!-- right BTNS -->
                <div class="ace-menu-left">
                    
                    <span id="ace-iframe-btn">
                        <button type="button" data-src="images">Images</button>
                        <button type="button" data-src="files">Files</button>
                        <button type="button" data-src="links">Links</button>
                    </span>

                    <span id="ace-panel-size-btns">
                        <button data-panel-size="4" type="button">2/3</button>
                        <button data-panel-size="2" type="button">1/2</button>
                        <button data-panel-size="1" type="button">1/3</button>        
                    </span>

                    <span id="ace-help-btns">
                        <button type="button" data-help="shortcuts">Shortcuts</button>
                        <button type="button" data-help="snippets">Snippets</button>
                    </span>
                </div>
            </div>
            <div class="ace-panels">
                <!-- Editor/Left panel -->
                <div id="ace-panel-left" class="ace-panel-left">
                    <h1 class="ace-article_title"></h1>                        
                    <div class="editor-wrapper">                               
                        <div id="ace-editor"></div>                             
                    </div>
                </div>  
                <!-- Right panel -->
                <div id="ace-panel-right" class="ace-panel-right">
                    <iframe id="ace-iframe" class="ace-panel-right-content hide" frameborder="0"></iframe>
                    <div id="ace-help" class="ace-panel-right-content hide" frameborder="0"></div>
                </div>
            </div>                                                                        
        </div> 

        <link  href="ace-for-txp/ace-for-write-tab/theme-sacripant.css" rel="stylesheet" />
        <script src="ace-for-txp/ace-for-write-tab/src/ace.js" type="text/javascript"></script>
        <script src="ace-for-txp/ace-for-write-tab/src/ext-language_tools.js" type="text/javascript"></script>
        <script src="ace-for-txp/ace-for-write-tab/src/ext-keybinding_menu.js" type="text/javascript"></script>
        <script src="ace-for-txp/ace-for-write-tab/ace-for-write-tab.js" type="text/javascript"></script>


HTML;

    return $out;
}

/*
 *  Inject Markup in write footer page
 */

function tom_we() {

    global $event;
    if($event !== 'article') {
        return;
    }
        
    echo tom_we_markup();
}


# --- END PLUGIN CODE ---
if (0) {
?>
<!--
# --- BEGIN PLUGIN HELP ---

# --- END PLUGIN HELP ---
-->
<?php
}
?>