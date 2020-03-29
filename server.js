var fs = require('fs');
var path = require('path');
var server = require('http').createServer(onRequest);
var utf8 = require('utf8');
var io = require('socket.io')(server);
var SSHClient = require('ssh2').Client;


var connected = false;

var staticFiles = {};
var basePath = path.join(require.resolve('xterm'), '../..');
['dist/addons/fit/fit.js',
    'src/xterm.css',
    'src/xterm.js'
].forEach(function (f) {
    staticFiles['/' + f] = fs.readFileSync(path.join(basePath, f));
});
staticFiles['/'] = fs.readFileSync('xtream.html');

// Handle static file serving
function onRequest(req, res) {
    //  console.log(req);
    var file;
    if (req.method === 'GET' && (file = staticFiles[req.url])) {
        res.writeHead(200, {
            'Content-Type': 'text/'
                    + (/css$/.test(req.url)
                            ? 'css'
                            : (/js$/.test(req.url) ? 'javascript' : 'html'))
        });
        // console.log(file);
        return res.end(file);
    }
    res.writeHead(404);
    res.end();
}

io.on('connection', function (socket) {
    var ssh = new SSHClient();
    ssh.on('ready', function () {
        socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
        connected = true;
        ssh.shell(function (err, stream) {
            if (err)
                return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
            socket.on('data', function (data) {
                stream.write(data);
            });
            stream.on('data', function (d) {
                socket.emit('data', utf8.decode(d.toString('binary')));
            }).on('close', function () {
                ssh.end();
            });
        });
    }).on('close', function () {
        socket.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
    }).on('error', function (err) {
        console.log(err);
        socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
    })
            .connect({
                host: 'SERVER_IP',
                port: 22,
                username: 'USER',
                privateKey: require('fs').readFileSync('PATH OF YOUR ')
            });
});
console.log("Server is started on 8080");
server.listen(8080);



//After few try here is working code.
//
//Following Libraries you need understand how its work.
//
//1) https://socket.io/ 
//
//This library is used for transmit package from client to server.
//
//2) https://github.com/staltz/xstream
//
//
//This library is used for terminal view.
//
//3) https://github.com/mscdex/ssh2
//
//This is main library. which is used for establishment connection with your remote server.
//
//
//Step 1 : 
//Install this 3 library in your project folder
//
//Setp 2 :
//Start from node side create a server.js file for open socket
//
//Step 3 : 
//Connection client socket to node server ( both are in local machine )
//
//Step 4 : 