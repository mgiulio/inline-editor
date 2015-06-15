(function() {

	function install(cfg) {
		var elOriginalDisplayMode;
		
		[].slice.call(document.body.querySelectorAll(cfg.selector), 0).forEach(function(el) {
			var editor = document.createElement('div');
			editor.style.width = '100%';
			editor.style.position = 'relative';
			editor.style.display = 'none';
		
			var textArea = document.createElement('textarea');
			textArea.style.display = 'block';
			textArea.style.width = '100%';
			editor.appendChild(textArea);
			
			var okBtn = document.createElement('button');
			okBtn.innerHTML = 'save';
			okBtn.style.position = 'absolute';
			okBtn.style.left = '0';
			okBtn.style.top = '100%';
			okBtn.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				console.log('block UI');
				
				var newText = textArea.value;
				
				cfg.processNewText(el, newText)
					.then(
						function(processedText) {
							el.innerHTML = processedText;
							editor.style.display = 'none';
							el.style.display = elOriginalDisplayMode;
						},
						function(/* rejReason */) {
							
						}
					)
					.then(function() {
						console.log('unblok UI');
					})
				;
			}, false);
			editor.appendChild(okBtn);
			
			el.parentNode.insertBefore(editor, el.nextSibling);
			
			el.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
		
				var text = el.innerHTML;
				textArea.value = text;
				
				elOriginalDisplayMode = window.getComputedStyle(el, null).display;
				el.style.display = 'none';
				editor.style.display = 'inline-block';
			}, false);
		});
	}
		
	var api = {
		install: install,
		//uninstall
	};
	
	window.inlineEditor = api;

})();
