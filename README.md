# About

A simple JavaScript inline editing component. [Demo](https://mgiulio.github.io/inline-editor/demo/profile-page/).

# Usage

The dist/inline-editor.js scripts exports to the window object the InlineEditor constructor to instantiate the editors: 

```javascript
el = document.querySelector('.masthead .title');
editor = new InlineEditor({
	el: el,
	processNewText: sendToServer,
	activityIndicator: {
		message: 'Saving header title...'
	}
});
el.editor = editor;
```

The activation of the editor is responsability of the client:

```javascript
document.body.addEventListener('click', activateEditor, false);

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
```

To process the entered text, typically to save it on the server, we implement the promise-returning callback specified at editor creation time:  
	
```javascript
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
```

## Skinning

The look of the editor can be customized using the following classes:

```css
.ined__textarea {
}
.ined__toolbar {
}
.ined__toolbar__submit {
}
.ined__toolbar__cancel {
}
.ined__overlay {
}
.ined__overlay__msg {
}
```

---

For more details please see the [demo source]

# TechNotes

ES 6 Features, transpiled with Babel:

* Template Strings
* Promises	
	
# Support

Modern browsers, no IE 10-.
