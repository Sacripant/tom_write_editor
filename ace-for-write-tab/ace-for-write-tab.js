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
	};
	// ace.require("ace/ext/language_tools");


	// Store Prefs
	var	prefs = getPrefs(),
	
		// open Editor Btn 		
		showAce	= $('<a class="show-ace ace-show-hide"><i>fullscreen</i></a>')
					.prependTo('p.body'),
		
		// Editor container
		aceEditor = document.getElementById('ace-editor'),			
		// aceEditor.style.fontSize='15px';


		// inject id in snippet
		replaceID = function(string, id) {
			return string.replace('{{ id }}', id);
		};
	

	window.onload = function() {
		
		var editor	= ace.edit("ace-editor")		// Initilize Editor
		,	body	= $('#body')
		,	aceArticleTitle = document.getElementsByClassName('ace-article_title')
		,	snippetManager = require("ace/snippets").snippetManager
		;

		console.log(snippetManager);
		
		// THEME
		editor.setTheme("ace/theme/sacripant");
		// MODE			
		editor.getSession().setMode("ace/mode/textile");
		// Editor options
		editor.getSession().setUseWrapMode(true);
		editor.setShowPrintMargin(true);
		editor.setOptions({
        	enableSnippets: true
	    });

		// synchronize with textarea
		editor.getSession().on('change', function(){
			body.val(editor.getSession().getValue());
		});
				
		// show Editor
		showAce.click(function() {

			// copy textarea content in Ace editor
			editor.getSession().setValue(body.val());

			// add focus in top on Editor
			editor.focus();
						
			// Clone article title
			var titre = $('#title').val();
			$(aceArticleTitle).text(titre);
						
			// Show Editor
			$('html').addClass('ace-editor-on');	
			
			return false;		
		});
		
		// Hide Editor	
		$('.hide-ace').click(function() {
			$('html').removeClass('ace-editor-on');				
		});
		
		// Shortcut
		var key = "ctrl"
		,	saveBtn = $('.publish')
		;
		
		if (navigator.userAgent.indexOf('Mac OS X') !== -1)
			key = '⌘';
						
		// add save shortcut to save button
		saveBtn[0].value += ' | '+key+'+s';
		
		$(document).keydown(function(e) {
			if ($('html').is('.ace-editor-on')) 
				{
					// esc = hide Editor
					if (e.keyCode === 27) 
						$('.hide-ace').click(); 				
				}
			// Save
			if (e.keyCode == 83 && (e.metaKey || e.ctrlKey))
				{
					e.preventDefault();
					saveBtn.eq(0).click();
				}
		});


		// TEST: Make image panel draggable

		// Select image iframe content
		var iframeContent = $("#ace-image-panel").contents(),
			images = iframeContent.find('#images_form tr');

			console.log(images);

		var dropImageSnippet = function(data) {
			return replaceID(prefs.drop.img, data)
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
