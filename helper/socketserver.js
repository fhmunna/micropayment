var MicroRaiden = require('./microraiden')
var WebSocketServer = require('websocket').server, wsServer;

MicroRaiden.getContracts();
MicroRaiden.getBalance();

var SocketServer = {
    init: function (server) {
        wsServer = new WebSocketServer({
            httpServer: server,
            // You should not use autoAcceptConnections for production
            // applications, as it defeats all standard cross-origin protection
            // facilities built into the protocol and the browser.  You should
            // *always* verify the connection's origin and decide whether or not
            // to accept it.
            autoAcceptConnections: false
        });

        wsServer.on('request', function (request) {
            if (!SocketServer.originIsAllowed(request.origin)) {
                // Make sure we only accept requests from an allowed origin
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var connection = request.accept('echo-protocol', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            connection.on('message', function (message) {
                SocketServer.on_message(connection, message)
            });
            connection.on('close', function (reasonCode, description) {
                console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });
    },

    originIsAllowed: function () {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    },

    on_message: function (connection, message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    }
}

module.exports = SocketServer;
