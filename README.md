# DEV-DNS
Basic NodeJS DNS Proxy used in local development


## Usage

clone the repo

set up local domains (records.json)

npm install

start 
npm start / sudo node index.js 


### DNS Stuff

Port 53 is a priviliged port, to capture DNS requests the app must run as root (sudo).

The A record maps a name to one or more IP addresses, when the IP are known and stable. 

The CNAME record maps a name to another name. It should only be used when there are no other records on that name. 

The ALIAS record maps a name to another name, but in turns it can coexist with other records on that name.