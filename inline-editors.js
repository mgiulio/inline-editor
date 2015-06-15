(function() {

	function install(cfg) {
		installCSS();
		
		var elOriginalDisplayMode;
		
		[].slice.call(document.body.querySelectorAll(cfg.selector), 0).forEach(function(editableEl) {
			var el = {
				editable: editableEl
			};
			
			el.editor = document.createElement('div');
			el.editor.className = 'editor';
			el.editor.innerHTML = `
				<textarea></textarea>
				<div class="toolbar">
					<button class="button submit">Save</button>
					<button class="button cancel">Cancel</button>
				</div>
			`;
			
			el.textArea = el.editor.querySelector('textArea');
			el.submit = el.editor.querySelector('.button.submit');
			el.cancel = el.editor.querySelector('.button.cancel');
			
			el.editable.addEventListener('click', enterEditMode, false);
			el.submit.addEventListener('click', submit, false);
			el.cancel.addEventListener('click', cancel, false);
			
			el.editable.parentNode.insertBefore(el.editor, el.editable.nextSibling);
			
			function enterEditMode(e) {
				e.preventDefault();
				e.stopPropagation();
		
				var text = el.editable.innerHTML;
				el.textArea.value = text;
				
				show();
			}
			
			function cancel(e) {
				console.log('cancel');
			}
			
			function submit(e) {
				e.preventDefault();
				e.stopPropagation();
				
				el.editor.classList.add('blocked');
				
				var newText = el.textArea.value;
				
				cfg.processNewText(el.editable, newText)
					.then(
						function(processedText) {
							el.editable.innerHTML = processedText;
							hide();
						},
						function(/* rejReason */) {
							
						}
					)
					.then(function() {
						el.editor.classList.remove('blocked');
					})
				;
			}
			
			function show() {
				elOriginalDisplayMode = window.getComputedStyle(el.editable, null).display;
				el.editable.style.display = 'none';
				
				el.editor.classList.add('visible');
				
				el.textArea.select();
			}
			
			function hide() {
				el.editor.classList.remove('visible');
				
				el.editable.style.display = elOriginalDisplayMode;
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
			.editor .toolbar { 
				background: #e6e2e2;
				padding: 5px;
				text-align: center;
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
