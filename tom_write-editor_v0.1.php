<?php

// This is a PLUGIN TEMPLATE for Textpattern CMS.

// Copy this file to a new name like abc_myplugin.php.  Edit the code, then
// run this file at the command line to produce a plugin for distribution:
// $ php abc_myplugin.php > abc_myplugin-0.1.txt

// Plugin name is optional.  If unset, it will be extracted from the current
// file name. Plugin names should start with a three letter prefix which is
// unique and reserved for each plugin author ("abc" is just an example).
// Uncomment and edit this line to override:
$plugin['name'] = 'tom_write_editor';

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
    register_callback('tomWE_inject_markup', 'admin_side', 'body_end');
    register_callback('tomWE_iframeCSS', 'admin_side', 'head_end');
}

/*
 *   Editor markup
 */
function tomWE_markup() {
    $out = <<<HTML

        <!-- 
            TOM WRITE EDITOR MARKUP 
        -->
        <div id="tomWE">
            <div class="tomWE-menu">
                <!-- left BTNS -->
                <div class="tomWE-menu-left">
                    <span class="tomWE-btnsgroup">
                        <button type="button" id="tomWE-save-btn" class="tomWE-btn tomWE-save-btn">
                            Save
                        </button>                        
                    </span>
                    <span class="tomWE-btnsgroup">
                        <button type="button" id="tomWE-hide-btn" class="tomWE-btn tomWE-hide-btn">    
                            Close                              
                        </button>
                    </span>
                    <span class="tomWE-btnsgroup">
                        <button type="button" id="tomWE-settings-btn" class="tomWE-btn tomWE-settings-btn" title="Ace editor settings" aria-label="Ace editor settings">    
                            <svg viewBox="0 0 20 20">
                                <use class="tomWE-icon tomWE-icon-settings" xlink:href="tom-WE/assets/icons.svg#settings" />
                            </svg>                              
                        </button>
                    </span>
                </div>
                <!-- right BTNS -->
                <div class="tomWE-menu-right">
                    
                    <span class="tomWE-btnsgroup" id="tomWE-rightcontent-btns">
                            <!-- articles btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-articles-btn" name="tomWE-menu-right-content" data-type="iframe" value="articles" />
                                <label 
                                    for="tomWE-articles-btn"
                                    title="articles"
                                    aria-label="articles"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-articles" xlink:href="tom-WE/assets/icons.svg#articles" />
                                    </svg>
                                </label>
                            </span>
                            
                            <!-- images btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-images-btn" name="tomWE-menu-right-content" data-type="iframe" value="images" />
                                <label 
                                    for="tomWE-images-btn"
                                    title="images"
                                    aria-label="images"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-images" xlink:href="tom-WE/assets/icons.svg#images" />
                                    </svg>
                                </label>
                            </span>

                            <!-- files btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-files-btn" name="tomWE-menu-right-content" data-type="iframe" value="files" />
                                <label 
                                    for="tomWE-files-btn"
                                    title="files"
                                    aria-label="files"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-files" xlink:href="tom-WE/assets/icons.svg#files" />
                                    </svg>
                                </label>
                            </span>

                            <!-- links btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-links-btn" name="tomWE-menu-right-content" data-type="iframe" value="links" />
                                <label 
                                    for="tomWE-links-btn"
                                    title="links"
                                    aria-label="links"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-links" xlink:href="tom-WE/assets/icons.svg#links" />
                                    </svg>
                                </label>
                            </span>

                            <!-- preview btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-preview-btn" name="tomWE-menu-right-content" data-type="preview" value="preview" />
                                <label 
                                    for="tomWE-preview-btn"
                                    title="preview"
                                    aria-label="preview"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-preview"  xlink:href="tom-WE/assets/icons.svg#preview" />
                                    </svg>
                                </label>
                            </span>
                        
                            <!-- shortcuts btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-shortcuts-btn" name="tomWE-menu-right-content" data-type="help-table" value="shortcuts" />
                                <label 
                                    for="tomWE-shortcuts-btn"
                                    title="Shortcuts"
                                    aria-label="Shortcuts"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-shortcuts" xlink:href="tom-WE/assets/icons.svg#shortcuts" />
                                    </svg>
                                </label>
                            </span>
                            
                            <!-- snippets btn -->
                            <span class="tomWE-btn">
                                <input type="radio" id="tomWE-snippets-btn" name="tomWE-menu-right-content" data-type="help-table" value="snippets" />
                                <label 
                                    for="tomWE-snippets-btn"
                                    title="Snippets"
                                    aria-label="Snippets"
                                >
                                    <svg viewBox="0 0 20 20">
                                        <use class="tomWE-icon tomWE-icon-snippets" xlink:href="tom-WE/assets/icons.svg#snippets" />
                                    </svg>                                    
                                </label>
                            </span>
                    </span>

                    <span class="tomWE-btnsgroup" id="tomWE-panel-size-btns">
                        <!-- 2/3 size btn -->
                        <span class="tomWE-btn">
                            <input type="radio" id="tomWE-size2-3-btn" name="tomWE-menu-right-size" value="4" disabled>
                            <label 
                                for="tomWE-size2-3-btn"
                                title="panel size: 2/3"
                            >
                                <svg viewBox="0 0 20 20">
                                    <use class="tomWE-icon-size tomWE-icon-size2-3" xlink:href="tom-WE/assets/icons.svg#size2-3" />
                                </svg>                                    
                            </label>
                        </span>
                        <!-- 1/2 size btn -->
                        <span class="tomWE-btn">
                            <input type="radio" id="tomWE-size1-2-btn" name="tomWE-menu-right-size" value="2" disabled>
                            <label 
                                for="tomWE-size1-2-btn"
                                title="panel size: 1/2"
                            >
                                <svg viewBox="0 0 20 20">
                                    <use class="tomWE-icon-size tomWE-icon-size1-2" xlink:href="tom-WE/assets/icons.svg#size1-2" />
                                </svg>                                    
                            </label>
                        </span>
                        <!-- 1/3 size btn -->
                        <span class="tomWE-btn">
                            <input type="radio" id="tomWE-size1-3-btn" name="tomWE-menu-right-size" value="1" disabled>
                            <label 
                                for="tomWE-size1-3-btn"
                                title="panel size: 1/3"
                            >
                                <svg viewBox="0 0 20 20">
                                    <use class="tomWE-icon-size tomWE-icon-size1-3" xlink:href="tom-WE/assets/icons.svg#size1-3" />
                                </svg>                                    
                            </label>
                        </span>
                        <!-- 0 size btn -->
                        <!-- close left Panel btn -->
                        <span class="tomWE-btn">
                            <input type="radio" id="tomWE-closePanel-btn" name="tomWE-menu-right-size" value="0" disabled checked />
                            <label 
                                for="tomWE-closePanel-btn"
                                title="Close right panel"
                            >
                                <svg viewBox="0 0 20 20">
                                    <use class="tomWE-icon-size tomWE-icon-size0" xlink:href="tom-WE/assets/icons.svg#size0" />
                                </svg>                                    
                            </label>
                        </span>
                    </span>

                </div>
            </div>
            <div class="tomWE-panels">
                <!-- Editor/Left panel -->
                <div id="tomWE-panel-left" class="tomWE-panel-left">
                    <h1 class="tomWE-article_title"></h1>                        
                    <div class="editor-wrapper">                               
                        <div id="tomWE-editor"></div>                             
                    </div>
                </div>  
                <!-- Right panel -->
                <div id="tomWE-panel-right" class="tomWE-panel-right">
                    <iframe id="tomWE-iframe" class="tomWE-panel-right-content tomWE-iframe hide" frameborder="0"></iframe>
                    <div id="tomWE-help" class="tomWE-panel-right-content tomWE-help-table hide"></div>
                </div>
            </div>                                                                        
        </div> 

        <link  href="tom-WE/assets/theme-sacripant.css" rel="stylesheet" />
        <script src="tom-WE/assets/src/ace.js" type="text/javascript"></script>
        <script src="tom-WE/assets/src/ext-language_tools.js" type="text/javascript"></script>
        <script src="tom-WE/assets/src/ext-keybinding_menu.js" type="text/javascript"></script>
        <script src="tom-WE/assets/ace-for-write-tab.js" type="text/javascript"></script>


HTML;

    return $out;
}


/*
 *  CSS for Txp call since Editor
 */

function tomWE_iframeCSS()
{
    $out = <<<HTML

    <style>
        .in-tomWE { padding-top : 2em; }
        .in-tomWE .txp-header { display: none !important; }

        .in-tomWE .txp-list tbody tr[draggable]:hover {
            cursor:  -webkit-grab;
            cursor:  grab;
            background-color: #ffda44;
        }
        .in-tomWE .txp-list tbody tr[draggable]:active {
            cursor:  grabbing;
        }
    </style>

HTML;

    echo $out;
}

/*
 *  Inject Editor Markup in write footer page
 */

function tomWE_inject_markup() {

    global $event;
    if($event !== 'article') {
        return;
    }
        
    echo tomWE_markup();
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