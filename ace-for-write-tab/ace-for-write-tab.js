(function ($) {

	/*
	 * Get JSON Prefs file
	 */
	function getPrefs (){
		var json = null;
		$.ajax({
	        url: "prefs.js",
	        async: false,
	        global: false,
	        dataType: "json",
	        success: function (data) {
	        	// console.log(data);
	            json = data;
	        },
	        error: function(){
	        	console.error('ajax error: ');
	        }
	    });
	    return json;
	}
	// ace.require("ace/ext/language_tools");


	// CamelCase to phrase
	function CamelCaseToPhrase(camelCase) {
    	return camelCase.split(/(?=[A-Z])/).join(' ');
	}




		// Store Prefs
	var	prefs = getPrefs(),

		editor = {},
		txpWritePage = {},

		// Store some Txp write page elements
		txpWritePageObj = function() {
			txpWritePage.$title = $('#title');
			txpWritePage.$body = $('#body');
			txpWritePage.$publish = $('.publish');
		},		

		// Store Editor Objects
		initEditorObj = function() {
			editor.btn = {
				"$show" : $('<a class="show-ace ace-show-hide"><i>fullscreen</i></a>').prependTo('p.body'),
				"$hide" : $('#ace-hide-btn'),
				"$save": $('#ace-save-btn'),
				"$iframeSrcs": $('#ace-iframe-btn').find('button'),
				"$help" : $('#ace-help').find('button')
			};
			editor.title = document.getElementsByClassName('ace-article_title');
			editor.open = false;
			editor.iframe = document.getElementById('ace-iframe');
			editor.help = document.getElementById('ace-help');
		},

		// Init Ace Editor with some options
		initAce = function(wrapper) {
			editor.ace = ace.edit(wrapper);	// Initialize Editor

			// THEME
			editor.ace.setTheme("ace/theme/sacripant");
			// MODE			
			editor.ace.getSession().setMode("ace/mode/textile");
			// editor.ace options
			editor.ace.getSession().setUseWrapMode(true);
			editor.ace.setShowPrintMargin(true);
			editor.ace.setOptions({
	        	enableSnippets: true,
	        	fontSize: "16px"
		    });

			// synchronize with textarea
			editor.ace.getSession().on('change', function(){
				txpWritePage.$body.val(editor.ace.getSession().getValue());
			});

			// Load snippets obj
			editor.snippetManager = require("ace/snippets").snippetManager;

			// Load Keybord Shortcuts Objects
            editor.keybordShortcuts = require("ace/ext/menu_tools/get_editor_keyboard_shortcuts").getEditorKeybordShortcuts(editor.ace);
			console.log(editor.keybordShortcuts);			


			// Create array of Ace shortcut
            // ace.config.loadModule("ace/ext/menu_tools/get_editor_keyboard_shortcuts", function(module) {
            //     console.log(editor.keybordShortcuts);
            //     // console.log(editor.ace.showKeyboardShortcuts(););
            // });

   			// console.log(getKeybordShortcuts(editor.ace));
			editor.ace.commands.addCommand({
		        name: "showKeyboardShortcuts",
		        bindKey: {win: "Ctrl-Alt-s", mac: "Command-Alt-s"},
		        exec: function(AceEditor) {
		        	console.log(editor);
		            ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
		                module.init(AceEditor);
		                AceEditor.showKeyboardShortcuts();
		            });
		        }
	    	});
	    	// editor.ace.execCommand("showKeyboardShortcuts");
		},

		// inject id in snippet
		replaceID = function(string, id) {
			return string.replace('{{ id }}', id);
		}, 

	
		// Show Editor
		showEditor = function() {
			// copy textarea content in Ace editor
			editor.ace.getSession().setValue(txpWritePage.$body.val());

			// add focus in top on Editor
			editor.ace.focus();
						
			// Clone article title
			$(editor.title).text(txpWritePage.$title.val());
						
			// Show Editor
			$('html').addClass('ace-editor-on');

			editor.open = true;
		},

		// Hide Editor
		hideEditor = function() {
			$('html').removeClass('ace-editor-on');	

			editor.open = false;			
		},

		// Load external page in right panel iframe
		loadPage = function(pageName) {
			editor.iframe.classList.add('hide');
			editor.iframe.src = prefs.path[pageName];
			editor.iframe.addEventListener('load', function() {
				editor.iframe.classList.remove('hide');
			});

		};


	window.onload = function() {
		
		txpWritePageObj();
		initEditorObj();
		initAce('ace-editor');	

		console.log(editor.ace);

		// Store Ace Keybords
		
				
		// show Editor
		editor.btn.$show.click(function() {
			showEditor();
		});
		
		// Hide Editor	
		editor.btn.$hide.click(function() {
			hideEditor();			
		});
		
		// trigger save on save button
		// editor.btn.save[0].value += ' | '+key+'+s';
		editor.btn.$save.click(function(){
			txpWritePage.$publish.click();
		});

		// Load external page in iframe
		editor.btn.$iframeSrcs.click(function() {
			loadPage(this.dataset.src);
		});

		// display Ace help tables
		editor.btn.$help.click(function() {
			var action = this.dataset.help;

			if (action === "shortcuts") {
				// console.log('click on shurtcuts btn');
				editor.ace.execCommand("showKeyboardShortcuts");
				// console.log(editor.ace.showKeyboardShortcuts());
				
			}
		}); 



		// Shortcut
		// var key = "ctrl";
		
		// if (navigator.userAgent.indexOf('Mac OS X') !== -1)
			// key = '⌘';

						

		
		$(document).keydown(function(e) {
			if (editor.open) {
				// esc = hide Editor
				if (e.keyCode === 27) {
					console.log("Esc editor");
					hideEditor();									
				}
			}
			// Save
			// if (e.keyCode == 83 && (e.metaKey || e.ctrlKey)) {
			// 	e.preventDefault();
			// 	txpWritePage.publish.click();
			// }
		});


		// TEST: Make image panel draggable

		// Select image iframe content
		var iframeContent = $("#ace-image-panel").contents(),
			images = iframeContent.find('#images_form tr');

			console.log(images);

		var dropImageSnippet = function(data) {
			return replaceID(prefs.drop.img, data);
		};


		var dndHandler = {

		    draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement
		    applyDragEvents: function(element) {

		        element.draggable = true;
		        var dndHandler = this; // Cette variable est nécessaire pour que l'événement « dragstart » accède facilement au namespace « dndHandler »

				element.addEventListener('dragstart', function(e) {
					dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
					e.imgid = $(dndHandler.draggedElement).find('input')[0].value;
					console.log(e.imgid);
		            e.dataTransfer.setData('text', dropImageSnippet(e.imgid)); // Nécessaire pour Firefox
		        });
		    }
		};

		images.each(function(index, el) {
			dndHandler.applyDragEvents(el);
		});
		


};


})(jQuery);
