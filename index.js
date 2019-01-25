'use strict';

const dns    = require('native-dns');
const config = require('config');
const async  = require('async');
const app    = require('./ui');
const server = dns.createServer();
const logger = console;

const TTL  = config.get('default_ttl') || 1800;
const PORT = (process.env.DNS_PORT) ?
  (process.env.DNS_PORT) :
  config.get('dns_port');
server.serve(PORT || 53);

server.on('close', () => logger.log('server closed', server.address()));
server.on('error', (err, buff, req, res) => logger.error(err.stack));
server.on('socketError', (err, socket) => logger.error(err));
server.on('listening', () => {
	logger.log('DNS Server Listening On: ', server.address());
	logger.log('Local DNS Entries: ', entries);
});

const authority = config.get('authority');
const entries   = app.entries;


// Proxy DNS
const proxy = (question, response, cb) => {
  logger.log('DNS Proxy: ', question.name);
  //FWD DNS Req OBJ
  const request = dns.Request({
    question: question, 
    server: authority,
    timeout: TTL
  });

  request.on('timeout', () => {
		logger.log('DNS Proxy Timeout: ', question.name);
  });

  //Append answers
  request.on('message', (err, msg) => {
    msg.answer.forEach(a => response.answer.push(a));
  });

  request.on('end', cb);
  request.send();
};


// DNS Handler
const handleRequest = (request, response) => {
  logger.log('DNS Request From: ', request.address.address, 'for: ', request.question[0].name);
  let f = []; //Request Functions
  
  request.question.forEach(question => {
		// Filter each request - entries table
    let entry = entries.filter(r => new RegExp(r.domain, 'i').exec(question.name)); 
    if (entry.length) {
        entry[0].records.forEach(record => {
          record.name = question.name;
          record.ttl  = record.ttl || TTL;
          // CName handler
          if (record.type == 'CNAME') {
            record.data = record.address;
            f.push(cb => proxy({ name: record.data, type: dns.consts.NAME_TO_QTYPE.A, class: 1 }, response, cb));
          }
          response.answer.push(dns[record.type](record));
        });
    } else {
      // Send to DNS PROXY
      f.push(cb => proxy(question, response, cb));
    }
  });
  // Exec all in parallel
  async.parallel(f, () => { response.send(); });
}

server.on('request', handleRequest);