var 
	fs = require('fs'),
	fse = require('fs-extra')
;

var 
	FILE_ENCODING = 'utf-8',
	EOL = '\n'
;

run();

function run() {
	cleanup();
	js();
}	

function cleanup() {
	notify('Cleaning dit directory');
	fse.emptyDirSync('dist');
}

function js() {
	notify('Processing Js');
	
	var 
		src = 'src/inline-editor.js',
		dest = 'dist/js/inline-editor.js';
	;
	
	console.log('Transpilation...');
	//var babel = require('...');
	
	console.log('Minification...');
	var UglifyJS = require('uglify-js');
	try {
		var result = UglifyJS.minify(src, {
			outSourceMap: "inline-editor.js.map"
		});
	} catch (e) {
		console.log(e.message + ' in ' +  e.filename + ' @ ' + e.line + ':' + e.col);
		return;
	}
	
	notify('Writing ' + dest);
	fs.writeFileSync(dest, result.code);
	fs.writeFileSync(dest + '.map', result.map);
}

function notify(msg) {
	console.log('=== ' + msg + '===');
}
