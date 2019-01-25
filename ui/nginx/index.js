
const fs = require('fse');
const config = require('config');
const { spawn } = require('child_process');

const SRC  = 'folderA'; // config.get(nginx_dir);
const DEST = 'folderB';
const TEMP = '';

// copy source folder to destination
fs.copy(source, destination, function (err) {
    if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log('NGINX copy completed!')
});

// parse nginx-conf
// create nginx-json 
// create nginx-conf -> /usr/local
// chown nginx-conf

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

const start = () => {
	const cmd = {
		file: 'nginx'
	};
	run(cmd.file);
};

const stop = () => {
	const cmd = {
		file: 'nginx',
		commands: ['-s', 'stop']
	};
	run(cmd.file, cmd.commands);
};

const test = () => {
	const cmd = {
		file: 'nginx',
		commands: ['-t']
	};
	run(cmd.file, cmd.commands);
};

const API = {
	stop,
	start,
	test,
};

module.exports = API;
