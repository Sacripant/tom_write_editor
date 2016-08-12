(function ($) {
	// Add body fullsceen btn 		
	// ace.require("ace/ext/language_tools");
	var showAce	=	$('<a class="show-ace ace-show-hide"><i>fullscreen</i></a>').prependTo('p.body');
	var aceEditor = document.getElementById('ace-editor');				
	// aceEditor.style.fontSize='15px';
	
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
		$('.show-ace').click(function() {

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
		,	saveBtn = $('.publish');
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
		
	};
})(jQuery);
