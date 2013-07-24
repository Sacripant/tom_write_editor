(function () {
	// Add button fullsceen		
	var showAce	=	$('<a class="show-ace ace-show-hide"><i>fullscreen</i></a>').prependTo('p.body');
	
	// Initiation code html wrapper-fullscreen
	var fullscreen	=	$('                                                                   \
							<div id="ace-fullscreen" class="show">                                \
								<h1 class="ace-article_title"></h1>                                \
								<div id="ace-editor"></div>                                        \
								<div class="ace-actions ace-fixed">                                \
									<button class="hide-ace ace-show-hide ace-fixed">close</button> \
								</div>                                                             \
							</div>                                                                \
							').appendTo('body');
	
	// Mode Textile par default
	// var changeMode = $('.ace-changeMode button');
	// $('.textileMode').addClass('actif');
	// changeMode.click(function() {
	// 	changeMode.toggleClass('actif');
	// });
	
	var aceEditor = document.getElementById('ace-editor');				
	// aceEditor.style.fontSize='15px';
	
	window.onload = function() {
    var editor	= ace.edit("ace-editor");
		var body	= $('#body');
		editor.getSession().setMode("ace/mode/textile");
		// Soft wrap
		editor.getSession().setUseWrapMode(true);
		editor.setShowPrintMargin(false);
		// THEME
		editor.setTheme("ace/theme/sacripant");			
		// synchronize with textarea
		editor.getSession().on('change', function(){
				body.val(editor.getSession().getValue());
		});	
		// show fullscreen
		$('.ace-show-hide').click(function() {
			// copy textarea content in Ace editor
			editor.getSession().setValue(body.val());
			// display editor in fullscreen
			$('html').toggleClass('ace-editor-on');
			// Clone titre article to Fullscreen
			var titre = $('#title').val();
			$('.ace-article_title').text(titre);
			// Position scrollbar
			var marginSize = aceEditor.offsetLeft;
			$('.ace-sacripant .ace_scrollbar').css('right', '-'+marginSize+'px');
			editor.resize(); //maybe unnecessary 
			return false;		
		});	
	};
	

	
})();