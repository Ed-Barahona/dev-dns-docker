/* jshint node: true, esversion: 6, devel: true */
'use strict';
const config     = require('config');
const fse        = require('fse');
const express    = require('express');
const bodyParser = require('body-parser');
const nginx	     = require('./nginx');
// const setDns 		 = require('./set-dns');
const app        = express();

const PORT =  process.env.PORT || config.get('port');
const DNS_FILE = process.cwd() + '/records.json';


app.use(bodyParser.json());
app.use(express.static(__dirname));

const setRecord = (data) => {
	fse.writeFileSync(DNS_FILE, JSON.stringify(data, null, '  '), {
		flag: 'w'
	});
};

const getRecord = (name) => {
	try {
		return JSON.parse(fse.readFileSync(name).toString());
	} catch(e){
		setRecord([]);
		return getRecord(name);
	}
};

let entries = app.entries = getRecord(DNS_FILE); 

app.get('/records', (req, res) => {
	res.status(200).send(entries);
});

app.post('/records', (req, res) => {
    entries = app.entries = req.body;
    setRecord(entries);
    res.status(200).send({message: "Successfully saved DNS record"});
});

app.get('/nginx/start', (req, res) => {
	nginx.start(req, res);
	res.status(200).send({message: "start nginx message received"});
});

app.get('/nginx/stop', (req, res) => {
	nginx.stop(req, res);
	res.status(200).send({message: "stop nginx message received"});
});

app.listen(PORT, () => {
   console.log("UI Running on: ", PORT);
});


module.exports = app;