const { spawn } = require('child_process');
const echo = spawn('echo', ['nameserver', '127.0.0.1']);
const tee  = spawn('tee', ['/etc/resolv.conf']);

// '$ echo nameserver 127.0.0.1 | sudo tee /etc/resolv.conf';
const init = () => {
	console.log("Setting DNS to localhost 127.0.0.1")
	console.warn("Should only be set in localhost and not in Docker")
	
	echo.stdout.on('data', (data) => {
		tee.stdin.write(data);
	});

	echo.stderr.on('data', (data) => {
		console.log(`echo stderr: ${data}`);
	});

	echo.on('close', (code) => {
		if (code !== 0) {
			console.log(`echo process exited with code ${code}`);
		}
		tee.stdin.end();
	});

	tee.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	tee.stderr.on('data', (data) => {
		console.log(`tee stderr: ${data}`);
	});

	tee.on('close', (code) => {
		if (code !== 0) {
			console.log(`tee process exited with code ${code}`);
		}
	});
};

const API = {
	init: init()
}

module.exports = API;