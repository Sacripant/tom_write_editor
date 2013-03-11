define('ace/theme/sacripant', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module){
	exports.isDark = true;
	exports.cssClass = "ace-sacripant";
	exports.cssText = "\
	.ace_editor {\n                                                               \
			}\n\n                                                                         \
	";                          
			var dom = require("../lib/dom");
	dom.importCssString(exports.cssText, exports.cssClass);
})
















