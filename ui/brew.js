
/* jshint node: true, esversion: 6, devel: true */

const config = require('config');
const { spawn } = require('child_process');


const run = (file, commands) => {
	
	const cmd = spawn(file, commands);
	cmd.stdout.on( 'data', data => {
			console.log( `stdout: ${data}` );
	});
	cmd.stderr.on( 'data', data => {
			console.log( `stderr: ${data}` );
	});
	cmd.on( 'close', code => {
			console.log( `child process exited with code ${code}` );
	});
};

const install = (name) => {
	const cmd = {
		file: 'brew'
	};
	run(cmd.file, [`${name}`]);
};

const API = {
	install
};

module.exports = API;