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
			okBtn.addEventListener('click', submit, false);
			editor.appendChild(okBtn);
			
			el.parentNode.insertBefore(editor, el.nextSibling);
			
			el.addEventListener('click', enterEditMode, false);
			
			function enterEditMode(e) {
				e.preventDefault();
				e.stopPropagation();
		
				var text = el.innerHTML;
				textArea.value = text;
				
				show();
			}
			
			function submit(e) {
				e.preventDefault();
				e.stopPropagation();
				
				editor.classList.add('blocked');
				
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
						editor.classList.remove('blocked');
					})
				;
			}
			
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
		
		var css = `
			.editor { 
				position: relative; 
				width: 100%; 
				display: none; 
			}
			.editor textarea { 
				width: 100%; 
				display: block; 
			}
			.editor .button.ok { 
				position: absolute; 
				left: 0; 
				top: 100%; 
			}
			.editor.visible { 
				display: inline-block; 
			}
			.editor.visible.blocked:after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0, 0.5);
			}
		`;
		
		styleEl.textContent = css;
		
		document.head.appendChild(styleEl);
		
		installCSS = function() {};
	}
		
	var api = {
		install: install,
		//uninstall
	};
	
	window.inlineEditor = api;

})();
