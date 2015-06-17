(function() {
	
	init();
	
	function init() {
		var mastheadTitleEditor = new InlineEditor({
			el: document.querySelector('.masthead__title'),
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving header title...'
			}
		});
		
		var mastheadSubTitleEditor = new InlineEditor({
			el: document.querySelector('.masthead__subtitle'),
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving header title...'
			}
		});

		var aboutDescEditor = new InlineEditor({
			el: document.querySelector('.aux .about .desc'),
			processNewText: sendToServer,
			activityIndicator: {
				message: 'Saving about desc...'
			}
		});
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
