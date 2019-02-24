// content of index.js
const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  
  console.log ('-- Request info: request.headers.origin');
	console.log(request.headers.origin);
	console.log ('-- Request info:');
  
  response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	
	// Ne retourner Access-Control-Allow-Headers que si headers contient origin
	if (request.headers.origin != null)
	  response.setHeader('Access-Control-Allow-Headers', request.headers.origin);
	
	if (request.method === 'OPTIONS') {
		response.writeHead(200);
		response.end();
		return;
	}
  
  console.log(request.url)
  response.end('Je suis Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
