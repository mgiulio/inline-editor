(function() {

	function install(cfg) {
		installCSS();
		
		var elOriginalDisplayMode;
		
		[].slice.call(document.body.querySelectorAll(cfg.selector), 0).forEach(function(el) {
			var editor = document.createElement('div');
			editor.className = 'editor';
		
			var textArea = document.createElement('textarea');
			editor.appendChild(textArea);
			
			var okBtn = document.createElement('button');
			okBtn.className = 'button ok';
			okBtn.innerHTML = 'save';
			okBtn.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				console.log('block UI');
				
				var newText = textArea.value;
				
				cfg.processNewText(el, newText)
					.then(
						function(processedText) {
							el.innerHTML = processedText;
							hide();
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
				
				show();
			}, false);
			
			function show() {
				elOriginalDisplayMode = window.getComputedStyle(el, null).display;
				el.style.display = 'none';
				
				editor.classList.add('visible');
				
				textArea.select();
			}
			
			function hide() {
				editor.classList.remove('visible');
				
				el.style.display = elOriginalDisplayMode;
			}
		});
	}
	
	function installCSS() {
		var styleEl = document.createElement('style');
		styleEl.id = "inline-editor-css";
		document.head.appendChild(styleEl);
		var sheet = styleEl.sheet;
		var rules = sheet.rules;
		
		sheet.insertRule('.editor { width: 100%; position: relative; display: none; }', rules.length);
		sheet.insertRule('.editor textarea { width: 100%; display: block; }', rules.length);
		sheet.insertRule('.editor .button.ok { position: absolute; left: 0; top: 100%; }', rules.length);
		sheet.insertRule('.editor.visible { display: inline-block; }', rules.length);
		
		installCSS = function() {};
	}
		
	var api = {
		install: install,
		//uninstall
	};
	
	window.inlineEditor = api;

})();
