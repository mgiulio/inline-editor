var 
	fse = require('fs-extra'),
	FILE_ENCODING = 'utf-8',
	EOL = '\n',
	src = 'src/inline-editor.js',
	dest = 'dist/inline-editor.js'
;

run();

function run() {
	try {
		rel();
	}
	catch(e) {
		console.log('Build process failed: ' + e.message);
	}
}	

function rel() {;
	copyToDist(minify(transpile(fse.readFileSync(src))));
}

function transpile(code) {
	console.log('Transpilation...');
	
	var babel = require('babel-core');
	
	var result = babel.transform(code);
	
	return result.code;
}
	
function minify(code) {
	console.log('Minification...');
	
	var UglifyJS = require('uglify-js');
	
	try {
		var result = UglifyJS.minify(code, {
			fromString: true
			//outSourceMap: "inline-editor.js.map"
		});
	} catch (e) {
		console.log('*** Uglify JS error ***');
		console.log(e.message + ' in ' +  e.filename + ' @ ' + e.line + ':' + e.col);
		throw e;
	}
	
	return result.code;
}

function copyToDist(code) {
	console.log('Writing processed code to ' + dest + '...');
	
	fse.writeFileSync(dest, code);
	//fse.writeFileSync(dest + '.map', uglifyResult.map);
}
		
function cleanDist() {
	notify('Cleaning dit directory');
	fse.emptyDirSync('dist');
}

function notify(msg) {
	console.log('=== ' + msg + '===');
}
