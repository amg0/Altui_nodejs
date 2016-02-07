//# sourceURL=DialogManager.js
// "use strict";

var DialogManager = ( function() {
	return {
		registerDialog: function( name, htmlDialog ) {
			var dialog = $("div#dialogs div#"+name);
			if (dialog.length ==0) 
				$("div#dialogs").append(htmlDialog);
			else
				$(dialog).replaceWith(htmlDialog);
			dialog = $("div#dialogs div#"+name);
			// remove all callbacks for now
			$(dialog).off();			
			$("div#dialogs").off();
			return  $(dialog);
		},

		runDialog: function(dialog, callback) {
			$(dialog).modal('show');
			$('#mnow-form').validator().on('submit', function (e) {
				if (e.isDefaultPrevented()) {
					// handle the invalid form...
					return false;
				} else {
					// everything looks good!
					(callback)();
					$(dialog).modal('hide');
					return true;
				}
			});
			// $("div#dialogs form").off('submit').on( 'submit',".btn-primary", function(e) {			} );
		}
	}
})();

