(function() {
	
	var
		editMode = true
	;
	
	init();
	
	function init() {
		var
			el,
			editor
		;
		
		el = document.querySelector('.masthead .title');
		editor = new InlineEditor({
			el: el,
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving header title...'
			}
		});
		el.editor = editor;
		
		el = document.querySelector('.masthead .subtitle');
		editor = new InlineEditor({
			el: el,
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving header title...'
			}
		});
		el.editor = editor;

		el = document.querySelector('.aux .about .description');
		editor = new InlineEditor({
			el: el,
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving about desc...'
			}
		});
		el.editor = editor;
		
		document.body.addEventListener('click', activateEditor, false);
		document.body.querySelector('.edit-mode-toggle').addEventListener('change', toggleEditMode, false);
	}
	
	function activateEditor(e) {
		if (!editMode)
			return;
		
		var target = e.target;
		
		if (!target.classList.contains('editable'))
			return;
		
		e.preventDefault();
		e.stopPropagation();
		
		target.editor.activate();
	}
	
	function toggleEditMode(e) {
		e.preventDefault();
		e.stopPropagation();
		
		document.body.classList.toggle('edit-mode');
		editMode = ! editMode;
	}
	
	function sendToServer(text, el) {
		var
			rnd = Math.random
			minTime = 1,
			maxTime = 5,
			successProb = 0.9
		;
		return new Promise(function(resolve, reject) {
			var json = {
				el: el,
				text: text
			};
			
			console.log(json);
			
			setTimeout(function() {
				if (rnd() <= successProb)
					resolve(text);
				else {
					console.log('failure');
					alert('Persistence on server has failed');
					reject('Cannot save text');
				}
			}, minTime + rnd()*maxTime * 1000);
		})
	}
	
}());
