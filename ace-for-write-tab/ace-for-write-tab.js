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


	// Store Prefs
	var	prefs = getPrefs(),

		editor = {},
		txpWritePage = {},

		// Load Ace snippets object
		snippetManager = require("ace/snippets").snippetManager,

		// Store some Txp write page elements
		txpWritePageObj = function() {
			txpWritePage.title = $('#title');
			txpWritePage.body = $('#body');
			txpWritePage.publish = $('.publish');
		},		

		// Store Editor Objects
		initEditorObj = function() {
			editor.btn = {
				"show" : $('<a class="show-ace ace-show-hide"><i>fullscreen</i></a>').prependTo('p.body'),
				"hide" : $('#ace-hide-btn'),
				"save": $('#ace-save-btn')				
			};
			editor.title = document.getElementsByClassName('ace-article_title');
			editor.open = false;
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
	        	enableSnippets: true
		    });

			// synchronize with textarea
			editor.ace.getSession().on('change', function(){
				txpWritePage.body.val(editor.ace.getSession().getValue());
			});	
		},

		// inject id in snippet
		replaceID = function(string, id) {
			return string.replace('{{ id }}', id);
		}, 

	
		// Show Editor
		showEditor = function() {
			// copy textarea content in Ace editor
			editor.ace.getSession().setValue(txpWritePage.body.val());

			// add focus in top on Editor
			editor.ace.focus();
						
			// Clone article title
			$(editor.title).text(txpWritePage.title);
						
			// Show Editor
			$('html').addClass('ace-editor-on');

			editor.open = true;
		},

		// Hide Editor
		hideEditor = function() {
			$('html').removeClass('ace-editor-on');	

			editor.open = false;			
		};

	window.onload = function() {
		
		txpWritePageObj();
		initEditorObj();
		initAce('ace-editor');	

		console.log(editor.ace);
		
				
		// show Editor
		editor.btn.show.click(function() {
			showEditor();
		});
		
		// Hide Editor	
		editor.btn.hide.click(function() {
			hideEditor();			
		});
		
		// add save shortcut to save button
		// saveBtn[0].value += ' | '+key+'+s';
		editor.btn.save.click(function(){
			txpWritePage.publish.click();
		});



		// Shortcut
		var key = "ctrl";
		
		if (navigator.userAgent.indexOf('Mac OS X') !== -1)
			key = '⌘';
						

		
		$(document).keydown(function(e) {
			if (editor.open) {
				// esc = hide Editor
				if (e.keyCode === 27)
					console.log("Esc editor");
					hideEditor();				
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
