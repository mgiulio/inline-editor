(function() {
	
	installCSS();
	
	function C(cfg) {
		this.el = cfg.el;
		this.processNewText = cfg.processNewText;
		
		var editor = this.editor = document.createElement('div');
		editor.className = 'editor';
		editor.innerHTML = `
			<textarea></textarea>
			<div class="toolbar">
				<button class="button submit">Save</button>
				<button class="button cancel">Cancel</button>
			</div>
			<div class="overlay">
				<div class="msg">${cfg.activityIndicator.message}</div>
			</div>
		`;
			
		var textArea = this.textArea = editor.querySelector('textArea');
		var submit = this.submit = editor.querySelector('.button.submit');
		var cancel = this.cancel = editor.querySelector('.button.cancel');
			
		this.el.addEventListener('click', this.enterEditMode.bind(this), false);
		submit.addEventListener('click', this.submitListener.bind(this), false);
		cancel.addEventListener('click', this.cancelListener.bind(this), false);
			
		this.el.parentNode.insertBefore(editor, this.el.nextSibling);
	}
	
	C.prototype.enterEditMode = function(e) {
		e.preventDefault();
		e.stopPropagation();
	
		var text = this.el.innerHTML;
		this.textArea.value = text;
			
		this.show();
	};
	
	C.prototype.submitListener = function(e) {
		e.preventDefault();
		e.stopPropagation();
			
		this.editor.classList.add('blocked');
			
		var newText = this.textArea.value;
			
		this.processNewText(newText, this.el)
			.then(
				function(processedText) {
					this.el.innerHTML = processedText;
					
				}.bind(this),
				function() {
				}.bind(this)
			)
			.then(function() {
				this.editor.classList.remove('blocked');
				this.hide();
			}.bind(this))
		;
	};
		
	C.prototype.cancelListener = function(e) {	
		e.preventDefault();
		e.stopPropagation();
			
		this.hide();
	};
		
	C.prototype.show = function() {
		this.elOriginalDisplayMode = window.getComputedStyle(this.el, null).display;
		this.el.style.display = 'none';
			
		this.editor.classList.add('visible');
		
		this.textArea.select();
	};
		
	C.prototype.hide = function() {
		this.editor.classList.remove('visible');
		this.el.style.display = this.elOriginalDisplayMode;
	};
	
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
			.editor .overlay {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0, 0.5);
				opacity: 0;
				transition: opacity 0.3s;
				pointer-events: none;
			}
			.editor.blocked .overlay {
				opacity: 1;
				pointer-events: auto;
			}
			.editor .overlay .msg {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: gray;
				color: white;
			}
		`;
		
		styleEl.textContent = css;
		
		document.head.appendChild(styleEl);
	}
		
	window.InlineEditor = C;

})();
