(function() {
	
	init();
	
	function init() {
		var mastheadTitleEl = document.querySelector('.masthead .title');
		var mastheadTitleEditor = new InlineEditor({
			el: mastheadTitleEl,
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving header title...'
			}
		});
		mastheadTitleEl.addEventListener('click', mastheadTitleEditor.activate.bind(mastheadTitleEditor), false);
		
		var mastheadSubTitleEl = document.querySelector('.masthead .subtitle');
		 var mastheadSubTitleEditor = new InlineEditor({
			el: mastheadSubTitleEl,
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving header title...'
			}
		});
		mastheadSubTitleEl.addEventListener('click', mastheadSubTitleEditor.activate.bind(mastheadSubTitleEditor), false);

		var aboutDescEl = document.querySelector('.aux .about .description');
		var aboutDescEditor = new InlineEditor({
			el: aboutDescEl,
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving about desc...'
			}
		});
		aboutDescEl.addEventListener('click', aboutDescEditor.activate.bind(aboutDescEditor), false);
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
					reject('Cannot save text');
				}
			}, minTime + rnd()*maxTime * 1000);
		})
	}
	
}());
