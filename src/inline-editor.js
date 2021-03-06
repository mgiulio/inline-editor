(function() {
	
	installCSS();
	
	function C(cfg) {
		if (!(cfg.el instanceof Element))
			throw Error('cfg.el is not an instance of Element');
		if (isEditorInstalledOn(cfg.el))
			throw Error(`Inline Editor already installed on element with id="${cfg.el.id}" and class="${cfg.el.className}"`);
		this.el = cfg.el;
		
		if ('processNewText' in cfg)
			if (typeof cfg.processNewText !== 'function')
				throw Error('cfg.processNewText is not a function');
			else
				this.processNewText = cfg.processNewText;
		else
			this.processNewText = defaultProcessNewText;
		
		this.install(cfg);
	}

	C.prototype.install = function(cfg) {
		var editor = this.editor = document.createElement('div');
		editor.className = 'ined';
		editor.innerHTML = `
			<textarea class="ined__textarea"></textarea>
			<div class="ined__toolbar">
				<button class="ined__toolbar__submit">Save</button>
				<button class="ined__toolbar__cancel">Cancel</button>
			</div>
			<div class="ined__overlay">
				<div class="ined__overlay__msg">${cfg.activityIndicator.message}</div>
			</div>
		`;
			
		var textArea = this.textArea = editor.querySelector('.ined__textarea');
		var submit = this.submit = editor.querySelector('.ined__toolbar__submit');
		var cancel = this.cancel = editor.querySelector('.ined__toolbar__cancel');
			
		submit.addEventListener('click', this.submitListener.bind(this), false);
		cancel.addEventListener('click', this.cancelListener.bind(this), false);
			
		this.el.parentNode.insertBefore(editor, this.el.nextSibling);
	};
	
	C.prototype.uninstall = function() {
		this.editor.parentNode.removeChild(this.editor);
		this.textArea = this.submit = this.cancel = this.editor = null;
	};
	
	C.prototype.activate = function(e) {
		this.oldText = this.el.innerHTML;
		this.textArea.value = this.oldText;
		
		var textAreaHeight = this.el.offsetHeight;
		if (textAreaHeight < 24)
			textAreaHeight = 24;
		this.textArea.style.height = textAreaHeight + 'px';
		
		this.elOriginalDisplayMode = window.getComputedStyle(this.el, null).display;
		this.el.style.display = 'none';
			
		this.editor.classList.add('ined--visible');
		this.textArea.select();
	};
	
	C.prototype.submitListener = function(e) {
		e.preventDefault();
		e.stopPropagation();
			
		var newText = this.textArea.value;
		if (newText === this.oldText) {
			this.hide();
			return;
		}
		
		this.editor.classList.add('ined--blocked');
			
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
			.ined__textarea { 
				display: block; 
				box-sizing: border-box;
				width: 100%; 
				resize: vertical;
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
		
		document.head.insertBefore(styleEl, document.head.firstElementChild);
	}
	
	function isEditorInstalledOn(el) {
		var nextEl = el.nextElementSibling;
		
		if (!nextEl)
			return false;
		
		return nextEl.classList.contains('ined');
	}
	
	function defaultProcessNewText(text, el) {
		return new Promise(function(resolve, reject) {
			resolve(text);
		});
	}
		
	window.InlineEditor = C;

})();
