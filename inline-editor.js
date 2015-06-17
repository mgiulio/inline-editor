(function() {
	
	installCSS();
	
	function C(cfg) {
		if (isEditorInstalledOn(cfg.el))
			throw Error(`Inline Editor already installed on element with id="${cfg.el.id}" and class="${cfg.el.className}"`);
		
		this.el = cfg.el;
		this.processNewText = cfg.processNewText;
		
		var editor = this.editor = document.createElement('div');
		editor.className = 'ined';
		editor.innerHTML = `
			<textarea class="ined__text"></textarea>
			<div class="ined__toolbar">
				<button class="ined__toolbar__submit">Save</button>
				<button class="ined__toolbar__cancel">Cancel</button>
			</div>
			<div class="ined__overlay">
				<div class="ined__overlay__msg">${cfg.activityIndicator.message}</div>
			</div>
		`;
			
		var textArea = this.textArea = editor.querySelector('.ined__text');
		var submit = this.submit = editor.querySelector('.ined__toolbar__submit');
		var cancel = this.cancel = editor.querySelector('.ined__toolbar__cancel');
			
		submit.addEventListener('click', this.submitListener.bind(this), false);
		cancel.addEventListener('click', this.cancelListener.bind(this), false);
			
		this.el.parentNode.insertBefore(editor, this.el.nextSibling);
	}
	
	C.prototype.activate = function(e) {
		var text = this.el.innerHTML;
		this.textArea.value = text;
			
		this.elOriginalDisplayMode = window.getComputedStyle(this.el, null).display;
		this.el.style.display = 'none';
			
		this.editor.classList.add('ined--visible');
		
		this.textArea.select();
	};
	
	C.prototype.submitListener = function(e) {
		e.preventDefault();
		e.stopPropagation();
			
		this.editor.classList.add('ined--blocked');
			
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
				this.editor.classList.remove('ined--blocked');
				this.hide();
			}.bind(this))
		;
	};
		
	C.prototype.cancelListener = function(e) {	
		e.preventDefault();
		e.stopPropagation();
			
		this.hide();
	};
			
	C.prototype.hide = function() {
		this.editor.classList.remove('ined--visible');
		this.el.style.display = this.elOriginalDisplayMode;
	};
	
	function installCSS() {
		var styleEl = document.createElement('style');
		styleEl.id = "ined-css";
		
		var css = `
			.ined { 
				position: relative; 
				width: 100%; 
				display: none; 
			}
			.ined__text { 
				width: 100%; 
				display: block; 
			}
			.ined__toolbar { 
				background: #e6e2e2;
				padding: 5px;
				text-align: center;
			}
			.ined--visible { 
				display: inline-block; 
			}
			.ined__overlay {
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
			.ined--blocked .ined__overlay {
				opacity: 1;
				pointer-events: auto;
			}
			.ined__overlay__msg {
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
	
	function isEditorInstalledOn(el) {
		var nextEl = el.nextElementSibling;
		
		if (!nextEl)
			return false;
		
		return nextEl.classList.contains('ined');
	}
		
	window.InlineEditor = C;

})();
